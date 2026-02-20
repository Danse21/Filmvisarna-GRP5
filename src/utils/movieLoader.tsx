import type Movie from "../interfaces/movie";

export default async function movieLoader({ params }: any) {
  console.log(params);
  const res = await fetch(`/api/movie?WHERE=slug=${params.slug}`);


  if (!res.ok) {
    throw new Response("Movie not found", { status: 404 });
  }

  const movies: Movie[] = await res.json();
  const movie = movies[0];

  return { movie };
}
