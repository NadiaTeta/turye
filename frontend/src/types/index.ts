export interface Dish {
  id: string;
  name: string;
  price: number;
  weight: string;
  kcal: string;
  tag: string;
  category: CategoryId;
  desc?: string;
  blobs: [string, string, string, string]; // colors for the drawn plate, used when there's no photo
  image?: string; // e.g. "/images/dishes/harvest-bowl.webp" (files live in the public folder)
  imageAlt?: string; // short description of the photo for screen readers
}

export type CategoryId = "breakfast" | "lunch" | "dinner" | "drinks" | "snacks";

export interface Category {
  id: CategoryId;
  label: string;
}

export type OrderStatus =
  | "placed"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "failed";

export interface OrderLine {
  dishId: string;
  name: string;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  number: string;
  placedAt: string; // ISO date string
  status: OrderStatus;
  statusNote?: string; // why an order was cancelled or failed
  name: string;
  phone: string;
  address: string;
  instructions: string;
  deliveryTime: string;
  payment: string;
  lines: OrderLine[];
  total: number;
  isSample?: boolean;
}

export type PostCategory = "new-on-the-menu" | "from-our-kitchen" | "eating-well" | "around-town";

export type PostBlock = { type: "p"; text: string } | { type: "h2"; text: string };

export interface Post {
  slug: string;
  title: string;
  category: PostCategory;
  publishedAt: string; // ISO date string
  readMinutes: number;
  excerpt: string;
  blobs: [string, string, string, string];
  image?: string;
  imageAlt?: string;
  body: PostBlock[];
  dishIds: string[]; // dishes mentioned in the post, shown as "order these"
}

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Work"
  street: string;
  apartment: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  provider: "password" | "google";
  addresses: SavedAddress[];
  createdAt: string; // ISO date string
}