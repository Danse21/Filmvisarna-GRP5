// Import navigation and location hooks from React Router
import { useLocation, useNavigate } from "react-router-dom";

// Import layout and button components from React Bootstrap
import { Container, Button } from "react-bootstrap";

// Define the route for the unsuccessful cancellation page
UnsuccessfulCancellationPage.route = {
  path: "/avbokning/misslyckad",
  index: 14,
};

// This component renders the unsuccessful cancellation page
export default function UnsuccessfulCancellationPage() {
  // Hook used to navigate to other pages
  const navigate = useNavigate();

  // Hook used to read data passed from the previous page
  const location = useLocation();

  // Read custom error message from route state if it exists
  const state = location.state as
    | {
        errorMessage?: string;
      }
    | undefined;

  // Use backend error message if available, otherwise use default text
  const errorMessage =
    state?.errorMessage ??
    "Kontrollera att din e-post och bokningsnummer stämmer";

  // Render the page
  return (
    <Container className="pt-5 pb-5 text-center" style={{ maxWidth: "700px" }}>
      {/* Red error box */}
      <div className="cancellation-result-box cancellation-error-box mx-auto mb-4">
        {/* Main error heading */}
        <h2 className="mb-5">Avbokning misslyckades!</h2>

        {/* Error explanation text */}
        <p className="mb-5">{errorMessage}</p>

        {/* Greeting text */}
        <p className="mb-0">Hälsningar,</p>
        <p className="mb-0">Retro Cinema</p>
      </div>

      {/* Button that navigates to StartPage */}
      <Button className="cancel-btn" onClick={() => navigate("/avbokning")}>
        Prova igen
      </Button>
    </Container>
  );
}
