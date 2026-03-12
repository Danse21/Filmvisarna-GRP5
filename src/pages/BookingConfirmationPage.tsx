import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import type Movie from "../interfaces/movie";

import ConfirmationInitialMessage from "../pages/booking/ConfirmationInitialMessage";
import ConfirmationAllSelectedItems from "../pages/booking/ConfirmationAllSelectedItems";
import ConfirmationFooterGreetingsNotes from "../pages/booking/ConfirmationFooterGreetingsNotes";

BookingConfirmationPage.route = {
  path: "/booking/confirmation",
  index: 11,
};

type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
    The confirmation page receives all booking data through navigate(..., { state })
    from BookingSummaryPage after successful booking.
  */
  const state = location.state as
    | {
        bookingId: number;
        bookingReference: string;
        movie: Movie;
        showtime: { id: number; start_time: string };
        screen: { screen_name: string };
        selectedSeats: string[];
        tickets: Tickets;
        totalPrice: number;
        email?: string;
      }
    | undefined;

  /*
    If the page is refreshed directly, location.state is lost.
    Then we show a fallback message.
  */
  if (!state) {
    return (
      <Container className="pt-5">
        <Button variant="link" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
        <p>Ingen bokningsinformation hittades.</p>
      </Container>
    );
  }

  const {
    bookingReference,
    movie,
    showtime,
    screen,
    selectedSeats,
    tickets,
    totalPrice,
  } = state;

  return (
    <Container className="confirmation-page pt-header pb-5">
      <div>
        {/* Top text section */}
        <ConfirmationInitialMessage />

        {/* Main box */}
        <ConfirmationAllSelectedItems
          movie={movie}
          showtime={showtime}
          screen={screen}
          selectedSeats={selectedSeats}
          tickets={tickets}
          totalPrice={totalPrice}
          bookingReference={bookingReference}
        />

        {/* Footer text */}
        <ConfirmationFooterGreetingsNotes />
      </div>
      <div className="mt-4">
        <Button variant="dark" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
      </div>
    </Container>
  );
}
