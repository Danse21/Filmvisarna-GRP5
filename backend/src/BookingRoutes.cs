namespace WebApp;

public static class BookingRoutes
{
  public static void Start()
  {
    // GET /api/booking?showtimeId=XX
    App.MapGet("/api/booking", (HttpContext context) =>
    {
      var showtimeIdStr = context.Request.Query["showtimeId"].ToString();

      if (string.IsNullOrWhiteSpace(showtimeIdStr))
        return RestResult.Parse(context, new { showtime = (object)null, screen = (object)null, seats = new object[] { } });

      if (!int.TryParse(showtimeIdStr, out var showtimeId))
        return RestResult.Parse(context, new { error = "Invalid showtimeId" });

      var showtime = SQLQueryOne(
        "SELECT * FROM showtime WHERE id = @id",
        new { id = showtimeId }
      );

      if (showtime == null)
        return RestResult.Parse(context, new { error = "Showtime not found" });

      var screen = SQLQueryOne(
        "SELECT * FROM screen WHERE id = @id",
        new { id = showtime.screen_id }
      );

      if (screen == null)
        return RestResult.Parse(context, new { error = "Screen not found" });

      var seats = SQLQuery(
        "SELECT * FROM seat WHERE screen_id = @id",
        new { id = screen.id }
      );

      return RestResult.Parse(context, new
      {
        showtime,
        screen,
        seats
      });
    });

    // POST /api/booking
    // Insert booking parameters into the booking table in the database
    App.MapPost("/api/booking", (HttpContext context, JsonElement bodyJson) =>
    {
      try
      {
        var body = JSON.Parse(bodyJson.ToString());

        int showtimeId = (int)body.showtime_id;
        string email = (string)body.email;
        decimal totalPrice = (decimal)body.total_price;

        int statusId = 1; // booking_status: 1 = Pending
        //Generate booking unique booking number using Timestamp-based style
        // (ex. 20260305221538942 (YYYYMMDDHHMMSS + random 3 digits))
        string bookingRef =
          DateTime.UtcNow.ToString("yyyyMMddHHmmss") +
          Random.Shared.Next(100, 999);

        // 1) INSERT booking
        SQLQuery(@"
          INSERT INTO booking (user_id, email, showtime_id, booking_date, booking_reference, booking_status_id, total_price)
          VALUES (NULL, @email, @showtimeId, NOW(), @bookingRef, @statusId, @totalPrice)
        ", new { email, showtimeId, bookingRef, statusId, totalPrice });

        // 2) FETCH the booking id
        var created = SQLQueryOne(@"
          SELECT id AS booking_id
          FROM booking
          WHERE email = @email AND showtime_id = @showtimeId
          ORDER BY id DESC
          LIMIT 1
        ", new { email, showtimeId });

        if (created == null)
        {
          context.Response.StatusCode = 500;
          return RestResult.Parse(context, new
          {
            error = "Booking inserted but could not be retrieved",
            booking_reference = bookingRef
          });
        }

        return RestResult.Parse(context, new
        {
          booking_id = created.booking_id,
          booking_reference = bookingRef
        });
      }
      catch (Exception ex)
      {
        context.Response.StatusCode = 500;
        return RestResult.Parse(context, new { error = "Booking crashed", message = ex.Message });
      }
    });
  }
}

  