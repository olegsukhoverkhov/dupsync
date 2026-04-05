const LOGOS = [
  "TechCrunch", "Product Hunt", "Y Combinator", "Vercel", "Notion", "Linear"
];

export function LogoBar() {
  return (
    <section className="border-y border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm text-zinc-500 mb-8">
          Trusted by creators and teams worldwide
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          {LOGOS.map((name) => (
            <div
              key={name}
              className="text-zinc-600 font-semibold text-lg tracking-tight hover:text-zinc-400 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
