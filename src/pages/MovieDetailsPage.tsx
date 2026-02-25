import { useLoaderData } from "react-router-dom";
import type Movie from "../interfaces/movie";
import movieLoader from "../utils/movieLoader";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

MovieDetailsPage.route = {
  path: "/movie/:slug",
  index: 8,

  loader: movieLoader
};


export default function MovieDetailsPage() {
  const { movie } = useLoaderData() as { movie: Movie; };

  return (
    <Container className="pt-4 pb-5">
      <h1>{movie.title}</h1>


      <img src={'/images/movies/' + movie.slug + '.jpg'} />




      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Duration:</strong> {movie.duration_minutes} min</p>
      <p><strong>Age limit:</strong> {movie.age_limit}+</p>

      <p>{movie.description}</p>
      <Col md={6}>
        <div className="movie-text-block text-center h-100">
          <ul className="list-unstyled mb=0 movie-facts">
            {movie.description}
          </ul>
        </div>
      </Col>
      <div className="mt-3">
        <a href={movie.imdb_link} target="_blank" rel="noreferrer">
          IMDb
        </a>
        {" | "}
        <a href={movie.rottentomatoes_link} target="_blank" rel="noreferrer">
          Rotten Tomatoes
        </a>
      </div>
    </Container>
  );
}


