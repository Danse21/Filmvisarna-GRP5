import type Movie from "../../interfaces/movie";

// Props for the box in the middle of the confirmation page
type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

type Props = {
  movie: Movie;
  showtime: { id: number; start_time: string };
  screen: { screen_name: string };
  selectedSeats: string[];
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
  selectedSeats,
  tickets,
  totalPrice,
  bookingReference,
}: Props) {
  // Format movie start and end time
  function formatDateTimeRange(startIso: string, durationMinutes: number) {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const dateText = start.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const startTime = start.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = end.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateText} ${startTime} - ${endTime}`;
  }

  // Groups selected seats by row, so same row is shown only once
  const groupedSeats = selectedSeats.reduce<Record<string, number[]>>(
    (acc, id) => {
      const [rowStr, seatStr] = id.split("-");
      const row = rowStr;
      const seat = Number(seatStr);

      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);

      return acc;
    },
    {},
  );

  const seatText = Object.entries(groupedSeats)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([row, seats]) => {
      const sorted = seats.sort((a, b) => a - b);

      if (sorted.length === 1) {
        return `Rad ${row} stol ${sorted[0]}`;
      }

      if (sorted.length === 2) {
        return `Rad ${row} stol ${sorted[0]} och ${sorted[1]}`;
      }

      const lastSeat = sorted[sorted.length - 1];
      const firstSeats = sorted.slice(0, -1).join(", ");
      return `Rad ${row} stol ${firstSeats} och ${lastSeat}`;
    })
    .join(" • ");

  return (
    <div className="confirmation-box mx-auto mb-4">
      <p className="ticket-summary mb-2">
        <strong>Dina val:</strong>
      </p>

      {tickets.child > 0 && (
        <p className="ticket-summary confirmation-line">
          {tickets.child} Barn {tickets.child * 80} kr
        </p>
      )}

      {tickets.adult > 0 && (
        <p className="ticket-summary confirmation-line">
          {tickets.adult} Vuxen {tickets.adult * 160} kr
        </p>
      )}

      {tickets.senior > 0 && (
        <p className="ticket-summary confirmation-line">
          {tickets.senior} Pensionär {tickets.senior * 120} kr
        </p>
      )}

      <p className="ticket-summary confirmation-line mb-3">
        <strong>Totaltpris:</strong> {totalPrice} kr
      </p>

      <p className="confirmation-line">
        <strong>Film:</strong> {movie.title} (Åldersgräns: {movie.age_limit} år)
      </p>

      <p className="confirmation-line">
        <strong>Datum:</strong>{" "}
        {formatDateTimeRange(showtime.start_time, movie.duration_minutes)}
      </p>

      <p className="confirmation-line">
        <strong>Plats:</strong> {seatText}
      </p>

      <p className="confirmation-line">
        <strong>Salong:</strong> {screen.screen_name}
      </p>

      <p className="confirmation-line mb-0">
        <strong>Bokningsnummer:</strong> {bookingReference}
      </p>
    </div>
  );
}
