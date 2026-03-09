namespace WebApp;

public static class TestRoutes
{
    public static void Start()
    {
        App.MapGet("/api/testmail", () =>
        {
            EmailService.SendEmail(
                "retrocinemagrp5@gmail.com",
                "Test RetroCinema",
                "<h1>Mail fungerar 🎬</h1>"
            );

            return "Mail skickat!";
        });
    }
}