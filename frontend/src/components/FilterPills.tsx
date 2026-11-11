import type { CategoryId } from "../types";
import { categories, dishes } from "../data/dishes";

export type MenuFilter = CategoryId | "all";

interface Props {
  active: MenuFilter;
  onChange: (id: MenuFilter) => void;
}

export default function FilterPills({ active, onChange }: Props) {
  const pills: { id: MenuFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: dishes.length },
    ...categories
      .map((cat) => ({
        id: cat.id,
        label: cat.label,
        count: dishes.filter((d) => d.category === cat.id).length,
      }))
      .filter((cat) => cat.count > 0),
  ];

  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Menu categories">
      {pills.map((pill) => {
        const isActive = pill.id === active;
        return (
          <button
            key={pill.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(pill.id)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-gold border-gold text-green-deep"
                : "bg-white border-card-line text-ink hover:border-gold"
            }`}
          >
            {pill.label}
            <span className={`text-xs ${isActive ? "opacity-75" : "opacity-60"}`}>
              {pill.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}