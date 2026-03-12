export interface UiSeat {
  id: string;
  row: number;
  seatInRow: number;
  seatNumber: number; // global seat number
  is_booked?: boolean; // to match how the seat object looks after merge (refer to mergeSeatsWithBookingState)
}

// This is used for frontend seat layout
