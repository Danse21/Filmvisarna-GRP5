namespace WebApp;

// API routes for ticket price categories (Adult, Child, etc.)
public static class PriceCategoryRoutes
{
  // Register routes when the backend starts
  public static void Start()
  {
    // GET /api/price_category
    // Returns all price categories
    App.MapGet("/api/price_category", (HttpContext context) =>
    {
      // Query all rows from price_category table
      var rows = SQLQuery("SELECT * FROM price_category");

      // Return result as JSON
      return RestResult.Parse(context, rows);
    });
  }
}
