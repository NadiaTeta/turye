import { Link } from "react-router-dom";
import Header from "./Header";

// Full-width food photo with the header and headline laid over it.
// The photo is a TEMPORARY stock image: swap public/images/hero.webp for a
// photo of your own food (wide, at least 2000px, with space on the left).
export default function Hero() {
  return (
    <section className="relative min-h-[92vh] md:min-h-[88vh] flex flex-col overflow-hidden bg-green-deep">
      <img
        src="/images/hero.webp"
        alt=""
        fetchPriority="high"
        className="hero-photo absolute inset-0 w-full h-full object-cover"
      />
      {/* Darkens the photo behind the text so it stays readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{ background: "linear-gradient(to top, rgba(10,28,20,0.95) 0%, rgba(10,28,20,0.75) 50%, rgba(10,28,20,0.35) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: "linear-gradient(to right, rgba(10,28,20,0.93) 0%, rgba(10,28,20,0.72) 42%, rgba(10,28,20,0.12) 75%)" }}
      />

      <div className="relative max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header tone="light" />
      </div>

      <div className="relative flex-1 flex items-end md:items-center max-w-[1180px] mx-auto px-6 md:px-11 w-full pb-14 md:pb-20">
        <div className="max-w-[560px] text-cream">
          <h1 style={{ ["--delay" as string]: "0.15s" }} className="rise font-display font-extrabold text-[2.8rem] md:text-[4rem] leading-[1.02] tracking-tight mb-6">
            Good food,
            <br />
            brought to your door.
          </h1>
          <p style={{ ["--delay" as string]: "0.35s" }} className="rise text-base md:text-lg leading-relaxed text-cream/85 max-w-md mb-9">
            From breakfast bowls to late-night snacks, everything is made fresh the day you order it.
            Have it delivered in about 30 minutes, or come eat with us.
          </p>
          <div style={{ ["--delay" as string]: "0.55s" }} className="rise flex flex-wrap items-center gap-5">
            <Link
              to="/menu"
              className="bg-gold text-green-deep rounded-full px-8 py-4 text-sm font-semibold hover:brightness-105 hover:scale-105 transition-all"
            >
              Order now
            </Link>
            <Link
              to="/locations"
              className="text-sm font-semibold text-cream border-b-2 border-gold pb-1"
            >
              Visit the restaurant
            </Link>
          </div>

          <ul style={{ ["--delay" as string]: "0.75s" }} className="rise flex flex-wrap gap-x-7 gap-y-2 mt-12 text-sm text-cream/80">
            <li>Open daily, 7 AM to 10 PM</li>
            <li>Delivery in about 30 minutes</li>
            <li>Dine in or take away</li>
          </ul>
        </div>
      </div>
    </section>
  );
}