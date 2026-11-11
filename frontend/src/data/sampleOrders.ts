import type { Order } from "../types";

// Sample orders so every tab of "My orders" has something to show while
// there's no backend. Set this to false (or delete the file) before launch.
export const SHOW_SAMPLE_ORDERS = true;

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();
const daysAgo = (d: number) => minutesAgo(d * 24 * 60);

export const sampleOrders: Order[] = [
  {
    number: "TY-482915",
    placedAt: minutesAgo(22),
    status: "out-for-delivery",
    name: "Sample Customer",
    phone: "555 0100",
    address: "12 Orchard Lane, Flat 3",
    instructions: "",
    deliveryTime: "As soon as possible (about 30 minutes)",
    payment: "Card on delivery",
    lines: [
      { dishId: "harvest-bowl", name: "Harvest Bowl", quantity: 2, lineTotal: 26 },
      { dishId: "citrus-kale-toss", name: "Citrus Kale Toss", quantity: 1, lineTotal: 9.2 },
    ],
    total: 38.19,
    isSample: true,
  },
  {
    number: "TY-371204",
    placedAt: daysAgo(3),
    status: "delivered",
    name: "Sample Customer",
    phone: "555 0100",
    address: "12 Orchard Lane, Flat 3",
    instructions: "",
    deliveryTime: "As soon as possible (about 30 minutes)",
    payment: "Cash on delivery",
    lines: [
      { dishId: "spicy-red-fish-salad", name: "Spicy Red Fish Salad", quantity: 1, lineTotal: 14 },
      { dishId: "pumpkin-cutlets", name: "Pumpkin Cutlets", quantity: 1, lineTotal: 8.5 },
    ],
    total: 25.49,
    isSample: true,
  },
  {
    number: "TY-290877",
    placedAt: daysAgo(11),
    status: "delivered",
    name: "Sample Customer",
    phone: "555 0100",
    address: "12 Orchard Lane, Flat 3",
    instructions: "",
    deliveryTime: "Today at 12:30 PM",
    payment: "Card on delivery",
    lines: [{ dishId: "herb-chicken-salad", name: "Herb Chicken Salad", quantity: 2, lineTotal: 24.8 }],
    total: 27.79,
    isSample: true,
  },
  {
    number: "TY-265130",
    placedAt: daysAgo(15),
    status: "failed",
    statusNote: "The courier couldn't reach you at the address, so the order was returned.",
    name: "Sample Customer",
    phone: "555 0100",
    address: "12 Orchard Lane, Flat 3",
    instructions: "",
    deliveryTime: "As soon as possible (about 30 minutes)",
    payment: "Cash on delivery",
    lines: [{ dishId: "greek-garden-plate", name: "Greek Garden Plate", quantity: 1, lineTotal: 10.75 }],
    total: 13.74,
    isSample: true,
  },
  {
    number: "TY-251986",
    placedAt: daysAgo(20),
    status: "cancelled",
    statusNote: "You cancelled this order.",
    name: "Sample Customer",
    phone: "555 0100",
    address: "12 Orchard Lane, Flat 3",
    instructions: "",
    deliveryTime: "Today at 7:00 PM",
    payment: "Card on delivery",
    lines: [{ dishId: "crisp-veggie", name: "Crisp Veggie", quantity: 1, lineTotal: 11.5 }],
    total: 14.49,
    isSample: true,
  },
];
