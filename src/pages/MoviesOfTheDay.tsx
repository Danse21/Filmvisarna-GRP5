import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MovieCard from "../parts/movieCard";
import type { MovieCardDto } from "../interfaces/moviecardDto";

MoviesPage.route = {
  path: "/Filmer/:date",
  index: 14,


};

export default function MoviesPage() {
  // State som håller alla filmer från databasen
  const [movies, setMovies] = useState<MovieCardDto[]>([]);

  // State som håller vald åldersgräns, börjar med "Alla"
  const [ageFilter, setAgeFilter] = useState("Alla");

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

  // Hämtar alla unika åldersgränser och sortera dem
  // new Set() tar bort dubbletter, [...] gör om till array
  const ageLimits = [...new Set(movies.map((m) => m.age_limit))].sort(
    (a, b) => a - b
  );
  // Filtrerar filmer baserat på vald åldersgräns i dropdownen
  const filteredMovies = movies.filter((movie) => {
    if (ageFilter === "Alla") return true;

    // Visar endast filmer vars age_limit matchar filtret
    // Number() används eftersom värdet från dropdownen är en string
    return movie.age_limit === Number(ageFilter);
  });

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

      {/* Dropdown för åldersgräns-filter */}
      <Row className="mb-3">
        <Col xs={4}>
          <Form.Select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="Alla">Alla åldrar</option>
            {ageLimits.map((age) => (
              <option key={age} value={age}>
                {age}+
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Samma grid som startsidan — 3 kort per rad */}
      <Row className="g-2">
        {filteredMovies.map((movie) => (
          <Col xs={4} key={movie.slug}>
            <MovieCard movie={movie} showShowtime={false} showBiljetter={false} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}