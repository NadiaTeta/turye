import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  dishId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalCount: () => number;
  addItem: (dishId: string, quantity: number) => void;
  setQuantity: (dishId: string, quantity: number) => void;
  removeItem: (dishId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  // persist keeps the cart in localStorage so it survives a page refresh.
  persist(
    (set, get) => ({
      items: [],
      totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (dishId, quantity) =>
        set((state) => {
          const existing = state.items.find((item) => item.dishId === dishId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.dishId === dishId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { dishId, quantity }] };
        }),
      setQuantity: (dishId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.dishId !== dishId)
              : state.items.map((item) =>
                  item.dishId === dishId ? { ...item, quantity } : item
                ),
        })),
      removeItem: (dishId) =>
        set((state) => ({
          items: state.items.filter((item) => item.dishId !== dishId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "turye-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);