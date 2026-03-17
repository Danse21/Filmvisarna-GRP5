import type Movie from "./movie";
import type SelectedSeatInfo from "./selectedSeatInfo";
import type Tickets from "./ticket";

export default interface BookingItems {
  id: number;
  bookingReference: string;
  email?: string;
  movie: Movie;
  showtime: {
    id: number;
    start_time: string;
    screen_id?: number;
  };
  screen: {
    id?: number;
    screen_name: string;
  };
  selectedSeats: string[];
  selectedSeatInfo: SelectedSeatInfo[];
  tickets: Tickets;
  totalPrice: number;
  isUpcoming: boolean;
}
