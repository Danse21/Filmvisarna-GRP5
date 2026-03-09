import type { SnackCardDto } from "../interfaces/SnackCardDto.ts";
export default async function snackLoader(): Promise<SnackCardDto[]> {
  const res = await fetch("/api/snack");
  if (!res.ok) throw new Error("Failed to fetch snacks");

  const data = await res.json();
  return data;
}