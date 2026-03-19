// Type describing the number of tickets per category
type Tickets = {
  adult: number; // adult tickets
  child: number; // child tickets
  senior: number; // senior tickets
};

// Allowed ticket types that can be updated
type TicketType = "adult" | "child" | "senior";

// Updates the ticket count for a specific category
export function updateTicketCount(
  tickets: Tickets,
  key: TicketType, // which ticket type to update
  plusMinus: number, // +1 or -1 depending on button pressed
) {
  // Calculate the next value but never allow negative numbers
  const nextValue = Math.max(0, tickets[key] + plusMinus);

  // Return a new tickets object with the updated value
  // Spread operator keeps the other ticket values unchanged
  return {
    ...tickets,
    [key]: nextValue, // update only the selected ticket type
  };
}
