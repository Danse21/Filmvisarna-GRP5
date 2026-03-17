import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MovieCard from "../parts/movieCard";
import type { MovieCardDto } from "../interfaces/moviecardDto";

MoviesPage.route = {
  path: "/filmer",
  index: 12,
};

export default function MoviesPage() {
  // State som håller alla filmer från databasen
  const [movies, setMovies] = useState<MovieCardDto[]>([]);

  // State som håller vald åldersgräns, börjar med "Alla"
  const [ageFilter, setAgeFilter] = useState("Alla");

  // Sparar texten som användaren skriver i sökfältet
  // "" (tom sträng) = ingen sökning aktiv, alla filmer visas
  const [searchQuery, setSearchQuery] = useState("");

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
    (a, b) => a - b,
  );
  // Filtrerar filmer baserat på vald åldersgräns i dropdownen
  const filteredMovies = movies.filter((movie) => {
    const matchesAge =
      ageFilter === "Alla" || movie.age_limit === Number(ageFilter);

    // .includes() kollar om strängen innehåller söktexten, "pulp fiction".includes ("pulp") = true
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesAge && matchesSearch;
  });

  return (
    <Container fluid className="pt-5 mt-3 pb-4 px-2 min-vh-100">
      {/* Stängknapp som navigerar tillbaka till startsidan */}
      <button
        className="btn btn-link text-decoration-none ps-0 fw-bold text-dark mb-3"
        onClick={() => navigate("/")}
      >
        ✕ STÄNG
      </button>

      <h2 className="mb-3">Filmer</h2>

      <Row className="mb-3 g-2">

        {/* Sökfält Form.Control */}
        <Col xs={12} md={8}>
          <Form.Control
            type="text"
            placeholder="Sök efter film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark bg-opacity-25 border-dark"
          />
        </Col>

        {/* Dropdown för åldersgräns-filter */}
        <Col xs={12} md={4}>
          <Form.Select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="bg-dark bg-opacity-25 border-dark"
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
          <Col xs={12} md={4} key={movie.slug}>
            <MovieCard
              movie={movie}
              showShowtime={false}
              showBiljetter={false}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
