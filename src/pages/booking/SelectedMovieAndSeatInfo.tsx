import { Row, Col } from "react-bootstrap";
import type Movie from "../../interfaces/movie";

// Props for BookingSummaryMovieInfo
// movie: the movie object from the parent page (BookingSummaryPage)
// showtime: contains information about the selected showtime
// screen: contains information about the selected salong
// seatText: already formatted seat text from parent page (example: "Rad 4: stol 38, 39, 40")
type Props = {
  movie: Movie;
  showtime: { id: number; start_time: string };
  screen: { screen_name: string };
  seatText: string;
};

// This component renders the second row on BookingSummaryPage:
// movie image on the left, and
// movie information on the right
export default function SelectedMovieAndSeatInfo({
  movie,
  showtime,
  screen,
  seatText,
}: Props) {
  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <Row className="booking-section">
      <Col md={6}>
        <img
          src={`/images/movies/${movie.slug}.jpg`}
          alt={movie.title}
          className="img-fluid rounded"
        />
      </Col>

      {/* right-hand side column: movie and booking details */}
      <Col md={6} className="movie-info-box ps-md-5">
        <p className="tight">
          <strong>Film:</strong> {movie.title}
        </p>
        <p className="tight">
          <strong>Åldersgräns:</strong> {movie.age_limit}+
        </p>
        <p className="tight">
          <strong>Datum:</strong> {formatDateTime(showtime.start_time)}
        </p>
        <p className="tight">
          <strong>Plats:</strong> {seatText}
        </p>
        <p className="tight mb-0">
          <strong>Salong:</strong> {screen.screen_name}
        </p>
      </Col>
    </Row>
  );
}
