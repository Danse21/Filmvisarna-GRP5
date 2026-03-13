// Import the Container component from React Bootstrap.
// Container is used to center and control the width of page content.
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

// Import Link from React Router.
// Link allows navigation between pages without reloading the browser.
import { Link } from "react-router-dom";

// Define the navigation route configuration for this page.
MenuPage.route = {
  path: "/menu", // URL path used to access the MenuPage
  menuLabel: "Menu", // Label used in navigation menus
  index: 3, // Order index used in route configuration
};

// This component renders the main Menu page.
export default function MenuPage() {
  // Return the JSX that renders the page layout
  return (
    // Container centers the content and adds horizontal padding
    <Container className="pt-5 pb-5">
      {/* 
        Navigation container for all menu links.
        - d-flex: uses flexbox layout
        - flex-column: stack links vertically
        - gap-3: spacing between links
        - fs-4: larger font size
      */}
      <nav className="d-flex flex-column gap-3 fs-4">
        {/* Link to the page that shows the user's bookings */}
        <Link className="menu-link" to="/mina-bokningar">
          Mina Bokningar
        </Link>

        {/* Link to the page that displays available movies */}
        <Link className="menu-link" to="/filmer">
          Filmer
        </Link>

        {/* Link to the snack shop page */}
        <Link className="menu-link" to="/snacks">
          Snacks
        </Link>

        {/* Link to the gift card page */}
        <Link className="menu-link" to="/presentkort">
          Presentkort
        </Link>

        {/* 
          Link to the cancel booking page.
          From here the user can:
          - enter email
          - enter booking reference
          - cancel an existing booking
        */}
        <Link className="menu-link" to="/avbokning">
          Avbokning
        </Link>

        {/* Link to the cinema calendar page */}
        <Link className="menu-link" to="/kalender">
          Kalender
        </Link>

        {/* Link to the chat assistant page */}
        <Link className="menu-link" to="/chatta-med-bengt">
          Chatta med Bengt
          <FontAwesomeIcon icon={faCommentDots} />
        </Link>
      </nav>
    </Container>
  );
}

// We use a flex column layout so the footer stays at the bottom,
// and we add padding inside the menu page to avoid the fixed header.
