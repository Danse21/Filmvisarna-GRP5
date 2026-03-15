// Import navigation hook from React Router
import { useNavigate } from "react-router-dom";

// Import layout and form components from React Bootstrap
import { Container, Row, Col, Button, Form } from "react-bootstrap";

// Import React hook for state
import { useState } from "react";

// Define the route for the cancel booking page
CancelBookingPage.route = {
  path: "/avbokning",
  index: 12,
};

// This component renders the cancel booking page
export default function CancelBookingPage() {
  // Hook used to navigate to other pages
  const navigate = useNavigate();

  // State that stores the email entered by the user
  const [email, setEmail] = useState("");

  // State that stores the booking reference entered by the user
  const [bookingReference, setBookingReference] = useState("");

  // This function runs when the user clicks the confirm button
  async function handleConfirmCancel() {
    try {
      // Send a POST request to the backend cancel-booking API
      const response = await fetch("/api/cancel-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Send email and booking reference as JSON
        body: JSON.stringify({
          email,
          booking_reference: bookingReference,
        }),
      });

      // Convert the server response to JSON
      const data = await response.json();

      // If cancellation succeeded, go to the successful page
      if (response.ok) {
        navigate("/avbokning/bekraftad");
      } else {
        // If cancellation failed, go to the unsuccessful page
        // and pass the backend error message
        navigate("/avbokning/misslyckad", {
          state: {
            errorMessage:
              data.error ??
              "Kontrollera att din e-post och bokningsnummer stämmer",
          },
        });
      }
    } catch (error) {
      // If something unexpected happens, navigate to unsuccessful page
      navigate("/avbokning/misslyckad", {
        state: {
          errorMessage: "Serverfel vid avbokning.",
        },
      });
    }
  }

  // Render the page
  return (
    <Container className="pt-5 pb-5" style={{ maxWidth: "700px" }}>
      {/* Back button that navigates back to MenuPage */}
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark mb-4"
        onClick={() => navigate("/menu")}
      >
        ← Bakåt
      </Button>

      {/* Main heading */}
      <h1 className="text-center mb-5">Avbokning</h1>

      {/* Introductory text */}
      <div className="mb-4">
        <p className="mb-1">Behöver du avboka?</p>
        <p>Ange e-post och bokningsnummer</p>
      </div>

      {/* Email input row */}
      <Row className="align-items-center mb-4">
        {/* Email label */}
        <Col xs={5} md={4}>
          <label htmlFor="cancel-email">E-post adress:</label>
        </Col>

        {/* Email input field */}
        <Col xs={7} md={8}>
          <Form.Control
            id="cancel-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </Col>
      </Row>

      {/* Booking reference input row */}
      <Row className="align-items-center mb-5">
        {/* Booking reference label */}
        <Col xs={5} md={4}>
          <label htmlFor="cancel-booking">Bokningsnummer:</label>
        </Col>

        {/* Booking reference input field */}
        <Col xs={7} md={8}>
          <Form.Control
            id="cancel-booking"
            type="text"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            className="form-input"
          />
        </Col>
      </Row>

      {/* Action buttons row */}
      <Row className="justify-content-end gap-3">
        <Col xs="auto">
          {/* This button cancels the action and returns the user to MenuPage */}
          <Button className="cancel-btn" onClick={() => navigate("/menu")}>
            Avbryta
          </Button>
        </Col>

        <Col xs="auto">
          {/* This button sends the cancellation request */}
          <Button
            className="cancel-btn"
            onClick={handleConfirmCancel}
            disabled={!email.trim() || !bookingReference.trim()}
          >
            Bekräfta
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
