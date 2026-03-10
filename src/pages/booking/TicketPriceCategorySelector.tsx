import type { PriceCategory } from "../../interfaces/priceCategory";
import { getPrice } from "../../utils/booking/getPrice";

type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

type Props = {
  tickets: Tickets;
  priceCategory: PriceCategory[];
  ageLimit: number;
  onChangeTicket: (
    key: "adult" | "child" | "senior",
    plusMinus: number,
  ) => void;
};

// Display ticket price category box and +/- buttons
export default function TicketPriceCategorySelector({
  tickets,
  priceCategory,
  ageLimit,
  onChangeTicket,
}: Props) {
  return (
    <section className="ticket-selector mt-4">
      <div className="ticket-grid">
        {/* VUXEN */}
        <div className="ticket-col">
          <div className="ticket-price">
            Pris {getPrice(priceCategory, "Adult")} kr
          </div>
          <div className="ticket-card-only">
            <div className="ticket-label">Vuxen</div>
          </div>
          <div className="ticket-controls">
            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("adult", -1)}
            >
              -
            </button>
            <span className="ticket-count">{tickets.adult}</span>
            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("adult", +1)}
            >
              +
            </button>
          </div>
        </div>

        {/* BARN */}
        {ageLimit < 12 && (
          <div className="ticket-col">
            <div className="ticket-price">
              Pris {getPrice(priceCategory, "Child")} kr
            </div>
            <div className="ticket-card-only">
              <div className="ticket-label">Barn &lt; 12 år</div>
            </div>
            <div className="ticket-controls">
              <button
                type="button"
                className="ticket-btn"
                onClick={() => onChangeTicket("child", -1)}
              >
                -
              </button>
              <span className="ticket-count">{tickets.child}</span>
              <button
                type="button"
                className="ticket-btn"
                onClick={() => onChangeTicket("child", +1)}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* PENSIONÄR */}
        <div className="ticket-col">
          <div className="ticket-price">
            Pris {getPrice(priceCategory, "Pensioner")} kr
          </div>
          <div className="ticket-card-only">
            <div className="ticket-label">Pensionär</div>
          </div>
          <div className="ticket-controls">
            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("senior", -1)}
            >
              -
            </button>
            <span className="ticket-count">{tickets.senior}</span>
            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("senior", +1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
