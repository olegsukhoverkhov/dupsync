import { Play, ArrowRight, Clock, Mic } from "lucide-react";

const EXAMPLES = [
  {
    title: "YouTube Tutorial",
    original: "🇺🇸 English",
    dubbed: "🇪🇸 Spanish",
    duration: "Dubbed in 3 min",
    accuracy: "98% voice match",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Product Demo",
    original: "🇺🇸 English",
    dubbed: "🇫🇷 French",
    duration: "Dubbed in 2 min",
    accuracy: "97% voice match",
    gradient: "from-violet-500/20 to-pink-500/20",
  },
  {
    title: "Online Course",
    original: "🇺🇸 English",
    dubbed: "🇯🇵 Japanese",
    duration: "Dubbed in 5 min",
    accuracy: "96% voice match",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

export function Examples() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Real <span className="gradient-text">results</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            See how creators use DupSync to reach global audiences
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.title}
              className="group rounded-2xl border border-white/10 bg-slate-800/50 overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Video thumbnail */}
              <div className={`relative aspect-video bg-gradient-to-br ${ex.gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-0.5" />
                  </div>
                </div>
                {/* Language transform indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-white">
                    {ex.original}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/50" />
                  <span className="text-xs bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-white">
                    {ex.dubbed}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white">{ex.title}</h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ex.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    {ex.accuracy}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
