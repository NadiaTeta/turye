import { Link } from "react-router-dom";

export default function CtaBand() {
  return (
    <section className="bg-green-deep">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 py-16 flex items-center justify-between flex-wrap gap-8">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-cream max-w-md leading-tight">
          Hungry? Turye — let's eat.
        </h2>
        <Link
          to="/menu"
          className="bg-gold text-green-deep rounded-full px-8 py-4 text-sm font-semibold hover:brightness-105 transition-all"
        >
          Order now
        </Link>
      </div>
    </section>
  );
}