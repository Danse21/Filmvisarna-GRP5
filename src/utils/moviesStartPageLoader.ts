import type { MovieCardDto } from "../interfaces/moviecardDto";
export async function moviesStartPageLoader(): Promise<MovieCardDto[]> {
  const res = await fetch("/api/movie?limit=5");
  if (!res.ok) throw new Error("Failed to fetch movies");

  const data = await res.json();
  return data;
}