import { dishes } from "../data/dishes";
import { useCartStore } from "../store/cartStore";
import type { Dish } from "../types";

// Flat delivery fee; change here if pricing changes.
export const DELIVERY_FEE = 2.99;

export interface CartLine {
  dish: Dish;
  quantity: number;
}

// Joins cart entries with dish data and works out the totals.
// Dishes no longer on the menu are skipped.
export function useCartLines() {
  const items = useCartStore((state) => state.items);

  const lines: CartLine[] = items.flatMap((item) => {
    const dish = dishes.find((d) => d.id === item.dishId);
    return dish ? [{ dish, quantity: item.quantity }] : [];
  });

  const subtotal = lines.reduce((sum, line) => sum + line.dish.price * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.length > 0 ? subtotal + DELIVERY_FEE : 0;

  return { lines, subtotal, itemCount, total };
}

export function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}