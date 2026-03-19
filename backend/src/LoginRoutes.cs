namespace WebApp;

// LoginRoutes contains all API endpoints related to authentication.
// These routes allow users to:
// - log in
// - check if they are logged in
// - log out
public static class LoginRoutes
{
    // Helper function used by the routes below.
    // It retrieves the currently logged-in user from the session.
    //
    // The session stores information about the current user between requests.
    // If no user exists in the session, the function returns null.
    private static Obj GetUser(HttpContext context)
    {
        return Session.Get(context, "user");
    }

    // Start() registers all login-related API routes in the application.
    // This method is called when the backend starts.
    public static void Start()
    {
        // POST /api/login
        // This endpoint is used when the user submits the login form.
        //
        // The frontend sends:
        // {
        //   email: "...",
        //   password: "..."
        // }
        //
        // The backend then verifies that:
        // 1. the user exists
        // 2. the password matches the stored hashed password
        App.MapPost("/api/login", (HttpContext context, JsonElement bodyJson) =>
        {
            // Check if a user is already stored in the session.
            // If this is not null, someone is already logged in.
            var user = GetUser(context);

            // Parse the JSON request body into an object that can be accessed in C#.
            var body = JSON.Parse(bodyJson.ToString());

            // If there is a user logged in already
            // we prevent a second login attempt.
            if (user != null)
            {
                var already = new { error = "A user is already logged in." };
                return RestResult.Parse(context, already);
            }

            // Find the user in the database by email.
            // SQLQueryOne returns a single row or null if no match is found.
            var dbUser = SQLQueryOne(
                "SELECT * FROM users WHERE email = @email",
                new { body.email }
            );

            // If no user exists with that email address,
            // return an error message.
            if (dbUser == null)
            {
                return RestResult.Parse(context, new { error = "No such user." });
            }

            // Compare the password entered by the user with the stored hashed password.
            //
            // Password.Verify():
            // - hashes the input password
            // - compares it to the stored hash in the database
            // - returns true if they match
            if (!Password.Verify(
                (string)body.password,
                (string)dbUser.password
            ))
            {
                return RestResult.Parse(context,
                    new { error = "Password mismatch." });
            }

            // If the password is correct, we store the user in the session.
            //
            // Before storing it, we remove the password field so that
            // sensitive data is never stored in the session or returned to the frontend.
            dbUser.Delete("password");

            // Save the logged-in user in the session under the key "user".
            // This allows future requests to know which user is logged in.
            Session.Set(context, "user", dbUser);

            // Return the logged-in user information to the frontend.
            // The frontend can use this to update the UI (for example showing logout).
            return RestResult.Parse(context, dbUser!);
        });

        // GET /api/login
        // This endpoint allows the frontend to check if a user is currently logged in.
        //
        // Example usage:
        // When the app loads, the frontend can call this endpoint
        // to determine whether to show login/register buttons or user menu options.
        App.MapGet("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);

            // If a user exists in the session, return it.
            // Otherwise return an error indicating no active login session.
            return RestResult.Parse(context, user != null ?
                user : new { error = "No user is logged in." });
        });

        // DELETE /api/login
        // This endpoint logs the user out.
        //
        // The frontend calls this when the user clicks the logout button.
        App.MapDelete("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);

            // Remove the user from the session.
            // Setting it to null effectively logs the user out.
            Session.Set(context, "user", null);

            // If no user was logged in, return an error message.
            // Otherwise confirm that logout was successful.
            return RestResult.Parse(context, user == null ?
                new { error = "No user is logged in." } :
                new { status = "Successful logout." }
            );
        });
    }
}