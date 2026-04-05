"use client";

import { useEffect, useState } from "react";

interface ProcessingIndicatorProps {
  label: string;
  sublabel?: string;
  steps?: string[];
  currentStep?: number;
}

export function ProcessingIndicator({
  label,
  sublabel,
  steps,
  currentStep = 0,
}: ProcessingIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setProgress((prev) => {
        if (prev >= 90) return 90 + Math.random() * 2;
        return prev + (90 - prev) * 0.05;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="flex flex-col items-center py-12 px-4">
      {/* Animated ring */}
      <div className="relative h-20 w-20 mb-6">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/5"
          />
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-white">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Label */}
      <p className="text-base font-medium text-white">{label}</p>
      {sublabel && (
        <p className="mt-1 text-sm text-slate-400">{sublabel}</p>
      )}

      {/* Steps */}
      {steps && steps.length > 0 && (
        <div className="mt-6 w-full max-w-xs space-y-2">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                i < currentStep
                  ? "bg-green-500/20"
                  : i === currentStep
                    ? "bg-pink-500/20"
                    : "bg-white/5"
              }`}>
                {i < currentStep ? (
                  <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === currentStep ? (
                  <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                )}
              </div>
              <span className={`text-sm ${
                i < currentStep
                  ? "text-slate-500 line-through"
                  : i === currentStep
                    ? "text-white font-medium"
                    : "text-slate-600"
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-6 w-full max-w-xs">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600">
          <span>Elapsed: {formatTime(elapsed)}</span>
          <span>Processing...</span>
        </div>
      </div>
    </div>
  );
}
