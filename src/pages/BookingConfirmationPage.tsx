import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

BookingConfirmationPage.route = {
  path: "/booking/confirmation",
  index: 11,
};

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | {
        bookingId: number;
        bookingReference: string;
      }
    | undefined;

  if (!state) {
    return (
      <Container className="pt-5">
        <Button variant="link" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
        <p>Ingen bokningsinformation hittades.</p>
      </Container>
    );
  }

  const { bookingId, bookingReference } = state;

  return (
    <Container className="pt-5 pb-5 text-center">
      <h2 className="mb-4">Tack för din bokning!</h2>

      <div className="confirmation-box mx-auto">
        <p className="mb-2">
          <strong>Boknings-ID:</strong> {bookingId}
        </p>
        <p className="mb-0">
          <strong>Bokningsreferens:</strong> {bookingReference}
        </p>
      </div>

      <div className="mt-4">
        <Button variant="dark" onClick={() => navigate("/")}>
          Till startsidan
        </Button>
      </div>
    </Container>
  );
}
