import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-card-line">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-display font-bold text-[1.05rem] text-green-deep">
            Turye
          </span>
          <p className="text-sm text-ink/70 mt-3 leading-relaxed">
            Fresh food, delivered — from our kitchen to your door.
          </p>
        </div>

        <FooterColumn
          title="Explore"
          links={[
            { to: "/", label: "Home" },
            { to: "/menu", label: "Menu" },
            { to: "/blog", label: "Blog" },
            { to: "/orders", label: "My orders" },
          ]}
        />
        <FooterColumn
          title="Visit"
          links={[{ to: "/locations", label: "Locations" }]}
        />

        <div>
          <h4 className="font-display font-bold text-sm text-green-deep mb-3">
            Hours
          </h4>
          <p className="text-sm text-ink/70 leading-relaxed">
            Mon – Sun
            <br />
            7:00 AM – 10:00 PM
          </p>
        </div>
      </div>

      <div className="border-t border-card-line">
        <p className="max-w-[1180px] mx-auto px-6 md:px-11 py-5 text-xs text-ink/60">
          © {new Date().getFullYear()} Turye. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-display font-bold text-sm text-green-deep mb-3">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-ink/70 hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}