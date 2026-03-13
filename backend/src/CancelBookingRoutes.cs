namespace WebApp;

// This class contains the route for cancelling an existing booking.
public static class CancelBookingRoutes
{
  // Start() registers the cancel booking route when the server starts.
  public static void Start()
  {
    // Create a POST API endpoint at /api/cancel-booking.
    App.MapPost("/api/cancel-booking", (HttpContext context, JsonElement bodyJson) =>
    {
      try
      {
        // Parse the incoming JSON request body.
        var body = JSON.Parse(bodyJson.ToString());

        // Check that the email field exists.
        if (body.email == null)
          return RestResult.Parse(context, new { error = "email is missing" });

        // Check that the booking reference field exists.
        if (body.booking_reference == null)
          return RestResult.Parse(context, new { error = "booking_reference is missing" });

        // Convert email to string.
        string email = (string)body.email;

        // Convert booking reference to string.
        string bookingReference = (string)body.booking_reference;

        // Find the booking by matching both email and booking reference.
        var booking = SQLQueryOne(
          @"SELECT id
            FROM booking
            WHERE email = @email
            AND booking_reference = @bookingReference",
          new
          {
            email,
            bookingReference
          }
        );

        // Return error if booking was not found.
        if (booking == null)
          return RestResult.Parse(context, new
          {
            error = "Kontrollera att din e-post och bokningsnummer stämmer"
          });

        // Delete the booking row from the booking table.
        SQLQuery(@"
          DELETE FROM booking
          WHERE id = @bookingId
        ", new
        {
          bookingId = booking.id
        });

        // Delete reserved seats so they become available again.
        SQLQuery(@"
          DELETE FROM booking_seat
          WHERE booking_id = @bookingId
        ", new
        {
          bookingId = booking.id
        });

        // Return success response.
        return RestResult.Parse(context, new
        {
          success = true
        });
      }
      catch (Exception ex)
      {
        // Return server error if something crashes unexpectedly.
        context.Response.StatusCode = 500;

        return RestResult.Parse(context, new
        {
          error = "Cancel booking failed",
          message = ex.Message
        });
      }
    });
  }
}