// import type Movie from "../interfaces/movie";

// export default async function movieLoader({ params }: any) {
//   // Fetch movie + showtimes from ONE backend endpoint
//   const res = await fetch(`/api/movie/${params.slug}/showtimes`);

//   if (!res.ok) {
//     throw new Response("Movie not found", { status: 404 });
//   }

//   // Backend returns: { movie, showtime }
//   const data = await res.json();

//   return {
//     movie: {
//       ...data.movie,
//       showtime: data.showtime ?? [], // always safe
//     },
//   };
// }

import type Movie from "../interfaces/movie";

export default async function movieLoader({ params }: any) {
  const res = await fetch(`/api/movie?WHERE=slug=${params.slug}`); // Fetch movie by slug

  if (!res.ok) {
    throw new Response("Movie not found", { status: 404 });
  }

  const movies: Movie[] = await res.json();
  const movie = movies[0];

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


