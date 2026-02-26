import type Movie from "../interfaces/movie";

export default async function movieLoader({ params }: any) {
  const res = await fetch(`/api/movie?WHERE=slug=${params.slug}`); // Fetch movie by slug

  if (!res.ok) {
    throw new Response("Movie not found", { status: 404 });
  }

  const movies: Movie[] = await res.json();
  const movie = movies[0];

  console.log("MOVIE ID:", movie.id);

  // return { movie };

  // Fetch showtime for this movie
  const showtimeRes = await fetch(`/api/showtime?WHERE=movie_id=${movie.id}`);
  const showtime = showtimeRes.ok ? await showtimeRes.json() : [];

  // Attach showtime to movie object
  return {
    movie: {
      ...movie,
      showtime,
    },
  };
}


