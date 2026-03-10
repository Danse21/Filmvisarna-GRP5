import type {
  PriceCategory,
  PriceRow,
  PriceCategoryRow,
} from "../../interfaces/priceCategory";

// Fetch and merge price data from backend
export async function fetchBookingPrices(): Promise<PriceCategory[]> {
  const [priceRes, catRes] = await Promise.all([
    fetch("/api/price"),
    fetch("/api/price_category"),
  ]);

  const prices: PriceRow[] = await priceRes.json();
  const categories: PriceCategoryRow[] = await catRes.json();

  return prices.map((price) => {
    const category = categories.find(
      (item) => item.id === price.price_category_id,
    );

    return {
      id: price.id,
      category_name: category?.name ?? "Unknown",
      amount: Number(price.amount),
    };
  });
}
