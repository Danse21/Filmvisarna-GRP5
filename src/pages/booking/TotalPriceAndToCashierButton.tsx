import { Button } from "react-bootstrap";

// This type defines all props that this component receives from its parent.
type Props = {
  totalPrice: number;
  totalTickets: number;
  selectedSeats: string[];
  onCheckout: () => void;
};

// This component renders the total price and the button
// that sends the user to the next booking step.
export default function TotalPriceAndToCashierButton({
  totalPrice,
  totalTickets,
  selectedSeats,
  onCheckout,
}: Props) {
  // This function checks whether the booking can continue.
  function handleCheckoutClick() {
    // Count how many seats the user has selected.
    const selectedSeatCount = selectedSeats.length;

    // Stop if the user has not selected any seat.
    if (selectedSeatCount === 0) {
      alert("Du måste välja minst en plats.");
      return;
    }

    // Stop if the number of tickets does not match the number of seats.
    if (totalTickets !== selectedSeatCount) {
      alert("Antalet valda platser måste matcha antalet biljetter.");
      return;
    }

    // Continue to the next page if all rules are correct.
    onCheckout();
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      {/* Show the total booking price */}
      <h5 className="mb-0">Totalt: {totalPrice} kr</h5>

      {/* Checkout button that validates seat and ticket count before navigation */}
      <Button
        className="checkout-btn-small d-flex align-items-center me-5"
        onClick={handleCheckoutClick}
      >
        Till kassan
      </Button>
    </div>
  );
}
