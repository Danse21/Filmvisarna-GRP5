import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import type { MovieCardDto } from "../interfaces/moviecardDto";
import TrailerModal from "../utils/trailerModal";

interface Props {
  movie: MovieCardDto;
}

export default function MovieCard({ movie }: Props) {
  const [showTrailer, setShowTrailer] = useState(false);
  return (
    <>
      <Card style={{ width: "18rem" }} className="mb-4">
        <Card.Img
          variant="top"
          src={`/images/movies/${movie.slug}.jpg`}
          alt={movie.title}
        />

        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>

          <Card.Text>
            Åldersgräns: {movie.age_limit} år
          </Card.Text>

          <Button
            variant="primary"
            onClick={() => setShowTrailer(true)}
          >
            Se Trailer
          </Button>
        </Card.Body>
      </Card>

      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </>
  );
}