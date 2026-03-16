import { Container, Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isMenuOpen = location.pathname === "/menu";

  return (
    <Navbar
      fixed="top"
      className="px-3"
      style={{ backgroundColor: "rgba(255, 236, 153, 0.75)" }}
    >
      <Container
        fluid
        className="d-flex align-items-center justify-content-between"
      >
        {/* create a Hamburger menu */}
        <button
          className="btn btn-link text-dark p-0 text-decoration-none fw-bold"
          onClick={() => navigate(isMenuOpen ? "/" : "/menu")}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <>
              <FontAwesomeIcon icon={faXmark} /> STÄNG
            </>
          ) : (
            <FontAwesomeIcon icon={faBars} size="lg" />
          )}
        </button>

        {/* Center cinema name */}
        <Navbar.Brand className="mx-auto fw-bold">Retro Cinema</Navbar.Brand>

        {/* Right icons - search and user icons */}
        <div className="d-flex gap-3">
          <FontAwesomeIcon
            icon={faSearch}
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/filmer")}
            aria-label="Open filmer"
          />
          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
            aria-label="Open login"
          />
        </div>
      </Container>
    </Navbar>
  );
}
