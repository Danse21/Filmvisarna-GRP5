import { Row, Col } from "react-bootstrap";
import type Movie from "../../interfaces/movie";
import { formatDateTime } from "../../utils/formatDateTime";

type Props = {
  movie: Movie;
  showtime: { id: number; start_time: string; screen_id: number };
  screen: { id: number; screen_name: string };
};

export default function SelectedMovieImageAndInfo({
  movie,
  showtime,
  screen,
}: Props) {
  return (
    <Row className="mt-4 mb-4">
      <Col xs={6}>
        <img
          src={`/images/movies/${movie.slug}.jpg`}
          alt={movie.title}
          className="img-fluid rounded"
        />
      </Col>

      <Col xs={6}>
        <h4>
          <strong>{movie.title}</strong>
        </h4>
        <strong>{formatDateTime(showtime.start_time)}</strong>
        <p>
          <strong>{screen.screen_name}</strong>
        </p>
        <p>
          <strong>Åldersgräns: {movie.age_limit} år</strong>
        </p>
      </Col>
    </Row>
  );
}
