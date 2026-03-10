type Seat = {
  id: string;
  row: number;
  seatNumber: number;
  is_booked?: boolean;
};

type Props = {
  layout: number[];
  mergedSeats: Seat[];
  selectedSeats: string[];
  onToggleSeat: (id: string) => void;
};

// Display seats
export default function SeatLayout({
  layout,
  mergedSeats,
  selectedSeats,
  onToggleSeat,
}: Props) {
  return (
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
                onClick={() => onToggleSeat(s.id)}
                title={`Rad ${s.row}, Stol ${s.seatNumber}`}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
