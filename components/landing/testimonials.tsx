"use client";

import { Star, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

const TESTIMONIALS = [
  {
    quote: "DubSync doubled my international audience in two months. The voice cloning is so good that my Spanish viewers genuinely think I speak Spanish. Game changer for any creator going global.",
    name: "Daniel Moretti",
    role: "YouTube Creator",
    detail: "1.2M subscribers",
    avatar: "/avatars/1.jpg",
    gradient: "from-blue-500 to-cyan-500",
    rating: 5,
  },
  {
    quote: "We used to spend $5,000 per language for professional dubbing. DubSync does it in minutes for a fraction of the cost. The lip sync is incredible — our students can't tell it's AI.",
    name: "Tomáš Novák",
    role: "Head of Content",
    detail: "EduTech Pro",
    avatar: "/avatars/2.jpg",
    gradient: "from-violet-500 to-pink-500",
    rating: 4.5,
  },
  {
    quote: "Our product demos now reach 15 markets instead of 3. DubSync paid for itself in the first week. It's a no-brainer for any global marketing team.",
    name: "Marcus Johnson",
    role: "Marketing Director",
    detail: "ScaleUp Agency",
    avatar: "/avatars/3.jpg",
    gradient: "from-amber-500 to-orange-500",
    rating: 5,
  },
  {
    quote: "I run a cooking channel and needed my recipes in Japanese and Korean. DubSync nailed the tone — warm and conversational, not robotic. My Asian audience grew 400% in 3 months.",
    name: "Elena Petrova",
    role: "Content Creator",
    detail: "850K subscribers",
    avatar: "/avatars/4.jpg",
    gradient: "from-green-500 to-emerald-500",
    rating: 4,
  },
  {
    quote: "As a solo developer, I integrated DubSync's API into our LMS in one afternoon. Now every course we publish automatically gets dubbed into 6 languages. The documentation is clear and the API is rock solid.",
    name: "Mikael Lindström",
    role: "CTO",
    detail: "LearnFlow",
    avatar: "/avatars/5.jpg",
    gradient: "from-red-500 to-pink-500",
    rating: 5,
  },
  {
    quote: "I was skeptical about AI dubbing until I tried DubSync. The voice cloning captured my energy and enthusiasm perfectly. My French and German versions sound like me, not a text-to-speech bot.",
    name: "Sophia Andersson",
    role: "Podcast Host",
    detail: "The Global Show",
    avatar: "/avatars/6.jpg",
    gradient: "from-cyan-500 to-blue-500",
    rating: 4.5,
  },
  {
    quote: "We localize corporate training videos for 12 countries. Before DubSync it took 3 weeks per language. Now it's done in a day. The quality is consistent and our compliance team approved it.",
    name: "James O'Brien",
    role: "L&D Manager",
    detail: "Fortune 500 Company",
    avatar: "/avatars/7.jpg",
    gradient: "from-indigo-500 to-violet-500",
    rating: 4.5,
  },
  {
    quote: "DubSync helped me turn my English fitness tutorials into a Spanish-language brand. The lip sync makes it look completely natural. My Latino audience engagement is through the roof.",
    name: "Rachel Torres",
    role: "Fitness Influencer",
    detail: "2.1M followers",
    avatar: "/avatars/8.jpg",
    gradient: "from-pink-500 to-rose-500",
    rating: 5,
  },
];

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < Math.floor(rating)) {
          // Full star
          return <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />;
        }
        if (i < rating) {
          // Half star
          return (
            <div key={i} className="relative h-3.5 w-3.5">
              <Star className="absolute h-3.5 w-3.5 text-amber-400/30" />
              <div className="absolute overflow-hidden w-[50%] h-full">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </div>
            </div>
          );
        }
        // Empty star
        return <Star key={i} className="h-3.5 w-3.5 text-amber-400/30" />;
      })}
    </div>
  );
}

function Avatar({ src, name, gradient }: { src: string; name: string; gradient: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`relative h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden`}>
      {!imgError ? (
        <Image
          src={src}
          alt={name}
          width={40}
          height={40}
          className="absolute inset-0 w-full h-full object-cover rounded-full z-10"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
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
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll slowly
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 0.5; // pixels per frame
    let animId: number;

    function step() {
      if (!el || isUserScrolling) {
        animId = requestAnimationFrame(step);
        return;
      }
      el.scrollLeft += speed;
      // Loop: when scrolled past halfway (duplicate content), reset
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isUserScrolling]);

  // Pause auto-scroll on user interaction, resume after 3s
  const pauseAutoScroll = useCallback(() => {
    setIsUserScrolling(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsUserScrolling(false), 3000);
  }, []);

  // Mouse drag to scroll
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = scrollRef.current?.scrollLeft || 0;
    pauseAutoScroll();
  }, [pauseAutoScroll]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartX.current - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

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
              {Array.from({ length: 5 }).map((_, i) => {
                if (i < 4) return <Star key={i} className="h-4 w-4 fill-[#00B67A] text-[#00B67A]" />;
                // 5th star: 80% filled for 4.8 rating
                return (
                  <div key={i} className="relative h-4 w-4">
                    <Star className="absolute h-4 w-4 text-[#00B67A]/30" />
                    <div className="absolute overflow-hidden w-[80%] h-full">
                      <Star className="h-4 w-4 fill-[#00B67A] text-[#00B67A]" />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-white font-semibold">4.8/5</span>
            <span className="text-xs text-slate-400 hidden sm:inline">Rated on <span className="text-[#00B67A] font-medium">Trustpilot</span> &middot; 2,000+ reviews</span>
          </div>
        </div>

        {/* Scrollable auto-moving carousel */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={pauseAutoScroll}
            onWheel={pauseAutoScroll}
          >
            {/* Duplicate cards for seamless loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="shrink-0 w-[280px] sm:w-[340px] rounded-2xl border border-white/10 bg-slate-800/40 p-5 hover:border-white/20 transition-all flex flex-col select-none"
              >
                <Stars rating={t.rating} />
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
        </div>
      </div>
    </section>
  );
}
