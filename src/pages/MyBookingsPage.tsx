import { useLoaderData, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

import MyBookingsCard from "../parts/MyBookingsCard";
import myBookingsServiceLoader from "../loaders/myBookingsServiceLoader";
import type BookingItems from "../interfaces/bookingItems";

// Route configuration for Mina bokningar.
// The loader protects the page and fetches bookings
// for the currently logged-in user.
MyBookingsPage.route = {
  path: "/mina-bokningar",
  loader: myBookingsServiceLoader,
  index: 16,
};

export default function MyBookingsPage() {
  const navigate = useNavigate();

  // Read the bookings returned by the route loader.
  const loaderData = useLoaderData() as {
    bookings: BookingItems[];
  };

  const { bookings } = loaderData;

  // Separate upcoming bookings from booking history.
  const upcomingBookings = bookings.filter((booking) => booking.isUpcoming);
  const historyBookings = bookings.filter((booking) => !booking.isUpcoming);

  // Group booking history by year.
  const groupedHistory = historyBookings.reduce<Record<number, BookingItems[]>>(
    (acc, booking) => {
      const year = new Date(booking.showtime.start_time).getFullYear();

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(booking);
      return acc;
    },
    {},
  );

  // Format the showtime date as "14 februari", etc.
  function formatShortDate(startIso: string) {
    return new Date(startIso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
    });
  }

  // Open the booking details page and pass the full booking in navigation state.
  function handleOpenBookingDetails(booking: BookingItems) {
    navigate(`/mina-bokningar/${booking.id}`, {
      state: booking,
    });
  }

  return (
    <Container className="pt-5 pb-5">
      {/* Back button to return to the previous page */}
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark mt-3"
        onClick={() => navigate(-1)}
      >
        ← Bakåt
      </Button>

      {/* Main page wrapper */}
      <div className="my-bookings-wrapper text-center mx-auto mt-3">
        <h2 className="mb-4">Mina bokningar</h2>

        {/* Upcoming bookings section */}
        <section className="mb-5">
          <h4 className="mb-3">Kommande</h4>

          {upcomingBookings.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {upcomingBookings.map((booking) => (
                <MyBookingsCard
                  key={booking.id}
                  date={formatShortDate(booking.showtime.start_time)}
                  movieTitle={booking.movie.title}
                  totalPrice={booking.totalPrice}
                  onClick={() => handleOpenBookingDetails(booking)}
                />
              ))}
            </div>
          ) : (
            <p>Inga kommande bokningar.</p>
          )}
        </section>

        {/* Booking history section */}
        <section>
          <h4 className="mb-4">Bokningshistorik</h4>

          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, bookingsInYear]) => (
                <div key={year} className="mb-4">
                  <div className="history-year-box mx-auto mb-3">{year}</div>

                  <div className="d-flex flex-column gap-3">
                    {bookingsInYear.map((booking) => (
                      <MyBookingsCard
                        key={booking.id}
                        date={formatShortDate(booking.showtime.start_time)}
                        movieTitle={booking.movie.title}
                        totalPrice={booking.totalPrice}
                        onClick={() => handleOpenBookingDetails(booking)}
                      />
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center">Ingen bokningshistorik finns ännu.</p>
          )}
        </section>
      </div>
    </Container>
  );
}
