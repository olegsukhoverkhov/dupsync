import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTABlock() {
  return (
    <div className="my-12 rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-8 text-center">
      <h3 className="text-xl font-bold text-white">Ready to try AI dubbing?</h3>
      <p className="mt-2 text-sm text-slate-400">
        Start dubbing your videos for free. No credit card required.
      </p>
      <Link
        href="/signup"
        className="mt-4 inline-flex items-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
      >
        Try DubSync Free
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
