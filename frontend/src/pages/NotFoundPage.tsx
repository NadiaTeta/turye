import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PlateVisual from "../components/PlateVisual";
import { usePageTitle } from "../lib/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page not found");

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <PlateVisual
          blobs={["#E9E2D2", "#E9E2D2", "#E9E2D2", "#E9E2D2"]}
          size={140}
          className="mb-8"
        />
        <h1 className="font-display font-extrabold text-3xl text-green-deep mb-3">
          This plate is empty
        </h1>
        <p className="text-sm text-ink/70 mb-8 max-w-sm">
          The page you're looking for doesn't exist. It may have moved, or the link has a typo.
        </p>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <Link
            to="/menu"
            className="bg-green-deep text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-green transition-colors"
          >
            Browse the menu
          </Link>
          <Link to="/" className="text-sm font-semibold text-green-deep border-b-2 border-gold pb-1">
            Go to the home page
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
