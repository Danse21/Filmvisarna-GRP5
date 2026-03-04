import { useState } from "react";
import { Card } from "react-bootstrap";
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
      <Card className="rounded-3 overflow-hidden shadow-lg border-0">
        <Card.Img
          src={`/images/movies/${movie.slug}.jpg`}
          alt={movie.title}
          style={{ height: "290px", objectFit: "cover" }}
        />
        <Card.ImgOverlay className="d-flex flex-column justify-content-between p-2">
          <p className="mb-0 align-self-start px-2 py-1 rounded bg-dark text-white fw-semibold small">
            {movie.age_limit}+
          </p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-sm fw-semibold text-white btn-trailer"
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
            >
              Trailer
            </button>
            <button
              className="btn btn-sm fw-semibold text-white btn-biljetter"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.slug}`);
              }}
            >
              Biljetter
            </button>
          </div>
        </Card.ImgOverlay>
      </Card>

      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </>
  );
}
