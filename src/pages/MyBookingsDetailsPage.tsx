import { Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import MyBookingsCard from "../parts/MyBookingsCard";
import ConfirmationAllSelectedItems from "./booking/ConfirmationAllSelectedItems";
import type BookingItem from "../interfaces/bookingItems";

MyBookingDetailsPage.route = {
  path: "/mina-bokningar/:id",
  index: 17,
};

export default function MyBookingDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state as BookingItem | undefined;

  if (!booking) {
    return (
      <Container className="pt-5 pb-5">
        <Button
          variant="link"
          className="ps-0 text-decoration-none fw-bold text-dark"
          onClick={() => navigate("/mina-bokningar")}
        >
          ← Bakåt
        </Button>

        <p>Ingen bokningsinformation hittades.</p>
      </Container>
    );
  }

  function formatShortDate(startIso: string) {
    return new Date(startIso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
    });
  }

  return (
    <Container className="pt-5 pb-5">
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark"
        onClick={() => navigate("/mina-bokningar")}
      >
        ← Bakåt
      </Button>

      <div className="my-bookings-wrapper mx-auto mt-3">
        <MyBookingsCard
          date={formatShortDate(booking.showtime.start_time)}
          totalPrice={booking.totalPrice}
        />

        <div className="text-center my-4">
          <img
            src={`/images/movies/${booking.movie.slug}.jpg`}
            alt={booking.movie.title}
            className="my-booking-details__image img-fluid rounded"
          />
        </div>

        <ConfirmationAllSelectedItems
          movie={booking.movie}
          showtime={booking.showtime}
          screen={booking.screen}
          selectedSeats={booking.selectedSeats}
          selectedSeatInfo={booking.selectedSeatInfo}
          tickets={booking.tickets}
          totalPrice={booking.totalPrice}
          bookingReference={booking.bookingReference}
        />

        <div className="text-center mt-4">
          <Button
            variant="danger"
            onClick={() =>
              navigate("/avbokning", {
                state: {
                  bookingReference: booking.bookingReference,
                  email: booking.email,
                },
              })
            }
          >
            Avboka
          </Button>
        </div>
      </div>
    </Container>
  );
}
