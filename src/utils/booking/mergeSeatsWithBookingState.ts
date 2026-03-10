import { generateSeatsFromLayout } from "./generateSeatsFromLayout";

type DbSeat = {
  id: number;
  seat_row: number;
  seat_number: number;
  is_booked: boolean;
};

// Combine layout seats (uiSeats) with DB booked seats (dbSeat)
export default function mergeSeatsWithBookingState(
  layout: number[],
  dbSeats: DbSeat[],
) {
  const uiSeats = generateSeatsFromLayout(layout);

  return uiSeats.map((seat) => {
    const dbSeat = dbSeats.find(
      (item) =>
        item.seat_row === seat.row && item.seat_number === seat.seatNumber,
    );

    return {
      ...seat,
      is_booked: dbSeat ? dbSeat.is_booked : false,
    };
  });
}
