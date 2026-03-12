namespace WebApp;

// This helper class is responsible for seat numbering and parsing
public static class SeatBookingHelpers
{
  // This method returns the seat layout for the selected screen.
  public static int[] GetScreenLayout(string screenName)
  {
    // Return the layout for Lilla Salongen.
    if (screenName == "Lilla Salongen")
      return new[] { 6, 8, 9, 10, 10, 12 };

    // Return the layout for Stora Salongen.
    return new[] { 8, 9, 10, 10, 10, 10, 12, 12 };
  }

  // This method checks if a seat id has the correct format.
  public static bool TryParseSeatId(string seatStr, out int row, out int seatInRow)
  {
    // Set default output values.
    row = 0;
    seatInRow = 0;

    // Stop if the seat string is empty.
    if (string.IsNullOrWhiteSpace(seatStr))
      return false;

    // Split the seat id into row and seat number.
    var parts = seatStr.Split('-');

    // Stop if the seat id does not contain exactly two parts.
    if (parts.Length != 2)
      return false;

    // Try to parse the row number.
    if (!int.TryParse(parts[0], out row))
      return false;

    // Try to parse the seat number inside the row.
    if (!int.TryParse(parts[1], out seatInRow))
      return false;

    // Return true if both values were parsed successfully.
    return true;
  }

  // This method converts a row number and seat number in that row
  // into one continuous seat number for the whole salon.
  public static int ToContinuousSeatNumber(
    int row,
    int seatInRow,
    int[] layout,
    string screenName
  )
  {
    // Stop if the row is outside the layout.
    if (row < 1 || row > layout.Length)
      throw new Exception($"Seat mapping failed: invalid row {row} for screen '{screenName}'");

    // Get the number of seats in the requested row.
    int seatsInRequestedRow = layout[row - 1];

    // Stop if the seat number does not exist in that row.
    if (seatInRow < 1 || seatInRow > seatsInRequestedRow)
      throw new Exception(
        $"Seat mapping failed for screen='{screenName}', row={row}, seatInRow={seatInRow}, seatsInRow={seatsInRequestedRow}"
      );

    // Start counting seat numbers from 1.
    int seatNumber = 1;

    // Loop through all rows from top to bottom.
    for (int r = 1; r <= layout.Length; r++)
    {
      // Get the number of seats in the current row.
      int seatsInRow = layout[r - 1];

      // Count seats from right to left inside each row.
      for (int s = seatsInRow; s >= 1; s--)
      {
        // Return the seat number when the requested seat is found.
        if (r == row && s == seatInRow)
          return seatNumber;

        // Increase the seat number after each seat.
        seatNumber++;
      }
    }

    // Throw an error if the seat could not be mapped.
    throw new Exception(
      $"Seat mapping failed unexpectedly for screen='{screenName}', row={row}, seatInRow={seatInRow}"
    );
  }
}