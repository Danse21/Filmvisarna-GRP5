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

  /* 
     Skapa Date-objekt från start_time
  */
  const showtimeDate = movie.start_time
    ? new Date(movie.start_time)
    : null;

  /* Formatera datum */
  const formattedDate = showtimeDate
    ? showtimeDate.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short"
    })
    : "";

  /* Formatera tid */
  const formattedTime = showtimeDate
    ? showtimeDate.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit"
    })
    : "";

  return (
    <>
      <Card
        className="rounded-3 overflow-hidden shadow-lg border-0"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/movie/${movie.slug}`)}
      >
        <Card.Img
          src={`/images/movies/${movie.slug}.jpg`}
          alt={movie.title}
          style={{ height: "290px", objectFit: "cover" }}
        />

        <Card.ImgOverlay className="d-flex flex-column justify-content-between p-2">

          {/* Åldersgräns */}
          <p className="mb-0 align-self-start px-2 py-1 rounded bg-dark text-white fw-semibold small">
            {movie.age_limit}+
          </p>

          {/* 
             Nedersta raden
             Trailer  Info  Biljetter
     */}
          <div className="d-flex align-items-center justify-content-between">

            {/* Trailer */}
            <button
              className="btn btn-sm fw-semibold text-white btn-trailer"
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
            >
              Trailer
            </button>

            {/* 
               Visningsinformation
               Limegrön ruta så text syns över bilden
          */}
            <div
              style={{
                background: "limegreen",
                color: "black",
                fontWeight: 600,
                fontSize: "0.75rem",
                padding: "4px 8px",
                borderRadius: "6px",
                textAlign: "center",
                minWidth: "110px"
              }}
            >
              {formattedDate} • {formattedTime}
              <br />
              {movie.screen_name}
            </div>

            {/* Biljetter */}
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