export function toggleSeat(selectedSeats: string[], id: string) {
  return selectedSeats.includes(id)
    ? selectedSeats.filter((s) => s !== id)
    : [...selectedSeats, id];
}