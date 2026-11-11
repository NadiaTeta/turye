import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// The burger photo, framed as a rounded card: it grows as you scroll through, tilts
// toward the cursor, and ingredient labels pop out onto each layer. All motion
// runs through CSS variables on the stage (--open, --mx, --my), so React never
// re-renders while it moves.
//
// The photo is public/images/burger/burger.png. If you swap it, move the
// labels by changing their `y` (how far down the photo, in %).

const labels = [
  { text: "Toasted sesame bun", y: 30, side: "left" },
  { text: "Red onion & tomato", y: 50, side: "right" },
  { text: "Melted cheddar", y: 60, side: "left" },
  { text: "Flame-grilled beef", y: 66, side: "right" },
  { text: "Fresh rocket", y: 79, side: "left" },
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function BurgerStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const burger = burgerRef.current;
    if (!section || !stage || !burger) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.setProperty("--open", "1");
      return;
    }

    const target = { open: 0, mx: 0, my: 0 };
    const cur = { open: 0, mx: 0, my: 0 };
    let hovering = false;
    let visible = false;
    let raf = 0;

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0;
      const scrollOpen = smooth(0.05, 0.6, p);
      target.open = Math.max(scrollOpen, hovering ? 0.6 : 0);
    };

    const tick = () => {
      readScroll();
      cur.open += (target.open - cur.open) * 0.12;
      cur.mx += (target.mx - cur.mx) * 0.08;
      cur.my += (target.my - cur.my) * 0.08;
      stage.style.setProperty("--open", cur.open.toFixed(4));
      stage.style.setProperty("--mx", cur.mx.toFixed(4));
      stage.style.setProperty("--my", cur.my.toFixed(4));
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.mx = (e.clientX / window.innerWidth - 0.5) * 2;
      target.my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(section);

    window.addEventListener("pointermove", onMove);
    burger.addEventListener("pointerenter", onEnter);
    burger.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      burger.removeEventListener("pointerenter", onEnter);
      burger.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-cream">
      <div
        ref={stageRef}
        className="burger-stage sticky top-0 h-screen overflow-hidden flex items-center"
      >
        <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full grid md:grid-cols-[1fr_1.3fr] gap-4 md:gap-10 items-center">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep mb-4">
              Made to order
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl leading-[1.05] tracking-tight text-green-deep mb-5">
              Built fresh,
              <br />
              layer by layer.
            </h2>
            <p className="text-base leading-relaxed text-ink/75 max-w-md mx-auto md:mx-0 mb-8">
              Nothing is made ahead. We start cooking when your order comes in, so every part of it
              is fresh when it gets to you.
            </p>
            <Link
              to="/menu"
              className="inline-block bg-green-deep text-cream rounded-full px-8 py-4 text-sm font-semibold hover:bg-green hover:scale-105 transition-all"
            >
              See the menu
            </Link>
          </div>

          <div className="flex justify-center">
            <div ref={burgerRef} className="burger">
              <div className="burger-glow" />
              <div className="burger-float">
                <img
                  src="/images/burger/burger.png"
                  alt="A cheeseburger with sesame bun, tomato, onion, cheddar and beef"
                  draggable={false}
                  className="burger-photo"
                />
              </div>
              {labels.map((label, i) => (
                <span
                  key={label.text}
                  className={`burger-label burger-label-${label.side}`}
                  style={{ top: `${label.y}%`, ["--at" as string]: 0.2 + i * 0.12 }}
                >
                  {label.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
