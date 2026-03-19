// import type Movie from "../interfaces/movie";

// Loader for booking page
export default async function bookingLoader({ params, request }: any) {
  // Get URL and query parameters
  const url = new URL(request.url);
  const showtimeId = url.searchParams.get("showtimeId");

  // Get movie slug from route params
  const slug = params.slug;

  // If no showtimeId is provided, return error
  if (!showtimeId) {
    throw new Response("Missing showtimeId", { status: 400 });
  }

  // Fetch movie data using slug
  const movieRes = await fetch(`/api/movie?WHERE=slug=${slug}`);
  const movies = await movieRes.json();
  const movie = movies[0]; // first movie in result

  // Fetch booking data for selected showtime
  const bookingRes = await fetch(`/api/booking?showtimeId=${showtimeId}`);
  const bookingData = await bookingRes.json();

  // Return data to the booking page
  return {
    movie,
    showtime: bookingData?.showtime ?? null,
    screen: bookingData?.screen ?? null,
    seats: bookingData?.seats ?? [],
  };
}

// Loads seats from /api/booking through bookingLoader
