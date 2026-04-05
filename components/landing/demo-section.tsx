"use client";

import { useState, useEffect } from "react";
import { Upload, Cpu, Download, Check, Loader2 } from "lucide-react";

const TABS = [
  {
    id: "upload",
    label: "Upload",
    icon: Upload,
    description: "Drag & drop your video",
  },
  {
    id: "process",
    label: "AI Processing",
    icon: Cpu,
    description: "AI does the heavy lifting",
  },
  {
    id: "download",
    label: "Download",
    icon: Download,
    description: "Get dubbed videos",
  },
];

const PROCESS_STEPS = [
  { label: "Transcribing audio", done: true },
  { label: "Translating to Spanish", done: true },
  { label: "Cloning speaker voice", done: true },
  { label: "Syncing lip movements", done: false },
];

const DOWNLOAD_LANGS = [
  { flag: "🇪🇸", lang: "Spanish", ready: true },
  { flag: "🇫🇷", lang: "French", ready: true },
  { flag: "🇩🇪", lang: "German", ready: true },
  { flag: "🇯🇵", lang: "Japanese", ready: false },
  { flag: "🇰🇷", lang: "Korean", ready: false },
  { flag: "🇧🇷", lang: "Portuguese", ready: false },
];

export function DemoSection() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            See it <span className="gradient-text">in action</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Three steps. That&apos;s all it takes to reach a global audience.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                activeTab === i
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-8 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            key={activeTab}
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
            style={{ animation: "progress-bar 4s linear forwards" }}
          />
        </div>

        {/* Tab content */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-8 min-h-[320px]">
            {activeTab === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 animate-fade-in">
                <div className="w-full max-w-md border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-blue-500/30 transition-colors">
                  <Upload className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-white font-medium">Drop your video here</p>
                  <p className="text-zinc-500 text-sm mt-1">MP4, MOV, AVI up to 5GB</p>
                </div>
                <div className="mt-6 flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 w-full max-w-md">
                  <div className="h-10 w-10 rounded bg-blue-500/20 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">product-demo.mp4</p>
                    <p className="text-xs text-zinc-500">245 MB</p>
                  </div>
                  <Check className="h-5 w-5 text-green-400" />
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="py-8 animate-fade-in">
                <div className="max-w-md mx-auto space-y-4">
                  {PROCESS_STEPS.map((step, i) => (
                    <div key={step.label} className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        step.done
                          ? "bg-green-500/20"
                          : "bg-blue-500/20"
                      }`}>
                        {step.done ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                        )}
                      </div>
                      <span className={`text-sm ${step.done ? "text-zinc-400" : "text-white font-medium"}`}>
                        {step.label}
                      </span>
                      {step.done && (
                        <span className="text-xs text-zinc-600 ml-auto">Done</span>
                      )}
                      {!step.done && (
                        <span className="text-xs text-blue-400 ml-auto">Processing...</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 max-w-md mx-auto">
                  <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>Overall progress</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="py-8 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {DOWNLOAD_LANGS.map((lang) => (
                    <div
                      key={lang.lang}
                      className={`rounded-xl border p-4 text-center transition-all ${
                        lang.ready
                          ? "border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
                          : "border-white/5 bg-white/[0.02] opacity-50"
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <p className="text-sm text-white mt-2">{lang.lang}</p>
                      {lang.ready ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                          <Download className="h-3 w-3" /> Ready
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600 mt-1 block">Processing</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
