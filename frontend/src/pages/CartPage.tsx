import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { DELIVERY_FEE, useCartLines } from "../lib/cart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FoodImage from "../components/FoodImage";
import { usePageTitle } from "../lib/usePageTitle";

export default function CartPage() {
  usePageTitle("Your cart");
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { lines, subtotal, itemCount, total } = useCartLines();

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[1180px] mx-auto px-6 md:px-11 w-full pt-6 pb-20">
        <h1 className="font-display font-extrabold text-[2.6rem] leading-none tracking-tight text-green-deep mb-10">
          Your cart
        </h1>

        {lines.length === 0 ? (
          <div className="bg-card rounded-[28px] px-6 py-16 flex flex-col items-center text-center">
            <h2 className="font-display font-bold text-xl text-green-deep mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-ink/70 mb-7">
              Pick a few dishes from the menu and they'll show up here.
            </p>
            <Link
              to="/menu"
              className="bg-green-deep text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-10">
            <ul className="flex-1 w-full flex flex-col gap-4" aria-label="Cart items">
              {lines.map(({ dish, quantity }) => (
                <li
                  key={dish.id}
                  className="bg-card rounded-[24px] p-4 sm:p-5 flex items-center gap-4 sm:gap-5 flex-wrap sm:flex-nowrap"
                >
                  <FoodImage src={dish.image} alt={dish.imageAlt ?? dish.name} blobs={dish.blobs} shape="circle" size={80} />

                  <div className="flex-1 min-w-[140px]">
                    <h2 className="font-display font-bold text-base">{dish.name}</h2>
                    <p className="text-sm text-muted mt-0.5">${dish.price.toFixed(2)} each</p>
                    <button
                      type="button"
                      onClick={() => removeItem(dish.id)}
                      className="text-xs font-semibold text-green-deep mt-2 border-b border-gold pb-0.5"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-4 bg-white rounded-full px-4 py-1.5 border border-card-line">
                    <button
                      type="button"
                      aria-label={`Decrease ${dish.name} quantity`}
                      onClick={() => setQuantity(dish.id, quantity - 1)}
                      className="w-[26px] h-[26px] rounded-full bg-cream-deep text-green-deep flex items-center justify-center"
                    >
                      –
                    </button>
                    <span className="font-bold min-w-[16px] text-center" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${dish.name} quantity`}
                      onClick={() => setQuantity(dish.id, quantity + 1)}
                      className="w-[26px] h-[26px] rounded-full bg-cream-deep text-green-deep flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-display font-bold text-green-deep min-w-[72px] text-right">
                    ${(dish.price * quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <aside className="w-full lg:w-[340px] bg-white rounded-[28px] border border-card-line p-6 lg:sticky lg:top-6">
              <h2 className="font-display font-bold text-lg text-green-deep mb-5">
                Order summary
              </h2>
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/70">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </dt>
                  <dd className="font-semibold">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/70">Delivery</dt>
                  <dd className="font-semibold">${DELIVERY_FEE.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-card-line pt-3 mt-1 text-base">
                  <dt className="font-display font-bold text-green-deep">Total</dt>
                  <dd className="font-display font-bold text-green-deep">${total.toFixed(2)}</dd>
                </div>
              </dl>

              <Link
                to="/checkout"
                className="block text-center w-full bg-green-deep text-white rounded-full py-3.5 text-sm font-semibold hover:bg-green transition-colors mt-6"
              >
                Go to checkout
              </Link>
              <Link
                to="/menu"
                className="block text-center text-sm font-semibold text-green-deep mt-4"
              >
                Keep ordering
              </Link>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}