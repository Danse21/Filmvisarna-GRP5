// import type Movie from "../interfaces/movie";

import type Movie from "../interfaces/movie";

export default async function movieLoader({ params }: any) {
  const res = await fetch(`/api/movie?WHERE=slug=${params.slug}`);

  if (!res.ok) {
    throw new Response("Movie not found", { status: 404 });
  }

  const movies: Movie[] = await res.json();
  const movie = movies[0];

  // Kontroll så filmen faktiskt finns.
  // Annars kraschar movie.id längre ner.
  if (!movie) {
    throw new Response("Movie not found", { status: 404 });
  }

  const showtimeRes = await fetch(`/api/showtime?WHERE=movie_id=${movie.id}`);
  const showtime = showtimeRes.ok ? await showtimeRes.json() : [];

  return {
    movie: {
      ...movie,
      showtime,
    },
  };
}
