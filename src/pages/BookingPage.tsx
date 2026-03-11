import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

import bookingLoader from "../loaders/bookingLoader";
import { updateTicketCount } from "../utils/booking/uppdateTicketCount";
import { fetchBookingPrices } from "../utils/booking/fetchBookingPrices";
import { calculateBookingTotals } from "../utils/booking/calculateBookingTotals";
import { screenLayouts } from "../utils/booking/screenLayouts";
import mergeSeatsWithBookingState from "../utils/booking/mergeSeatsWithBookingState";
import { toggleSeat } from "../utils/booking/toggleSeat";

import type Movie from "../interfaces/movie";
import type { PriceCategory } from "../interfaces/priceCategory";

import SelectedMovieImageAndInfo from "./booking/SelectedMovieImageAndInfo";
import SeatLayout from "./booking/SeatLayout";
import SeatLegendLabel from "./booking/SeatLegendLabel";
import TicketPriceCategorySelector from "./booking/TicketPriceCategorySelector";
import TotalPriceAndToCashierButton from "./booking/TotalPriceAndToCashierButton";

type DbSeat = {
  id: number;
  seat_row: number;
  seat_number: number;
  is_booked: boolean;
};

BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
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

  useEffect(() => {
    async function loadPrices() {
      const mergedPrices = await fetchBookingPrices();
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

      <SelectedMovieImageAndInfo
        movie={movie}
        showtime={showtime}
        screen={screen}
      />

      <section className="mt-5 text-center">
        <div className="text-black p-1 mb-2">
          <strong>Duken</strong>
        </div>

        <SeatLayout
          layout={layout}
          mergedSeats={mergedSeats}
          selectedSeats={selectedSeats}
          onToggleSeat={(id) =>
            setSelectedSeats((prev) => toggleSeat(prev, id))
          }
        />

        <SeatLegendLabel />
      </section>

      <TicketPriceCategorySelector
        tickets={tickets}
        priceCategory={priceCategory}
        ageLimit={movie.age_limit}
        onChangeTicket={changeTicket}
      />

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
              tickets,
              totalPrice,
            },
          })
        }
      />
    </Container>
  );
}
