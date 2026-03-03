namespace WebApp;

public static class PriceRoutes
{
  public static void Start()
  {
    App.MapGet("/api/prices", (HttpContext context) =>
    {
      var rows = SQLQuery(@"
        SELECT
          pc.id   AS price_category_id,
          pc.name AS category_name,
          p.amount
        FROM price_category pc
        JOIN price p ON p.price_category_id = pc.id
        ORDER BY pc.id
      ");

      return RestResult.Parse(context, rows);
    });
  }
}