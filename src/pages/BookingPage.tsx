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
<<<<<<< HEAD
import type DbSeat from "../interfaces/dbSeat";
import type SelectedSeatInfo from "../interfaces/selectedSeatInfo";

import type Movie from "../interfaces/movie";
=======
import { getPrice } from "../utils/booking/getPrice";
>>>>>>> b6906e3e64b71dd817eb7b9eeed9e00bc936223e
import type { PriceCategory } from "../interfaces/priceCategory";

// Interfaces
import type Movie from "../interfaces/movie";

// Route Navigation
BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
};

<<<<<<< HEAD
// Navigation route
BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
=======
type DbSeat = {
  id: number;
  seat_row: number;
  seat_number: number;
  is_booked: boolean;
>>>>>>> b6906e3e64b71dd817eb7b9eeed9e00bc936223e
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
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const mergedSeats = mergeSeatsWithBookingState(layout, dbSeats);

  // This array stores the exact selected seats with their real seat numbers
  // from the booking page seat layout.
  const selectedSeatInfo: SelectedSeatInfo[] = selectedSeats
    .map((selectedId) => {
      // Find the matching seat object in the merged seat list.
      const matchingSeat = mergedSeats.find((seat) => seat.id === selectedId);

      // Return null if the seat was not found.
      if (!matchingSeat) {
        return null;
      }

      // Return the exact seat information used in the seat layout.
      return {
        id: matchingSeat.id,
        row: matchingSeat.row,
        seatNumber: matchingSeat.seatNumber,
      };
    })
    // Remove null values from the array.
    .filter((seat): seat is SelectedSeatInfo => seat !== null);

  const navigate = useNavigate();

<<<<<<< HEAD
=======
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

>>>>>>> b6906e3e64b71dd817eb7b9eeed9e00bc936223e
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

  // A user should not be able to select more ticket category than the number of selected seats or vice versa
  function changeTicket(key: "adult" | "child" | "senior", plusMinus: number) {
    setTickets((prev) => {
      const next = updateTicketCount(prev, key, plusMinus);

      const selectedSeatCount = selectedSeats.length;
      const nextTotal = next.adult + next.child + next.senior;

      // Never allow more ticket selection than selected seats
      if (nextTotal > selectedSeatCount) {
        return prev;
      }

      // Extra safety check to ensure nothing goes below 0 (negative)
      if (next.adult < 0 || next.child < 0 || next.senior < 0) {
        return prev;
      }

      return next;
    });
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

  // Adjust number of selected seats if a user makes a change
  useEffect(() => {
    setTickets((prev) => {
      const selectedSeatCount = selectedSeats.length;
      let total = prev.adult + prev.child + prev.senior;

      // If the number of ticket matches number of selected seats, change nothing
      if (total <= selectedSeatCount) {
        return prev;
      }

      // Create a shallow copy of an existing object (prev)
      // this help us to work on a part of sate
      const next = { ...prev };

      // Remove the excess ticket in the reverse order
      // First senior, then child, then adult
      while (total > selectedSeatCount) {
        if (next.senior > 0) {
          next.senior--;
        } else if (next.child > 0) {
          next.child--;
        } else if (next.adult > 0) {
          next.adult--;
        }
        total = next.adult + next.child + next.senior;
      }

      return next;
    });
  }, [selectedSeats]);

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
            <div key={rowIndex} className="d-flex flex-row-reverse gap-2 justify-content-center">
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
                    onClick={() =>
                      setSelectedSeats((prev) => toggleSeat(prev, s.id))
                    }
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
            <div className="ticket-price">
              Pris {getPrice(priceCategory, "Adult")} kr
            </div>

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
              <div className="ticket-price">
                Pris {getPrice(priceCategory, "Child")} kr
              </div>

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
            <div className="ticket-price">
              Pris {getPrice(priceCategory, "Pensioner")} kr
            </div>

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

<<<<<<< HEAD
      <TotalPriceAndToCashierButton
        totalPrice={totalPrice}
        totalTickets={totalTickets}
        selectedSeats={selectedSeats}
        onCheckout={() =>
          navigate("/booking/selected", {
            state: {
              movie,
              showtime,
              screen,
              selectedSeats,
              selectedSeatInfo,
              tickets,
              totalPrice,
            },
          })
        }
      />
=======
        {/* Navigation button to next page, only enbled when there is seat and ticket selected */}
        <Button
          className="checkout-btn-small d-flex align-items-center mt-4 me-5"
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
>>>>>>> b6906e3e64b71dd817eb7b9eeed9e00bc936223e
    </Container>
  );
}
