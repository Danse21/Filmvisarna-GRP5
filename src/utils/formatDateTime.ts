export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}