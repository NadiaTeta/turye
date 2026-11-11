# Turye — Frontend

React + TypeScript + Vite + Tailwind CSS v4 + Zustand recreation of the menu page, set up to grow into the full food delivery frontend.

## Structure

```
src/
  components/   Header, MenuHero, FilterPills, DishGrid, DishCard
  store/        cartStore.ts — Zustand store for cart items/quantities
  data/         dishes.ts — dish + category data (swap for an API call later)
  types/        shared TypeScript interfaces
  index.css     Tailwind v4 entry + design tokens (@theme) + plate visual styles
  App.tsx       page shell
  main.tsx      React entry point
```

## Notes

- The "plate" visuals are CSS gradient blobs, not real photos (see `.plate` in `index.css`). Swap in real food photography by replacing the four `<div className="blob" />` elements in `DishCard.tsx` with an `<img>`.
- Cart state lives in `src/store/cartStore.ts`. Reading it anywhere: `useCartStore((s) => s.totalCount())`.
- Category filter pills currently only change visual state — wire `activeCategory` in `App.tsx` up to real filtering once dishes have a `category` field.
