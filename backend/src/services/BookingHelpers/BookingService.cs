namespace WebApp;

// BookingService is marked as partial so its methods
// can be split across multiple files.
// This keeps large service logic easier to organize.
// Holds the logic for retrieving booking data,
// creating bookings, and fetching bookings for the logged-in user.
public static partial class BookingService
{
  // CreateBooking
  // Creates a new booking row and inserts matching booking_seat rows.
  public static object CreateBooking(HttpContext context, JsonElement bodyJson)
  {
    try
    {
      // Parse incoming JSON request body.
      var body = JSON.Parse(bodyJson.ToString());

      // Validate required fields.
      if (body.showtime_id == null)
        return RestResult.Parse(context, new { error = "showtime_id is missing" });

      if (body.email == null)
        return RestResult.Parse(context, new { error = "email is missing" });

      if (body.total_price == null)
        return RestResult.Parse(context, new { error = "total_price is missing" });

      if (body.seats == null)
        return RestResult.Parse(context, new { error = "seats are missing" });

      if (body.tickets == null)
        return RestResult.Parse(context, new { error = "tickets are missing" });

      // Convert JSON values to typed variables.
      int showtimeId = Convert.ToInt32(body.showtime_id);
      string email = (string)body.email;
      decimal totalPrice = Convert.ToDecimal(body.total_price);

      // Seats arrive as strings like "4-3" (Row 4, seat 3).
      var selectedSeats = body.seats;

      // Booking status 1 = Pending.
      int statusId = 1;

      // Create a unique booking reference.
      string bookingRef =
        DateTime.UtcNow.ToString("yyyyMMddHHmmss") +
        Random.Shared.Next(100, 999).ToString();

      // Fetch the selected showtime.
      var showtime = SQLQueryOne(
        "SELECT * FROM showtime WHERE id = @id",
        new { id = showtimeId }
      );

      // Stop if the showtime does not exist.
      if (showtime == null)
        return RestResult.Parse(context, new { error = "Showtime not found" });

      // Stop if the showtime has no connected screen.
      if (showtime.screen_id == null)
        return RestResult.Parse(context, new { error = "showtime.screen_id is null" });

      // Fetch the connected screen/salon.
      var screen = SQLQueryOne(
        "SELECT * FROM screen WHERE id = @id",
        new { id = Convert.ToInt32(showtime.screen_id) }
      );

      // Stop if the screen does not exist.
      if (screen == null)
        return RestResult.Parse(context, new { error = "Screen not found" });

      // Read screen name and get its seat layout.
      string screenName = screen.screen_name != null
        ? ((string)screen.screen_name).Trim()
        : "";

      // Get the correct seat layout for the selected screen.
      int[] layout = SeatBookingHelpers.GetScreenLayout(screenName);

      // Step 1: Prevent double booking before creating anything.
      foreach (var seatStrObj in selectedSeats)
      {
        // Convert the selected seat object to string.
        string seatStr = (string)seatStrObj;

        // Validate seat id format, for example "6-11".
        if (!SeatBookingHelpers.TryParseSeatId(seatStr, out int row, out int seatInRow))
        {
          return RestResult.Parse(context, new
          {
            error = $"Invalid seat format: '{seatStr}'"
          });
        }

        // Convert row + seatInRow into a continuous seat number used in the database.
        int seatNumber = SeatBookingHelpers.ToContinuousSeatNumber(
          row,
          seatInRow,
          layout,
          screenName
        );

        // Find the seat in the database.
        var dbSeat = SQLQueryOne(
          "SELECT id FROM seat WHERE screen_id = @screenId AND seat_number = @seatNumber",
          new
          {
            screenId = screen.id,
            seatNumber
          }
        );

        // Stop if the seat does not exist in the database.
        if (dbSeat == null)
          return RestResult.Parse(context, new
          {
            error = $"Seat not found for row {row}, seat {seatInRow}"
          });

        // Check if the seat is already booked for the same showtime.
        var existing = SQLQueryOne(
          "SELECT id FROM booking_seat WHERE seat_id = @seatId AND showtime_id = @showtimeId",
          new
          {
            seatId = Convert.ToInt32(dbSeat.id),
            showtimeId
          }
        );

        // Stop if the seat is already booked.
        if (existing != null)
          return RestResult.Parse(context, new
          {
            error = $"Seat already booked for this showtime: row {row}, seat {seatInRow}"
          });
      }

      // Try to connect the booking to the currently logged-in user.
      // Visitors will get null here.
      // Logged-in users will get their unique user id.
      int? currentUserId = MyBookingsAuthenticationHelpers.GetCurrentUserId(context);

      // Step 2: Insert the booking row.
      // - Visitors get user_id = null
      // - Logged-in users get user_id = their users.id
      SQLQuery(@"
        INSERT INTO booking
          (user_id, email, showtime_id, booking_date, booking_reference, booking_status_id, total_price)
        VALUES
          (@userId, @email, @showtimeId, NOW(), @bookingRef, @statusId, @totalPrice)
      ", new
      {
        userId = currentUserId,
        email,
        showtimeId,
        bookingRef,
        statusId,
        totalPrice
      });

      // Fetch the newly created booking id using the booking reference.
      var created = SQLQueryOne(
        "SELECT id FROM booking WHERE booking_reference = @bookingRef ORDER BY id DESC LIMIT 1",
        new { bookingRef }
      );

      // Stop if the booking row was inserted but no id was returned.
      if (created == null || created.id == null)
      {
        context.Response.StatusCode = 500;

        return RestResult.Parse(context, new
        {
          error = "Booking inserted but id is null",
          booking_reference = bookingRef
        });
      }

      // Convert the booking id to integer.
      int bookingId = Convert.ToInt32(created.id);

      // Step 3: Build the ticket category queue.
      // Adult first, then Child, then Pensioner.
      int adultCategoryId = 1;
      int pensionerCategoryId = 2;
      int childCategoryId = 3;

      // Read number of selected tickets in each category.
      int adultCount = body.tickets?.adult != null ? Convert.ToInt32(body.tickets.adult) : 0;
      int childCount = body.tickets?.child != null ? Convert.ToInt32(body.tickets.child) : 0;
      int seniorCount = body.tickets?.senior != null ? Convert.ToInt32(body.tickets.senior) : 0;

      // Count selected seats.
      int selectedSeatCount = 0;
      foreach (var _ in selectedSeats)
      {
        selectedSeatCount++;
      }

      // Count total selected tickets.
      int totalTicketCount = adultCount + childCount + seniorCount;

      // Stop if number of tickets does not match number of seats.
      if (totalTicketCount != selectedSeatCount)
      {
        return RestResult.Parse(context, new
        {
          error = "Number of tickets must match number of selected seats"
        });
      }

      // Build ticket category queue in booking order.
      var categoryQueue = new List<int>();

      // Add adult ticket categories first.
      for (int i = 0; i < adultCount; i++) categoryQueue.Add(adultCategoryId);

      // Add child ticket categories second.
      for (int i = 0; i < childCount; i++) categoryQueue.Add(childCategoryId);

      // Add pensioner ticket categories last.
      for (int i = 0; i < seniorCount; i++) categoryQueue.Add(pensionerCategoryId);

      // Step 4: Insert one booking_seat row per selected seat.
      int seatIndex = 0;

      foreach (var seatStrObj in selectedSeats)
      {
        // Convert the selected seat object to string.
        string seatStr = (string)seatStrObj;

        // Validate seat id format before using it.
        if (!SeatBookingHelpers.TryParseSeatId(seatStr, out int row, out int seatInRow))
        {
          return RestResult.Parse(context, new
          {
            error = $"Invalid seat format: '{seatStr}'"
          });
        }

        // Convert row + seatInRow into a continuous seat number.
        int seatNumber = SeatBookingHelpers.ToContinuousSeatNumber(
          row,
          seatInRow,
          layout,
          screenName
        );

        // Find the matching seat in the database.
        var dbSeat = SQLQueryOne(
          "SELECT id FROM seat WHERE screen_id = @screenId AND seat_number = @seatNumber",
          new
          {
            screenId = screen.id,
            seatNumber
          }
        );

        // Stop if the seat could not be found.
        if (dbSeat == null || dbSeat.id == null)
        {
          return RestResult.Parse(context, new
          {
            error = $"dbSeat.id is null for row {row}, seat {seatInRow}, mapped seat_number {seatNumber}"
          });
        }

        // Assign the correct price category based on ticket order.
        int priceCategoryId =
          seatIndex < categoryQueue.Count ? categoryQueue[seatIndex] : adultCategoryId;

        // Insert one booking_seat row for this seat.
        SQLQuery(@"
          INSERT INTO booking_seat (booking_id, seat_id, showtime_id, price_category_id)
          VALUES (@bookingId, @seatId, @showtimeId, @priceCategoryId)
        ", new
        {
          bookingId,
          seatId = Convert.ToInt32(dbSeat.id),
          showtimeId,
          priceCategoryId
        });

        // Move to the next selected seat.
        seatIndex++;
      }

      // Send booking confirmation email after booking has been created.
      BookingEmailBuilder.SendBookingEmailFromShowtime(
        email,
        bookingRef,
        showtimeId,
        screenName,
        selectedSeats,
        adultCount,
        childCount,
        seniorCount,
        totalPrice
      );

      // Return success response with booking id and reference.
      return RestResult.Parse(context, new
      {
        booking_id = bookingId,
        booking_reference = bookingRef
      });
    }
    catch (Exception ex)
    {
      // Return server error if booking fails unexpectedly.
      context.Response.StatusCode = 500;

      return RestResult.Parse(context, new
      {
        error = "Booking crashed",
        message = ex.Message
      });
    }
  }

