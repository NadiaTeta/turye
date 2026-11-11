import { useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { DELIVERY_FEE, formatPrice, useCartLines } from "../lib/cart";
import type { Order } from "../types";
import { useOrdersStore } from "../store/ordersStore";
import { useCurrentUser } from "../store/authStore";
import Header from "../components/Header";
import { FieldError, TextField, inputClass } from "../components/form";
import Footer from "../components/Footer";
import { usePageTitle } from "../lib/usePageTitle";

// Kitchen hours, matching the footer (7:00 AM – 10:00 PM).
const OPEN_HOUR = 7;
const CLOSE_HOUR = 22;

type DeliveryTime = "asap" | "scheduled";
type PaymentMethod = "cash" | "card";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  street: string;
  apartment: string;
  instructions: string;
}

type FormErrors = Partial<Record<keyof FormValues | "slot", string>>;

const emptyForm: FormValues = {
  name: "",
  phone: "",
  email: "",
  street: "",
  apartment: "",
  instructions: "",
};

// Delivery slots every 30 minutes, starting at least 45 minutes from now,
// with the last slot 30 minutes before closing.
function getTodaySlots(now: Date) {
  const earliest = new Date(now.getTime() + 45 * 60 * 1000);
  const slot = new Date(now);
  slot.setSeconds(0, 0);
  slot.setMinutes(slot.getMinutes() < 30 ? 30 : 60);
  if (slot.getHours() < OPEN_HOUR) slot.setHours(OPEN_HOUR, 30, 0, 0);

  const last = new Date(now);
  last.setHours(CLOSE_HOUR - 1, 30, 0, 0);

  const slots: string[] = [];
  while (slot <= last) {
    if (slot >= earliest) {
      slots.push(slot.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    }
    slot.setMinutes(slot.getMinutes() + 30);
  }
  return slots;
}

function validate(values: FormValues, deliveryTime: DeliveryTime, slot: string): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a phone number the courier can call.";
  }
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email, or leave it blank.";
  }
  if (!values.street.trim()) errors.street = "Enter the street address for delivery.";
  if (deliveryTime === "scheduled" && !slot) errors.slot = "Pick a delivery time.";
  return errors;
}

