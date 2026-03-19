import type { PriceCategory } from "../../interfaces/priceCategory";
import { getPrice } from "../../utils/booking/getPrice";

// Type describing number of tickets per category
type Tickets = {
  adult: number; // adult tickets
  child: number; // child tickets
  senior: number; // senior tickets
};

// Props received from the parent component
type Props = {
  tickets: Tickets; // selected ticket counts
  priceCategory: PriceCategory[]; // price categories from backend
  ageLimit: number; // movie age limit (used to hide child tickets if needed)

  // Function to increase/decrease tickets
  // key = ticket type, plusMinus = +1 or -1
  onChangeTicket: (
    key: "adult" | "child" | "senior",
    plusMinus: number,
  ) => void;
};

// Component that displays ticket categories with +/- buttons
export default function TicketPriceCategorySelector({
  tickets,
  priceCategory,
  ageLimit,
  onChangeTicket,
}: Props) {
  return (
    // Section containing all ticket selectors
    <section className="ticket-selector mt-4">
      <div className="ticket-grid">
        {/* ADULT TICKET */}
        <div className="ticket-col">
          {/* Show price for adult ticket */}
          <div className="ticket-price">
            Pris {getPrice(priceCategory, "Adult")} kr
          </div>

          {/* Ticket category label */}
          <div className="ticket-card-only">
            <div className="ticket-label">Vuxen</div>
          </div>

          {/* Ticket counter with +/- buttons */}
          <div className="ticket-controls">
            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("adult", -1)} // decrease ticket
            >
              -
            </button>

            {/* Current number of adult tickets */}
            <span className="ticket-count">{tickets.adult}</span>

            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("adult", +1)} // increase ticket
            >
              +
            </button>
          </div>
        </div>

        {/* CHILD TICKET */}
        {/* Only show if the movie allows children (age limit under 12) */}
        {ageLimit < 12 && (
          <div className="ticket-col">
            {/* Child ticket price */}
            <div className="ticket-price">
              Pris {getPrice(priceCategory, "Child")} kr
            </div>

            {/* Child ticket label */}
            <div className="ticket-card-only">
              <div className="ticket-label">Barn &lt; 12 år</div>
            </div>

            {/* Ticket counter */}
            <div className="ticket-controls">
              <button
                type="button"
                className="ticket-btn"
                onClick={() => onChangeTicket("child", -1)}
              >
                -
              </button>

              {/* Current number of child tickets */}
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

        {/* SENIOR TICKET */}
        <div className="ticket-col">
          {/* Senior ticket price */}
          <div className="ticket-price">
            Pris {getPrice(priceCategory, "Pensioner")} kr
          </div>

          {/* Senior ticket label */}
          <div className="ticket-card-only">
            <div className="ticket-label">Pensionär</div>
          </div>

          {/* Ticket counter */}
          <div className="ticket-controls">
            <button
              type="button"
              className="ticket-btn"
              onClick={() => onChangeTicket("senior", -1)}
            >
              -
            </button>

            {/* Current number of senior tickets */}
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
