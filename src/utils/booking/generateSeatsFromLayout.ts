import type { UiSeat } from "../../interfaces/uiSeat";

// Generates seat objects based on a cinema hall layout
// layout example: [10, 12, 12, 10] → number of seats per row
export function generateSeatsFromLayout(layout: number[]): UiSeat[] {
  // Array that will contain all generated seats
  const seats: UiSeat[] = [];

  // Global seat number across the whole hall
  let seatNumber = 1;

  // Loop through each row in the layout
  layout.forEach((seatsInRow, rowIndex) => {
    // Row number (rows start at 1 instead of 0)
    const row = rowIndex + 1;

    // Create seats in the row
    // Loop backwards so seats appear correctly in UI layout
    for (let seat = seatsInRow; seat >= 1; seat--) {
      // Add a seat object to the array
      seats.push({
        id: `${row}-${seat}`, // unique seat id (row-seat)
        row, // row number
        seatInRow: seat, // position within the row
        seatNumber, // global seat number
      });

      // Increase global seat counter
      seatNumber++;
    }
  });

  // Return the full list of generated seats
  return seats;
}
