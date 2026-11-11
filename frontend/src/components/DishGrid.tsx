import { useEffect, useState } from "react";
import { dishes } from "../data/dishes";
import { type SortOption, sortDishes } from "../lib/menu";
import type { MenuFilter } from "./FilterPills";
import DishCard from "./DishCard";

interface Props {
  category: MenuFilter;
  sort: SortOption;
  linkedDish: string | null; // from /menu?dish=<id>: open this card
}

export default function DishGrid({ category, sort, linkedDish }: Props) {
  const [activeId, setActiveId] = useState<string | null>(linkedDish);

  // Open and scroll to a linked dish, including when it changes while
  // already on the menu (for example, picking another search result).
  useEffect(() => {
    if (!linkedDish) return;
    setActiveId(linkedDish);
    document.getElementById(`dish-${linkedDish}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [linkedDish]);

  const filtered = category === "all" ? dishes : dishes.filter((d) => d.category === category);
  const visible = sortDishes(filtered, sort);

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      aria-label="Dishes"
    >
      {visible.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          isActive={dish.id === activeId}
          onToggle={() => setActiveId((cur) => (cur === dish.id ? null : dish.id))}
        />
      ))}
    </section>
  );
}
