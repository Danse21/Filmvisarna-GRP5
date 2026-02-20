import { useLoaderData } from "react-router-dom";
import type Movie from "../interfaces/movie";
import movieLoader from "../utils/movieLoader";

MovieDetailsPage.route = {
  path: "/movie/:slug",
  loader: movieLoader
};


export default function MovieDetailsPage() {
  const { movie } = useLoaderData() as { movie: Movie; };

  return (
    <div className="container mt-4">
      <h1>{movie.title}</h1>


      <img src={'/images/movies/' + movie.slug + '.jpg'} />




      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Duration:</strong> {movie.duration_minutes} min</p>
      <p><strong>Age limit:</strong> {movie.age_limit}+</p>

      <p>{movie.description}</p>

      <div className="mt-3">
        <a href={movie.imdb_link} target="_blank" rel="noreferrer">
          IMDb
        </a>
        {" | "}
        <a href={movie.rottentomatoes_link} target="_blank" rel="noreferrer">
          Rotten Tomatoes
        </a>
      </div>
    </div>
  );
}


