import { useLoaderData, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

import MyBookingsCard from "../parts/MyBookingsCard";
import myBookingsServiceLoader from "../loaders/myBookingsServiceLoader";
import type BookingItems from "../interfaces/bookingItems";

MyBookingsPage.route = {
  path: "/mina-bokningar",
  loader: myBookingsServiceLoader,
  index: 16,
};

export default function MyBookingsPage() {
  const navigate = useNavigate();

  const loaderData = useLoaderData() as {
    bookings: BookingItems[];
  };

  const { bookings } = loaderData;

  const upcomingBookings = bookings.filter((booking) => booking.isUpcoming);
  const historyBookings = bookings.filter((booking) => !booking.isUpcoming);

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

  function formatShortDate(startIso: string) {
    return new Date(startIso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
    });
  }

  function handleOpenBookingDetails(booking: BookingItems) {
    navigate(`/mina-bokningar/${booking.id}`, {
      state: booking,
    });
  }

  return (
    <Container className="pt-5 pb-5">
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark mt-3"
        onClick={() => navigate(-1)}
      >
        ← Bakåt
      </Button>

      <div className="my-bookings-wrapper mx-auto mt-3">
        <h2 className="text-center mb-4">Mina bokningar</h2>

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

        <section>
          <h4 className="text-center mb-4">Bokningshistorik</h4>

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
