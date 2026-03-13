import { useLoaderData, useNavigate } from "react-router-dom";
import type Movie from "../interfaces/movie";
import movieLoader from "../loaders/movieLoader";
import { Container, Row, Col, Button } from "react-bootstrap";
import TrailerModal from "../utils/trailerModal";
import { useState } from "react";

// Route navigation
MovieDetailsPage.route = {
  path: "/movie/:slug",
  index: 8,
  loader: movieLoader,
};

export default function MovieDetailsPage() {
  // Load movie data using movieLoader
  const { movie } = useLoaderData() as { movie: Movie };
  const [showTrailer, setShowTrailer] = useState(false);
  console.log("MOVIE WITH SHOWTIMES:", movie);
  const navigate = useNavigate();
  const screenNames: Record<number, string> = {
    1: "Stora Salongen",
    2: "Lilla Salongen",
  };

  return (
    <Container className="pt-5 pb-5 mt-1">
      {/* Create a close button (X STÄNG) */}
      <div className="d-flex justify-content-start mb-4">
        <Button
          variant="link"
          className="fw-bold text-dark text-decoration-none ps-0"
          onClick={() => navigate("/")}
        >
          X STÄNG
        </Button>
      </div>

      {/* Upper section of the page */}
      <Row className="mb-4 align-items-stretch">
        <Col xs={6}>
          <div className="movie-image-block">
            <img
              src={`/images/movies/${movie.slug}.jpg`}
              alt={movie.title}
              className="movie-info-image img-fluid mb-2"
            />
            <Button
              className="pt-0 pb-0 mt-none"
              onClick={() => setShowTrailer(true)}
            >
              Se Trailer
            </Button>
          </div>
        </Col>

        {/* Add movie description */}
        <Col xs={6} className="d-flex">
          <div className="movie-text-block d-flex align-items-center">
            <p className="movie-description mb-0">{movie.description}</p>
          </div>
        </Col>
      </Row>

      {/*Drink tips info - Hardcoded*/}
      <Row className="mb-4 align-items-stretch text-center">
        <Col xs={6}>
          <div className="movie-image-block movie-drink-tips movie-text-block">
            <h6 className="mb-2 text-center">Drink Tips</h6>
            <p className="mb-0 text-center">Milkshake (Boozy twist)</p>
            <p className="mb-0 text-center">En blinkning till Mia</p>
            <p className="mb-0 text-center">& Vincents ikoniska scen</p>
            <p className="mb-0 text-center">Bourbon eller rom</p>
            <p className="mb-0 text-center">Vaniljglass & Baileys</p>
            <p className="mb-0 text-center">En skvätt Baileys</p>
            <p className="mb-0 text-center">Lite mjölk</p>
          </div>
        </Col>

        {/* Movie facts */}
        <Col xs={6}>
          <div className="movie-text-block h-100">
            <ul className="list-unstyled movie-facts">
              <li>
                <strong>Genre:</strong> {movie.genre}
              </li>
              <li>
                <strong>Längd:</strong> {movie.duration_minutes} min
              </li>
              <li>
                <strong>Åldersgräns:</strong> {movie.age_limit}+
              </li>
            </ul>
            <div className="mt-2">
              <a href={movie.imdb_link} target="_blank" rel="noreferrer">
                IMDb
              </a>{" "}
              |{" "}
              <a
                href={movie.rottentomatoes_link}
                target="_blank"
                rel="noreferrer"
              >
                Rotten Tomatoes
              </a>
            </div>
          </div>
        </Col>
      </Row>

      {/* Add showtime (välj visning) */}
      <section className="mt-4">
        <h4 className="mb-3">Välj visning</h4>

        <Row className="g-3">
          {(movie.showtime ?? []).map((show) => (
            <Col md={3} key={show.id}>
              <Button
                variant="outline-dark"
                className="w-100 py-3"
                onClick={() =>
                  navigate(`/booking/${movie.slug}?showtimeId=${show.id}`)
                }
              >
                {new Date(show.start_time).toLocaleString("sv-SE", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                <div className="small text-muted">
                  <strong>{screenNames[show.screen_id]}</strong>
                </div>
              </Button>
            </Col>
          ))}
        </Row>
      </section>
      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </Container>
  );
}
