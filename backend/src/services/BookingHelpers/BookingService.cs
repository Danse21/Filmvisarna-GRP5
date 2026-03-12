namespace WebApp;


// Holds the logic from GET and POST (the booking itself)
// for retrieving booking data and creating bookings.
public static class BookingService
{
  // GetBookingData
  // Returns showtime, screen and seat booking state
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
      @"SELECT id, seat_row, seat_number FROM seat WHERE screen_id = @screenId",
      new { screenId = screen.id }
    );

    // Fetch all seats already booked for this showtime.
    var occupiedSeats = SQLQuery(
      @"SELECT * FROM booking_seat WHERE showtime_id = @showtimeId",
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

  // CreateBooking
  // Creates a new booking and inserts booking_seat rows
  public static object CreateBooking(HttpContext context, JsonElement bodyJson)
  {
    try
    {
      // Parse incoming JSON request body.
      var body = JSON.Parse(bodyJson.ToString());

      // Validate required fields
      if (body.showtime_id == null)
        return RestResult.Parse(context, new { error = "showtime_id is missing" });

      if (body.email == null)
        return RestResult.Parse(context, new { error = "email is missing" });

      if (body.total_price == null)
        return RestResult.Parse(context, new { error = "total_price is missing" });

      if (body.seats == null)
        return RestResult.Parse(context, new { error = "seats are missing" });

      // Convert JSON values to typed variables.
      int showtimeId = Convert.ToInt32(body.showtime_id);
      string email = (string)body.email;
      decimal totalPrice = Convert.ToDecimal(body.total_price);

      // Seats arrive as strings like "4-3" (Row 4 seat 3)
      var selectedSeats = body.seats;

      // Booking status 1 = Pending
      int statusId = 1;

      // Create a unique booking reference.
      string bookingRef =
        DateTime.UtcNow.ToString("yyyyMMddHHmmss") +
        Random.Shared.Next(100, 999).ToString();

      // Fetch showtime and screen
      var showtime = SQLQueryOne(
        "SELECT * FROM showtime WHERE id = @id",
        new { id = showtimeId }
      );

      if (showtime == null)
        return RestResult.Parse(context, new { error = "Showtime not found" });

      if (showtime.screen_id == null)
        return RestResult.Parse(context, new { error = "showtime.screen_id is null" });

      // Fetch the screen/salon.
      var screen = SQLQueryOne(
        "SELECT * FROM screen WHERE id = @id",
        new { id = Convert.ToInt32(showtime.screen_id) }
      );

      if (screen == null)
        return RestResult.Parse(context, new { error = "Screen not found" });

      // Read screen name and get its seat layout.
      string screenName = screen.screen_name != null
        ? ((string)screen.screen_name).Trim()
        : "";

      int[] layout = SeatBookingHelpers.GetScreenLayout(screenName);

      // Step 1: Prevent double booking
      foreach (var seatStrObj in selectedSeats)
      {
        string seatStr = (string)seatStrObj;

        // Validate seat id format (e.g. "6-11").
        if (!SeatBookingHelpers.TryParseSeatId(seatStr, out int row, out int seatInRow))
        {
          return RestResult.Parse(context, new
          {
            error = $"Invalid seat format: '{seatStr}'"
          });
        }

        // Convert row + seatInRow into a continuous seat number.
        int seatNumber = SeatBookingHelpers.ToContinuousSeatNumber(row, seatInRow, layout, screenName);

        // Find the seat in the database.
        var dbSeat = SQLQueryOne(
          "SELECT id FROM seat WHERE screen_id = @screenId AND seat_number = @seatNumber",
          new
          {
            screenId = screen.id,
            seatNumber
          }
        );

        if (dbSeat == null)
          return RestResult.Parse(context, new
          {
            error = $"Seat not found for row {row}, seat {seatInRow}"
          });

        // Check if seat is already booked.
        var existing = SQLQueryOne(
          "SELECT id FROM booking_seat WHERE seat_id = @seatId AND showtime_id = @showtimeId",
          new
          {
            seatId = Convert.ToInt32(dbSeat.id),
            showtimeId
          }
        );

        if (existing != null)
          return RestResult.Parse(context, new
          {
            error = $"Seat already booked for this showtime: row {row}, seat {seatInRow}"
          });
      }

      // Step 2: Insert booking row
      SQLQuery(@"
        INSERT INTO booking
          (user_id, email, showtime_id, booking_date, booking_reference, booking_status_id, total_price)
        VALUES
          (NULL, @email, @showtimeId, NOW(), @bookingRef, @statusId, @totalPrice)
      ", new
      {
        email,
        showtimeId,
        bookingRef,
        statusId,
        totalPrice
      });

      // Fetch the newly created booking.
      var created = SQLQueryOne(
        "SELECT id FROM booking WHERE booking_reference = @bookingRef ORDER BY id DESC LIMIT 1",
        new { bookingRef }
      );

      if (created == null || created.id == null)
      {
        context.Response.StatusCode = 500;
        return RestResult.Parse(context, new
        {
          error = "Booking inserted but id is null",
          booking_reference = bookingRef
        });
      }

      int bookingId = Convert.ToInt32(created.id);

      // Step 3: Insert booking_seat rows
      foreach (var seatStrObj in selectedSeats)
      {
        string seatStr = (string)seatStrObj;

        SeatBookingHelpers.TryParseSeatId(seatStr, out int row, out int seatInRow);

        int seatNumber = SeatBookingHelpers.ToContinuousSeatNumber(row, seatInRow, layout, screenName);

        var dbSeat = SQLQueryOne(
          "SELECT id FROM seat WHERE screen_id = @screenId AND seat_number = @seatNumber",
          new
          {
            screenId = screen.id,
            seatNumber
          }
        );

        SQLQuery(@"
          INSERT INTO booking_seat (booking_id, seat_id, showtime_id)
          VALUES (@bookingId, @seatId, @showtimeId)
        ", new
        {
          bookingId,
          seatId = Convert.ToInt32(dbSeat.id),
          showtimeId
        });
      }

      // Return success response.
      return RestResult.Parse(context, new
      {
        booking_id = bookingId,
        booking_reference = bookingRef
      });
    }
    catch (Exception ex)
    {
      // Return error if booking fails unexpectedly.
      context.Response.StatusCode = 500;

      return RestResult.Parse(context, new
      {
        error = "Booking crashed",
        message = ex.Message
      });
    }
  }
}