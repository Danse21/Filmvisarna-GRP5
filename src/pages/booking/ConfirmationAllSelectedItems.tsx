import type Movie from "../../interfaces/movie";

// This type stores how many tickets were selected in each category.
type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

// This type stores the exact selected seat information
// that was passed from BookingPage.
type SelectedSeatInfo = {
  id: string;
  row: number;
  seatNumber: number;
};

// This type defines all props that this component receives from its parent.
type Props = {
  movie: Movie;
  showtime: { id: number; start_time: string; };
  screen: { screen_name: string; };
  selectedSeats: string[];
  selectedSeatInfo: SelectedSeatInfo[];
  tickets: Tickets;
  totalPrice: number;
  bookingReference: string;
};

/*
  ConfirmationAllSelectedItems

  This component renders the main bordered box with:
  - selected ticket types
  - total price
  - movie information
  - date
  - seats
  - salong
  - booking reference
*/
export default function ConfirmationAllSelectedItems({
  movie,
  showtime,
  screen,
  selectedSeats: _selectedSeats,
  selectedSeatInfo,
  tickets,
  totalPrice,
  bookingReference,
}: Props) {
  // This function formats the movie start time and calculates the movie end time.
  function formatDateTimeRange(startIso: string, durationMinutes: number) {
    // Create a Date object from the movie start time.
    const start = new Date(startIso);

    // Create a Date object for the movie end time by adding the movie duration.
    const end = new Date(start.getTime() + durationMinutes * 60000);

    // Format the date in Swedish format.
    const dateText = start.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Format the movie start time in Swedish format.
    const startTime = start.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format the movie end time in Swedish format.
    const endTime = end.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Return one complete formatted date and time string.
    return `${dateText} ${startTime} - ${endTime}`;
  }

  // This object groups selected seats by row using the exact seat numbers
  // from the booking page instead of recalculating them.
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

  // This creates the final seat text shown on the confirmation page.
  const seatText =
    selectedSeatInfo.length > 0
      ? Object.entries(groupedSeats)
        // Sort rows from lowest to highest row number.
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([row, seats]) => {
          // Sort seat numbers from lowest to highest.
          const sortedSeats = [...seats].sort((a, b) => a - b);

          // If there is only one seat in the row, show one seat number.
          if (sortedSeats.length === 1) {
            return `Rad ${row}: stol ${sortedSeats[0]}`;
          }

          // If there are two seats in the row, join them with "och".
          if (sortedSeats.length === 2) {
            return `Rad ${row}: stol ${sortedSeats[0]} och ${sortedSeats[1]}`;
          }

          // If there are more than two seats, separate all but the last with commas.
          const lastSeat = sortedSeats[sortedSeats.length - 1];
          const firstSeats = sortedSeats.slice(0, -1).join(", ");

          // Return formatted text for the row.
          return `Rad ${row}: stol ${firstSeats} och ${lastSeat}`;
        })
        // Join all row texts into one string.
        .join(" • ")
      : // Show a dash if no seats were selected.
      "—";

  // Render the confirmation box with all selected booking information.
  return (
    <div className="confirmation-box confirmation-message mx-auto mb-4">
      {/* Show a heading for the selected items. */}
      <p className="ticket-summary mb-2">Dina val:</p>

      {/* Show child tickets if at least one child ticket was selected. */}
      {tickets.child > 0 && (
        <p className="ticket-summary confirmation-line">
          {tickets.child} Barn {tickets.child * 80} kr
        </p>
      )}

      {/* Show adult tickets if at least one adult ticket was selected. */}
      {tickets.adult > 0 && (
        <p className="ticket-summary confirmation-line">
          {tickets.adult} Vuxen {tickets.adult * 160} kr
        </p>
      )}

      {/* Show senior tickets if at least one senior ticket was selected. */}
      {tickets.senior > 0 && (
        <p className="ticket-summary confirmation-line">
          {tickets.senior} Pensionär {tickets.senior * 120} kr
        </p>
      )}

      {/* Show the total booking price. */}
      <p className="ticket-summary confirmation-line mb-3">
        Totaltpris: {totalPrice} kr
      </p>

      {/* Show the movie title and age limit. */}
      <p className="confirmation-line">
        Film: {movie.title} (Åldersgräns: {movie.age_limit} år)
      </p>

      {/* Show the movie date and time. */}
      <p className="confirmation-line">
        Datum:{" "}
        {formatDateTimeRange(showtime.start_time, movie.duration_minutes)}
      </p>

      {/* Show the selected seats using the exact seat numbers from BookingPage. */}
      <p className="confirmation-line">Plats: {seatText}</p>

      {/* Show the selected cinema salon. */}
      <p className="confirmation-line">Salong: {screen.screen_name}</p>

      {/* Show the booking reference number. */}
      <p className="confirmation-line mb-0">
        Bokningsnummer: {bookingReference}
      </p>
    </div>
  );
}
