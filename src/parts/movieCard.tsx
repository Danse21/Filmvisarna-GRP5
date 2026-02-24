import { Card, Button, Container } from "react-bootstrap";
import { useState } from "react";
import type { MovieCardDto } from "../interfaces/moviecardDto";
import TrailerModal from "../utils/trailerModal";
import { useNavigate } from "react-router-dom";

interface Props {
  movie: MovieCardDto;
}

export default function MovieCard({ movie }: Props) {
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "20vh" }}
      >
        <Card style={{ width: "18rem" }} className=" mb-4">
          <Card.Img
            variant="top"
            src={`/images/movies/${movie.slug}.jpg`}
            alt={movie.title}
          />

          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>

            <Card.Text>Åldersgräns: {movie.age_limit} år</Card.Text>

            <Button variant="primary" onClick={() => setShowTrailer(true)}>
              Se Trailer
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/movie-info/${movie.slug}`)}
              className="flex-fill"
            >
              Biljetter
            </Button>
          </Card.Body>
        </Card>
      </Container>

      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </>
  );
}
