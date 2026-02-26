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
      <div
        className="position-relative rounded-3 overflow-hidden"
        style={{
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.8)",
          backgroundImage: `url(/images/movies/${movie.slug}.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "320px",
        }}
      >
        <p className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded bg-dark text-white fw-semibold small">
          {movie.age_limit}+
        </p>
        <div className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between p-2 mb-3">
          <button
            className="btn btn-sm fw-semibold text-black btn-trailer"
            onClick={(e) => {
              e.stopPropagation();
              setShowTrailer(true);
            }}
          >
            Trailer
          </button>
          <button
            className="btn btn-sm fw-semibold text-black btn-biljetter"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.slug}`);
            }}
          >
            Biljetter
          </button>
        </div>
      </div>

      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </>
  );
}
