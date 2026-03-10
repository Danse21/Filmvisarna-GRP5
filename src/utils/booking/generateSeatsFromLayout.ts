import type { UiSeat } from "../../interfaces/uiSeat";

// Create seat object from a hall layout
export function generateSeatsFromLayout(layout: number[]): UiSeat[] {
  const seats: UiSeat[] = [];
  let seatNumber = 1;

  layout.forEach((seatsInRow, rowIndex) => {
    const row = rowIndex + 1;

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