  // GetBookingData
  // Returns showtime, screen and current seat booking state.
  public static object GetBookingData(HttpContext context)
  {
    // Read showtimeId from the query string.
    var showtimeIdStr = context.Request.Query["showtimeId"].ToString();

    // If no showtimeId is provided, return an empty structure.
    if (string.IsNullOrWhiteSpace(showtimeIdStr))
      return RestResult.Parse(context, new
      {
        showtime = (object?)null,
        screen = (object?)null,
        seats = new object[] { }
      });

    // Validate that showtimeId is a number.
    if (!int.TryParse(showtimeIdStr, out var showtimeId))
      return RestResult.Parse(context, new { error = "Invalid showtimeId" });

    // Fetch the selected showtime from the database.
    var showtime = SQLQueryOne(
      "SELECT * FROM showtime WHERE id = @id",
      new { id = showtimeId }
    );

    // Stop if the showtime does not exist.
    if (showtime == null)
      return RestResult.Parse(context, new { error = "Showtime not found" });

    // Fetch the screen/salon connected to the showtime.
    var screen = SQLQueryOne(
      "SELECT * FROM screen WHERE id = @id",
      new { id = showtime.screen_id }
    );

    // Stop if the screen does not exist.
    if (screen == null)
      return RestResult.Parse(context, new { error = "Screen not found" });

