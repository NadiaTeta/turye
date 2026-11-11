import { Link } from "react-router-dom";

// Home page section for the restaurant itself.
// TEMPORARY stock photo: swap public/images/restaurant-dining.webp for your own.
export default function EatIn() {
  return (
    <section className="max-w-[1180px] mx-auto px-6 md:px-11 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <img
          src="/images/restaurant-dining.webp"
          alt="Guests sharing a meal at the restaurant"
          loading="lazy"
          className="w-full md:w-1/2 aspect-[4/3] object-cover rounded-[32px]"
        />
        <div className="md:w-1/2 max-w-md">
          <h2 className="font-display font-extrabold text-3xl md:text-[2.4rem] leading-tight text-green-deep mb-4">
            Pull up a chair
          </h2>
          <p className="text-base leading-relaxed text-ink/80 mb-4">
            Everything on the menu is served at our restaurant too. Stop in for breakfast, meet friends
            for lunch, or pick up your order on the way home.
          </p>
          <p className="text-sm text-ink/70 mb-8">Open every day, 7 AM to 10 PM. Walk-ins welcome.</p>
          <Link
            to="/locations"
            className="inline-block bg-green-deep text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
          >
            Find the restaurant
          </Link>
        </div>
      </div>
    </section>
  );
}