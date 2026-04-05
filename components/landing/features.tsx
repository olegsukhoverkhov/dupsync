import { Mic, Scan, Globe, Zap, Sparkles, Code } from "lucide-react";

const FEATURES = [
  {
    icon: Mic,
    title: "Voice Cloning",
    description: "AI clones the original speaker's voice — tone, accent, emotion. It sounds like them, not a robot.",
  },
  {
    icon: Scan,
    title: "Lip Sync",
    description: "Mouth movements automatically match the dubbed audio. Viewers won't notice it's a dub.",
  },
  {
    icon: Globe,
    title: "30+ Languages",
    description: "From Spanish to Japanese to Arabic. One video, unlimited reach across the globe.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "A 10-minute video dubbed in under 3 minutes. No more waiting days for manual dubbing.",
  },
  {
    icon: Sparkles,
    title: "Studio Quality",
    description: "Up to 4K output with natural-sounding speech. Professional results without the studio.",
  },
  {
    icon: Code,
    title: "API Access",
    description: "Integrate DubSync into your workflow. Automate dubbing at scale with our REST API.",
  },
];

export function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why <span className="gradient-text">DubSync</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Everything you need to make your content truly global
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 hover:bg-slate-800/60 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:from-pink-500/30 group-hover:to-blue-600/30 transition-all">
                <f.icon className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
