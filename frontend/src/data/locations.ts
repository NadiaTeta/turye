// Restaurant details for the Locations page. Everything marked PLACEHOLDER
// needs your real information before launch. Add more objects to
// `locations` if you open another restaurant; the page lists them all.

export interface Location {
  id: string;
  name: string;
  address: string[]; // one line per entry
  phone: string;
  hours: { days: string; time: string }[];
  services: string[]; // what customers can do there
  note?: string;
  image?: string; // photo of the restaurant, in the public folder
  imageAlt?: string;
  // Text Google Maps can search for, usually the full address. Leave empty
  // to show a placeholder instead of the map.
  mapQuery: string;
}

export const locations: Location[] = [
  {
    id: "main",
    name: "Turye Kitchen", // PLACEHOLDER
    address: ["123 Example Street", "Your City, 00000"], // PLACEHOLDER
    phone: "+1 555 0100", // PLACEHOLDER
    hours: [{ days: "Monday to Sunday", time: "7:00 AM – 10:00 PM" }],
    services: ["Dine in", "Takeaway", "Delivery"],
    note: "Walk-ins welcome. Call ahead for groups of 6 or more.", // PLACEHOLDER
    mapQuery: "", // e.g. "123 Example Street, Your City"
    image: "/images/restaurant-interior.webp", // PLACEHOLDER stock photo: use a photo of your restaurant
    imageAlt: "Inside the restaurant: tables and chairs in a warmly lit dining room",
  },
];

// Areas you deliver to, with typical delivery time. PLACEHOLDER names:
// replace with your real neighbourhoods or postcodes.
export const deliveryAreas: { name: string; minutes: string }[] = [
  { name: "Old Town", minutes: "20–30 min" },
  { name: "Riverside", minutes: "20–30 min" },
  { name: "Market District", minutes: "25–35 min" },
  { name: "Hillcrest", minutes: "30–40 min" },
  { name: "Parkview", minutes: "30–40 min" },
];