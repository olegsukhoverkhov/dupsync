import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "DupSync doubled my international audience in two months. The voice cloning is so good that my Spanish viewers think I actually speak Spanish.",
    name: "Alex Rivera",
    role: "YouTube Creator",
    followers: "1.2M subscribers",
    avatar: "AR",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote: "We used to spend $5,000 per language for professional dubbing. DupSync does it in minutes for a fraction of the cost. The lip sync is incredible.",
    name: "Sarah Chen",
    role: "Head of Content",
    followers: "EduTech Pro",
    avatar: "SC",
    gradient: "from-violet-500 to-pink-500",
  },
  {
    quote: "Our product demos now reach 15 markets instead of 3. DupSync paid for itself in the first week. It's a no-brainer for any global team.",
    name: "Marcus Klein",
    role: "Marketing Director",
    followers: "ScaleUp Agency",
    avatar: "MK",
    gradient: "from-amber-500 to-orange-500",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Loved by <span className="gradient-text">creators</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Join thousands of creators who are reaching global audiences
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 hover:border-white/20 transition-all"
            >
              <Stars />
              <p className="mt-4 text-zinc-300 text-sm leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role} &middot; {t.followers}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
