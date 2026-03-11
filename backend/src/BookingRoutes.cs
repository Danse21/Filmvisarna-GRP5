namespace WebApp;

public static class BookingRoutes
{
  public static void Start()
  {
    // --------------------------------------------------
    // GET /api/booking?showtimeId=XX
    // Returns showtime, screen and seat booking state
    // --------------------------------------------------
    App.MapGet("/api/booking", (HttpContext context) =>
    {
      var showtimeIdStr = context.Request.Query["showtimeId"].ToString();

      // If no showtimeId is provided, return an empty structure
      if (string.IsNullOrWhiteSpace(showtimeIdStr))
        return RestResult.Parse(context, new
        {
          showtime = (object?)null,
          screen = (object?)null,
          seats = new object[] { }
        });

      // Validate query param
      if (!int.TryParse(showtimeIdStr, out var showtimeId))
        return RestResult.Parse(context, new { error = "Invalid showtimeId" });

      // Fetch showtime
      var showtime = SQLQueryOne(
        "SELECT * FROM showtime WHERE id = @id",
        new { id = showtimeId }
      );

      if (showtime == null)
        return RestResult.Parse(context, new { error = "Showtime not found" });

      // Fetch screen/salong
      var screen = SQLQueryOne(
        "SELECT * FROM screen WHERE id = @id",
        new { id = showtime.screen_id }
      );

      if (screen == null)
        return RestResult.Parse(context, new { error = "Screen not found" });

      // Fetch all seats for the screen/saloon
      var seats = SQLQuery(@"SELECT id, seat_row, seat_number FROM seat WHERE screen_id = @screenId", new
      {
        screenId = screen.id
      });

      // Fetch occoupied seats
      var occupiedSeats = SQLQuery(@"SELECT * FROM booking_seat WHERE showtime_id = @showtimeId", new
      {
        showtimeId
      });

      occupiedSeats.ForEach(x => seats.Find(y => y.id == x.seat_id).is_booked=true);

      return RestResult.Parse(context, new
      {
        showtime,
        screen,
        seats
      });
    });

    // --------------------------------------------------
    // POST /api/booking
    // Creates booking row + booking_seat rows
    // Prevents double booking for same showtime
    // --------------------------------------------------
    App.MapPost("/api/booking", (HttpContext context, JsonElement bodyJson) =>
    {
      try
      {
        var body = JSON.Parse(bodyJson.ToString());

        // ----------------------------
        // Validate required body fields
        // ----------------------------
        if (body.showtime_id == null)
          return RestResult.Parse(context, new { error = "showtime_id is missing" });

        if (body.email == null)
          return RestResult.Parse(context, new { error = "email is missing" });

        if (body.total_price == null)
          return RestResult.Parse(context, new { error = "total_price is missing" });

        if (body.seats == null)
          return RestResult.Parse(context, new { error = "seats are missing" });

        int showtimeId = Convert.ToInt32(body.showtime_id);
        string email = (string)body.email;
        decimal totalPrice = Convert.ToDecimal(body.total_price);

        // Seats are sent like ["8-3", "8-2", "8-1"]
        var selectedSeats = body.seats;

        // Booking status: 1 = Pending
        int statusId = 1;

        // Timestamp-based booking reference
        string bookingRef =
          DateTime.UtcNow.ToString("yyyyMMddHHmmss") +
          Random.Shared.Next(100, 999).ToString();

        // ----------------------------
        // Fetch showtime and screen
        // ----------------------------
        var showtime = SQLQueryOne(
          "SELECT * FROM showtime WHERE id = @id",
          new { id = showtimeId }
        );

        if (showtime == null)
          return RestResult.Parse(context, new { error = "Showtime not found" });

        if (showtime.screen_id == null)
          return RestResult.Parse(context, new { error = "showtime.screen_id is null" });

        var screen = SQLQueryOne(
          "SELECT * FROM screen WHERE id = @id",
          new { id = Convert.ToInt32(showtime.screen_id) }
        );

        if (screen == null)
          return RestResult.Parse(context, new { error = "Screen not found" });

        // ----------------------------
        // Use same layout as frontend
        // ----------------------------
        string screenName = screen.name != null
          ? ((string)screen.name).Trim()
          : "";

        int[] layout =
          screenName == "Lilla Salongen"
            ? new[] { 6, 8, 9, 10, 10, 12 }
            : new[] { 8, 9, 10, 10, 10, 10, 12, 12 };

        // Convert row + seatInRow into global seat_number
        int ToSeatNumber(int row, int seatInRow)
        {
          int seatNumber = 1;

          for (int r = 1; r <= layout.Length; r++)
          {
            int seatsInRow = layout[r - 1];

            // Right -> left numbering inside each row
            for (int s = seatsInRow; s >= 1; s--)
            {
              if (r == row && s == seatInRow)
                return seatNumber;

              seatNumber++;
            }
          }

          throw new Exception($"Seat mapping failed for row={row}, seatInRow={seatInRow}");
        }

        // --------------------------------------------------
        // Step 1: Prevent double booking BEFORE inserting
        foreach (var seatStrObj in selectedSeats)
        {
          string seatStr = (string)seatStrObj; // e.g. "8-3"
          var parts = seatStr.Split('-');

          int row = int.Parse(parts[0]);
          int seatInRow = int.Parse(parts[1]);
          int seatNumber = ToSeatNumber(row, seatInRow);

          // Find the real seat.id in DB
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

          // If there is already a booking_seat row for same seat + showtime, reject
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

        // Fetch the inserted booking row again using booking_reference
        var created = SQLQueryOne(
          "SELECT id, booking_reference, email, showtime_id, booking_status_id, total_price FROM booking WHERE booking_reference = @bookingRef ORDER BY id DESC LIMIT 1",
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

        // Step 3: Build ticket-category queue
        // Adult first, then Child, then Pensioner
        int adultCategoryId = 1;
        int pensionerCategoryId = 2;
        int childCategoryId = 3;

        // Get number of ticket
        int adultCount = body.tickets?.adult != null ? Convert.ToInt32(body.tickets.adult) : 0;
        int childCount = body.tickets?.child != null ? Convert.ToInt32(body.tickets.child) : 0;
        int seniorCount = body.tickets?.senior != null ? Convert.ToInt32(body.tickets.senior) : 0;


        // Do not allow a user to book if the number of selected ticket is not equal to the number of selected seat
        // A user cannot select more ticket than seat. You cannot go further with booking.
        int selectedSeatCount = 0;
        foreach (var _ in selectedSeats)
        {
          selectedSeatCount++;
        }

        int totalTicketCount = adultCount + childCount + seniorCount;

        if (totalTicketCount != selectedSeatCount)
        {
          return RestResult.Parse(context, new
          {
            error = "Number of tickets must match number of selected seats"
          });
}

        var categoryQueue = new List<int>();

        for (int i = 0; i < adultCount; i++) categoryQueue.Add(adultCategoryId);
        for (int i = 0; i < childCount; i++) categoryQueue.Add(childCategoryId);
        for (int i = 0; i < seniorCount; i++) categoryQueue.Add(pensionerCategoryId);

        int seatIndex = 0;

        // Step 4: Insert booking_seat rows
        foreach (var seatStrObj in selectedSeats)
        {
          string seatStr = (string)seatStrObj;
          var parts = seatStr.Split('-');

          int row = int.Parse(parts[0]);
          int seatInRow = int.Parse(parts[1]);
          int seatNumber = ToSeatNumber(row, seatInRow);

          Console.WriteLine($"Seat mapping: row={row}, seatInRow={seatInRow}");
          // Console.WriteLine($"Seats in row: {seatsInRow}");

          var dbSeat = SQLQueryOne(
            "SELECT id FROM seat WHERE screen_id = @screenId AND seat_number = @seatNumber",
            new
            {
              screenId = screen.id,
              seatNumber
            }
          );
          if (dbSeat == null || dbSeat.id == null)
            return RestResult.Parse(context, new
            {
              error = $"dbSeat.id is null for row {row}, seat {seatInRow}, mapped seat_number {seatNumber}"
            });
          // Assign price category by ticket order
          int priceCategoryId =
            seatIndex < categoryQueue.Count ? categoryQueue[seatIndex] : adultCategoryId;

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

          seatIndex++;
        }

        // Step 5: Return success response
        return RestResult.Parse(context, new
        {
          booking_id = bookingId,
          booking_reference = bookingRef
        });
      }
      catch (Exception ex)
      {
        context.Response.StatusCode = 500;
        return RestResult.Parse(context, new
        {
          error = "Booking crashed",
          message = ex.Message
        });
      }
    });
  }
}


  