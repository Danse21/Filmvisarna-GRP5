import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import type Movie from "../interfaces/movie";
import bookingLoader from "../utils/bookingLoader";

// Route Navigation
BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
};

export default function BookingPage() {
  const { movie, showtime, screen } = useLoaderData() as {
    movie: Movie;
    showtime: {
      id: number;
      start_time: string;
      screen_id: number;
    };
    screen: {
      id: number;
      screen_name: string;
    };
  };

  const navigate = useNavigate();

  // Helper for formatting the showtime
  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const layout = [8, 9, 10, 10, 10, 10, 12, 12]; // Number of seats per row, back --> front row.

  type Seat = {
    id: string;
    row: number;
    seatInRow: number;
    seatNumber: number; // global seat number (used for booking)
  };

  // Generate seats with proper numbering
  // Fix: Initialize seats as an empty array to avoid the recursion error
  function generateSeatsFromLayout(layout: number[]): Seat[] {
    const seats: Seat[] = [];
    let seatNumber = 1;

    layout.forEach((seatsInRow, rowIndex) => {
      const row = rowIndex + 1;

      // RIGHT → LEFT numbering
      for (let seat = seatsInRow; seat >= 1; seat--) {
        seats.push({
          id: `${row}-${seat}`,
          row,
          seatInRow: seat,
          seatNumber,
        });
        seatNumber++;
      }
    });

    return seats;
  }

  const seats = generateSeatsFromLayout(layout);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  function toggleSeat(id: string) {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  return (
    <Container className="pt-5">
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-medium"
        onClick={() => navigate(-1)}
      >
        ← Bakåt
      </Button>

      <Row className="mt-4 mb-4">
        <Col xs={6}>
          <img
            src={`/images/movies/${movie.slug}.jpg`}
            alt={movie.title}
            className="img-fluid rounded"
          />
        </Col>
        <Col xs={6}>
          <h4>{movie.title}</h4>
          <strong>{formatDateTime(showtime.start_time)}</strong>
          <p>
            <strong>{screen.screen_name}</strong>
          </p>
          <p>
            <strong>Åldersgräns: {movie.age_limit} år</strong>
          </p>
        </Col>
      </Row>

      <section className="mt-5 text-center">
        <div className=" text-black p-1 mb-2">
          <strong>Duken</strong>
        </div>

        {/* Groups seats by row for correct centering */}
        <div className="d-flex flex-column gap-2 align-items-center">
          {layout.map((_, rowIndex) => (
            <div key={rowIndex} className="d-flex gap-2 justify-content-center">
              {seats
                .filter((s) => s.row === rowIndex + 1)
                .map((s) => (
                  <button
                    key={s.id}
                    className={`seat ${selectedSeats.includes(s.id) ? "seat-selected" : "seat-free"}`}
                    onClick={() => toggleSeat(s.id)}
                    title={`Rad ${s.row}, Stol ${s.seatInRow}`}
                  />
                ))}
            </div>
          ))}
        </div>
        <div className="seat-legend d-flex flex-column gap-1">
          <div className="legend-item">
            <span className="legend-seat seat-free" />
            <span>Ledig stol</span>
          </div>

          <div className="legend-item">
            <span className="legend-seat seat-occupied" />
            <span>Upptagen stol</span>
          </div>

          <div className="legend-item">
            <span className="legend-seat seat-selected" />
            <span>Vald stol</span>
          </div>
        </div>

        <div className="mt-5">
          <Button
            variant="primary"
            disabled={selectedSeats.length === 0}
            className="px-5"
          >
            Boka {selectedSeats.length} platser
          </Button>
        </div>
      </section>
    </Container>
  );
}
