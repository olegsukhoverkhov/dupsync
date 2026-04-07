"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does voice cloning work?",
    a: "DubSync uses AI to analyze the speaker's voice characteristics — pitch, tone, accent, and emotion — from the original video. It then generates new speech in the target language that preserves these characteristics, so the dubbed version sounds like the same person speaking a different language.",
  },
  {
    q: "What video formats are supported?",
    a: "DubSync supports MP4, MOV, AVI, WebM, and MKV formats. The maximum file size depends on your plan: 100MB for Free, 500MB for Starter, 2GB for Pro, and 5GB for Enterprise.",
  },
  {
    q: "How long does dubbing take?",
    a: "Most videos are processed in 2-5 minutes. A typical 10-minute video takes about 3 minutes to dub into one language. You can dub into multiple languages simultaneously — they all process in parallel.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes 1 video up to 1 minute with lip sync and voice cloning. No credit card required.",
  },
  {
    q: "How accurate is the lip sync?",
    a: "DubSync uses AI lip-sync technology to automatically adjust mouth movements to match the new audio. Our users report a 95-98% accuracy rate, making it nearly indistinguishable from native speech.",
  },
  {
    q: "Can I edit the translation before dubbing?",
    a: "Yes. After the AI generates the translation, you can review and edit the script before generating the final dubbed audio. This gives you full control over the accuracy and tone of the translation.",
  },
  {
    q: "What languages does DubSync support?",
    a: "DubSync supports over 30 languages including Spanish, French, German, Japanese, Korean, Chinese (Mandarin), Hindi, Arabic, Portuguese, Italian, Turkish, Indonesian, Russian, Polish, Dutch, Swedish, and more.",
  },
  {
    q: "Can DubSync handle multiple speakers in one video?",
    a: "Yes. DubSync automatically detects and separates multiple speakers, cloning each voice individually. This works great for interviews, panel discussions, podcasts, and multi-speaker presentations.",
  },
  {
    q: "How much does AI video dubbing cost?",
    a: "DubSync offers a free plan (1 video up to 1 minute), Starter at $19.99/month (20 credits), Pro at $49.99/month (50 credits), and Business at $149.99/month (150 credits). Annual billing saves 20%. Every credit includes lip sync.",
  },
  {
    q: "What does 1 credit mean in DubSync?",
    a: "1 credit = 1 minute of dubbed video in 1 target language, always with lip sync included. A 5-minute video into 3 languages uses 15 credits. No hidden multipliers.",
  },
  {
    q: "Does DubSync include lip sync on all plans?",
    a: "Yes. Every paid plan includes lip sync in every credit — no extra charges, no separate pools, no credit multipliers. Even the free plan includes lip sync.",
  },
  {
    q: "Is DubSync better than traditional dubbing?",
    a: "For digital content, marketing videos, e-learning, and social media — yes. AI dubbing is 10-100x faster and more affordable. Traditional dubbing studios still excel for theatrical releases where maximum emotional nuance is required.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-white pr-4">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-slate-500 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* Always in DOM for SSR/SEO — CSS controls visibility */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
