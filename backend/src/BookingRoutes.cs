namespace WebApp;

public static class BookingRoutes
{
  public static void Start()
  {
    App.MapGet("/api/booking", (HttpContext context) =>
    {
      var showtimeIdStr = context.Request.Query["showtimeId"].ToString();

      if (string.IsNullOrWhiteSpace(showtimeIdStr))
        return RestResult.Parse(context, new { error = "Missing showtimeId" });

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

      // ✅ IMPORTANT: use RestResult.Parse so Obj serializes correctly
      return RestResult.Parse(context, new
      {
        showtime,
        screen,
        seats
      });
    });
  }
}




// public static class BookingRoute
// {
//   public static void Start()
//   {
//     App.MapGet("/api/booking", (HttpContext context) =>
//     {
//     var showtimeId = context.Request.Query["showtimeId"];

//     if (string.IsNullOrEmpty(showtimeId))
//       return RestResult.Parse(context, new { error = "Missing showtimeId" });

//     var showtime = SQLQueryOne(
//     "SELECT * FROM showtime WHERE id = @id",
//     new { id = int.Parse(showtimeId) }
//     );

//     if (showtime == null)
//       return RestResult.Parse(context, new { error = "Showtime not found" });

//     var screen = SQLQueryOne(
//     "SELECT * FROM screen WHERE id = @id",
//     new { id = showtime.screen_id }
//     );

//     var seats = SQLQuery(
//     "SELECT * FROM seat WHERE screen_id = @id",
//     new { id = screen.id }
//     );

//     return RestResult.Parse(context, new
//     {
//       showtime,
//       screen,
//       seats
//     });

//   )};
// }
  
// }
  