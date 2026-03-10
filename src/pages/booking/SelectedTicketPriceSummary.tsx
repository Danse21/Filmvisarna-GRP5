type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

type Props = {
  tickets: Tickets;
  totalPrice: number;
};

export default function SelectedTicketPriceSummary({
  tickets,
  totalPrice,
}: Props) {
  return (
    <div className="selection-box">
      <h5 className="mb-1">Dina val:</h5>

      <div className="ticket-summary">
        {tickets.adult > 0 && (
          <p className="tight">
            {tickets.adult} Vuxen {tickets.adult * 160} kr
          </p>
        )}
        {tickets.child > 0 && (
          <p className="tight">
            {tickets.child} Barn {tickets.child * 80} kr
          </p>
        )}
        {tickets.senior > 0 && (
          <p className="tight">
            {tickets.senior} Pensionär {tickets.senior * 120} kr
          </p>
        )}
      </div>

      <h5 className="mt-3 mb-0">Totalt {totalPrice} kr</h5>
    </div>
  );
}
