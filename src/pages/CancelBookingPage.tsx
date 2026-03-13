import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useState } from "react";

// Navigation route
CancelBookingPage.route = {
  path: "/avbokning",
  index: 12,
};

export default function CancelBookingPage() {
  const navigate = useNavigate();

  // Store email input value
  const [email, setEmail] = useState("");

  // Store booking reference input value
  const [bookingReference, setBookingReference] = useState("");

  // Temporary function until backend cancel API exists
  function handleConfirmCancel() {
    alert(
      `Avbokning skickad\nE-post: ${email}\nBokningsnummer: ${bookingReference}`,
    );
  }

  return (
    <Container className="pt-5 pb-5" style={{ maxWidth: "700px" }}>
      {/* Back button */}
      <Button
        variant="link"
        className="ps-0 text-decoration-none fw-bold text-dark mb-4"
        onClick={() => navigate("/menu")}
      >
        ← Bakåt
      </Button>

      {/* Page heading */}
      <h1 className="avbokning-header text-center mb-5">Avbokning</h1>

      {/* Description text */}
      <div className="avbokning-body mb-4">
        <p className="mb-0">Behöver du avboka?</p>
        <p>Ange e-post och bokningsnummer</p>
      </div>

      {/* Email input row */}
      <Row className="avbokning-body align-items-center mb-4">
        <Col xs={12} md={4} className="email-field">
          <label htmlFor="cancel-email">E-post adress:</label>
        </Col>

        <Col xs={12} md={8}>
          <Form.Control
            id="cancel-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </Col>
      </Row>

      {/* Booking number input row */}
      <Row className="avbokning-body align-items-center mb-5">
        <Col xs={12} md={4}>
          <label htmlFor="cancel-booking">Bokningsnummer:</label>
        </Col>

        <Col xs={12} md={8}>
          <Form.Control
            id="cancel-booking"
            type="text"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            className="form-input"
          />
        </Col>
      </Row>

      {/* Buttons */}
      <Row className="justify-content-end gap-3">
        <Col xs="auto">
          <Button className="cancel-btn" onClick={() => navigate("/menu")}>
            Avbryta
          </Button>
        </Col>

        <Col xs="auto">
          <Button
            className="cancel-btn"
            onClick={handleConfirmCancel}
            disabled={!email || !bookingReference}
          >
            Bekräfta
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
