namespace WebApp;

public static class PriceCategoryRoutes
{
  public static void Start()
  {
    App.MapGet("/api/price_category", (HttpContext context) =>
    {
      var rows = SQLQuery("SELECT * FROM price_category");
      return RestResult.Parse(context, rows);
    });
  }
}