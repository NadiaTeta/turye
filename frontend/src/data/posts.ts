import type { Post, PostCategory } from "../types";

export const postCategories: { id: PostCategory; label: string }[] = [
  { id: "new-on-the-menu", label: "New on the menu" },
  { id: "from-our-kitchen", label: "From our kitchen" },
  { id: "eating-well", label: "Eating well" },
  { id: "around-town", label: "Around town" },
];

// Starter posts so the blog has real-looking content. Replace the copy with
// your own details (suppliers, staff names, real news) before launch.
export const posts: Post[] = [
  {
    slug: "wild-rocket-and-berry-joins-the-menu",
    title: "Wild Rocket & Berry joins the menu",
    category: "new-on-the-menu",
    publishedAt: "2026-09-18",
    readMinutes: 2,
    excerpt: "Peppery rocket, sweet berries and a light dressing. Our newest salad is vegan and comes in at 330 kcal.",
    blobs: ["#8F3B5C", "#8FA84E", "#E3B23C", "#6F8F4E"],
    image: "/images/blog/wild-rocket-berry.webp",
    imageAlt: "Rocket salad with berries and pomegranate",
    dishIds: ["wild-rocket-berry"],
    body: [
      { type: "p", text: "Our newest dish started as a staff lunch. Someone tossed the last of the morning's rocket with a handful of berries, and by the end of the week the whole kitchen was asking for it." },
      { type: "h2", text: "What's in it" },
      { type: "p", text: "A generous bed of wild rocket, mixed seasonal berries and a bright, light dressing. The rocket brings the pepper, the berries bring the sweetness, and nothing about it feels heavy." },
      { type: "p", text: "It's fully vegan, weighs in at 395 g and comes to 330 kcal, which makes it the lightest dish on the menu." },
      { type: "h2", text: "When to order it" },
      { type: "p", text: "It works as a lunch on its own or alongside something warmer like the Pumpkin Cutlets. You'll find it on the menu from today." },
    ],
  },
  {
    slug: "what-made-fresh-daily-means",
    title: "What \"made fresh daily\" means in our kitchen",
    category: "from-our-kitchen",
    publishedAt: "2026-09-09",
    readMinutes: 3,
    excerpt: "Nothing on our menu is cooked the day before. Here's how a day in the kitchen runs, from the first delivery to the last order.",
    blobs: ["#7C8F4A", "#D9A441", "#B85C38", "#8FA84E"],
    image: "/images/blog/made-fresh-daily.webp",
    imageAlt: "Trays of freshly prepared vegetables and ingredients",
    dishIds: ["harvest-bowl", "pumpkin-cutlets"],
    body: [
      { type: "p", text: "\"Made fresh daily\" is the first thing we promise on our home page, so it's worth explaining what it looks like behind the kitchen door." },
      { type: "h2", text: "Before we open" },
      { type: "p", text: "Produce arrives early each morning. Vegetables are washed and prepped, sauces and dressings are made, and anything left from the day before is not used for orders." },
      { type: "h2", text: "When you order" },
      { type: "p", text: "Your dish is assembled when the order comes in, not ahead of time. That's why a Harvest Bowl arrives with the greens still crisp and the roasted vegetables still warm." },
      { type: "h2", text: "At the end of the day" },
      { type: "p", text: "We close the kitchen at 10 PM. Whatever we've prepped and haven't used doesn't carry over to tomorrow's menu." },
    ],
  },
  {
    slug: "lightest-lunches-under-450-kcal",
    title: "Our lightest lunches, all under 450 kcal",
    category: "eating-well",
    publishedAt: "2026-08-28",
    readMinutes: 3,
    excerpt: "Six dishes that keep you full through the afternoon without weighing you down, from lightest to most filling.",
    blobs: ["#6F8F4E", "#E4A63B", "#A3B86C", "#D9713F"],
    image: "/images/blog/lightest-lunches.webp",
    imageAlt: "A light green salad on a dark plate",
    dishIds: ["wild-rocket-berry", "citrus-kale-toss", "greek-garden-plate", "crisp-veggie"],
    body: [
      { type: "p", text: "Every dish on our menu lists its calories, so it's easy to pick something lighter. Here are the six that come in under 450 kcal, from lightest to most filling." },
      { type: "h2", text: "Under 400 kcal" },
      { type: "p", text: "Wild Rocket & Berry (330 kcal) is our lightest dish. Citrus Kale Toss (360 kcal) is bright and sharp, and both are vegan. Greek Garden Plate (390 kcal) is gluten free and a little more substantial." },
      { type: "h2", text: "Around 425 kcal" },
      { type: "p", text: "Pumpkin Cutlets, Harvest Bowl and Crisp Veggie all sit at 425 kcal and weigh 485 g, so they're the ones to choose when you want a proper plateful. The Harvest Bowl has some heat; the other two are gluten free." },
      { type: "p", text: "If you're after protein rather than fewer calories, the Herb Chicken Salad (480 kcal) is the one to try." },
    ],
  },
  {
    slug: "going-vegan-start-here",
    title: "Trying vegan? Start with these two",
    category: "eating-well",
    publishedAt: "2026-08-14",
    readMinutes: 2,
    excerpt: "Two fully vegan dishes that don't feel like they're missing anything.",
    blobs: ["#8FA84E", "#E4A63B", "#A3B86C", "#5D7A3C"],
    image: "/images/blog/going-vegan.webp",
    imageAlt: "Vegan bowl with avocado, beans and vegetables",
    dishIds: ["citrus-kale-toss", "wild-rocket-berry"],
    body: [
      { type: "p", text: "If you're cutting back on animal products, or just curious, two dishes on our menu are fully vegan." },
      { type: "h2", text: "Citrus Kale Toss" },
      { type: "p", text: "Kale can be tough, so we massage it with citrus until it softens. It's bright and fresh, and comes to 360 kcal." },
      { type: "h2", text: "Wild Rocket & Berry" },
      { type: "p", text: "Peppery and sweet in the same bite, at 330 kcal. Order both and share them if you can't decide." },
    ],
  },
  {
    slug: "open-every-day-7am-to-10pm",
    title: "We're open every day, 7 AM to 10 PM",
    category: "around-town",
    publishedAt: "2026-07-30",
    readMinutes: 1,
    excerpt: "Breakfast, lunch, dinner or a late snack: our kitchen takes orders seven days a week.",
    blobs: ["#D9A441", "#7C8F4A", "#C4472E", "#A3B86C"],
    image: "/images/blog/open-every-day.webp",
    imageAlt: "Warmly lit restaurant dining room",
    dishIds: [],
    body: [
      { type: "p", text: "A quick note for anyone wondering when they can order: our kitchen is open every day of the week, from 7 AM to 10 PM." },
      { type: "p", text: "Orders placed as soon as possible arrive in about 30 minutes. You can also schedule delivery for later the same day at checkout, in 30-minute slots." },
      { type: "p", text: "Holiday hours will be posted here ahead of time." },
    ],
  },
  {
    slug: "behind-the-spicy-red-fish-salad",
    title: "The story behind the Spicy Red Fish Salad",
    category: "from-our-kitchen",
    publishedAt: "2026-07-16",
    readMinutes: 2,
    excerpt: "Our most-ordered dish, and why the marinade is the part we never rush.",
    blobs: ["#C4472E", "#E3B23C", "#7C8F4A", "#D9713F"],
    image: "/images/blog/red-fish-salad.webp",
    imageAlt: "Red fish fillet served with vegetables",
    dishIds: ["spicy-red-fish-salad"],
    body: [
      { type: "p", text: "The Spicy Red Fish Salad has been on the menu since the start, and it's still the dish people order most." },
      { type: "h2", text: "It's all in the marinade" },
      { type: "p", text: "The red fish is marinated in a blend of spices and fresh lemon. It's the one step we never rush, because it's where the heat and the brightness come from." },
      { type: "p", text: "It's served over fresh greens, weighs 460 g and comes to 510 kcal. It's labelled spicy for a reason, so go easy if you're sensitive to heat." },
    ],
  },
];

export function categoryLabel(id: PostCategory) {
  return postCategories.find((c) => c.id === id)?.label ?? id;
}

export function formatPostDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}