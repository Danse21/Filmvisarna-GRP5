namespace WebApp;

public static class MyBookingsService
{
  public static object GetMyBookings(HttpContext context)
{
  // Read email from query string
  var email = context.Request.Query["email"].ToString();

  if (string.IsNullOrWhiteSpace(email))
  {
    return RestResult.Parse(context, new
    {
      error = "email is missing"
    });
  }

  // Get all bookings for this email
  var bookings = SQLQuery(@"
    SELECT
      b.id,
      b.email,
      b.booking_reference,
      b.total_price,
      b.booking_date,
      b.showtime_id,

      st.start_time,
      st.screen_id,

      s.screen_name,

      m.id AS movie_id,
      m.title AS movie_title,
      m.slug AS movie_slug,
      m.age_limit,
      m.duration_minutes
    FROM booking b
    JOIN showtime st ON st.id = b.showtime_id
    JOIN screen s ON s.id = st.screen_id
    JOIN movie m ON m.id = st.movie_id
    WHERE b.email = @email
    ORDER BY st.start_time DESC
  ", new
  {
    email
  });

  var result = new List<object>();

  foreach (var booking in bookings)
  {
    // Get all seats for this booking
    var bookingSeats = SQLQuery(@"
      SELECT
        bs.seat_id,
        bs.price_category_id,
        seat.seat_row,
        seat.seat_number
      FROM booking_seat bs
      JOIN seat ON seat.id = bs.seat_id
      WHERE bs.booking_id = @bookingId
      ORDER BY seat.seat_row, seat.seat_number
    ", new
    {
      bookingId = booking.id
    });

    var selectedSeats = new List<string>();
    var selectedSeatInfo = new List<object>();

    int adultCount = 0;
    int childCount = 0;
    int seniorCount = 0;

    foreach (var seat in bookingSeats)
    {
      selectedSeats.Add($"{seat.seat_row}-{seat.seat_number}");

      selectedSeatInfo.Add(new
      {
        id = $"{seat.seat_row}-{seat.seat_number}",
        row = (int)seat.seat_row,
        seatNumber = (int)seat.seat_number
      });

      int priceCategoryId = Convert.ToInt32(seat.price_category_id);

      if (priceCategoryId == 1) adultCount++;
      else if (priceCategoryId == 2) seniorCount++;
      else if (priceCategoryId == 3) childCount++;
    }

    bool isUpcoming = Convert.ToDateTime(booking.start_time) > DateTime.Now;

    result.Add(new
    {
      id = booking.id,
      bookingReference = booking.booking_reference,
      email = booking.email,

      movie = new
      {
        id = booking.movie_id,
        title = booking.movie_title,
        slug = booking.movie_slug,
        age_limit = booking.age_limit,
        duration_minutes = booking.duration_minutes
      },

      showtime = new
      {
        id = booking.showtime_id,
        start_time = booking.start_time,
        screen_id = booking.screen_id
      },

      screen = new
      {
        id = booking.screen_id,
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

      totalPrice = booking.total_price,
      isUpcoming
    });
  }

  return RestResult.Parse(context, result);
}
}