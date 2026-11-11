import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Order } from "../types";
import { dishes } from "../data/dishes";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../lib/cart";
import {
  type OrderTab,
  formatOrderDate,
  progressSteps,
  statusLabel,
  tabForStatus,
  useAllOrders,
} from "../lib/orders";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePageTitle } from "../lib/usePageTitle";

const tabs: { id: OrderTab; label: string; empty: string }[] = [
  { id: "active", label: "Active", empty: "No orders on the way right now." },
  { id: "past", label: "Past", empty: "Delivered orders will show up here." },
  { id: "cancelled", label: "Cancelled", empty: "No cancelled or failed orders." },
];

export default function OrdersPage() {
  usePageTitle("My orders");
  const orders = useAllOrders();

  const countFor = (tab: OrderTab) => orders.filter((o) => tabForStatus[o.status] === tab).length;
  const [activeTab, setActiveTab] = useState<OrderTab>(() =>
    countFor("active") > 0 ? "active" : "past"
  );
  const visible = orders.filter((o) => tabForStatus[o.status] === activeTab);
  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[860px] mx-auto px-6 w-full pt-6 pb-20">
        <h1 className="font-display font-extrabold text-[2.6rem] leading-none tracking-tight text-green-deep mb-8">
          My orders
        </h1>

        <div className="flex flex-wrap gap-2.5 mb-8" role="tablist" aria-label="Order groups">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="orders-panel"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gold border-gold text-green-deep"
                    : "bg-white border-card-line text-ink hover:border-gold"
                }`}
              >
                {tab.label}
                <span className={`text-xs ${isActive ? "opacity-75" : "opacity-60"}`}>
                  {countFor(tab.id)}
                </span>
              </button>
            );
          })}
        </div>

        <div id="orders-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {visible.length === 0 ? (
            <div className="bg-card rounded-[28px] px-6 py-14 text-center">
              <p className="text-sm text-ink/70 mb-6">{current.empty}</p>
              <Link
                to="/menu"
                className="inline-block bg-green-deep text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {visible.map((order) => (
                <li key={order.number}>
                  <OrderCard order={order} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const tab = tabForStatus[order.status];

  // Only dishes still on the menu can be ordered again.
  const reorderable = order.lines.filter((line) => dishes.some((d) => d.id === line.dishId));

  const reorder = () => {
    reorderable.forEach((line) => addItem(line.dishId, line.quantity));
    navigate("/cart");
  };

  return (
    <article className="bg-card rounded-[24px] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h2 className="font-display font-bold text-base flex items-center gap-2 flex-wrap">
            Order {order.number}
            {order.isSample && (
              <span className="text-[0.68rem] font-semibold text-muted bg-white rounded-full px-2.5 py-0.5 border border-card-line">
                Sample
              </span>
            )}
          </h2>
          <p className="text-sm text-muted mt-0.5">{formatOrderDate(order.placedAt)}</p>
        </div>
        <StatusBadge order={order} />
      </div>

      {tab === "active" && <Progress order={order} />}

      {order.statusNote && (
        <p className="text-sm bg-white rounded-2xl border border-card-line px-4 py-3 mb-4">
          {order.statusNote}
        </p>
      )}

      <ul className="flex flex-col gap-1.5 text-sm mb-4">
        {order.lines.map((line) => (
          <li key={line.dishId} className="flex justify-between gap-3">
            <span>
              <span className="font-semibold">{line.quantity}×</span> {line.name}
            </span>
            <span className="font-semibold whitespace-nowrap">{formatPrice(line.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 flex-wrap border-t border-card-line pt-4">
        <div className="text-sm">
          <span className="text-ink/70">Total </span>
          <span className="font-display font-bold text-green-deep">{formatPrice(order.total)}</span>
          <span className="text-ink/70"> to {order.address}</span>
        </div>

        {tab === "active" && (
          <Link
            to={`/orders/${order.number}`}
            className="bg-green-deep text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-green transition-colors"
          >
            Track order
          </Link>
        )}

        {tab !== "active" && reorderable.length > 0 && (
          <button
            type="button"
            onClick={reorder}
            className="bg-green-deep text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-green transition-colors"
          >
            {tab === "past" ? "Reorder" : "Order again"}
          </button>
        )}
      </div>
    </article>
  );
}

function StatusBadge({ order }: { order: Order }) {
  const tab = tabForStatus[order.status];
  const style =
    tab === "active"
      ? "bg-gold text-green-deep border-gold"
      : tab === "past"
        ? "bg-white text-green-deep border-card-line"
        : "bg-white text-[#B8321F] border-[#E9B8AE]";

  return (
    <span className={`text-xs font-semibold rounded-full border px-3 py-1.5 ${style}`}>
      {statusLabel[order.status]}
    </span>
  );
}

function Progress({ order }: { order: Order }) {
  const currentIndex = progressSteps.indexOf(order.status);

  return (
    <ol className="grid grid-cols-4 gap-2 mb-5" aria-label="Delivery progress">
      {progressSteps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li
            key={step}
            aria-current={i === currentIndex ? "step" : undefined}
            className="flex flex-col gap-2"
          >
            <span
              className={`h-1.5 rounded-full ${done ? "bg-green-deep" : "bg-white border border-card-line"}`}
            />
            <span className={`text-xs ${i === currentIndex ? "font-bold text-green-deep" : done ? "text-ink/80" : "text-muted"}`}>
              {statusLabel[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
