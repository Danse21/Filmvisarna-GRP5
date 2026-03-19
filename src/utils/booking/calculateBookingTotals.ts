import { getPrice } from "./getPrice";
import type { PriceCategory } from "../../interfaces/priceCategory";

// Type describing number of tickets per category
type Tickets = {
  adult: number; // number of adult tickets
  child: number; // number of child tickets
  senior: number; // number of senior tickets
};

// Function that calculates booking totals
// Returns total number of tickets and total price
export function calculateBookingTotals(
  tickets: Tickets,
  priceCategory: PriceCategory[],
) {
  // Calculate total number of selected tickets
  const totalTickets = tickets.adult + tickets.child + tickets.senior;

  // Calculate total price based on ticket count and category price
  const totalPrice =
    tickets.adult * getPrice(priceCategory, "Adult") + // adult ticket price
    tickets.child * getPrice(priceCategory, "Child") + // child ticket price
    tickets.senior * getPrice(priceCategory, "Pensioner"); // senior ticket price

  // Return both totals to the calling component
  return {
    totalTickets,
    totalPrice,
  };
}
