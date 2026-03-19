import type {
  PriceCategory,
  PriceRow,
  PriceCategoryRow,
} from "../../interfaces/priceCategory";

// Function that fetches price data and price categories from the backend
// and combines them into one structured array
export async function fetchBookingPrices(): Promise<PriceCategory[]> {
  // Fetch price rows and price categories in parallel
  // Promise.all makes both requests at the same time
  const [priceRes, catRes] = await Promise.all([
    fetch("/api/price"), // ticket prices
    fetch("/api/price_category"), // price category names
  ]);

  // Convert responses to JSON arrays
  const prices: PriceRow[] = await priceRes.json();
  const categories: PriceCategoryRow[] = await catRes.json();

  // Merge price data with category names
  return prices.map((price) => {
    // Find the category that matches the price row
    const category = categories.find(
      (item) => item.id === price.price_category_id,
    );

    // Return a combined object used by the frontend
    return {
      id: price.id, // price id
      category_name: category?.name ?? "Unknown", // category name
      amount: Number(price.amount), // price converted to number
    };
  });
}
