import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Changelog — DubSync",
  description:
    "See what is new in DubSync. Product updates, new features, and improvements.",
  alternates: { canonical: "https://dubsync.app/changelog" },
  openGraph: {
    type: "website",
    title: "Changelog — DubSync",
    description:
      "See what is new in DubSync. Product updates, new features, and improvements.",
    url: "https://dubsync.app/changelog",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync Changelog",
    description: "Product updates, new features, and improvements.",
  },
};

export default function ChangelogPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Changelog</h1>
          <p className="text-zinc-300 text-lg mb-12">
            A log of new features, improvements, and fixes shipped to DubSync.
          </p>

          {/* Entry */}
          <article className="relative border-l-2 border-pink-500/40 pl-8 pb-12">
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-pink-500 bg-[#0F172A]" />
            <time className="text-sm text-zinc-500">April 2026</time>
            <h2 className="text-xl font-semibold mt-1 mb-3">Launch</h2>
            <ul className="space-y-2 text-zinc-300">
              <li>DubSync is live. AI-powered video dubbing with voice cloning and lip sync.</li>
              <li>Support for 30+ languages on day one.</li>
              <li>Free plan with 5 minutes of dubbing per month.</li>
              <li>Starter, Pro, and Enterprise plans available.</li>
              <li>REST API with full documentation.</li>
              <li>Dashboard with real-time dubbing progress and history.</li>
            </ul>
          </article>
        </div>
      </main>
      <Footer />
      <BreadcrumbSchema items={[{ name: "Changelog", url: "https://dubsync.app/changelog" }]} />
    </div>
  );
}
