namespace WebApp;

public static class TestRoutes
{
    public static void Start()
    {
        App.MapGet("/api/testmail", () =>
        {
            EmailService.SendEmail("retrocinemagrp5@gmail.com", "<h1>Testmail från RetroCinema</h1>");

            return "Mail skickat!";
        });
    }
}