import { getPrice } from "./getPrice";
import type { PriceCategory } from "../../interfaces/priceCategory";

type Tickets = {
  adult: number;
  child: number;
  senior: number;
};

// Computes total tickets and total price
export function calculateBookingTotals(
  tickets: Tickets,
  priceCategory: PriceCategory[],
) {
  const totalTickets = tickets.adult + tickets.child + tickets.senior;

  const totalPrice =
    tickets.adult * getPrice(priceCategory, "Adult") +
    tickets.child * getPrice(priceCategory, "Child") +
    tickets.senior * getPrice(priceCategory, "Pensioner");

  return {
    totalTickets,
    totalPrice,
  };
}
