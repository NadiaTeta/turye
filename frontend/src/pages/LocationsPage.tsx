import { useState } from "react";
import { Link } from "react-router-dom";
import { deliveryAreas, locations, type Location } from "../data/locations";
import { DELIVERY_FEE, formatPrice } from "../lib/cart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePageTitle } from "../lib/usePageTitle";

export default function LocationsPage() {
  usePageTitle("Locations");
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[1180px] mx-auto px-6 md:px-11 w-full pt-6 pb-20">
        <h1 className="font-display font-extrabold text-[2.6rem] leading-none tracking-tight text-green-deep mb-3">
          Visit us or order in
        </h1>
        <p className="text-base text-ink/75 mb-10 max-w-lg">
          Eat with us at the restaurant, pick up on your way home, or have it delivered to your door.
        </p>

        <div className="flex flex-col gap-6">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>

        <DeliveryChecker />
      </main>

      <Footer />
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  const query = location.mapQuery || location.address.join(", ");
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  return (
    <section
      className="bg-card rounded-[32px] p-6 md:p-8 flex flex-col lg:flex-row gap-8"
      aria-labelledby={`location-${location.id}`}
    >
      <div className="flex-1 min-w-0 flex flex-col">
        {location.image && (
          <img
            src={location.image}
            alt={location.imageAlt ?? ""}
            loading="lazy"
            className="w-full aspect-[16/9] object-cover rounded-[22px] mb-6"
          />
        )}
        <h2
          id={`location-${location.id}`}
          className="font-display font-extrabold text-2xl text-green-deep mb-4"
        >
          {location.name}
        </h2>

        <ul className="flex flex-wrap gap-2 mb-6" aria-label="Available at this location">
          {location.services.map((service) => (
            <li
              key={service}
              className="text-xs font-semibold text-green-deep bg-white rounded-full px-3 py-1.5 border border-card-line"
            >
              {service}
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
          <div>
            <dt className="text-muted font-semibold text-xs mb-1.5">Address</dt>
            <dd className="font-semibold leading-relaxed">
              {location.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-semibold text-xs mb-1.5">Hours</dt>
            <dd className="font-semibold leading-relaxed">
              {location.hours.map((h) => (
                <span key={h.days} className="block">
                  {h.days}
                  <br />
                  {h.time}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-semibold text-xs mb-1.5">Phone</dt>
            <dd>
              <a
                href={`tel:${location.phone.replace(/\s/g, "")}`}
                className="font-semibold border-b border-gold pb-0.5"
              >
                {location.phone}
              </a>
            </dd>
          </div>
        </dl>

        {location.note && <p className="text-sm text-ink/75 mb-6">{location.note}</p>}

        <div className="flex flex-wrap items-center gap-4 mt-auto">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-deep text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-green transition-colors"
          >
            Get directions
          </a>
          <Link
            to="/menu"
            className="text-sm font-semibold text-green-deep border-b-2 border-gold pb-1"
          >
            Order for delivery
          </Link>
        </div>
      </div>

      <div className="lg:w-[46%] min-h-[280px] rounded-[24px] overflow-hidden bg-cream-deep border border-card-line">
        {location.mapQuery ? (
          <iframe
            title={`Map showing ${location.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`}
            className="w-full h-full min-h-[280px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center text-center p-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mb-3 text-green-deep">
              <path
                d="M12 21C12 21 5 14.5 5 9.5C5 5.91 8.13 3 12 3C15.87 3 19 5.91 19 9.5C19 14.5 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="text-sm text-muted max-w-[220px]">
              The map appears here once the address is added in data/locations.ts.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function DeliveryChecker() {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<string | null>(null);

  const search = checked?.trim().toLowerCase() ?? "";
  const match = search
    ? deliveryAreas.find(
        (a) => a.name.toLowerCase().includes(search) || search.includes(a.name.toLowerCase())
      )
    : undefined;

  return (
    <section className="mt-14" aria-labelledby="delivery-heading">
      <h2 id="delivery-heading" className="font-display font-extrabold text-2xl text-green-deep mb-2">
        Do we deliver to you?
      </h2>
      <p className="text-sm text-ink/75 mb-6">
        Delivery is {formatPrice(DELIVERY_FEE)} to every area we cover.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(query);
        }}
        className="flex flex-wrap gap-3 max-w-xl mb-5"
      >
        <label htmlFor="area-search" className="sr-only">
          Your neighbourhood
        </label>
        <input
          id="area-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setChecked(null);
          }}
          placeholder="Enter your neighbourhood"
          className="flex-1 min-w-[220px] bg-white rounded-full border border-card-line px-5 py-3 text-sm outline-none focus:border-green-deep focus-visible:ring-2 focus-visible:ring-gold/40"
        />
        <button
          type="submit"
          className="bg-green-deep text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-green transition-colors"
        >
          Check
        </button>
      </form>

      <div aria-live="polite">
        {search && match && (
          <p className="bg-white rounded-2xl border border-gold px-5 py-4 text-sm max-w-xl mb-6">
            <strong className="font-bold text-green-deep">Yes, we deliver to {match.name}.</strong>{" "}
            Orders usually arrive in {match.minutes}.{" "}
            <Link to="/menu" className="font-semibold text-green-deep border-b border-gold pb-0.5">
              Start your order
            </Link>
          </p>
        )}
        {search && !match && (
          <p className="bg-white rounded-2xl border border-card-line px-5 py-4 text-sm max-w-xl mb-6">
            <strong className="font-bold">We don't deliver to "{checked?.trim()}" yet.</strong>{" "}
            You're welcome to visit us or order takeaway instead.
          </p>
        )}
      </div>

      <p className="text-xs text-muted font-semibold mb-2.5">Areas we deliver to</p>
      <ul className="flex flex-wrap gap-2.5">
        {deliveryAreas.map((area) => (
          <li
            key={area.name}
            className="bg-white rounded-full border border-card-line px-4 py-2 text-sm"
          >
            <span className="font-semibold">{area.name}</span>{" "}
            <span className="text-muted">{area.minutes}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}