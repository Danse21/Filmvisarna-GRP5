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
