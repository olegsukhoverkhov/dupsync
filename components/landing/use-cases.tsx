const USE_CASES = [
  {
    icon: "\u{1F3AC}",
    title: "YouTube & Content Creators",
    description:
      "Reach global audiences by dubbing your videos into 30+ languages. Grow subscribers and revenue without re-shooting content.",
    badge: "10x audience reach",
  },
  {
    icon: "\u{1F393}",
    title: "E-Learning & Online Courses",
    description:
      "Make courses accessible worldwide. Dub lectures, tutorials, and training videos while keeping instructor voice and personality.",
    badge: "Udemy, Coursera, LMS",
  },
  {
    icon: "\u{1F4C8}",
    title: "Marketing & Product Teams",
    description:
      "Localize product demos, ads, and onboarding videos for every market. Launch campaigns in 30+ languages simultaneously.",
    badge: "15 markets, 1 video",
  },
  {
    icon: "\u{1F399}\uFE0F",
    title: "Podcasts & Media",
    description:
      "Expand your podcast to new language markets. AI preserves your voice, tone, and delivery in every language.",
    badge: "Same voice, new language",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-2xl border border-white/10 bg-slate-800/40 p-6"
            >
              <span className="text-[40px] leading-none" role="img" aria-label={useCase.title}>
                {useCase.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {useCase.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                {useCase.description}
              </p>
              <span className="mt-4 inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-xs text-pink-400">
                {useCase.badge}
              </span>
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
