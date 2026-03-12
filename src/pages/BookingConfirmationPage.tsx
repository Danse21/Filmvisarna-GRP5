import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import type Movie from "../interfaces/movie";

import ConfirmationInitialMessage from "../pages/booking/ConfirmationInitialMessage";
import ConfirmationAllSelectedItems from "../pages/booking/ConfirmationAllSelectedItems";
import ConfirmationFooterGreetingsNotes from "../pages/booking/ConfirmationFooterGreetingsNotes";

// This type stores how many tickets were selected in each category.
type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

// This type stores the exact selected seat information
// passed from BookingPage through BookingSummaryPage.
type SelectedSeatInfo = {
  id: string;
  row: number;
  seatNumber: number;
};

BookingConfirmationPage.route = {
  path: "/booking/confirmation",
  index: 11,
};

export default function BookingConfirmationPage() {
  // This hook is used to navigate the user to another page.
  const navigate = useNavigate();

  // This hook is used to read booking data passed from the previous page.
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
        selectedSeatInfo: SelectedSeatInfo[];
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

  // Destructure the booking data so it is easier to use below.
  const {
    bookingReference,
    movie,
    showtime,
    screen,
    selectedSeats,
    selectedSeatInfo,
    tickets,
    totalPrice,
  } = state;

  // Render the full confirmation page.
  return (
    <Container className="confirmation-page pt-header pb-5">
      <div>
        {/* This component renders the top heading and greeting text. */}
        <ConfirmationInitialMessage />

        {/* This component renders the main booking summary box. */}
        <ConfirmationAllSelectedItems
          movie={movie}
          showtime={showtime}
          screen={screen}
          selectedSeats={selectedSeats}
          selectedSeatInfo={selectedSeatInfo}
          tickets={tickets}
          totalPrice={totalPrice}
          bookingReference={bookingReference}
        />

        {/* This component renders the footer greeting text. */}
        <ConfirmationFooterGreetingsNotes />
      </div>

      <div className="mt-4">
        {/* This button sends the user back to the home page. */}
        <Button variant="danger" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
      </div>
    </Container>
  );
}
