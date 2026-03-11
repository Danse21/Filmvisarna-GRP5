namespace WebApp;

public static class TestRoutes
{
    public static void Start()
    {
        App.MapGet("/api/testmail", () =>
        {
            EmailService.SendEmail("retrocinemagrp5@gmail.com", "test mail", null);

            return "Mail skickat!";
        });
    }
}
