// This type defines the database seat object (how seat table looks).
export default interface DbSeat {
  id: number;
  seat_row: number;
  seat_number: number;
  is_booked: boolean;
}

// This is used for database seat result
