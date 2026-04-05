"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 2000000, label: "Minutes Dubbed", suffix: "M+", display: "2" },
  { value: 30, label: "Languages", suffix: "+", display: "30" },
  { value: 10000, label: "Videos Processed", suffix: "K+", display: "10" },
  { value: 98, label: "Satisfaction Rate", suffix: "%", display: "98" },
];

function AnimatedNumber({ target, suffix }: { target: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const num = parseInt(target);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const steps = 40;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, num]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-white">
      {count}{suffix}
    </div>
  );
}

export function StatsBanner() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <AnimatedNumber target={stat.display} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
