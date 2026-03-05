import type { StartPageDto } from "../interfaces/startPageDto";

export default async function startPageLoader(): Promise<StartPageDto> {
  return {
    cardMovies: []
  };
}