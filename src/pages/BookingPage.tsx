import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";

import bookingLoader from "../loaders/bookingLoader";
import { formatDateTime } from "../utils/formatDateTime";

/*Utils imports saker som gör saker åt den här ska dom flesta samlas här */
import { updateTicketCount } from "../utils/booking/uppdateTicketCount";
import { fetchBookingPrices } from "../utils/booking/fetchBookingPrices";

import { calculateBookingTotals } from "../utils/booking/calculateBookingTotals";
import { screenLayouts } from "../utils/booking/screenLayouts";

import mergeSeatsWithBookingState from "../utils/booking/mergeSeatsWithBookingState";


import { toggleSeat } from "../utils/booking/toggleSeat";
import { getPrice } from "../utils/booking/getPrice";
import type { PriceCategory } from "../interfaces/priceCategory";

// Interfaces
import type Movie from "../interfaces/movie";

// Route Navigation
BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
};

type DbSeat = {
  id: number;
  seat_row: number;
  seat_number: number;
  is_booked: boolean;
};



export default function BookingPage() {
  const loaderData = useLoaderData() as {
    movie: Movie;
    showtime: { id: number; start_time: string; screen_id: number };
    screen: { id: number; screen_name: string };
    seats: DbSeat[];
  };

  const { movie, showtime, screen, seats: dbSeats } = loaderData;
  const layout = screenLayouts[screen.screen_name] ?? [];
  const mergedSeats = mergeSeatsWithBookingState(layout, dbSeats);


  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  const [priceCategory, setPriceCategory] = useState<PriceCategory[]>([]);

  const { totalTickets, totalPrice } = calculateBookingTotals(
    tickets,
    priceCategory,
  );

  function changeTicket(key: "adult" | "child" | "senior", plusMinus: number) {
    setTickets((prev) => updateTicketCount(prev, key, plusMinus));
  }




  // Fetch on mount
  // Merge: price_category_id -> category name
  useEffect(() => {
    async function loadPrices() {
      const mergedPrices = await fetchBookingPrices();
      console.log("MERGED PRICE OPTIONS:", mergedPrices);
      setPriceCategory(mergedPrices);
    }

    loadPrices();
  }, []);






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
          {showtime && <strong>{formatDateTime(showtime.start_time)}</strong>}
          <p>{screen && <strong>{screen.screen_name}</strong>}</p>
          <p>
            <strong>Åldersgräns: {movie.age_limit} år</strong>
          </p>
        </Col>
      </Row>

      <section className="mt-5 text-center">
        <div className="text-black p-1 mb-2">
          <strong>Duken</strong>
        </div>

        <div className="d-flex flex-column gap-2 align-items-center">
          {layout.map((_, rowIndex) => (
            <div key={rowIndex} className="d-flex gap-2 justify-content-center">
              {mergedSeats
                .filter((s) => s.row === rowIndex + 1)
                .map((s) => (
                  <button
                    key={s.id}
                    className={`seat
                      ${s.is_booked ? "seat-occupied" : "seat-free"}
                      ${selectedSeats.includes(s.id) ? "seat-selected" : ""}
                    `}
                    disabled={s.is_booked}
                    onClick={() => setSelectedSeats((prev) => toggleSeat(prev, s.id))}
                    title={`Rad ${s.row}, Stol ${s.seatNumber}`}
                  />
                ))}
            </div>
          ))}
        </div>

        <div className="seat-legend d-flex flex-column gap-1 mt-3">
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
      </section>
      {/* Ticket selector wrapper */}
      <section className="ticket-selector mt-4">
        <div className="ticket-grid">
          {/* VUXEN */}
          <div className="ticket-col">
            <div className="ticket-price">Pris {getPrice(priceCategory, "Adult")} kr</div>

            {/* Card contains ONLY the category label */}
            <div className="ticket-card-only">
              <div className="ticket-label">Vuxen</div>
            </div>

            {/* Counter is BELOW the card */}
            <div className="ticket-controls">
              <button
                type="button"
                className="ticket-btn"
                onClick={() => changeTicket("adult", -1)}
              >
                -
              </button>

              <span className="ticket-count">{tickets.adult}</span>

              <button
                type="button"
                className="ticket-btn"
                onClick={() => changeTicket("adult", +1)}
              >
                +
              </button>
            </div>
          </div>

          {/* BARN Lagt att den inte renderas om age limit är 12 eller mer*/}
          {movie.age_limit < 12 && (
            <div className="ticket-col">
              <div className="ticket-price">Pris {getPrice(priceCategory, "Child")} kr</div>

              <div className="ticket-card-only">
                <div className="ticket-label">Barn &lt; 12 år</div>
              </div>

              <div className="ticket-controls">
                <button
                  type="button"
                  className="ticket-btn"
                  onClick={() => changeTicket("child", -1)}
                >
                  -
                </button>

                <span className="ticket-count">{tickets.child}</span>

                <button
                  type="button"
                  className="ticket-btn"
                  onClick={() => changeTicket("child", +1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* PENSIONÄR */}
          <div className="ticket-col">
            <div className="ticket-price">Pris {getPrice(priceCategory, "Pensioner")} kr</div>

            <div className="ticket-card-only">
              <div className="ticket-label">Pensionär</div>
            </div>

            <div className="ticket-controls">
              <button
                type="button"
                className="ticket-btn"
                onClick={() => changeTicket("senior", -1)}
              >
                -
              </button>

              <span className="ticket-count">{tickets.senior}</span>

              <button
                type="button"
                className="ticket-btn"
                onClick={() => changeTicket("senior", +1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom actions: Totalt bigger, Till kassan smaller */}
      <div className="checkout-row mt-4 pb-4">
        <button type="button" className="total-box fw-bold text-black" disabled>
          Totalt
          <br />
          <strong>{totalPrice} kr</strong>
        </button>

        {/* Navigation button to next page, only enbled when there is seat and ticket selected */}
        <Button
          className="checkout-btn-small mt-4 me-5"
          disabled={selectedSeats.length === 0 || totalTickets === 0}
          onClick={() =>
            navigate("/booking/selected", {
              state: {
                movie,
                showtime,
                screen,
                selectedSeats,
                tickets,
                totalPrice,
              },
            })
          }
        >
          Till kassan
        </Button>

        {/* <button type="button" className="checkout-btn-small mt-4 me-5" disabled>
          Till kassan
        </button> */}
      </div>
    </Container>
  );
}
