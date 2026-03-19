import type { StartPageDto } from "../interfaces/startPageDto";

export default async function startPageLoader(): Promise<StartPageDto> {
  const res = await fetch("/api/movies/upcoming");

  if (!res.ok) {
    throw new Error("Failed to load start page movies");
  }

  const movies = await res.json();

  return {
    movies,
  };
}
