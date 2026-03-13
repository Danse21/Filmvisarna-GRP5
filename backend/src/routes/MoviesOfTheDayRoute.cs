namespace WebApp;

public static class MovieOfTheDayRoute
{
    public static void Start()
    {
        App.MapGet("/api/movie/moviestoday", (HttpContext context) =>
        {
            var date = context.Request.Query["date"].ToString();

            var rows = SQLQuery(
                "SELECT m.id, m.title, m.slug, m.age_limit, m.trailer_link, " +
                "s.id AS showtime_id, s.start_time, sc.screen_name " +
                "FROM movie m " +
                "JOIN showtime s ON s.movie_id = m.id " +
                "JOIN screen sc ON sc.id = s.screen_id " +
                "WHERE DATE(s.start_time) = @date " +
                "ORDER BY s.start_time " +
                "LIMIT 4",
                new { date },
                context
            );

            return RestResult.Parse(context, rows);
        });
    }
}