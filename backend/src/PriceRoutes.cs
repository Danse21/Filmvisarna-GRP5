namespace WebApp;

// Routes for prices
public static class PriceRoutes
{
  // Register routes
  public static void Start()
  {
    // GET /api/prices
    App.MapGet("/api/prices", (HttpContext context) =>
    {
      // SQL query that returns all price categories with their price
      var rows = SQLQuery(@"
        SELECT
          pc.id   AS price_category_id, // category id
          pc.name AS category_name,     // category name
          p.amount                      // price amount
        FROM price_category pc          // price category table
        JOIN price p ON p.price_category_id = pc.id // join with price table
        ORDER BY pc.id                  // order by category id
      ");

      // Convert SQL result to REST response (JSON)
      return RestResult.Parse(context, rows);
    });
  }
}