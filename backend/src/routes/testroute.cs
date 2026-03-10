namespace WebApp;

public static class TestRoutes
{
    public static void Start()
    {
        App.MapGet("/api/testmail", () =>
        {
            EmailService.SendEmail("retrocinemagrp5@gmail.com");

            return "Mail skickat!";
        });
    }
}