namespace WebApp;

public static class MovieShowtimeRoutes
{
    public static void Start()
    {
        // GET movie + its showtimes (joined with screen)
        App.MapGet("/api/movie/{slug}/showtimes", (HttpContext context, string slug) =>
        {
            // Fetch movie by slug
            var movie = SQLQueryOne(
                "SELECT * FROM movie WHERE slug = @slug",
                new { slug }
            );

            if (movie == null)
            {
                return RestResult.Parse(context, new { error = "Movie not found." });
            }

            // Fetch showtimes for the movie
            // showtime has BOTH movie_id and screen_id
            var showtime = SQLQuery(
                @"
                SELECT
                    s.showtime_id,
                    s.start_time,
                    s.screen_id,
                    sc.name AS screen_name
                FROM showtime s
                JOIN screen sc ON sc.screen_id = s.screen_id
                WHERE s.movie_id = @movie_id
                ",
                new { movie_id = movie.movie_id }
            );

            // Return combined object
            return RestResult.Parse(context, new
            {
                movie,
                showtime
            });
        });
    }
}