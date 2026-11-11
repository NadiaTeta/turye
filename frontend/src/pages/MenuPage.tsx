import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import MenuHero from "../components/MenuHero";
import DishGrid from "../components/DishGrid";
import Footer from "../components/Footer";
import type { MenuFilter } from "../components/FilterPills";
import type { SortOption } from "../lib/menu";
import { usePageTitle } from "../lib/usePageTitle";

export default function MenuPage() {
  usePageTitle("Menu");
  const [activeCategory, setActiveCategory] = useState<MenuFilter>("all");
  const [sort, setSort] = useState<SortOption>("popular");
  const [searchParams] = useSearchParams();
  const linkedDish = searchParams.get("dish");

  // Arriving from search or a featured dish: show every category so the dish is visible.
  useEffect(() => {
    if (linkedDish) setActiveCategory("all");
  }, [linkedDish]);

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>
      <main className="flex-1 max-w-[1180px] mx-auto px-6 md:px-11 w-full pb-20">
        <MenuHero
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sort={sort}
          onSortChange={setSort}
        />
        <DishGrid category={activeCategory} sort={sort} linkedDish={linkedDish} />
      </main>
      <Footer />
    </div>
  );
}
