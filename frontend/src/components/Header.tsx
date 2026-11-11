import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import SearchDialog from "./SearchDialog";
import { useCurrentUser } from "../store/authStore";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/blog", label: "Blog" },
  { to: "/locations", label: "Locations" },
  { to: "/orders", label: "My orders" },
];

// tone="light" is for placing the header over a photo (the home page hero).
export default function Header({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const totalCount = useCartStore((state) => state.totalCount());
  const user = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the page changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <header className={`flex items-center justify-between pt-6 pb-6 ${tone === "light" ? "text-cream" : ""}`}>
      <Logo tone={tone} />

      <nav className="hidden md:flex gap-8" aria-label="Primary">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-sm font-medium pb-1 border-b-2 transition-colors ${
                isActive
                  ? "border-gold opacity-100"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2.5">
        <IconButton label="Search" onClick={() => setSearchOpen(true)} buttonRef={searchButtonRef}>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </IconButton>
        <IconButton to={user ? "/profile" : "/login"} label={user ? "Your profile" : "Log in"}>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M4 20C4 16.13 7.58 13 12 13C16.42 13 20 16.13 20 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </IconButton>
        <IconButton to="/cart" label={`Cart, ${totalCount} ${totalCount === 1 ? "item" : "items"}`} badge={totalCount}>
          <path
            d="M6 6H21L19 15H8L6 6ZM6 6L5 3H2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1.4" fill="currentColor" />
          <circle cx="18" cy="20" r="1.4" fill="currentColor" />
        </IconButton>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
          className="md:hidden w-[38px] h-[38px] rounded-full border border-card-line bg-white text-green-deep flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {searchOpen && <SearchDialog onClose={closeSearch} />}

      {menuOpen && (
        <MobileMenu onClose={closeMenu} />
      )}
    </header>
  );
}

function IconButton({
  label,
  badge,
  to,
  onClick,
  buttonRef,
  children,
}: {
  label: string;
  badge?: number;
  to?: string;
  onClick?: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  const className =
    "relative w-[38px] h-[38px] rounded-full border border-card-line bg-white text-green-deep flex items-center justify-center hover:-translate-y-0.5 transition-transform";

  const content = (
    <>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {children}
      </svg>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#D6432E] text-white text-[0.62rem] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-cream">
          {badge}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-label={label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={buttonRef} type="button" aria-label={label} onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <NavLink
      to="/"
      className={`flex items-center gap-2 font-display font-bold text-[1.05rem] tracking-wide ${
        light ? "text-cream" : "text-green-deep"
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20C4 20 3 9 12 5C21 1 21 12 17 16C13 20 4 20 4 20Z"
          fill={light ? "#E8A23A" : "#1B4332"}
        />
        <path
          d="M4 20C4 20 8 13 14 10"
          stroke={light ? "#123024" : "#F4EFE3"}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span>Turye</span>
    </NavLink>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const user = useCurrentUser();

  useEffect(() => {
    // Stop the page behind from scrolling, and put focus inside the menu.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep Tab cycling within the menu while it's open.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="md:hidden fixed inset-0 z-50 bg-cream flex flex-col px-6 pt-6 pb-10 overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <Logo />
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="w-[38px] h-[38px] rounded-full border border-card-line bg-white text-green-deep flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-10">
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.to} className="border-b border-card-line">
              <NavLink
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between py-4 font-display font-bold text-2xl ${
                    isActive ? "text-green-deep" : "text-ink/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <Link
          to={user ? "/profile" : "/login"}
          onClick={onClose}
          className="bg-white border border-card-line text-green-deep rounded-full py-4 text-center text-sm font-semibold"
        >
          {user ? `Your profile (${user.name.split(" ")[0]})` : "Log in or sign up"}
        </Link>
        <Link
          to="/menu"
          onClick={onClose}
          className="bg-green-deep text-white rounded-full py-4 text-center text-sm font-semibold"
        >
          Order now
        </Link>
      </div>
    </div>
  );
}