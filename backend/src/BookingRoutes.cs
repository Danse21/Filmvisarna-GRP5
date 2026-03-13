namespace WebApp;

// This class defines all API routes related to bookings.
// It connects HTTP endpoints to the booking service logic.
public static class BookingRoutes
{
  public static void Start()
  {
    // GET /api/booking?showtimeId=XX
    // Returns all data required to render the booking page:
    // - showtime information
    // - screen/salon information
    // - seat list with booking status
    App.MapGet("/api/booking", (HttpContext context) =>
    {
      // Delegate the logic to BookingService
      return BookingService.GetBookingData(context);
    });

    // POST /api/booking
    // Creates a new booking and related booking_seat rows
    App.MapPost("/api/booking", (HttpContext context, JsonElement bodyJson) =>
    {
      // Delegate the booking creation logic to BookingService
      return BookingService.CreateBooking(context, bodyJson);
    });
  }
}


  