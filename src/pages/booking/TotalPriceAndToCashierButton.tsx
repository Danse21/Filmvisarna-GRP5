import { Button } from "react-bootstrap";

type Props = {
  totalPrice: number;
  totalTickets: number;
  selectedSeats: string[];
  onCheckout: () => void;
};

export default function TotalPriceAndToCashierButton({
  totalPrice,
  totalTickets,
  selectedSeats,
  onCheckout,
}: Props) {
  return (
    <div className="checkout-row mt-4 pb-4">
      <button type="button" className="total-box fw-bold text-black" disabled>
        Totalt
        <br />
        <strong>{totalPrice} kr</strong>
      </button>

      <Button
        className="checkout-btn-small d-flex align-items-center mt-4 me-5"
        disabled={selectedSeats.length === 0 || totalTickets === 0}
        onClick={onCheckout}
      >
        Till kassan
      </Button>
    </div>
  );
}