    // Fetch all seats that belong to this screen.
    var seats = SQLQuery(
      "SELECT id, seat_row, seat_number FROM seat WHERE screen_id = @screenId",
      new { screenId = screen.id }
    );

    // Fetch all seats already booked for this showtime.
    var occupiedSeats = SQLQuery(
      "SELECT * FROM booking_seat WHERE showtime_id = @showtimeId",
      new { showtimeId }
    );

    // Mark seats as booked if they appear in booking_seat.
    occupiedSeats.ForEach(x =>
    {
      var matchingSeat = seats.Find(y => y.id == x.seat_id);

      if (matchingSeat != null)
        matchingSeat.is_booked = true;
    });

    // Return showtime, screen and seat state to the frontend.
    return RestResult.Parse(context, new
    {
      showtime,
      screen,
      seats
    });
  }

// GetMyBookings
// Returns all bookings that belong to the currently logged-in user.
public static object GetMyBookings(HttpContext context)
{
  try
  {
    // Read the logged-in user's id from the custom session.
    int? userId = MyBookingsAuthenticationHelpers.GetCurrentUserId(context);

    // Only logged-in users may access Mina bokningar.
    if (!userId.HasValue)
    {
      context.Response.StatusCode = 401;

      return RestResult.Parse(context, new
      {
        error = "Du måste vara inloggad för att se dina bokningar."
      });
    }

    // Fetch all bookings that belong to the current logged-in user.
    // This SQL string starts directly with SELECT,
    // which matches the working pattern used in MovieRoutes.cs.
    var bookings = SQLQuery(
      "SELECT " +
      "b.id, b.user_id, b.email, b.booking_reference, b.total_price, b.booking_date, " +
      "b.showtime_id, st.start_time, st.screen_id, s.screen_name, " +
      "m.id AS movie_id, m.title AS movie_title, m.slug AS movie_slug, " +
      "m.age_limit, m.duration_minutes " +
      "FROM booking b " +
      "JOIN showtime st ON st.id = b.showtime_id " +
      "JOIN screen s ON s.id = st.screen_id " +
      "JOIN movie m ON m.id = st.movie_id " +
      "WHERE b.user_id = @userId " +
      "ORDER BY st.start_time DESC",
      new { userId = userId.Value },
      context
    );

    // If SQLQuery returned an error row, return that clearly.
    if (bookings != null && bookings.Length > 0 && bookings[0] != null && bookings[0].error != null)
    {
      context.Response.StatusCode = 500;

      return RestResult.Parse(context, new
      {
        error = "Main bookings query failed",
        message = bookings[0].error
      });
    }

    var result = new List<object>();

    foreach (var booking in bookings)
    {
      // Skip invalid rows if important values are missing.
      if (
        booking.id == null ||
        booking.showtime_id == null ||
        booking.screen_id == null ||
        booking.movie_id == null
      )
      {
        continue;
      }

      // Convert key values once before reuse.
      int bookingId = Convert.ToInt32(booking.id);
      int showtimeId = Convert.ToInt32(booking.showtime_id);
      int screenId = Convert.ToInt32(booking.screen_id);
      int movieId = Convert.ToInt32(booking.movie_id);

      // Fetch all seats connected to this booking.
      // This also follows the same SQLQuery pattern as MovieRoutes.cs.
      var bookingSeats = SQLQuery(
        "SELECT " +
        "bs.seat_id, bs.price_category_id, seat.seat_row, seat.seat_number " +
        "FROM booking_seat bs " +
        "JOIN seat ON seat.id = bs.seat_id " +
        "WHERE bs.booking_id = @bookingId " +
        "ORDER BY seat.seat_row, seat.seat_number",
        new { bookingId },
        context
      );

      // If SQLQuery returned an error row, return that clearly.
      if (bookingSeats != null && bookingSeats.Length > 0 && bookingSeats[0] != null && bookingSeats[0].error != null)
      {
        context.Response.StatusCode = 500;

        return RestResult.Parse(context, new
        {
          error = "Booking seats query failed",
          message = bookingSeats[0].error,
          bookingId
        });
      }

      var selectedSeats = new List<string>();
      var selectedSeatInfo = new List<object>();

      int adultCount = 0;
      int childCount = 0;
      int seniorCount = 0;

      foreach (var seat in bookingSeats)
      {
        // Skip seat rows with missing values instead of crashing.
        if (seat.seat_row == null || seat.seat_number == null)
        {
          continue;
        }

        int row = Convert.ToInt32(seat.seat_row);
        int seatNumber = Convert.ToInt32(seat.seat_number);

        // Build seat id in the format expected by the frontend.
        selectedSeats.Add($"{row}-{seatNumber}");

        // Store structured seat data for the frontend.
        selectedSeatInfo.Add(new
        {
          id = $"{row}-{seatNumber}",
          row,
          seatNumber
        });

        // Count ticket types if price_category_id exists.
        if (seat.price_category_id != null)
        {
          int priceCategoryId = Convert.ToInt32(seat.price_category_id);

          if (priceCategoryId == 1) adultCount++;
          else if (priceCategoryId == 2) seniorCount++;
          else if (priceCategoryId == 3) childCount++;
        }
      }

      // Mark booking as upcoming if the showtime is in the future.
      bool isUpcoming =
        booking.start_time != null &&
        Convert.ToDateTime(booking.start_time) > DateTime.Now;

      // Build the final booking object in the format expected by the frontend.
      result.Add(new
      {
        id = bookingId,
        bookingReference = booking.booking_reference,
        email = booking.email,

        movie = new
        {
          id = movieId,
          title = booking.movie_title,
          slug = booking.movie_slug,
          age_limit = booking.age_limit != null ? Convert.ToInt32(booking.age_limit) : 0,
          duration_minutes = booking.duration_minutes != null ? Convert.ToInt32(booking.duration_minutes) : 0
        },

        showtime = new
        {
          id = showtimeId,
          start_time = booking.start_time,
          screen_id = screenId
        },

        screen = new
        {
          id = screenId,
          screen_name = booking.screen_name
        },

        selectedSeats,
        selectedSeatInfo,

        tickets = new
        {
          adult = adultCount,
          child = childCount,
          senior = seniorCount
        },

        totalPrice = booking.total_price != null
          ? Convert.ToDecimal(booking.total_price)
          : 0,

        isUpcoming
      });
    }

    // Return all bookings for the logged-in user.
    return RestResult.Parse(context, result);
    }
    catch (Exception ex)
    {
      // Return a server error if something unexpected happens.
      context.Response.StatusCode = 500;

      return RestResult.Parse(context, new
      {
        error = "GetMyBookings crashed",
        message = ex.Message
      });
    }
  }
}
  