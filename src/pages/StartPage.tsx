import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MovieCard from "../parts/movieCard";
import type { MovieCardDto } from "../interfaces/moviecardDto";
import TrailerModal from "../utils/trailerModal";

// Navigation route
StartPage.route = {
  path: "/",
  startLabel: "Start",
  index: 1,
};

export default function StartPage() {
  const [movies, setMovies] = useState<MovieCardDto[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("/api/movie?limit=5");
      const data = await res.json();
      setMovies(data);
    }

    fetchMovies();
  }, []);

  return (
    <Container fluid className="pt-5 mt-3 pb-4 px-2 min-vh-100" >

      {/* Första filmen som hero-kort i full bredd */}
      {movies.length > 0 && (
        <Row className="mb-2 mx-n2">
          <Col xs={12} className="px-0">
            <div
              className="position-relative overflow-hidden shadow-lg"
              style={{
                backgroundImage: `url(/images/movies/${movies[0].slug}.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px",
              }}
            >
              <p className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded bg-dark text-white fw-semibold small">
                {movies[0].age_limit}+
              </p>
              <div className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between p-3 mb-3">
                <button
                  className="btn fw-semibold text-black btn-trailer"
                  onClick={() => setShowTrailer(true)}
                >
                  Trailer
                </button>
                <button
                  className="btn fw-semibold text-black btn-biljetter"
                  onClick={() => navigate(`/movie/${movies[0].slug}`)}
                >
                  Biljetter
                </button>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Resten av filmerna: 3 per rad */}
      <Row className="g-2">
        {movies.slice(1).map((movie) => (
          <Col xs={4} key={movie.slug}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>

      {/* Trailer-modal för hero-kortet */}
      {movies.length > 0 && (
        <TrailerModal
          show={showTrailer}
          onHide={() => setShowTrailer(false)}
          trailerUrl={movies[0]?.trailer_link}
        />
      )}
    </Container>
  );
}