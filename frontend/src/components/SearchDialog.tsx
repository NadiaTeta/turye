import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, dishes } from "../data/dishes";
import { formatPrice } from "../lib/cart";
import FoodImage from "./FoodImage";

const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const q = query.trim().toLowerCase();
  // Matches dish names, tags ("vegan", "spicy") and categories ("lunch").
  const results = q
    ? dishes.filter((d) =>
        [d.name, d.tag, categoryLabel(d.category)].some((field) => field.toLowerCase().includes(q))
      )
    : dishes.slice(0, 4);

  useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const choose = (dishId: string) => {
    onClose();
    navigate(`/menu?dish=${dishId}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[highlighted]) {
      e.preventDefault();
      choose(results[highlighted].id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 flex items-start justify-center px-4 pt-[10vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the menu"
        onKeyDown={onKeyDown}
        className="w-full max-w-[560px] bg-cream rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 border-b border-card-line">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-green-deep flex-shrink-0">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            placeholder="Search dishes, like vegan or salad"
            aria-label="Search dishes"
            aria-controls="search-results"
            aria-activedescendant={results[highlighted] ? `result-${results[highlighted].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            className="flex-1 bg-transparent py-4 text-base outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-muted bg-white rounded-full border border-card-line px-2.5 py-1"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!q && <p className="text-xs font-semibold text-muted px-3 pt-2 pb-1">Popular dishes</p>}

          {results.length === 0 ? (
            <p className="text-sm text-ink/70 px-3 py-8 text-center">
              No dishes match "{query.trim()}". Try a dish name or a word like vegan or spicy.
            </p>
          ) : (
            <ul id="search-results" role="listbox" aria-label="Dishes">
              {results.map((dish, i) => (
                <li
                  key={dish.id}
                  id={`result-${dish.id}`}
                  role="option"
                  aria-selected={i === highlighted}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => choose(dish.id)}
                  className={`flex items-center gap-4 rounded-2xl px-3 py-2.5 cursor-pointer ${
                    i === highlighted ? "bg-card" : ""
                  }`}
                >
                  <FoodImage src={dish.image} alt="" blobs={dish.blobs} shape="circle" size={44} />
                  <span className="flex-1 min-w-0">
                    <span className="block font-display font-bold text-sm">{dish.name}</span>
                    <span className="block text-xs text-muted">
                      {categoryLabel(dish.category)}, {dish.tag}
                    </span>
                  </span>
                  <span className="text-sm font-bold text-green-deep">{formatPrice(dish.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}