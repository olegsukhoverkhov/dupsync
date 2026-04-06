import Link from "next/link";
import { GraduationCap, Mic } from "lucide-react";

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="white" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
      <path
        d="M19 7.5V2h-3.5c0 3-2 4.5-4.5 5v6.5c0 2.5-2 4.5-4.5 4.5S2 16 2 13.5 4 9 6.5 9c.5 0 1 .1 1.5.2V12c-.5-.1-1-.2-1.5-.2C5.1 11.8 4 12.5 4 13.5S5.1 15.2 6.5 15.2 9 14 9 13V2h4c0 0 0 3.5 3 5 .7.3 1.5.5 2.5.5h.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8">
      <defs>
        <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#5851DB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#ig)" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig)" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        d="M15.5 8H14c-1.1 0-1.5.7-1.5 1.5V11h3l-.5 3h-2.5v7h-3v-7H8v-3h1.5V9c0-2.2 1.3-3.5 3.5-3.5h2.5v2.5z"
        fill="white"
      />
    </svg>
  );
}

const USE_CASES = [
  {
    key: "youtube",
    icon: <YouTubeIcon />,
    title: "YouTube",
    description:
      "Dub your videos, shorts, and tutorials into 30+ languages. Grow subscribers and watch time globally with AI voice cloning and lip sync.",
    tagline: "1 video, 30+ markets",
    link: "/platforms/youtube",
  },
  {
    key: "tiktok",
    icon: <TikTokIcon />,
    title: "TikTok",
    description:
      "Localize viral content for every market. Dub TikTok videos with natural voice cloning and lip sync \u2014 keep the energy, reach new audiences.",
    tagline: "Go viral in every language",
    link: "/platforms/tiktok",
  },
  {
    key: "instagram",
    icon: <InstagramIcon />,
    title: "Instagram",
    description:
      "Dub Reels, Stories, and IGTV for international followers. AI preserves your authentic voice and syncs lips perfectly for every language.",
    tagline: "Your voice, every feed",
    link: "/platforms/instagram",
  },
  {
    key: "facebook",
    icon: <FacebookIcon />,
    title: "Facebook",
    description:
      "Localize video ads, product demos, and branded content for every market. Reach 3B+ users in their native language with AI dubbing.",
    tagline: "3B+ users, one upload",
    link: "/platforms/facebook",
  },
  {
    key: "elearning",
    icon: <GraduationCap className="h-8 w-8 text-white" />,
    title: "E-Learning",
    description:
      "Dub courses, tutorials, and training videos for global learners. Keep the instructor\u2019s voice and personality across every language.",
    tagline: "Teach the world",
    link: "/platforms/elearning",
  },
  {
    key: "podcasts",
    icon: <Mic className="h-8 w-8 text-white" />,
    title: "Podcasts",
    description:
      "Expand your podcast to new language markets. AI preserves your voice, tone, and delivery in every language \u2014 your listeners won\u2019t know the difference.",
    tagline: "Same voice, new audience",
    link: "/platforms/podcasts",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: USE_CASES.map((useCase, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: useCase.title,
    description: useCase.description,
  })),
};

export function UseCases() {
  return (
    <section id="use-cases" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for your workflow
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            See how teams like yours use DubSync
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.key}
              className="group rounded-2xl border border-white/10 bg-slate-800/40 p-6 transition-colors hover:border-white/20 hover:bg-slate-800/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                {useCase.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {useCase.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {useCase.description}
              </p>
              <span className="mt-4 inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-xs text-pink-400">
                {useCase.tagline}
              </span>
              <div className="mt-4">
                <Link
                  href={useCase.link}
                  className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
