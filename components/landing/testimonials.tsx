"use client";

import { Star, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

const TESTIMONIALS = [
  {
    quote: "DubSync doubled my international audience in two months. The voice cloning is so good that my Spanish viewers genuinely think I speak Spanish. Game changer for any creator going global.",
    name: "Daniel Moretti",
    role: "YouTube Creator",
    detail: "1.2M subscribers",
    avatar: "/avatars/1.jpg",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote: "We used to spend $5,000 per language for professional dubbing. DubSync does it in minutes for a fraction of the cost. The lip sync is incredible — our students can't tell it's AI.",
    name: "Tomáš Novák",
    role: "Head of Content",
    detail: "EduTech Pro",
    avatar: "/avatars/2.jpg",
    gradient: "from-violet-500 to-pink-500",
  },
  {
    quote: "Our product demos now reach 15 markets instead of 3. DubSync paid for itself in the first week. It's a no-brainer for any global marketing team.",
    name: "Marcus Johnson",
    role: "Marketing Director",
    detail: "ScaleUp Agency",
    avatar: "/avatars/3.jpg",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    quote: "I run a cooking channel and needed my recipes in Japanese and Korean. DubSync nailed the tone — warm and conversational, not robotic. My Asian audience grew 400% in 3 months.",
    name: "Elena Petrova",
    role: "Content Creator",
    detail: "850K subscribers",
    avatar: "/avatars/4.jpg",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    quote: "As a solo developer, I integrated DubSync's API into our LMS in one afternoon. Now every course we publish automatically gets dubbed into 6 languages. The documentation is clear and the API is rock solid.",
    name: "Mikael Lindström",
    role: "CTO",
    detail: "LearnFlow",
    avatar: "/avatars/5.jpg",
    gradient: "from-red-500 to-pink-500",
  },
  {
    quote: "I was skeptical about AI dubbing until I tried DubSync. The voice cloning captured my energy and enthusiasm perfectly. My French and German versions sound like me, not a text-to-speech bot.",
    name: "Sophia Andersson",
    role: "Podcast Host",
    detail: "The Global Show",
    avatar: "/avatars/6.jpg",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    quote: "We localize corporate training videos for 12 countries. Before DubSync it took 3 weeks per language. Now it's done in a day. The quality is consistent and our compliance team approved it.",
    name: "James O'Brien",
    role: "L&D Manager",
    detail: "Fortune 500 Company",
    avatar: "/avatars/7.jpg",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    quote: "DubSync helped me turn my English fitness tutorials into a Spanish-language brand. The lip sync makes it look completely natural. My Latino audience engagement is through the roof.",
    name: "Rachel Torres",
    role: "Fitness Influencer",
    detail: "2.1M followers",
    avatar: "/avatars/8.jpg",
    gradient: "from-pink-500 to-rose-500",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function Avatar({ src, name, gradient }: { src: string; name: string; gradient: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`relative h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden`}>
      {!imgError && (
        <Image
          src={src}
          alt={name}
          width={40}
          height={40}
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      )}
      <span className="relative z-0">{initials}</span>
    </div>
  );
}

// Trustpilot star icon (green)
function TrustpilotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00B67A" />
    </svg>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Loved by <span className="gradient-text">creators</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            Join thousands of creators who are reaching global audiences
          </p>
          {/* Trustpilot rating */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5">
            <TrustpilotIcon />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#00B67A] text-[#00B67A]" />
              ))}
            </div>
            <span className="text-sm text-white font-semibold">4.8/5</span>
            <span className="text-xs text-slate-400 hidden sm:inline">Rated on <span className="text-[#00B67A] font-medium">Trustpilot</span> &middot; 2,000+ reviews</span>
          </div>
        </div>

        {/* Horizontal scroll carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="snap-start shrink-0 w-[320px] sm:w-[360px] rounded-2xl border border-white/10 bg-slate-800/40 p-5 hover:border-white/20 transition-all flex flex-col"
              >
                <Stars />
                <p className="mt-3 text-slate-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                  <Avatar src={t.avatar} name={t.name} gradient={t.gradient} />
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} &middot; {t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => {
                  scrollRef.current?.children[i]?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className="h-1.5 w-6 rounded-full bg-white/10 hover:bg-white/30 transition-colors cursor-pointer"
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
