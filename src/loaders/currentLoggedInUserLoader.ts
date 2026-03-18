// This loader checks whether a user is currently logged in.
// It uses the existing backend route GET /api/login.
//
// Important:
// If backend says "No user is logged in.", that is NOT a real error for MenuPage.
// We simply treat the visitor as logged out.
export default async function currentUserLoader() {
  try {
    const response = await fetch("/api/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If the request itself fails, treat the user as logged out
    // instead of crashing the menu page.
    if (!response.ok) {
      return {
        isLoggedIn: false,
        user: null,
      };
    }

    const data = await response.json();

    // Backend returns { error: "No user is logged in." }
    // when nobody is logged in.
    if (data?.error) {
      return {
        isLoggedIn: false,
        user: null,
      };
    }

    // Logged-in user found.
    return {
      isLoggedIn: true,
      user: data,
    };
  } catch {
    // If anything unexpected happens, do not crash MenuPage.
    // Just treat the visitor as logged out.
    return {
      isLoggedIn: false,
      user: null,
    };
  }
}
