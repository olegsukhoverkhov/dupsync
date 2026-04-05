import { Upload, Cpu, Download } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "Step 1",
    title: "Upload your video",
    description:
      "Upload any video file (MP4, MOV, AVI up to 5GB). DubSync automatically transcribes the original audio and detects the source language.",
  },
  {
    icon: Cpu,
    step: "Step 2",
    title: "AI processes your video",
    description:
      "Our AI translates the transcript, clones the speaker\u2019s voice in the target language, and generates lip-synced audio that matches mouth movements. The entire process takes 2\u20135 minutes for a typical 10-minute video.",
  },
  {
    icon: Download,
    step: "Step 3",
    title: "Download your dubbed video",
    description:
      "Review the result, make any edits to the translation, and download your dubbed video in up to 4K quality. Share it with your global audience instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How <span className="gradient-text">DubSync</span> works
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            DubSync uses AI to automate the entire video dubbing workflow — from
            transcription to voice cloning to lip sync — in three simple steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-2xl border border-white/10 bg-slate-800/30 p-6 hover:border-white/20 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6 text-pink-400" />
              </div>
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1">
                {s.step}
              </p>
              <h3 className="text-lg font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
