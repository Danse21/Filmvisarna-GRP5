// This is a helper function that will be exported into BookingSummaryPage.tsx and ConfirmationAllSelectedItems.tsx

// This function converts a row number and seat number inside that row
// into one continuous seat number across the entire salon.
// The numbering continues from top to bottom without restarting on each row.
export function toContinuousSeatNumber(
  row: number,
  seatInRow: number,
  layout: number[],
): number {
  // This variable stores the continuous seat number while counting all seats.
  let seatNumber = 1;

  // Loop through all rows from top to bottom.
  for (let r = 1; r <= layout.length; r++) {
    // Get how many seats exist in the current row.
    const seatsInRow = layout[r - 1];

    // Loop through the seats in the current row.
    for (let s = 1; s <= seatsInRow; s++) {
      // Return the continuous seat number when the requested seat is found.
      if (r === row && s === seatInRow) {
        return seatNumber;
      }

      // Increase the continuous seat number after each seat.
      seatNumber++;
    }
  }

  // Return 0 if the seat could not be found.
  return 0;
}
