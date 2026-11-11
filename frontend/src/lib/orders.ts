import type { Order, OrderStatus } from "../types";
import { useOrdersStore } from "../store/ordersStore";
import { SHOW_SAMPLE_ORDERS, sampleOrders } from "../data/sampleOrders";

export type OrderTab = "active" | "past" | "cancelled";

export const tabForStatus: Record<OrderStatus, OrderTab> = {
  placed: "active",
  preparing: "active",
  "out-for-delivery": "active",
  delivered: "past",
  cancelled: "cancelled",
  failed: "cancelled",
};

export const statusLabel: Record<OrderStatus, string> = {
  placed: "Order placed",
  preparing: "Being prepared",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Delivery failed",
};

// The steps an active order moves through, in order.
export const progressSteps: OrderStatus[] = ["placed", "preparing", "out-for-delivery", "delivered"];

export function formatOrderDate(iso: string) {
  const date = new Date(iso);
  const day = date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `${day}, ${time}`;
}

export function newestFirst(a: Order, b: Order) {
  return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
}

// Saved orders plus the sample ones (while SHOW_SAMPLE_ORDERS is on), newest first.
export function useAllOrders() {
  const saved = useOrdersStore((state) => state.orders);
  return [...saved, ...(SHOW_SAMPLE_ORDERS ? sampleOrders : [])].sort(newestFirst);
}

// What each step means for the customer, shown on the tracking page.
export const stepDescription: Record<OrderStatus, string> = {
  placed: "We've received your order.",
  preparing: "The kitchen is making your food.",
  "out-for-delivery": "Your courier is on the way.",
  delivered: "Your order was delivered. Enjoy your meal.",
  cancelled: "This order was cancelled.",
  failed: "This order couldn't be delivered.",
};

// Scheduled orders arrive at their chosen slot; ASAP orders about 30 minutes
// after they were placed.
export function estimatedArrival(order: Order) {
  const scheduled = order.deliveryTime.match(/^Today at (.+)$/);
  if (scheduled) return scheduled[1];
  const eta = new Date(new Date(order.placedAt).getTime() + 30 * 60 * 1000);
  return eta.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
