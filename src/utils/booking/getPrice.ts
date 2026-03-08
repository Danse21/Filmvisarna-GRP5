import type { PriceCategory } from "../../interfaces/priceCategory";

export function getPrice(priceCategory: PriceCategory[], name: string) {
  const wanted = name.trim().toLowerCase();
  const match = priceCategory.find(
    (x) => x.category_name.trim().toLowerCase() === wanted,
  );
  return match?.amount ?? 0;
}

// Helper to get price by category name