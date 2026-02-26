namespace WebApp;

public static class ShowtimeAdmin
{
  public static void Start()
  {
    App.MapPost("/api/admin/generate-showtimes", (HttpContext context) =>
    {
      int created = 0; // Räknar hur många nya rader som skapas

      DateTime today = DateTime.Today;
      DateTime endDate = today.AddDays(30);

      // 1. Hämta filmer
      var movies = SQLQuery("SELECT id FROM movie");

      // 2. Hämta salonger
      var screens = SQLQuery("SELECT id FROM screen");

      if (movies.Count() == 0 || screens.Count() == 0)
      {
        return RestResult.Parse(context,
                Arr(Obj(new { error = "Movies or screens missing." })));
      }

      // 3. Hämta redan existerande showtimes i intervallet
      var existingRows = SQLQuery(
              @"SELECT screen_id, start_time
                  FROM showtime
                  WHERE start_time BETWEEN @start AND @end",
              Obj(new { start = today, end = endDate })
          );

      // Bygg HashSet för snabb lookup
      var existing = new HashSet<string>();

      foreach (var row in existingRows)
      {
        var dt = DateTime.Parse(row.start_time.ToString());
        string key = row.screen_id + "|" + dt.ToString("yyyy-MM-dd HH:mm:ss");
        existing.Add(key);
      }

      var timeSlots = new List<TimeSpan>
        {
                new TimeSpan(14, 0, 0),
                new TimeSpan(19, 0, 0)
        };

      var random = new Random();

      // Lista för alla saknade rader
      var valuesList = new List<string>();

      for (var date = today; date <= endDate; date = date.AddDays(1))
      {
        foreach (var screen in screens)
        {
          foreach (var slot in timeSlots)
          {
            DateTime startTime = date.Add(slot);
            string key = screen.id + "|" + startTime.ToString("yyyy-MM-dd HH:mm:ss");

            if (existing.Contains(key))
              continue;

            var movie = movies[random.Next(movies.Count())];

            valuesList.Add(
                    $"({movie.id}, {screen.id}, '{startTime:yyyy-MM-dd HH:mm:ss}')"
                );

            created++;
            existing.Add(key);
          }
        }
      }

      if (valuesList.Count == 0)
      {
        return RestResult.Parse(context,
                Arr(Obj(new { created = 0 })));
      }

      // Batch size – justera vid behov
      int batchSize = 10;

      for (int i = 0; i < valuesList.Count; i += batchSize)
      {
        var batch = valuesList.Skip(i).Take(batchSize);

        string insertSql =
                @"INSERT INTO showtime (movie_id, screen_id, start_time)
                      VALUES " + string.Join(", ", batch);

        SQLQuery(insertSql);
      }

      return RestResult.Parse(context,
              Arr(Obj(new { created })));
    });
  }
}