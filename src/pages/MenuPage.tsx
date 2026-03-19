// Import React hook for local component state.
// We use this to disable the logout button while the logout request is running.
import { useState } from "react";

// Import layout and button components from React Bootstrap.
import { Container, Button } from "react-bootstrap";

// Import Font Awesome icon support for the chat menu item.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

// Import React Router tools.
// - Link: navigate between pages without full page reload
// - useLoaderData: read data returned by the route loader
// - useNavigate: navigate programmatically after logout
import { Link, useLoaderData, useNavigate } from "react-router-dom";

// Import the loader that checks whether a user is currently logged in.
import currentLoggedInUserLoader from "../loaders/currentLoggedInUserLoader";
import { useUserContext } from "../hooks/userContext";

// Route configuration for the menu page.
MenuPage.route = {
  path: "/menu",
  menuLabel: "Menu",
  loader: currentLoggedInUserLoader,
  index: 3,
};

export default function MenuPage() {
  // Hook used for programmatic navigation.
  const navigate = useNavigate();
  const [, setUser] = useUserContext();

  // Read login state and user information returned by the loader.
  const loaderData = useLoaderData() as {
    isLoggedIn: boolean;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    } | null;
  };

  // Extract values from loader data for easier use below.
  const { isLoggedIn, user } = loaderData;

  // Tracks whether the logout request is currently in progress.
  // This helps prevent multiple clicks on the logout button.
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout by calling the backend logout route.
  async function handleLogout() {
    // Show loading state on the button.
    setIsLoggingOut(true);

    try {
      // Call backend to remove the logged-in user from session.
      await fetch("/api/login", {
        method: "DELETE",
      });

      setUser({
        id: null,
        firstName: "",
        email: "",
        isLoggedIn: false,
      });

      // After successful logout, go to the start page.
      navigate("/");
    } catch (error) {
      // Log the error in the browser console for debugging.
      console.error("Logout failed:", error);

      // Even if logout fails, move the user away and reload menu state.
      navigate("/menu");
    } finally {
      // Always stop the loading state.
      setIsLoggingOut(false);
    }
  }

  return (
    <Container className="pt-5 pb-5">
      {/* 
        Navigation container for all menu links.

        Utility classes:
        - d-flex: use flexbox
        - flex-column: stack items vertically
        - gap-3: add spacing between items
        - fs-4: make text larger
      */}
      <nav className="d-flex flex-column gap-3 fs-4">
        {/* 
          Show "Mina Bokningar" only when a user is logged in.
          Visitors should not see this link at all.
        */}
        {isLoggedIn && (
          <Link className="mt-4 menu-link" to="/mina-bokningar">
            Mina Bokningar
          </Link>
        )}

        {/* 
          Link to the movies page.

          The className is built dynamically:
          - if the user is logged in, no extra top margin is needed
          - if the user is not logged in, add "mt-4" so the first visible link
            gets the same spacing from the top
        */}
        <Link className={`${isLoggedIn ? "" : "mt-4"} menu-link`} to="/filmer">
          Filmer
        </Link>

        {/* Link to the snacks page */}
        <Link className="menu-link" to="/snacks">
          Snacks
        </Link>

        {/* Link to the gift card page */}
        <Link className="menu-link" to="/presentkort">
          Presentkort
        </Link>

        {/* 
          Link to the cancellation page.
          This page should be available to both visitors and logged-in users.
        */}
        <Link className="menu-link" to="/avbokning">
          Avbokning
        </Link>

        {/* Link to the calendar page */}
        <Link className="menu-link" to="/kalender">
          Kalender
        </Link>

        {/* Link to the AI chat page */}
        <Link className="menu-link" to="/chatta-med-bengt">
          Chatta med Bengt <FontAwesomeIcon icon={faCommentDots} />
        </Link>

        {/* 
          Show logout button only when a user is logged in.

          The button:
          - calls handleLogout when clicked
          - becomes disabled while the logout request is running
          - shows a loading label during logout
        */}
        {isLoggedIn && (
          <Button
            variant="link"
            className="menu-link text-start text-danger mt-3"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Loggar ut..." : "Logga ut"}
          </Button>
        )}

        {/* 
          Optional user info.

          This is not required for functionality, but it is useful because it:
          - clearly shows that a user is logged in
          - confirms which user is currently active
          - helps during development and debugging
        */}
        {isLoggedIn && user && (
          <div className="mt-2 text-muted fs-6">
            Inloggad som: {user.firstName} {user.lastName}
          </div>
        )}
      </nav>
    </Container>
  );
}
