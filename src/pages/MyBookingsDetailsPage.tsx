import { Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import MyBookingsCard from "../parts/MyBookingsCard";
import ConfirmationAllSelectedItems from "./booking/ConfirmationAllSelectedItems";
import type BookingItem from "../interfaces/bookingItems";

// Route configuration for this page
// URL example: /mina-bokningar/123
MyBookingDetailsPage.route = {
  path: "/mina-bokningar/:id", // booking id from URL
  index: 17, // order in route configuration
};

export default function MyBookingDetailsPage() {
  // Hook used to navigate programmatically between pages
  const navigate = useNavigate();

  // Access location object (used to receive booking data from previous page)
  const location = useLocation();

  // Booking data passed via navigation state
  const booking = location.state as BookingItem | undefined;

  // If booking data is missing (for example if user refreshed the page)
  // show an error message instead of crashing
  if (!booking) {
    return (
      <Container className="pt-5 pb-5">
        {/* Back button to bookings list */}
        <Button
          variant="link"
          className="ps-0 text-decoration-none fw-bold text-dark"
          onClick={() => navigate("/mina-bokningar")}
        >
          ← Bakåt
        </Button>

        {/* Message shown if booking state is missing */}
        <p>Ingen bokningsinformation hittades.</p>
      </Container>
    );
  }

  // Helper function that formats the showtime date
  // Example: "2026-04-12T18:00:00" -> "12 april"
  function formatShortDate(startIso: string) {
    return new Date(startIso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
    });
  }

  return (
    <Container className="pt-5 pb-5">
      {/* Back button to the bookings overview page */}
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark"
        onClick={() => navigate("/mina-bokningar")}
      >
        ← Bakåt
      </Button>

      {/* Wrapper for the booking details layout */}
      <div className="my-bookings-wrapper mx-auto mt-3">
        {/* Card showing booking date and total price */}
        <MyBookingsCard
          date={formatShortDate(booking.showtime.start_time)}
          totalPrice={booking.totalPrice}
        />

        {/* Movie poster image */}
        <div className="text-center my-4">
          <img
            src={`/images/movies/${booking.movie.slug}.jpg`} // image based on movie slug
            alt={booking.movie.title} // alt text for accessibility
            className="my-booking-details__image img-fluid rounded"
          />
        </div>

        {/* Component that displays full booking details:
            movie, showtime, seats, tickets, price and reference */}
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

        {/* Cancel booking button */}
        <div className="text-center mt-4">
          <Button
            variant="danger"
            onClick={() =>
              // Navigate to cancel page and pass booking info
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
