import Hero from "../components/Hero";
import BurgerStack from "../components/BurgerStack";
import Highlights from "../components/Highlights";
import FeaturedDishes from "../components/FeaturedDishes";
import EatIn from "../components/EatIn";
import CtaBand from "../components/CtaBand";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { usePageTitle } from "../lib/usePageTitle";

export default function HomePage() {
  usePageTitle();

  return (
    <div className="bg-cream min-h-screen">
      <Hero />
      <BurgerStack />
      <Reveal>
        <FeaturedDishes />
      </Reveal>
      <Reveal>
        <Highlights />
      </Reveal>
      <div className="pt-20">
        <Reveal>
          <EatIn />
        </Reveal>
      </div>
      <Reveal>
        <CtaBand />
      </Reveal>
      <Footer />
    </div>
  );
}
