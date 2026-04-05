import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Contact — DubSync",
  description:
    "Get in touch with the DubSync team. Support, sales, and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-zinc-300 text-lg mb-12">
            Have a question, need support, or want to discuss enterprise
            pricing? We would love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">General Inquiries</h2>
                <a
                  href="mailto:hello@dubsync.app"
                  className="text-pink-400 hover:text-pink-300"
                >
                  hello@dubsync.app
                </a>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Support</h2>
                <a
                  href="mailto:support@dubsync.app"
                  className="text-pink-400 hover:text-pink-300"
                >
                  support@dubsync.app
                </a>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Sales &amp; Enterprise</h2>
                <a
                  href="mailto:sales@dubsync.app"
                  className="text-pink-400 hover:text-pink-300"
                >
                  sales@dubsync.app
                </a>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Community</h2>
                <p className="text-zinc-400">
                  Join us on{" "}
                  <a
                    href="https://discord.gg/dubsync"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300"
                  >
                    Discord
                  </a>{" "}
                  for real-time help and feature discussions.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <form
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="gradient-button rounded-lg px-6 py-2.5 text-sm font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <BreadcrumbSchema items={[{ name: "Contact", url: "https://dubsync.app/contact" }]} />
    </div>
  );
}
