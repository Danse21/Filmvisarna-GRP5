namespace WebApp;

public static class MovieRoutes
{
    public static void Start()
    {
        App.MapGet("/api/movies/upcoming", (HttpContext context) =>
        {
 var rows = SQLQuery(
"SELECT m.id, m.title, m.slug, m.age_limit,  m.trailer_link, " +
"s.id AS showtime_id, s.start_time, sc.screen_name " +
"FROM movie m " +
"JOIN showtime s ON s.movie_id = m.id " +
"JOIN screen sc ON sc.id = s.screen_id " +
"WHERE s.id = (" +
"  SELECT s2.id " +
"  FROM showtime s2 " +
"  WHERE s2.movie_id = m.id " +
"  AND s2.start_time >= NOW() " +
"  ORDER BY s2.start_time ASC, s2.id ASC " +
"  LIMIT 1" +
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