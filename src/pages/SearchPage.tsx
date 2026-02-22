import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

// Navigation route
SearchPage.route = {
  path: "/search",
  menuLabel: "Search",
  index: 5,
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <Container className="pt-5">
      {/* Add a close button that navigates back to start page when clicked */}
      <button
        className="btn btn-link text-decoration-none mb-4"
        onClick={() => navigate("/")}
      >
        ✕ STÄNG
      </button>

      {/* Create a search input field*/}
      <div className="position-relative mx-auto" style={{ maxWidth: 400 }}>
        {/* Add Search icon in the input field */}
        <FontAwesomeIcon
          icon={faSearch}
          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
        />

        {/* Create text input */}
        <input
          type="text"
          className="form-control ps-5 pe-5"
          placeholder="sök efter film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {/* Clear button */}
        {query && (
          <button
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {/* Add User helper text */}
      <p className="text-center mt-5 text-muted">
        Börja skriva för att söka efter filmer
      </p>
    </Container>
  );
}
