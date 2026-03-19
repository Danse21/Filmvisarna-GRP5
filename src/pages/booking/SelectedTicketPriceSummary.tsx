// This type describes how many tickets were selected per category
type Tickets = {
  adult: number; // number of adult tickets
  child: number; // number of child tickets
  senior: number; // number of senior tickets
};

// Props received from the parent component (BookingSummaryPage)
// - tickets: selected ticket counts
// - totalPrice: calculated total price for all tickets
type Props = {
  tickets: Tickets;
  totalPrice: number;
};

// Component that shows a summary of selected tickets and total price
export default function SelectedTicketPriceSummary({
  tickets,
  totalPrice,
}: Props) {
  return (
    // Container for the ticket summary section
    <div className="selection-box summary-part-one">
      {/* Section title */}
      <h5 className="mb-1">Dina val:</h5>

      {/* List of selected ticket types */}
      <div className="ticket-summary">
        {/* Show adult tickets only if at least one is selected */}
        {tickets.adult > 0 && (
          <p className="tight">
            {tickets.adult} Vuxen {tickets.adult * 160} kr{" "}
            {/* price per adult */}
          </p>
        )}

        {/* Show child tickets only if selected */}
        {tickets.child > 0 && (
          <p className="tight">
            {tickets.child} Barn {tickets.child * 80} kr {/* price per child */}
          </p>
        )}

        {/* Show senior tickets only if selected */}
        {tickets.senior > 0 && (
          <p className="tight">
            {tickets.senior} Pensionär {tickets.senior * 120} kr{" "}
            {/* price per senior */}
          </p>
        )}
      </div>

      {/* Total price for all selected tickets */}
      <h5 className="mt-3 mb-0">Totalt {totalPrice} kr</h5>
    </div>
  );
}
