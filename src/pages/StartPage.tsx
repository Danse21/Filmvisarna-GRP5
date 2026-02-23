import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import MovieCard from "../parts/movieCard";
import type { MovieCardDto } from "../interfaces/moviecardDto";

// Navigation route
StartPage.route = {
  path: "/",
  startLabel: "Start",
  index: 1,
};

export default function StartPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieCardDto[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("/api/movie?limit=5");
      const data = await res.json();
      setMovies(data);
    }

    fetchMovies();
  }, []);




  return (

    <div className="homepage-cards">
      {movies.map((movie) => (
        <MovieCard key={movie.slug} movie={movie} />
      ))}
    </div>
  );
}
