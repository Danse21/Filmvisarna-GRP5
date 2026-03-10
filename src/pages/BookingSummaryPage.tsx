import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import type Movie from "../interfaces/movie";

import SelectedTicketPriceSummary from "./booking/SelectedTicketPriceSummary";
import EmailInputField from "./booking/EmailInputField";
import SelectedMovieAndSeatInfo from "./booking/SelectedMovieAndSeatInfo";

BookingSummaryPage.route = {
  path: "/booking/selected",
  index: 10,
};

type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | {
        movie: Movie;
        showtime: { id: number; start_time: string };
        screen: { screen_name: string };
        selectedSeats: string[];
        tickets: Tickets;
        totalPrice: number;
      }
    | undefined;

  const [email, setEmail] = useState("");

  if (!state) {
    return (
      <Container className="pt-5">
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Bakåt
        </Button>
        <p>Ingen bokningsdata hittades.</p>
      </Container>
    );
  }

  const { movie, showtime, screen, tickets, totalPrice, selectedSeats } = state;

  const seatText =
    selectedSeats?.length > 0
      ? Object.entries(
          selectedSeats.reduce<Record<string, number[]>>((acc, id) => {
            const [rowStr, seatStr] = id.split("-");
            const row = rowStr;
            const seat = Number(seatStr);

            if (!acc[row]) acc[row] = [];
            acc[row].push(seat);

            return acc;
          }, {}),
        )
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([row, seats]) => {
            const sorted = seats.sort((x, y) => y - x);
            return `Rad ${row}: stol ${sorted.join(", ")}`;
          })
          .join(" • ")
      : "—";

  async function confirmBooking() {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        showtime_id: showtime.id,
        email,
        seats: selectedSeats,
        tickets,
        total_price: totalPrice,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate("/booking/confirmation", {
        state: {
          bookingId: data.booking_id,
          bookingReference: data.booking_reference,
          movie,
          showtime,
          screen,
          selectedSeats,
          tickets,
          totalPrice,
          email,
        },
      });
    } else {
      alert(
        data.error
          ? `${data.error}: ${data.message ?? ""}`
          : "Bokningen misslyckades.",
      );
    }
  }

  return (
    <Container className="booking-summary-page pt-header pb-5">
      <Row className="booking-section">
        <Col md={6}>
          <SelectedTicketPriceSummary
            tickets={tickets}
            totalPrice={totalPrice}
          />
        </Col>

        <Col md={5}>
          <EmailInputField email={email} onChangeEmail={setEmail} />
        </Col>
      </Row>

      <SelectedMovieAndSeatInfo
        movie={movie}
        showtime={showtime}
        screen={screen}
        seatText={seatText}
      />

      <div className="booking-section text-center">
        <Button
          className="confirm-booking-btn"
          disabled={!email}
          onClick={confirmBooking}
        >
          Bekräfta bokning
        </Button>
      </div>
    </Container>
  );
}

/*
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import type Movie from "../interfaces/movie";

BookingSummaryPage.route = {
  path: "/booking/selected",
  index: 10,
};

type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | {
        movie: Movie;
        showtime: { id: number; start_time: string };
        screen: { screen_name: string };
        selectedSeats: string[]; // e.g. ["1-8","1-7"]
        tickets: Tickets;
        totalPrice: number;
      }
    | undefined;

  const [email, setEmail] = useState("");

  if (!state) {
    return (
      <Container className="pt-5">
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Bakåt
        </Button>
        <p>Ingen bokningsdata hittades.</p>
      </Container>
    );
  }

  const { movie, showtime, screen, tickets, totalPrice, selectedSeats } = state;

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // selectedSeats like ["3-7","3-6","1-2"]  -> "Rad 3: stol 7, 6 • Rad 1: stol 2"
  const seatText =
    selectedSeats?.length > 0
      ? Object.entries(
          selectedSeats.reduce<Record<string, number[]>>((acc, id) => {
            const [rowStr, seatStr] = id.split("-");
            const row = rowStr;
            const seat = Number(seatStr);

            if (!acc[row]) acc[row] = [];
            acc[row].push(seat);

            return acc;
          }, {}),
        )
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([row, seats]) => {
            const sorted = seats.sort((x, y) => y - x); // right->left style
            return `Rad ${row}: stol ${sorted.join(", ")}`;
          })
          .join(" • ")
      : "—";

  // Send booking request from the BookingSummaryPage to database
  async function confirmBooking() {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        showtime_id: showtime.id,
        email,
        seats: selectedSeats,
        tickets,
        total_price: totalPrice,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate("/booking/confirmation", {
        state: {
          bookingId: data.booking_id,
          bookingReference: data.booking_reference,
          movie,
          showtime,
          screen,
          selectedSeats,
          tickets,
          totalPrice,
        },
      });
    } else {
      alert(
        data.error
          ? `${data.error}: ${data.message ?? ""}`
          : "Bokningen misslyckades.",
      );
    }
  }
  return (
    // pt-header pushes content below your fixed header
    <Container className="booking-summary-page pt-header pb-5">
      {/* ===== TOP SECTION ===== */
/*
      <Row className="booking-section">
        {/* LEFT BOX - selections */
/*
        <Col md={6}>
          <div className="selection-box">
            <h5 className="mb-1">Dina val:</h5>

            <div className="ticket-summary">
              {tickets.adult > 0 && (
                <p className="tight">
                  {tickets.adult} Vuxen {tickets.adult * 160} kr
                </p>
              )}
              {tickets.child > 0 && (
                <p className="tight">
                  {tickets.child} Barn {tickets.child * 80} kr
                </p>
              )}
              {tickets.senior > 0 && (
                <p className="tight">
                  {tickets.senior} Pensionär {tickets.senior * 120} kr
                </p>
              )}
            </div>

            <h5 className="mt-3 mb-0">Totalt {totalPrice} kr</h5>
          </div>
        </Col>

        {/* RIGHT BOX: email label and input box starts on same line) */
/*
        <Col md={5}>
          <div>
            <span className="email-label-inline">
              <strong>Fyll i din Email:</strong>
            </span>

            <div>
              <Form.Control
                className="email-input"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* MIDDLE SECTION: movie image and text */
/*
      <Row className="booking-section">
        {/* Movie image */
/*
        <Col md={6}>
          <img
            src={`/images/movies/${movie.slug}.jpg`}
            alt={movie.title}
            className="img-fluid rounded"
          />
        </Col>

        {/* Movie information (more space from image) */
/*
        <Col md={6} className="movie-info-box ps-md-5">
          <p className="tight">
            <strong>Film:</strong> {movie.title}
          </p>
          <p className="tight">
            <strong>Åldersgräns:</strong> {movie.age_limit}+
          </p>
          <p className="tight">
            <strong>Datum:</strong> {formatDateTime(showtime.start_time)}
          </p>
          <p className="tight">
            <strong>Plats:</strong> {seatText}
          </p>
          <p className="tight mb-0">
            <strong>Salong:</strong> {screen.screen_name}
          </p>
        </Col>
      </Row>

      {/* ===== CONFIRM BUTTON SECTION ===== */
/*
      <div className="booking-section text-center">
        <Button
          className="confirm-booking-btn"
          disabled={!email}
          onClick={confirmBooking}
        >
          Bekräfta bokning
        </Button>
      </div>
    </Container>
  );
}*/
