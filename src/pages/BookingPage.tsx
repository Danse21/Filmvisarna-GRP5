import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import type Movie from "../interfaces/movie";
import bookingLoader from "../loaders/bookingLoader";
import type {
  PriceCategory,
  PriceRow,
  PriceCategoryRow,
} from "../interfaces/priceCategory";

// Route Navigation
BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
};

type DbSeat = {
  seat_id: number;
  seat_row: number;
  seat_number: number;
};

type UiSeat = {
  id: number;
  row: number;
  seatInRow: number;
  seatNumber: number;
};


const verboseScreenLayout = await (await fetch('/api/screenLayout')).json();
const getSeatLayout = (screen: number) =>
  verboseScreenLayout.filter((x: any) => x.id === screen).map((x: any) => x.seatsPerRow);

const screenLayouts: Record<string, number[]> = {
  "Stora Salongen": getSeatLayout(1),
  "Lilla Salongen": getSeatLayout(2)
};

function generateSeatsFromLayout(layout: number[]): UiSeat[] {
  const seats: UiSeat[] = [];
  let seatNumber = 1;

  layout.forEach((seatsInRow, rowIndex) => {
    const row = rowIndex + 1;

    for (let seat = seatsInRow; seat >= 1; seat--) {
      seats.unshift({
        id: 0,
        row,
        seatInRow: seat,
        seatNumber,
      });

      seatNumber++;
    }
  });

  return seats;
}

export default function BookingPage() {
  const loaderData = useLoaderData() as {
    movie: Movie;
    showtime: { id: number; start_time: string; screen_id: number; };
    screen: { id: number; screen_name: string; };
    seats: DbSeat[];
  };

  const { movie, showtime, screen, seats: dbSeats } = loaderData;

  const layout = screenLayouts[screen.screen_name] ?? [];

  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  function toggleSeat(id: number) {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  function changeTicket(key: "adult" | "child" | "senior", delta: number) {
    setTickets((prev) => {
      const nextValue = Math.max(0, prev[key] + delta);
      return { ...prev, [key]: nextValue };
    });
  }

  const [priceCategory, setPriceCategory] = useState<PriceCategory[]>([]);

  useEffect(() => {
    async function loadPrices() {
      const [priceRes, catRes] = await Promise.all([
        fetch("/api/price"),
        fetch("/api/price_category"),
      ]);

      const prices: PriceRow[] = await priceRes.json();
      const categories: PriceCategoryRow[] = await catRes.json();

      const merged: PriceCategory[] = prices.map((p) => {
        const cat = categories.find((c) => c.id === p.price_category_id);

        return {
          id: p.id,
          category_name: cat?.name ?? "Unknown",
          amount: Number(p.amount),
        };
      });

      setPriceCategory(merged);
    }

    loadPrices();
  }, []);

  function getPrice(name: string) {
    const wanted = name.trim().toLowerCase();

    const match = priceCategory.find(
      (x) => x.category_name.trim().toLowerCase() === wanted,
    );

    return match?.amount ?? 0;
  }

  const totalTickets = tickets.adult + tickets.child + tickets.senior;

  const totalPrice =
    tickets.adult * getPrice("Adult") +
    tickets.child * getPrice("Child") +
    tickets.senior * getPrice("Pensioner");

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const uiSeats = generateSeatsFromLayout(layout);

  const mergedSeats = uiSeats.map((seat) => {
    const dbSeat = dbSeats.find(
      (s) => s.seat_row === seat.row && s.seat_number === seat.seatNumber
    );

    return {
      ...seat,
      id: dbSeat!.seat_id,
    };
  });

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

          <p>
            {screen && <strong>{screen.screen_name}</strong>}
          </p>

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
                .map((s, i) => (
                  <button
                    key={i}
                    className={`seat
                      ${selectedSeats.includes(s.id) ? "seat-selected" : "seat-free"}
                    `}
                    onClick={() => toggleSeat(s.id)}
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
            <span className="legend-seat seat-selected" />
            <span>Vald stol</span>
          </div>
        </div>
      </section>

      <section className="ticket-selector mt-4">
        <div className="ticket-grid">

          <div className="ticket-col">
            <div className="ticket-price">Pris {getPrice("Adult")} kr</div>

            <div className="ticket-card-only">
              <div className="ticket-label">Vuxen</div>
            </div>

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

          {movie.age_limit < 12 && (
            <div className="ticket-col">
              <div className="ticket-price">Pris {getPrice("Child")} kr</div>

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

          <div className="ticket-col">
            <div className="ticket-price">Pris {getPrice("Pensioner")} kr</div>

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

      <div className="checkout-row mt-4 pb-4">
        <button type="button" className="total-box fw-bold text-black" disabled>
          Totalt
          <br />
          <strong>{totalPrice} kr</strong>
        </button>

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
      </div>
    </Container>
  );
}