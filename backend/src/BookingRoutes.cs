namespace WebApp;

public static class BookingRoute
{
  public static void Start()
  {
    App.MapGet("/api/booking", (HttpContext context) =>
    {
      var showtimeId = context.Request.Query["showtimeId"];

      if (string.IsNullOrEmpty(showtimeId))
        return Results.BadRequest("Missing showtimeId");

      var showtime = SQLQueryOne(
      "SELECT * FROM showtime WHERE id = @id",
      new { id = showtimeId }
      );

      var screen = SQLQueryOne(
      "SELECT * FROM screen WHERE id = @id",
     new { id = showtime.screen_id }
      );

      var seats = SQLQuery(
      "SELECT * FROM seat WHERE screen_id = @id",
      new { id = screen.id }
      );

      return Results.Ok(new
      {
        showtime,
        screen,
        seats
      });
    });
  }
}
  