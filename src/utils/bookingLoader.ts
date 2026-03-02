import type Movie from "../interfaces/movie";

export default async function bookingLoader({ params, request }: any) {
  const url = new URL(request.url);
  const showtimeId = url.searchParams.get("showtimeId");
  const slug = params.slug;

  if (!showtimeId) {
    throw new Response("Missing showtimeId", { status: 400 });
  }

  // Fetch movie by slug from database: slug identifies movie
  const movieRes = await fetch(`/api/movie?WHERE=slug=${slug}`);
  const movies: Movie[] = await movieRes.json();
  const movie = movies[0];

  // Fetch showtime by id from database: showtimeId identifies the showtime
  const showtimeRes = await fetch(`/api/showtime?WHERE=id=${showtimeId}`);
  const showtimes = await showtimeRes.json();
  const showtime = showtimes[0];

  // Fetch screen by id from database
  const screenRes = await fetch(`/api/screen?WHERE=id=${showtime.screen_id}`);
  const screens = await screenRes.json();
  const screen = screens[0];

  return {
    movie,
    showtime,
    screen,
  };
}
