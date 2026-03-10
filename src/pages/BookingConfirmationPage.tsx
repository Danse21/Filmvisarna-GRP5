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
        <Button variant="da" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
      </div>
    </Container>
  );
}

/*
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import type Movie from "../interfaces/movie";

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
      }
    | undefined;

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

  function formatDateTimeRange(startIso: string, durationMinutes: number) {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const dateText = start.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const startTime = start.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = end.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateText} ${startTime} - ${endTime}`;
  }

  // Gör om ["4-3","4-2","4-1"] till "Rad 4 stol 3, 2 och 1"
  const groupedSeats = selectedSeats.reduce<Record<string, number[]>>(
    (acc, id) => {
      const [rowStr, seatStr] = id.split("-");
      const row = rowStr;
      const seat = Number(seatStr);

      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);

      return acc;
    },
    {},
  );

  const seatText = Object.entries(groupedSeats)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([row, seats]) => {
      const sorted = seats.sort((a, b) => a - b);

      if (sorted.length === 1) {
        return `Rad ${row} stol ${sorted[0]}`;
      }

      if (sorted.length === 2) {
        return `Rad ${row} stol ${sorted[0]} och ${sorted[1]}`;
      }

      const lastSeat = sorted[sorted.length - 1];
      const firstSeats = sorted.slice(0, -1).join(", ");
      return `Rad ${row} stol ${firstSeats} och ${lastSeat}`;
    })
    .join(" • ");

  return (
    <Container className="confirmation-page pt-header pb-5">
      {/* Add a close button at the left top */
/* <Button
        variant="link"
        className="btn btn-link text-dark p-0 text-decoration-none fw-bold"
        onClick={() => navigate("/")}
      >
        ✕ STÄNG
      </Button>
      <h2 className="confirmation-title text-center mb-4">Bekräftelse</h2>
      <div className="confirmation-text mb-4">
        <p className="mb-1">Hej,</p>
        <p>Här kommer bokningsbekräftelse för dina biljetter.</p>
      </div>
      <div className="confirmation-box mx-auto mb-4">
        <p className="ticket-summary mb-2">
          <strong>Dina val:</strong>
        </p>

        {tickets.child > 0 && (
          <p className="ticket-summary confirmation-line">
            {tickets.child} Barn {tickets.child * 80} kr
          </p>
        )}

        {tickets.adult > 0 && (
          <p className="ticket-summary confirmation-line">
            {tickets.adult} Vuxen {tickets.adult * 160} kr
          </p>
        )}

        {tickets.senior > 0 && (
          <p className="ticket-summary confirmation-line">
            {tickets.senior} Pensionär {tickets.senior * 120} kr
          </p>
        )}

        <p className="ticket-summary confirmation-line mb-3">
          <strong>Totaltpris:</strong> {totalPrice} kr
        </p>

        <p className="confirmation-line">
          <strong>Film:</strong> {movie.title} (Åldersgräns: {movie.age_limit}{" "}
          år)
        </p>

        <p className="confirmation-line">
          <strong>Datum:</strong>{" "}
          {formatDateTimeRange(showtime.start_time, movie.duration_minutes)}
        </p>

        <p className="confirmation-line">
          <strong>Plats:</strong> {seatText}
        </p>

        <p className="confirmation-line">
          <strong>Salong:</strong> {screen.screen_name}
        </p>

        <p className="confirmation-line mb-0">
          <strong>Bokningsnummer:</strong> {bookingReference}
        </p>
      </div>
      <div className="confirmation-footer">
        <p className="welcome-text">Välkommen åter!</p>
        <p className="greeting-text">
          Hälsningar,
          <br />
          Retro Cinema
        </p>
      </div>
      <div className="mt-4">
        <Button variant="dark" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
      </div>
    </Container>
  );
}*/
