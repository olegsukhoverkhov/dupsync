import Link from "next/link";

const ROWS = [
  {
    feature: "Lip sync minutes from ~$20/mo",
    dubsync: { text: "20 min", color: "text-green-400" },
    rask: { text: "\u2717 not available", color: "text-red-400" },
    heygen: { text: "shared pool*", color: "text-yellow-400" },
  },
  {
    feature: "Lip sync included in every credit",
    dubsync: { text: "always", color: "text-green-400" },
    rask: { text: "2x credit cost", color: "text-red-400" },
    heygen: { text: "costs credits", color: "text-yellow-400" },
  },
  {
    feature: "Price for lip sync access",
    dubsync: { text: "$19.99/mo", color: "text-green-400" },
    rask: { text: "$120/mo", color: "text-red-400" },
    heygen: { text: "$29/mo", color: "text-yellow-400" },
  },
  {
    feature: "Hidden lip sync surcharges",
    dubsync: { text: "none", color: "text-green-400" },
    rask: { text: "doubles usage", color: "text-red-400" },
    heygen: { text: "shared pool", color: "text-yellow-400" },
  },
];

const STATS = [
  {
    value: "20 min",
    label: "of lip sync from just $19.99",
  },
  {
    value: "$1.00/min",
    label: "all-inclusive, lip sync included in every credit",
  },
  {
    value: "$0",
    label: "hidden surcharges, every credit = lip sync included",
  },
];

export function ComparisonBlock() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Every credit includes lip sync.{" "}
            <span className="gradient-text">No hidden fees.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            See how DubSync compares to Rask AI and HeyGen for AI video dubbing
            with lip sync.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/50">
          <table className="w-full text-sm">
            <caption className="sr-only">
              DubSync vs Rask AI vs HeyGen — lip sync comparison
            </caption>
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-slate-400 font-medium">
                  Feature
                </th>
                <th className="px-6 py-4 text-center font-semibold text-white">
                  DubSync
                </th>
                <th className="px-6 py-4 text-center font-medium text-slate-400">
                  Rask AI
                </th>
                <th className="px-6 py-4 text-center font-medium text-slate-400">
                  HeyGen
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={
                    i < ROWS.length - 1 ? "border-b border-white/5" : ""
                  }
                >
                  <td className="px-6 py-4 text-slate-300">{row.feature}</td>
                  <td
                    className={`px-6 py-4 text-center font-semibold ${row.dubsync.color}`}
                  >
                    {row.dubsync.text}
                  </td>
                  <td
                    className={`px-6 py-4 text-center ${row.rask.color}`}
                  >
                    {row.rask.text}
                  </td>
                  <td
                    className={`px-6 py-4 text-center ${row.heygen.color}`}
                  >
                    {row.heygen.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-xs text-slate-500 text-center">
          * HeyGen lip sync shares Premium Credits with avatars, generation, and
          other features. Prices as of April 2026.
        </p>

        {/* Stat cards */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom text + link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Other tools charge $120/mo for lip sync or split credits between
          features.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/compare"
            className="text-sm text-pink-400 hover:text-pink-300 font-medium"
          >
            See how we compare &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
