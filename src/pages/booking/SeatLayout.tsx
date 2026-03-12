// Import the UiSeat interface which represents seats used in the UI layout
import type { UiSeat } from "../../interfaces/uiSeat";

// This type defines all props that this component receives from its parent component
type Props = {
  // Layout array describing how many seats exist in each row
  layout: number[];

  // All seats in the layout merged with booking information from the database
  mergedSeats: UiSeat[];

  // List of seat ids that the user has currently selected
  selectedSeats: string[];

  // Function passed from parent to toggle seat selection
  onToggleSeat: (id: string) => void;
};

// This component renders the full seat layout in rows and seats
export default function SeatLayout({
  layout,
  mergedSeats,
  selectedSeats,
  onToggleSeat,
}: Props) {
  return (
    // Main container stacking all rows vertically
    <div className="d-flex flex-column gap-2 align-items-center">
      {/* Loop through each row defined in the layout */}
      {layout.map((_, rowIndex) => (
        // Create a row container
        <div
          key={rowIndex}
          className="d-flex flex-row-reverse gap-2 justify-content-center"
        >
          {/* Filter seats that belong to the current row */}
          {mergedSeats
            .filter((s) => s.row === rowIndex + 1)

            // Render each seat as a button
            .map((s) => (
              <button
                key={s.id}
                // Assign CSS classes based on seat state
                className={`seat
                  ${s.is_booked ? "seat-occupied" : "seat-free"}
                  ${selectedSeats.includes(s.id) ? "seat-selected" : ""}
                `}
                // Disable seat if already booked
                disabled={s.is_booked}
                // Toggle seat selection when clicked
                onClick={() => onToggleSeat(s.id)}
                // Tooltip showing row and seat number
                title={`Rad ${s.row}, Stol ${s.seatNumber}`}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
