export interface PriceCategory {
  id: number;
  category_name: "Adult" | "Child" | "Pensioner" | string;
  amount: number;
}

export interface PriceRow {
  id: number;
  price_category_id: number;
  amount: number;
}

export interface PriceCategoryRow {
  id: number;
  name: string; // Adult / Pensioner / Child
}
