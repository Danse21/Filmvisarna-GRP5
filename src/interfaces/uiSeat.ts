export interface UiSeat {
  id: string; // "row-seatInRow"
  row: number;
  seatInRow: number;
  seatNumber: number; // global seat number
  is_booked?: boolean;
};