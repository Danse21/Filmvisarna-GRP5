// Import navigation hook from React Router
import { useNavigate } from "react-router-dom";

// Import layout components from React Bootstrap
import { Container } from "react-bootstrap";

// Define the route for the present card page
PresentCardPage.route = {
  path: "/presentkort",
  index: 15,
};

// This component renders the prsent card page
export default function PresentCardPage() {
  // Hook used to navigate to other pages
  const navigate = useNavigate();

  // Render the page
  return (
    <Container className="pt-5 pb-5" style={{ maxWidth: "700px" }}>
      {/* Add a close button that navigates back to start page when clicked */}
      <button
        className="btn btn-link text-decoration-none ps-0 fw-bold text-dark mt-3 mb-3"
        onClick={() => navigate("/menu")}
      >
        ✕ STÄNG
      </button>
      <div>
        {/* Main heading */}
        <h2 className="confirmation-title text-center mb-5">Presentkort</h2>
      </div>

      {/* Yello message box */}
      <div className="confirmation-box mx-auto mb-4">
        <h5 className="text-center mb-4">PRESENTKORT FRÅN RETRO CINEMA</h5>
        {/* Present card message */}
        <p className="mb-4">
          Presentkorten från Retro Cinema kan användas i våra fysiska salonger.
          Ge bort det som födelsedagspresent, julklapp eller företagspresent.
        </p>

        <p className="mb-4">
          Observera att presentkortet inte kan returneras och att dess värde
          inte kan bytas mot kontanter.
        </p>

        <p className="mb-4">
          Presentkortet är giltigt i två (2) år från utfärdandedatumet.
        </p>
      </div>
    </Container>
  );
}
