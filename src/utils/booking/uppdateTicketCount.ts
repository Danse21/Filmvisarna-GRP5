type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

type TicketType = "adult" | "child" | "senior";

export function updateTicketCount(
  tickets: Tickets,
  key: TicketType,
  plusMinus: number,
) {
  const nextValue = Math.max(0, tickets[key] + plusMinus);

  return {
    ...tickets,
    [key]: nextValue,
  };
}
