import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MovieCard from "../parts/movieCard";
import type { MovieCardDto } from "../interfaces/moviecardDto";

MoviesPage.route = {
  path: "/filmer",
  index: 11,
};

export default function MoviesPage() {
  // State som håller alla filmer från databasen
  const [movies, setMovies] = useState<MovieCardDto[]>([]);
  const navigate = useNavigate();

  // Hämta alla filmer när sidan laddas
  // Ingen limit här — vi vill visa alla filmer
  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("/api/movie");
      const data = await res.json();
      setMovies(data);
    }

    fetchMovies();
  }, []);

  return (
    <Container fluid className="pt-5 mt-3 pb-4 px-2 min-vh-100">
      {/* Stängknapp som navigerar tillbaka till startsidan */}
      <button
        className="btn btn-link text-decoration-none mb-3"
        onClick={() => navigate("/")}
      >
        ✕ STÄNG
      </button>

      <h2 className="mb-3">Filmer</h2>

      {/* Samma grid som startsidan — 3 kort per rad */}
      <Row className="g-2">
        {movies.map((movie) => (
          <Col xs={4} key={movie.slug}>
            <MovieCard movie={movie} showShowtime={false} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}