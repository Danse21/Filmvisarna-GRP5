import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import type Movie from "../interfaces/movie";

import type SelectedSeatInfo from "../interfaces/selectedSeatInfo";
import type Tickets from "../interfaces/ticket";

import SelectedTicketPriceSummary from "./booking/SelectedTicketPriceSummary";
import EmailInputField from "./booking/EmailInputField";
import SelectedMovieAndSeatInfo from "./booking/SelectedMovieAndSeatInfo";

BookingSummaryPage.route = {
  path: "/booking/selected",
  index: 10,
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
        selectedSeatInfo: SelectedSeatInfo[];
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

  const {
    movie,
    showtime,
    screen,
    tickets,
    totalPrice,
    selectedSeats,
    selectedSeatInfo,
  } = state;

  // This object groups selected seats by row using the exact seat numbers
  // from the booking page seat layout.
  const groupedSeats: Record<number, number[]> = {};

  // Loop through all selected seat info objects.
  selectedSeatInfo.forEach((seat) => {
    // Create an empty array for the row if it does not exist yet.
    if (!groupedSeats[seat.row]) {
      groupedSeats[seat.row] = [];
    }

    // Add the exact seat number to the correct row.
    groupedSeats[seat.row].push(seat.seatNumber);
  });

  // This variable creates the text that shows the selected seats
  // using the exact seat numbers from BookingPage.
  const seatText =
    selectedSeatInfo.length > 0
      ? Object.entries(groupedSeats)
          // Sort rows from lowest to highest row number.
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([row, seats]) => {
            // Sort seat numbers from lowest to highest.
            const sortedSeats = [...seats].sort((a, b) => a - b);

            // Return formatted seat text for one row.
            return `Rad ${row}: stol ${sortedSeats.join(", ")}`;
          })
          // Join all row texts into one string.
          .join(" • ")
      : // Show a dash if no seats are selected.
        "—";

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
          selectedSeatInfo,
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
