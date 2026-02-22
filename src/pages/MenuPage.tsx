import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

// Navigation route
MenuPage.route = {
  path: "/menu",
  menuLabel: "Menu",
  index: 3,
};
/* Add menu items */
export default function MenuPage() {
  return (
    <Container className="pt-5 pb-5">
      <nav className="d-flex flex-column gap-3 fs-4">
        <Link className="menu-link" to="/mina-bokningar">
          Mina Bokningar
        </Link>
        <Link className="menu-link" to="/filmer">
          Filmer
        </Link>
        <Link className="menu-link" to="/snacks">
          Snacks
        </Link>
        <Link className="menu-link" to="/presentkort">
          Presentkort
        </Link>
        <Link className="menu-link" to="/avbokning">
          Avbokning
        </Link>
        <Link className="menu-link" to="/kalender">
          Kalender
        </Link>
        <Link className="menu-link" to="/chatta-med-bengt">
          Chatta med Bengt
        </Link>
      </nav>
    </Container>
  );
}

// We use a flex column layout so the footer stays at the bottom,
// and we add padding inside the menu page to avoid the fixed header.
