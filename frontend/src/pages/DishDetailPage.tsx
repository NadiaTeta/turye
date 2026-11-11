import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dishes } from "../data/dishes";
import { useCartStore } from "../store/cartStore";
import Header from "../components/Header";
import PlateVisual from "../components/PlateVisual";
import Footer from "../components/Footer";

export default function DishDetailPage() {
  const { dishId } = useParams();
  const dish = dishes.find((d) => d.id === dishId);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (!dish) {
    return (
      <div className="bg-cream min-h-screen flex flex-col">
        <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
          <Header />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display font-bold text-2xl text-green-deep mb-3">
            Dish not found
          </h1>
          <p className="text-sm text-ink/70 mb-6">
            That item isn't on the menu — it may have been removed.
          </p>
          <Link
            to="/menu"
            className="bg-green-deep text-white rounded-full px-6 py-3 text-sm font-semibold"
          >
            Back to the menu
          </Link>
        </div>
      </div>
    );
  }

  const related = dishes.filter((d) => d.id !== dish.id).slice(0, 3);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11">
        <Header />

        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-deep mb-8"
        >
          ← Back to the menu
        </Link>

        <div className="flex items-start gap-14 flex-wrap md:flex-nowrap pb-16">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <PlateVisual
              blobs={dish.blobs}
              size={320}
              className="shadow-[0_20px_48px_rgba(27,42,32,0.18)]"
            />
          </div>

          <div className="flex-1 min-w-[280px]">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display font-extrabold text-3xl text-green-deep">
                {dish.name}
              </h1>
              <span className="font-display font-bold text-2xl text-green-deep whitespace-nowrap">
                ${dish.price.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Tag>{dish.weight}</Tag>
              <Tag>{dish.kcal}</Tag>
              <Tag>{dish.tag}</Tag>
            </div>

            <p className="text-base leading-relaxed text-ink/80 mb-8 max-w-md">
              {dish.desc ??
                `A fresh, seasonal take on ${dish.name.toLowerCase()} — made to order with ingredients sourced daily.`}
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-5 bg-white rounded-full px-5 py-2.5 border border-card-line">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full bg-cream-deep text-green-deep flex items-center justify-center text-lg"
                >
                  –
                </button>
                <span className="font-bold min-w-[16px] text-center">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-7 h-7 rounded-full bg-cream-deep text-green-deep flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addItem(dish.id, qty);
                  setAdded(true);
                }}
                className="bg-green-deep text-white rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
              >
                Add to cart — ${(dish.price * qty).toFixed(2)}
              </button>
            </div>

            {added && (
              <p className="text-sm font-semibold text-green-deep mt-4">
                Added to cart.
              </p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="pb-20">
            <h2 className="font-display font-extrabold text-2xl text-green-deep mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/dish/${item.id}`}
                  className="bg-card rounded-[24px] p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
                >
                  <PlateVisual blobs={item.blobs} size={110} className="mb-3.5" />
                  <span className="font-display font-bold text-sm">{item.name}</span>
                  <span className="text-green-deep font-bold text-sm mt-1">
                    ${item.price.toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold text-muted bg-white rounded-full px-3 py-1.5 border border-card-line">
      {children}
    </span>
  );
}