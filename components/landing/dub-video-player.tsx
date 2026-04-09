"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export type DubLanguage = {
  code: string;
  label: string;
  flag: string;
  url: string;
  /** Static poster image (JPG) shown until the user clicks play. */
  poster?: string;
};

type Props = {
  /** All language tracks shown in the switcher. The first one is the default. */
  languages: DubLanguage[];
  /** Tailwind aspect-ratio class. Defaults to landscape video (16:9). */
  aspectClass?: string;
  /** Compact play-button sizing for small thumbnail cells. */
  compact?: boolean;
};

/**
 * Click-to-play video player with optional language switcher.
 *
 * Behaviour:
 *  - The browser does NOT preload any video bytes until the user clicks play.
 *    Only the static poster JPG is fetched up front; the <video> element is
 *    only mounted on click and uses `preload="none"`.
 *  - Switching language while playing transparently swaps the source and
 *    re-mounts the player so the new track also starts on a fresh user gesture.
 *  - Layout is fluid and works the same on web and mobile (no UA sniffing).
 *  - The container box matches the video's aspect ratio so the player is
 *    sized to the video, not the column.
 */
export function DubVideoPlayer({
  languages,
  aspectClass = "aspect-video",
  compact = false,
}: Props) {
  const [activeCode, setActiveCode] = useState(languages[0]?.code);
  const [playing, setPlaying] = useState(false);

  const active = languages.find((l) => l.code === activeCode) ?? languages[0];

  const onSelectLang = (code: string) => {
    if (code === activeCode) return;
    setActiveCode(code);
    // Force re-mount of <video> so the new source loads only on next click.
    setPlaying(false);
  };

  return (
    <div className="w-full">
      {/* Video viewport */}
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10`}
      >
        {playing ? (
          <video
            // key forces a remount when the language changes so we don't keep
            // a stale buffer for the previous track.
            key={active.code}
            src={active.url}
            poster={active.poster}
            controls
            autoPlay
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${active.label} version`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {active.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-violet-500/10 to-blue-600/20" />
            )}
            <span
              className={`relative z-10 flex ${
                compact ? "h-12 w-12" : "h-16 w-16"
              } items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/40 transition-transform group-hover:scale-110`}
            >
              <Play
                className={`${compact ? "h-5 w-5" : "h-7 w-7"} text-white ml-0.5`}
                fill="currentColor"
              />
            </span>
          </button>
        )}
      </div>

      {/* Language switcher — single horizontal row, scrolls horizontally on
          ultra-narrow screens instead of wrapping. */}
      {languages.length > 1 && (
        <div
          role="tablist"
          aria-label="Choose dubbed language"
          className="mt-3 flex items-center justify-center gap-1.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {languages.map((lang) => {
            const isActive = lang.code === activeCode;
            return (
              <button
                key={lang.code}
                role="tab"
                aria-selected={isActive}
                aria-label={lang.label}
                type="button"
                onClick={() => onSelectLang(lang.code)}
                title={lang.label}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-white bg-white text-slate-900 shadow-sm shadow-white/20"
                    : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span aria-hidden className="text-base leading-none">{lang.flag}</span>
                {/* Label hidden on narrow mobile so all 4 tabs fit without
                    horizontal scrolling. Desktop shows the full word. */}
                <span className="hidden sm:inline">{lang.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
