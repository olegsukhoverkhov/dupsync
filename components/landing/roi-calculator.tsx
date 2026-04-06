import Link from "next/link";

const ROWS = [
  {
    metric: "Cost per language",
    traditional: "$3,000 \u2013 $5,000",
    dubsync: "From $1/min",
  },
  {
    metric: "Time for 10-min video",
    traditional: "1\u20133 weeks",
    dubsync: "3 minutes",
  },
  {
    metric: "Simultaneous languages",
    traditional: "1",
    dubsync: "30+",
  },
  {
    metric: "Voice actors needed",
    traditional: "Yes",
    dubsync: "No \u2014 AI voice cloning",
  },
  {
    metric: "Lip sync",
    traditional: "Manual work",
    dubsync: "Automatic",
  },
  {
    metric: "10-min video \u00D7 5 languages",
    traditional: "~$20,000",
    dubsync: "~$50",
  },
];

export function RoiCalculator() {
  return (
    <section id="roi" className="py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why pay thousands for dubbing?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            See how much you save with AI-powered dubbing
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of traditional dubbing costs versus DubSync AI dubbing
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="bg-slate-800/60 px-6 py-4 text-sm font-semibold text-white"
                >
                  Metric
                </th>
                <th
                  scope="col"
                  className="bg-slate-800/60 px-6 py-4 text-sm font-semibold text-slate-500"
                >
                  Traditional Dubbing
                </th>
                <th
                  scope="col"
                  className="bg-slate-800/60 px-6 py-4 text-sm font-semibold text-green-400"
                >
                  DubSync
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, index) => (
                <tr
                  key={row.metric}
                  className={
                    index < ROWS.length - 1
                      ? "border-b border-white/10"
                      : undefined
                  }
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-white"
                  >
                    {row.metric}
                  </th>
                  <td className="px-6 py-4 text-slate-500">
                    {row.traditional}
                  </td>
                  <td className="px-6 py-4 text-green-400 font-medium">
                    {row.dubsync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:shadow-pink-500/40 hover:brightness-110"
          >
            Save 99% on dubbing costs &mdash; Start Free
          </Link>
        </div>
      </div>
    </section>
  );
}
