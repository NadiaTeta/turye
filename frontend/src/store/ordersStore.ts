import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "../types";

// Orders live in the browser for now. When the backend exists, this store
// will load orders from the server instead, and statuses will update there.
interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    { name: "turye-orders" }
  )
);
