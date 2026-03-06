import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../parts/movieCard";
import type { MovieCardDto } from "../interfaces/moviecardDto";
import HeroCard from "../parts/heroCard";
import TrailerModal from "../utils/trailerModal";
import startPageLoader from "../loaders/startPageLoader";


// Navigation route
StartPage.route = {
  path: "/",
  startLabel: "Start",
  loader: startPageLoader,
  index: 1,
};

export default function StartPage() {
  // State som håller alla filmer vi hämtar från databasen
  const [movies, setMovies] = useState<MovieCardDto[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);



  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("/api/movies/upcoming");
      const data = await res.json();

      console.log(JSON.stringify(data, null, 2)); // debug

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
            <HeroCard />
          </Col>
        </Row>
      )}

      {/* Resten av filmerna: 4 per rad och det är dom första unika kommande visningarna*/}
      <Row className="g-2">
        {movies.map((movie) => (
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
