import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";

// Navigation route
SearchPage.route = {
  path: "/search",
  menuLabel: "Search",
  index: 5,
};

export default function SearchPage() {
  return (
    <Container className="d-flex flex-column align-items-center pt-5">
      {/* Search input wrapper */}
      <div className="search-input-wrapper w-100">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="sök efter film..."
          aria-label="Sök efter film"
        />
      </div>

      {/* Helper text to hep users know what they should on the page */}
      <p className="search-helper-text mt-5">
        Börja skriva för att söka efter filmer
      </p>
    </Container>
  );
}
