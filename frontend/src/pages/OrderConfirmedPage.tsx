import { Link, useParams } from "react-router-dom";
import { useOrdersStore } from "../store/ordersStore";
import { useCurrentUser } from "../store/authStore";
import { formatPrice } from "../lib/cart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePageTitle } from "../lib/usePageTitle";

export default function OrderConfirmedPage() {
  usePageTitle("Order confirmed");
  const { orderNumber } = useParams();
  const user = useCurrentUser();
  const order = useOrdersStore((state) => state.orders.find((o) => o.number === orderNumber));

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[720px] mx-auto px-6 w-full pt-10 pb-20">
        {!order ? (
          <div className="text-center">
            <h1 className="font-display font-extrabold text-3xl text-green-deep mb-3">
              Order not found
            </h1>
            <p className="text-sm text-ink/70 mb-7">
              We couldn't find that order on this device. Your recent orders are under My orders.
            </p>
            <Link
              to="/orders"
              className="inline-block bg-green-deep text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
            >
              Go to My orders
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div
                className="w-16 h-16 rounded-full bg-green-deep text-cream flex items-center justify-center mx-auto mb-6"
                aria-hidden="true"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5L10 17.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="font-display font-extrabold text-[2.2rem] leading-tight tracking-tight text-green-deep mb-3">
                Thanks, {order.name.split(" ")[0]}. Your order is in.
              </h1>
              <p className="text-base text-ink/75">
                Order <strong className="font-bold text-ink">{order.number}</strong> is being
                prepared now.
              </p>
            </div>

            <div className="bg-card rounded-[28px] p-6 sm:p-8">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm mb-7">
                <Detail label="Delivering to" value={order.address} />
                <Detail label="Arriving" value={order.deliveryTime} />
                <Detail label="Payment" value={order.payment} />
                {order.instructions && <Detail label="Note for the courier" value={order.instructions} />}
              </dl>

              <ul className="flex flex-col gap-2.5 text-sm border-t border-card-line pt-5">
                {order.lines.map((line) => (
                  <li key={line.dishId} className="flex justify-between gap-3">
                    <span>
                      <span className="font-semibold">{line.quantity}×</span> {line.name}
                    </span>
                    <span className="font-semibold">{formatPrice(line.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-card-line pt-4 mt-4 font-display font-bold text-green-deep">
                <span>Total, including delivery</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            {!user && (
              <div className="bg-white border border-card-line rounded-[24px] px-6 py-5 mt-6 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm">
                  <strong className="font-bold text-green-deep">Save your details for next time.</strong>{" "}
                  With an account, checkout fills itself in.
                </p>
                <Link
                  to="/signup"
                  className="bg-white border border-green-deep rounded-full px-5 py-2.5 text-sm font-semibold text-green-deep hover:bg-green-deep hover:text-white transition-colors"
                >
                  Create an account
                </Link>
              </div>
            )}

            <div className="flex items-center justify-center gap-6 flex-wrap mt-8">
              <Link
                to={`/orders/${order.number}`}
                className="inline-block bg-green-deep text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
              >
                Track this order
              </Link>
              <Link
                to="/"
                className="text-sm font-semibold text-green-deep border-b-2 border-gold pb-1"
              >
                Back to home
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted font-semibold text-xs mb-1">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}