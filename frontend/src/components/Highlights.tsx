const items = [
  {
    title: "Made fresh daily",
    body: "Every dish is prepared the day it's ordered — nothing sits and waits.",
  },
  {
    title: "Under 30 minutes",
    body: "Ordered by the time your delivery window opens, at your door before it closes.",
  },
  {
    title: "Built around your day",
    body: "Breakfast, lunch, dinner, drinks and snacks — order whenever you're hungry.",
  },
];

export default function Highlights() {
  return (
    <section className="bg-cream-deep">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="font-display font-bold text-lg text-green-deep mb-2">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink/75">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}