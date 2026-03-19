import { Row, Col } from "react-bootstrap";
import type Movie from "../../interfaces/movie";
import { formatDateTime } from "../../utils/formatDateTime";

// Props for this component
// - movie: movie information
// - showtime: selected showtime details
// - screen: cinema screen information
type Props = {
  movie: Movie;
  showtime: { id: number; start_time: string; screen_id: number };
  screen: { id: number; screen_name: string };
};

// Component that shows the selected movie image and basic showtime info
export default function SelectedMovieImageAndInfo({
  movie,
  showtime,
  screen,
}: Props) {
  return (
    // Layout row for image and movie info
    <Row className="mt-4 mb-4">
      {/* Left column: movie poster */}
      <Col xs={6}>
        <img
          src={`/images/movies/${movie.slug}.jpg`} // image path based on movie slug
          alt={movie.title} // alt text for accessibility
          className="img-fluid rounded" // responsive image with rounded corners
        />
      </Col>

      {/* Right column: movie information */}
      <Col xs={6}>
        {/* Movie title */}
        <h4>
          <strong>{movie.title}</strong>
        </h4>

        {/* Formatted showtime date and time */}
        <strong>{formatDateTime(showtime.start_time)}</strong>

        {/* Screen name */}
        <p>
          <strong>{screen.screen_name}</strong>
        </p>

        {/* Age limit for the movie */}
        <p>
          <strong>Åldersgräns: {movie.age_limit} år</strong>
        </p>
      </Col>
    </Row>
  );
}
