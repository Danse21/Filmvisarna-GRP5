// import type Movie from "../interfaces/movie";

export default async function bookingLoader({ params, request }: any) {
  const url = new URL(request.url);
  const showtimeId = url.searchParams.get("showtimeId");
  const slug = params.slug;

  if (!showtimeId) {
    throw new Response("Missing showtimeId", { status: 400 });
  }

  const movieRes = await fetch(`/api/movie?WHERE=slug=${slug}`);
  const movies = await movieRes.json();
  const movie = movies[0];

  const bookingRes = await fetch(`/api/booking?showtimeId=${showtimeId}`);
  const bookingData = await bookingRes.json();

  return {
    movie,
    showtime: bookingData?.showtime ?? null,
    screen: bookingData?.screen ?? null,
    seats: bookingData?.seats ?? [],
  };
}

// loads seats from /api/booking through bookingLoader