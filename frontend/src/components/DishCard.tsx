import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Dish } from "../types";
import { useCartStore } from "../store/cartStore";
import FoodImage from "./FoodImage";

interface Props {
  dish: Dish;
  isActive: boolean;
  onToggle: () => void;
}

export default function DishCard({ dish, isActive, onToggle }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Clear the "Added" confirmation after a moment.
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <article
      id={`dish-${dish.id}`}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`bg-card rounded-[28px] p-3.5 pb-5 flex flex-col items-center text-center shadow-[0_10px_24px_rgba(27,42,32,0.08)] cursor-pointer border transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        isActive ? "border-[rgba(27,67,50,0.15)]" : "border-transparent"
      }`}
    >
      <FoodImage src={dish.image} alt={dish.imageAlt ?? dish.name} blobs={dish.blobs} shape="tile" size={150} className="mb-4" />

      <div className="font-display font-bold text-base flex items-center justify-between w-full gap-2 px-1.5 text-left">
        <span>{dish.name}</span>
        <span className="text-green-deep font-bold">${dish.price.toFixed(2)}</span>
      </div>

      {isActive && (
        <div className="flex flex-col items-center gap-3.5 w-full mt-4 px-1.5">
          <div className="flex items-center gap-[18px] bg-white rounded-full px-[18px] py-1.5 border border-card-line">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={(e) => {
                e.stopPropagation();
                setQty((q) => Math.max(1, q - 1));
              }}
              className="w-[22px] h-[22px] rounded-full bg-cream-deep text-green-deep flex items-center justify-center"
            >
              –
            </button>
            <span className="font-bold min-w-[14px]">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={(e) => {
                e.stopPropagation();
                setQty((q) => q + 1);
              }}
              className="w-[22px] h-[22px] rounded-full bg-cream-deep text-green-deep flex items-center justify-center"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addItem(dish.id, qty);
              setAdded(true);
              setHasAdded(true);
              setQty(1);
            }}
            className="w-full bg-green-deep text-white rounded-full py-3 text-sm font-semibold hover:bg-green transition-colors"
          >
            {added ? "Added to cart" : `Add to cart — $${(dish.price * qty).toFixed(2)}`}
          </button>

          {hasAdded && (
            <Link
              to="/cart"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-green-deep border-b border-gold pb-0.5"
            >
              View cart
            </Link>
          )}
        </div>
      )}
    </article>
  );
}