namespace WebApp;

public static class MovieRoutes
{
    public static void Start()
    {
        App.MapGet("/api/movies/upcoming", (HttpContext context) =>
        {
            var rows = SQLQuery(
                "SELECT m.id, m.title, m.slug, m.age_limit, s.id AS showtime_id, s.start_time " +
                "FROM movie m " +
                "JOIN showtime s ON s.movie_id = m.id " +
                "WHERE s.start_time = ( " +
                "  SELECT MIN(start_time) " +
                "  FROM showtime " +
                "  WHERE movie_id = m.id " +
                "  AND start_time >= NOW() " +
                ") " +
                "ORDER BY s.start_time " +
                "LIMIT 4",
                null,
                context
            );

            return RestResult.Parse(context, rows);
        });
    }
}