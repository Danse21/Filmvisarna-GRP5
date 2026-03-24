import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MovieCardDto } from "../interfaces/moviecardDto";
import TrailerModal from "../utils/trailerModal";


interface Props {
  movies: MovieCardDto[];
}

export default function HeroCard({ movies }: Props) {

  // Index för vilken film som visas just nu
  const [currentIndex, setCurrentIndex] = useState(0);

  // Styr trailer-modalen
  const [showTrailer, setShowTrailer] = useState(false);

  // Router navigation
  const navigate = useNavigate();

  // Om inga filmer finns ännu renderas inget
  if (movies.length === 0) return null;

  // Nuvarande film
  const movie = movies[currentIndex];

  // Funktion för att gå till nästa film
  function nextMovie() {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }

  // Funktion för att gå till föregående film
  function prevMovie() {
    setCurrentIndex((prev) =>
      prev === 0 ? movies.length - 1 : prev - 1
    );
  }

  return (
    <>
      {/* Hero container */}
      <div
        className="position-relative overflow-hidden hero-image"
        style={{
          backgroundImage: `url(/images/movies/${movie.slug}.jpg)`,
          marginTop: "-56px",
          paddingTop: "56px",
        }}
      >

        {/* Åldersgräns */}
        <p className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded bg-dark text-white fw-semibold small">
          {movie.age_limit}+
        </p>

        {/* Vänster pil */}
        <button
          className="position-absolute top-50 start-0 btn hero-arrow"
          style={{
            zIndex: 5,
            fontSize: "8rem",
            color: "#2ab5a0",
            background: "none",
            border: "none",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}
          onClick={prevMovie}
        >
          ‹
        </button>

        {/* Höger pil */}
        <button
          className="position-absolute top-50 end-0 btn hero-arrow"
          style={{
            zIndex: 5,
            fontSize: "8rem",
            color: "#2ab5a0",
            background: "none",
            border: "none",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}
          onClick={nextMovie}
        >
          ›
        </button>

        {/* Fade-effekt i botten — tonar ut bilden mot sidans bakgrundsfärg */}
        <div className="hero-fade"></div>

        {/* Knappar längst ner */}
        <div
          className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between p-3 mb-3"
          style={{ zIndex: 5 }}
        >

          {/* Trailer knapp */}
          <button
            className="btn fw-semibold text-black btn-trailer"
            onClick={() => setShowTrailer(true)}
          >
            Trailer
          </button>

          {/* Biljetter knapp */}
          <button
            className="btn fw-semibold text-black btn-biljetter"
            onClick={() => navigate(`/booking/${movie.slug}?showtimeId=${movie.showtime_id}`)}
          >
            Biljetter
          </button>

        </div>

      </div>

      {/* Trailer modal */}
      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </>
  );
}