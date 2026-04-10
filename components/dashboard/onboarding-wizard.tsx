"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Mic, Globe, Subtitles, Play, X } from "lucide-react";
import { useDashboardT } from "./locale-provider";

const STEPS = [
  {
    icon: Upload,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    titleKey: "dashboard.onboarding.step1Title",
    titleFallback: "Upload your video",
    descKey: "dashboard.onboarding.step1Desc",
    descFallback:
      "Drop any video file. We support most formats — MP4, MOV, AVI, MKV and more.",
  },
  {
    icon: Mic,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    titleKey: "dashboard.onboarding.step2Title",
    titleFallback: "Select original language",
    descKey: "dashboard.onboarding.step2Desc",
    descFallback:
      "Tell us which language the speaker uses in your video. This helps our AI transcribe the speech accurately.",
  },
  {
    icon: Globe,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    titleKey: "dashboard.onboarding.step3Title",
    titleFallback: "Choose target languages",
    descKey: "dashboard.onboarding.step3Desc",
    descFallback:
      "Pick from 30+ languages to dub your video into. AI will clone the speaker's voice and sync lip movements.",
  },
  {
    icon: Subtitles,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    titleKey: "dashboard.onboarding.step4Title",
    titleFallback: "Add subtitles",
    descKey: "dashboard.onboarding.step4Desc",
    descFallback:
      "Optionally burn subtitles into the video. You can also download SRT/VTT files separately.",
  },
  {
    icon: Play,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    titleKey: "dashboard.onboarding.step5Title",
    titleFallback: "Get your dubbed video",
    descKey: "dashboard.onboarding.step5Desc",
    descFallback:
      "Download or preview the result in minutes. Your first video is completely free — no credit card required.",
  },
];

export function OnboardingWizard({
  onComplete,
  demoProjectId,
}: {
  onComplete: () => void;
  demoProjectId?: string | null;
}) {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const t = useDashboardT();
  const lastStep = STEPS.length - 1;

  async function dismiss() {
    onComplete();
    fetch("/api/profile/onboarding", { method: "PATCH" }).catch(() => {});
  }

  function next() {
    if (step < lastStep) {
      setStep(step + 1);
    } else {
      dismiss();
      router.push("/projects/new");
    }
  }

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[460px] max-w-[90vw] rounded-3xl border border-white/10 bg-slate-900 p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Wizard title */}
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-pink-400 mb-4">
          {t("dashboard.onboarding.wizardTitle", "Getting Started")}
        </p>

        {/* Icon */}
        <div
          className={`mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border ${current.bg}`}
        >
          <Icon className={`h-8 w-8 ${current.color}`} />
        </div>

        {/* Title + desc */}
        <h2 className="text-center text-xl font-bold text-white mb-2">
          {t(current.titleKey, current.titleFallback)}
        </h2>
        <p className="text-center text-sm text-slate-400 leading-relaxed mb-8">
          {t(current.descKey, current.descFallback)}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-pink-500"
                  : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step === lastStep && demoProjectId ? (
            <>
              <button
                onClick={() => {
                  dismiss();
                  router.push(`/projects/${demoProjectId}`);
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                {t("dashboard.onboarding.viewDemo", "View demo")}
              </button>
              <button
                onClick={next}
                className="flex-1 gradient-button rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer"
              >
                {t("dashboard.onboarding.startDubbing", "Start dubbing")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={dismiss}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                {t("dashboard.onboarding.skip", "Skip")}
              </button>
              <button
                onClick={next}
                className="flex-1 gradient-button rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer"
              >
                {t("dashboard.onboarding.next", "Next")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
