import { Link } from "react-router-dom";
import { dishes } from "../data/dishes";
import { formatPrice } from "../lib/cart";
import FoodImage from "./FoodImage";

export default function FeaturedDishes() {
  const featured = dishes.slice(0, 4);

  return (
    <section className="max-w-[1180px] mx-auto px-6 md:px-11 py-20">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl md:text-[2.4rem] text-green-deep mb-2">
            Today's picks
          </h2>
          <p className="text-sm text-ink/70">A few favourites from the kitchen, made fresh this morning.</p>
        </div>
        <Link to="/menu" className="text-sm font-semibold text-green-deep border-b-2 border-gold pb-1">
          See the full menu
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {featured.map((dish) => (
          <Link key={dish.id} to={`/menu?dish=${dish.id}`} className="group flex flex-col">
            <FoodImage
              src={dish.image}
              alt={dish.imageAlt ?? dish.name}
              blobs={dish.blobs}
              shape="tile"
              size={180}
              className="mb-3.5 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="flex items-start justify-between gap-2">
              <span className="font-display font-bold text-sm md:text-base leading-snug">{dish.name}</span>
              <span className="text-green-deep font-bold text-sm md:text-base">{formatPrice(dish.price)}</span>
            </div>
            <span className="text-xs text-muted mt-1">{dish.tag}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}