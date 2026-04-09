import { ArrowRight, Clock, Mic } from "lucide-react";
import { LANDING_DUB_LANGUAGES } from "@/lib/landing-dubs";
import { DubVideoPlayer } from "./dub-video-player";

const ORIGINAL_LANG = LANDING_DUB_LANGUAGES.find((l) => l.code === "original")!;
const ES_LANG = LANDING_DUB_LANGUAGES.find((l) => l.code === "es")!;
const FR_LANG = LANDING_DUB_LANGUAGES.find((l) => l.code === "fr")!;
const JA_LANG = LANDING_DUB_LANGUAGES.find((l) => l.code === "ja")!;

const DUB_CARDS: Array<{
  title: string;
  badgeTop: string;
  badgeBottom?: string;
  duration: string;
  accuracy: string;
  url: string;
  poster: string;
}> = [
  {
    title: "Polish creator — original",
    badgeTop: `${ORIGINAL_LANG.flag} English (source)`,
    duration: "0:21 sample",
    accuracy: "Untouched original",
    url: ORIGINAL_LANG.url,
    poster: ORIGINAL_LANG.poster,
  },
  {
    title: "Dubbed to Spanish",
    badgeTop: `${ORIGINAL_LANG.flag} English`,
    badgeBottom: `${ES_LANG.flag} Spanish`,
    duration: "Dubbed in 3 min",
    accuracy: "Lip-sync 2 Pro",
    url: ES_LANG.url,
    poster: ES_LANG.poster,
  },
  {
    title: "Dubbed to French",
    badgeTop: `${ORIGINAL_LANG.flag} English`,
    badgeBottom: `${FR_LANG.flag} French`,
    duration: "Dubbed in 3 min",
    accuracy: "Lip-sync 2 Pro",
    url: FR_LANG.url,
    poster: FR_LANG.poster,
  },
  {
    title: "Dubbed to Japanese",
    badgeTop: `${ORIGINAL_LANG.flag} English`,
    badgeBottom: `${JA_LANG.flag} Japanese`,
    duration: "Dubbed in 3 min",
    accuracy: "Lip-sync 2 Pro",
    url: JA_LANG.url,
    poster: JA_LANG.poster,
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
            One creator, four languages — all AI-dubbed with voice cloning and lip sync
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUB_CARDS.map((card) => (
            <RealResultCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * A card showing a single real video clip. Uses DubVideoPlayer with a single
 * language so the click-to-play + no-preload behaviour comes for free.
 *
 * Card width is capped to the native source video width so the player isn't
 * upscaled past 720px on wide screens.
 */
function RealResultCard({
  title,
  badgeTop,
  badgeBottom,
  duration,
  accuracy,
  url,
  poster,
}: {
  title: string;
  badgeTop: string;
  badgeBottom?: string;
  duration: string;
  accuracy: string;
  url: string;
  poster: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-slate-800/50 overflow-hidden hover:border-white/20 transition-all flex flex-col w-full max-w-[640px] mx-auto">
      <div className="relative">
        <DubVideoPlayer
          languages={[
            {
              code: "single",
              label: badgeBottom ?? badgeTop,
              flag: "",
              url,
              poster,
            },
          ]}
          aspectClass="aspect-video"
          compact
        />
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 text-white">
            {badgeTop}
          </span>
          {badgeBottom && (
            <>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
              <span className="text-[10px] sm:text-xs bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 text-white">
                {badgeBottom}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <Mic className="h-3 w-3" />
            {accuracy}
          </span>
        </div>
      </div>
    </div>
  );
}
