"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does voice cloning work?",
    a: "Our AI analyzes the speaker's voice from the original video — capturing tone, pitch, accent, and speaking style. It then generates speech in the target language that sounds like the original speaker. No voice samples or recordings needed beyond the video itself.",
  },
  {
    q: "What video formats are supported?",
    a: "We support all major video formats including MP4, MOV, AVI, WebM, and MKV. Files can be up to 5GB depending on your plan. We process videos at their original resolution, up to 4K.",
  },
  {
    q: "How long does dubbing take?",
    a: "Most videos are dubbed in under 3 minutes per language. A 10-minute video typically takes about 2-3 minutes to process. You can dub into multiple languages simultaneously — they all process in parallel.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! Our free plan includes 5 minutes of dubbing per month in up to 2 languages. No credit card required. It's a great way to test the quality before upgrading.",
  },
  {
    q: "How accurate is the lip sync?",
    a: "Our lip-sync technology uses AI to match mouth movements to the dubbed audio. The result is natural-looking video where viewers typically can't tell it's been dubbed. Accuracy rates average 96-98%.",
  },
  {
    q: "Can I edit the translation before dubbing?",
    a: "Absolutely. After transcription, you can review and edit both the original transcript and the translations. This gives you full control over the final output before generating the dubbed video.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="text-base font-medium text-white pr-4">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-5 animate-fade-in">
          <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function Faq() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>

        <div>
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
