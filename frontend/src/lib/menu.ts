import type { Dish } from "../types";

export type SortOption = "popular" | "price-asc" | "price-desc" | "kcal-asc";

export const sortOptions: { id: SortOption; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "kcal-asc", label: "Calories: lowest first" },
];

const kcalOf = (dish: Dish) => parseInt(dish.kcal, 10) || 0;

// "Popular" keeps the order dishes are listed in data/dishes.ts, so put your
// best sellers first there. Once the backend tracks orders, this can use
// real sales numbers instead.
export function sortDishes(list: Dish[], sort: SortOption) {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  if (sort === "kcal-asc") copy.sort((a, b) => kcalOf(a) - kcalOf(b));
  return copy;
}