export default function CheckoutPage() {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const { lines, subtotal, itemCount, total } = useCartLines();

  const user = useCurrentUser();
  const defaultAddress = user?.addresses.find((a) => a.isDefault);

  // Logged-in customers start with their details and default address filled in.
  const [values, setValues] = useState<FormValues>(() =>
    user
      ? {
          ...emptyForm,
          name: user.name,
          phone: user.phone,
          email: user.email,
          street: defaultAddress?.street ?? "",
          apartment: defaultAddress?.apartment ?? "",
        }
      : emptyForm
  );
  const [addressId, setAddressId] = useState<string | null>(defaultAddress?.id ?? null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>("asap");
  const [slot, setSlot] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const placingOrder = useRef(false);

  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;
  const slots = useMemo(() => getTodaySlots(now), [now]);

  // Nothing to check out: send them back to the cart.
  // (Skipped while placing an order, since the cart is cleared on the way out.)
  if (lines.length === 0 && !placingOrder.current) {
    return <Navigate to="/cart" replace />;
  }

  const update = (field: keyof FormValues) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values, deliveryTime, slot);
    setErrors(found);

    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`field-${firstError}`)?.focus();
      return;
    }

    const order: Order = {
      number: `TY-${Math.floor(100000 + Math.random() * 900000)}`,
      placedAt: new Date().toISOString(),
      status: "placed",
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: [values.street.trim(), values.apartment.trim()].filter(Boolean).join(", "),
      deliveryTime: deliveryTime === "asap" ? "As soon as possible (about 30 minutes)" : `Today at ${slot}`,
      instructions: values.instructions.trim(),
      payment: payment === "cash" ? "Cash on delivery" : "Card on delivery",
      lines: lines.map(({ dish, quantity }) => ({
        dishId: dish.id,
        name: dish.name,
        quantity,
        lineTotal: dish.price * quantity,
      })),
      total,
    };

    placingOrder.current = true;
    addOrder(order);
    navigate(`/order-confirmed/${order.number}`, { replace: true });
    clearCart();
  };

  const canOrder = isOpen && (slots.length > 0 || deliveryTime === "asap");

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[1180px] mx-auto px-6 md:px-11 w-full pt-6 pb-20">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-deep mb-6"
        >
          ← Back to cart
        </Link>
        <h1 className="font-display font-extrabold text-[2.6rem] leading-none tracking-tight text-green-deep mb-10">
          Checkout
        </h1>

        {!user && (
          <p className="bg-white border border-card-line rounded-2xl px-5 py-4 text-sm mb-8">
            Have an account?{" "}
            <Link to="/login?next=/checkout" className="font-semibold text-green-deep border-b border-gold pb-0.5">
              Log in
            </Link>{" "}
            to use your saved details and addresses.
          </p>
        )}

        {!isOpen && (
          <p className="bg-cream-deep border border-card-line rounded-2xl px-5 py-4 text-sm mb-8">
            The kitchen is closed right now. We take orders daily from 7:00 AM to 10:00 PM.
          </p>
        )}

        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row items-start gap-10"
        >
          <div className="flex-1 w-full flex flex-col gap-6">
            <Section title="Your details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  id="name"
                  label="Full name"
                  autoComplete="name"
                  value={values.name}
                  onChange={update("name")}
                  error={errors.name}
                />
                <TextField
                  id="phone"
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={update("phone")}
                  error={errors.phone}
                />
              </div>
              <TextField
                id="email"
                label="Email (optional, for your receipt)"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update("email")}
                error={errors.email}
              />
            </Section>

            <Section title="Delivery address">
              {user && user.addresses.length > 0 && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Saved addresses">
                  {user.addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      aria-pressed={addressId === address.id}
                      onClick={() => {
                        setAddressId(address.id);
                        setValues((v) => ({ ...v, street: address.street, apartment: address.apartment }));
                        setErrors((e) => ({ ...e, street: undefined }));
                      }}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        addressId === address.id
                          ? "bg-gold border-gold text-green-deep"
                          : "bg-white border-card-line hover:border-gold"
                      }`}
                    >
                      {address.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-pressed={addressId === null}
                    onClick={() => {
                      setAddressId(null);
                      setValues((v) => ({ ...v, street: "", apartment: "" }));
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      addressId === null
                        ? "bg-gold border-gold text-green-deep"
                        : "bg-white border-card-line hover:border-gold"
                    }`}
                  >
                    New address
                  </button>
                </div>
              )}
              <TextField
                id="street"
                label="Street address"
                autoComplete="street-address"
                value={values.street}
                onChange={(v) => {
                  update("street")(v);
                  setAddressId(null);
                }}
                error={errors.street}
              />
              <TextField
                id="apartment"
                label="Apartment, floor, or building (optional)"
                value={values.apartment}
                onChange={update("apartment")}
              />
              <TextField
                id="instructions"
                label="Note for the courier (optional)"
                multiline
                value={values.instructions}
                onChange={update("instructions")}
              />
            </Section>

            <Section title="Delivery time">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Delivery time">
                <Choice
                  name="delivery-time"
                  checked={deliveryTime === "asap"}
                  onSelect={() => setDeliveryTime("asap")}
                  title="As soon as possible"
                  detail="About 30 minutes"
                />
                <Choice
                  name="delivery-time"
                  checked={deliveryTime === "scheduled"}
                  onSelect={() => setDeliveryTime("scheduled")}
                  title="Schedule for later"
                  detail="Pick a time today"
                  disabled={slots.length === 0}
                />
              </div>

              {deliveryTime === "scheduled" && (
                <div>
                  <label htmlFor="field-slot" className="block text-sm font-semibold mb-1.5">
                    Delivery time
                  </label>
                  <select
                    id="field-slot"
                    value={slot}
                    onChange={(e) => {
                      setSlot(e.target.value);
                      setErrors((er) => ({ ...er, slot: undefined }));
                    }}
                    aria-invalid={Boolean(errors.slot)}
                    aria-describedby={errors.slot ? "error-slot" : undefined}
                    className={inputClass(Boolean(errors.slot))}
                  >
                    <option value="">Choose a time</option>
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.slot && <FieldError id="error-slot">{errors.slot}</FieldError>}
                </div>
              )}
              {slots.length === 0 && isOpen && (
                <p className="text-sm text-muted">No more scheduled slots today.</p>
              )}
            </Section>

            <Section title="Payment">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Payment method">
                <Choice
                  name="payment"
                  checked={payment === "cash"}
                  onSelect={() => setPayment("cash")}
                  title="Cash on delivery"
                  detail="Pay the courier at your door"
                />
                <Choice
                  name="payment"
                  checked={payment === "card"}
                  onSelect={() => setPayment("card")}
                  title="Card on delivery"
                  detail="The courier brings a card reader"
                />
              </div>
            </Section>
          </div>

          <aside className="w-full lg:w-[340px] bg-white rounded-[28px] border border-card-line p-6 lg:sticky lg:top-6">
            <h2 className="font-display font-bold text-lg text-green-deep mb-5">Your order</h2>

            <ul className="flex flex-col gap-2.5 text-sm mb-5">
              {lines.map(({ dish, quantity }) => (
                <li key={dish.id} className="flex justify-between gap-3">
                  <span>
                    <span className="font-semibold">{quantity}×</span> {dish.name}
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatPrice(dish.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="flex flex-col gap-3 text-sm border-t border-card-line pt-4">
              <div className="flex justify-between">
                <dt className="text-ink/70">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Delivery</dt>
                <dd className="font-semibold">{formatPrice(DELIVERY_FEE)}</dd>
              </div>
              <div className="flex justify-between border-t border-card-line pt-3 mt-1 text-base">
                <dt className="font-display font-bold text-green-deep">Total</dt>
                <dd className="font-display font-bold text-green-deep">{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={!canOrder}
              className="w-full bg-green-deep text-white rounded-full py-3.5 text-sm font-semibold hover:bg-green transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-deep"
            >
              Place order — {formatPrice(total)}
            </button>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="bg-card rounded-[24px] p-5 sm:p-6 flex flex-col gap-4 border-0 m-0 min-w-0">
      <legend className="font-display font-bold text-lg text-green-deep float-left w-full mb-1">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Choice({
  name,
  checked,
  onSelect,
  title,
  detail,
  disabled = false,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-white border-card-line"
          : checked
            ? "bg-white border-gold cursor-pointer"
            : "bg-white border-card-line hover:border-gold cursor-pointer"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="mt-1 accent-green-deep"
      />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted mt-0.5">{detail}</span>
      </span>
    </label>
  );
}