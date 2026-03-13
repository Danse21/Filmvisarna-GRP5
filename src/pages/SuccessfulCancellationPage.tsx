// Import navigation hook from React Router
import { useNavigate } from "react-router-dom";

// Import layout and button components from React Bootstrap
import { Container, Button } from "react-bootstrap";

// Define the route for the successful cancellation page
SuccessfulCancellationPage.route = {
  path: "/avbokning/bekraftad",
  index: 13,
};

// This component renders the successful cancellation page
export default function SuccessfulCancellationPage() {
  // Hook used to navigate to other pages
  const navigate = useNavigate();

  // Render the page
  return (
    <Container className="pt-5 pb-5 text-center" style={{ maxWidth: "700px" }}>
      {/* Green confirmation box */}
      <div className="cancellation-result-box cancellation-success-box mx-auto mb-4">
        {/* Main heading */}
        <h2 className="mb-5">Bekräftelse</h2>

        {/* Confirmation message */}
        <p className="mb-5">Du är nu avbokad</p>

        {/* Greeting text */}
        <p className="mb-0">Hälsningar,</p>
        <p className="mb-0">Retro Cinema</p>
      </div>

      {/* Button that navigates to StartPage */}
      <Button className="cancel-btn" onClick={() => navigate("/")}>
        Till Startsidan
      </Button>
    </Container>
  );
}
