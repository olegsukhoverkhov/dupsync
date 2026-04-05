import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-violet-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[128px]" />

      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center relative">
        <h2 className="text-4xl sm:text-5xl font-bold">
          Ready to go{" "}
          <span className="gradient-text">global</span>?
        </h2>
        <p className="mt-6 text-lg text-zinc-400">
          Join 2,000+ creators who are reaching new audiences with AI-powered dubbing.
          Start for free — no credit card required.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-10 py-4 text-lg font-semibold"
          >
            Start Dubbing Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-zinc-600">
          No credit card required &middot; 5 free minutes &middot; Cancel anytime
        </p>
      </div>
    </section>
  );
}
