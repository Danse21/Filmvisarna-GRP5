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
import type DbSeat from "../interfaces/dbSeat";
import type SelectedSeatInfo from "../interfaces/selectedSeatInfo";

import type Movie from "../interfaces/movie";
import type { PriceCategory } from "../interfaces/priceCategory";

import SelectedMovieImageAndInfo from "./booking/SelectedMovieImageAndInfo";
import SeatLayout from "./booking/SeatLayout";
import SeatLegendLabel from "./booking/SeatLegendLabel";
import TicketPriceCategorySelector from "./booking/TicketPriceCategorySelector";
import TotalPriceAndToCashierButton from "./booking/TotalPriceAndToCashierButton";

// Navigation route
BookingPage.route = {
  path: "/booking/:slug",
  loader: bookingLoader,
  index: 9,
};

export default function BookingPage() {
  const loaderData = useLoaderData() as {
    movie: Movie;
    showtime: { id: number; start_time: string; screen_id: number; };
    screen: { id: number; screen_name: string; };
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

  useEffect(() => {
    async function loadPrices() {
      const mergedPrices = await fetchBookingPrices();
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
    <Container className="pt-5 pb-5">
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark"
        onClick={() => navigate(-1)}
      >
        ← Bakåt
      </Button>

      <div className="booking-movie-card mb-3 shadow">
        <SelectedMovieImageAndInfo
          movie={movie}
          showtime={showtime}
          screen={screen}
        />
      </div>

      <section className="mt-3 text-center booking-seat-card shadow">
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
                selectedSeatInfo,
                tickets,
                totalPrice,
              },
            })
          }
        />
      </section>
    </Container>
  );
}
