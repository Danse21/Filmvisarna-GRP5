namespace WebApp;

// This helper class reads the logged-in user from the project's
// existing custom Session system.
public static class MyBookingsAuthenticationHelpers
{
  // Returns the logged-in user object from session,
  // or null if no user is logged in.
  public static dynamic GetCurrentUser(HttpContext context)
  {
    return Session.Get(context, "user");
  }

  // Returns the logged-in user's id,
  // or null if no user is logged in.
  public static int? GetCurrentUserId(HttpContext context)
  {
    var user = GetCurrentUser(context);

    if (user == null || user.id == null)
      return null;

    return Convert.ToInt32(user.id);
  }
}