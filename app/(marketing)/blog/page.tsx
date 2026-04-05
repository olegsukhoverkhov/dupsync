import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Blog — DubSync",
  description:
    "News, tutorials, and insights on AI video dubbing, voice cloning, and multilingual content creation.",
};

export default function BlogPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <p className="text-zinc-300 text-lg mb-12">
            Insights on AI dubbing, multilingual content strategy, and product
            updates from the DubSync team.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              We are working on our first posts. Subscribe below to get notified
              when we publish.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="gradient-button rounded-lg px-6 py-2.5 text-sm font-medium whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
