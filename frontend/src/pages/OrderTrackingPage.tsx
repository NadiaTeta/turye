import { Link, useParams } from "react-router-dom";
import type { Order } from "../types";
import { formatPrice } from "../lib/cart";
import {
  estimatedArrival,
  formatOrderDate,
  progressSteps,
  statusLabel,
  stepDescription,
  tabForStatus,
  useAllOrders,
} from "../lib/orders";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePageTitle } from "../lib/usePageTitle";

export default function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const order = useAllOrders().find((o) => o.number === orderNumber);
  usePageTitle(order ? `Track order ${order.number}` : "Order not found");

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[860px] mx-auto px-6 w-full pt-6 pb-20">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-deep mb-8"
        >
          ← Back to My orders
        </Link>

        {!order ? (
          <div className="bg-card rounded-[28px] px-6 py-14 text-center">
            <h1 className="font-display font-bold text-2xl text-green-deep mb-3">Order not found</h1>
            <p className="text-sm text-ink/70">
              We couldn't find order {orderNumber} on this device.
            </p>
          </div>
        ) : (
          <Tracking order={order} />
        )}
      </main>

      <Footer />
    </div>
  );
}

function Tracking({ order }: { order: Order }) {
  const tab = tabForStatus[order.status];
  const isActive = tab === "active";
  const stopped = tab === "cancelled";

  return (
    <>
      <p className="text-sm text-muted mb-2">
        Order {order.number}, placed {formatOrderDate(order.placedAt)}
      </p>
      <h1 className="font-display font-extrabold text-[2.4rem] leading-[1.1] tracking-tight text-green-deep mb-3">
        {statusLabel[order.status]}
      </h1>
      <p className="text-base text-ink/80 mb-10">
        {isActive ? (
          <>
            Estimated arrival around{" "}
            <strong className="font-bold text-ink">{estimatedArrival(order)}</strong>
          </>
        ) : (
          stepDescription[order.status]
        )}
      </p>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <section
          className="flex-1 w-full bg-card rounded-[28px] p-6 sm:p-8"
          aria-labelledby="progress-heading"
        >
          <h2 id="progress-heading" className="font-display font-bold text-lg text-green-deep mb-6">
            Progress
          </h2>

          {stopped ? (
            <p className="text-sm bg-white rounded-2xl border border-card-line px-4 py-3">
              {order.statusNote ?? stepDescription[order.status]}
            </p>
          ) : (
            <Timeline order={order} />
          )}
        </section>

        <aside className="w-full md:w-[320px] flex flex-col gap-6">
          <section className="bg-white rounded-[28px] border border-card-line p-6" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="font-display font-bold text-lg text-green-deep mb-4">
              Delivery
            </h2>
            <dl className="flex flex-col gap-4 text-sm">
              <Detail label="Address" value={order.address} />
              {order.instructions && <Detail label="Note for the courier" value={order.instructions} />}
              <Detail label="Delivery time" value={order.deliveryTime} />
              <Detail label="Contact phone" value={order.phone} />
              <Detail label="Payment" value={order.payment} />
            </dl>
          </section>

          <section className="bg-white rounded-[28px] border border-card-line p-6" aria-labelledby="items-heading">
            <h2 id="items-heading" className="font-display font-bold text-lg text-green-deep mb-4">
              Items
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {order.lines.map((line) => (
                <li key={line.dishId} className="flex justify-between gap-3">
                  <span>
                    <span className="font-semibold">{line.quantity}×</span> {line.name}
                  </span>
                  <span className="font-semibold whitespace-nowrap">{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-card-line pt-3 mt-4 font-display font-bold text-green-deep">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Timeline({ order }: { order: Order }) {
  const currentIndex = progressSteps.indexOf(order.status);

  return (
    <ol className="flex flex-col" aria-label="Delivery progress">
      {progressSteps.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const isLast = i === progressSteps.length - 1;
        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done || current
                    ? "bg-green-deep text-cream"
                    : "bg-white border-2 border-card-line"
                } ${current && step !== "delivered" ? "ring-4 ring-gold/40" : ""}`}
                aria-hidden="true"
              >
                {(done || (current && step === "delivered")) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5L10 17.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {current && step !== "delivered" && <span className="w-2 h-2 rounded-full bg-gold" />}
              </span>
              {!isLast && (
                <span className={`w-0.5 flex-1 min-h-[28px] my-1 ${done ? "bg-green-deep" : "bg-card-line"}`} />
              )}
            </div>
            <div className={isLast ? "" : "pb-6"}>
              <p className={`text-sm font-bold ${done || current ? "text-green-deep" : "text-muted"}`}>
                {statusLabel[step]}
              </p>
              {(done || current) && (
                <p className="text-sm text-ink/70 mt-0.5">{stepDescription[step]}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
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
