import { useLoaderData, useNavigate } from "react-router-dom";
import type Movie from "../interfaces/movie";
import movieLoader from "../loaders/movieLoader";
import { Container, Row, Col, Button, Card, CardBody } from "react-bootstrap";
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
  const { movie } = useLoaderData() as { movie: Movie; };
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
      <Card className="border-0 shadow-sm rounded-3 mb-4" style={{ backgroundColor: "#91D3AD80" }}>
        <Card.Body>
          <Row className="mb-3 mx-2 align-items-stretch shadow-sm rounded-3" style={{ backgroundColor: "#FAECB666" }}>
            <Col xs={5}>
              <img
                src={`/images/movies/${movie.slug}.jpg`}
                alt={movie.title}
                className="img-fluid rounded shadow mt-3"
                style={{ width: "100%", objectFit: "cover" }}
              />
              <div className="text-center mt-2">
                <Button
                  className="btn-trailer fw-semibold px-4 text-black mb-3"
                  onClick={() => setShowTrailer(true)}
                >
                  Se Trailer
                </Button>
              </div>
            </Col>
            {/* Add movie description */}
            <Col xs={7} className="d-flex align-items-center">
              <p className="mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                {movie.description}</p>
            </Col>
          </Row>

          {/*Drink tips info*/}
          <Row className="mb-4">
            <Col xs={5}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: "#FAECB666" }}>
                <Card.Body className="text-center">
                  <Card.Title className="fw-bold mb-3" style={{ fontSize: "1rem" }}>
                    Drink tips:
                  </Card.Title>
                  {/* Hämtar drink_tips från databasen och delar upp på radbrytningar */}
                  {/* .split("\n") delar strängen vid varje \n → ["Bourbon", "Vaniljglass", "Baileys"] */}
                  {/* .map() loopar och skapar en <p> per rad */}
                  {/* Om drink_tips är null/tom visas en fallback-text */}
                  {movie.drink_tips ? (
                    movie.drink_tips.split("\n").map((line, index) => (
                      <p className="mb-1" key={index}>
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="mb-0 text-muted">Inga drinktips ännu</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Movie facts */}
            <Col xs={7}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: "#FAECB666" }}>
                <CardBody className="text-center d-flex flex-column justify-content-center">
                  <p className="mb-1">
                    <strong>Genre:</strong> {movie.genre}
                  </p>
                  <p className="mb-1">
                    <strong>Längd:</strong> {movie.duration_minutes} min
                  </p>
                  <p className="mb-1">
                    <strong>Åldersgräns:</strong> {movie.age_limit}+
                  </p>
                  <p className="mb-0">
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
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Add showtime (välj visning) */}
      <Card className="mt-4 border-0 shadow-sm rounded-3" style={{ backgroundColor: "rgba(249, 168, 36, 0.55)" }}>
        <Card.Body>
          <h4 className="text-center fw-bold mb-3">Välj visning</h4>

          <Row className="g-3">
            {(movie.showtime ?? []).map((show) => (
              <Col md={3} key={show.id}>
                <Button
                  className="w-100 py-3 rounded-3 shadow-sm btn-showtime"
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
        </Card.Body>
      </Card>
      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailer_link}
      />
    </Container>
  );
}
