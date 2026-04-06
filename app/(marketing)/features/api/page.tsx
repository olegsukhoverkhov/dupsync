import { Metadata } from "next";
import Link from "next/link";
import {
  Code,
  ArrowRight,
  Zap,
  Shield,
  Webhook,
  Server,
  Clock,
  FileJson,
  Layers,
  Lock,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";

export const metadata: Metadata = {
  title: "Video Dubbing API — Integrate AI Dubbing Into Your Product | DubSync",
  description:
    "Integrate DubSync's AI video dubbing into your product with our REST API. Voice cloning, lip sync, and translation — all programmable.",
  alternates: { canonical: "https://dubsync.app/features/api" },
  openGraph: {
    type: "website",
    title: "Video Dubbing API — Integrate AI Dubbing Into Your Product",
    description:
      "Integrate DubSync's AI video dubbing into your product with our REST API.",
    url: "https://dubsync.app/features/api",
    images: ["/og-image.png"],
  },
};

const CODE_EXAMPLE = `curl -X POST https://api.dubsync.app/v1/dub \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_url": "https://example.com/video.mp4",
    "target_languages": ["es", "fr", "ja"],
    "voice_cloning": true,
    "lip_sync": true,
    "webhook_url": "https://yourapp.com/webhook/dubsync"
  }'`;

const CAPABILITIES = [
  {
    icon: Zap,
    title: "One-call dubbing",
    description:
      "Submit a video URL, target languages, and options in a single POST request. DubSync handles transcription, translation, voice cloning, and lip sync end to end.",
  },
  {
    icon: Webhook,
    title: "Webhook notifications",
    description:
      "Register a webhook URL and receive real-time updates when jobs start processing, complete, or encounter errors. No polling required.",
  },
  {
    icon: Layers,
    title: "Batch processing",
    description:
      "Submit multiple videos in a single batch request. Each video is processed in parallel and results are delivered individually as they complete.",
  },
  {
    icon: FileJson,
    title: "Script access",
    description:
      "Retrieve the generated transcript, translated script, and timing data via the API. Edit scripts programmatically and re-submit for re-dubbing.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    description:
      "All API traffic is encrypted over TLS 1.3. API keys are scoped to specific permissions and can be rotated at any time from your dashboard.",
  },
  {
    icon: Clock,
    title: "Usage tracking",
    description:
      "Query your current usage, remaining credits, and job history through dedicated endpoints. Build billing integrations and usage dashboards on top of the API.",
  },
];

const TECH_SPECS = [
  { label: "Protocol", value: "HTTPS REST (JSON)" },
  { label: "Authentication", value: "Bearer token (API key)" },
  { label: "Rate limit", value: "60 requests/min (Pro), 300/min (Enterprise)" },
  { label: "Max video size", value: "5 GB per file" },
  { label: "Max video duration", value: "2 hours" },
  { label: "Supported formats", value: "MP4, MOV, WebM" },
  { label: "Output format", value: "MP4 (H.264 + AAC)" },
  { label: "Webhooks", value: "HMAC-SHA256 signed payloads" },
  { label: "SDKs", value: "Python, Node.js, Go (coming soon)" },
  { label: "Uptime SLA", value: "99.9% (Enterprise)" },
];

const FAQS = [
  {
    question: "Which plans include API access?",
    answer:
      "The API is available on Pro and Enterprise plans. Pro includes 60 requests per minute and standard rate limits. Enterprise unlocks higher throughput, priority processing, and a dedicated support channel. See the pricing page for full details.",
  },
  {
    question: "How do I authenticate API requests?",
    answer:
      "Create an API key from your DubSync dashboard under Settings > API Keys. Pass it as a Bearer token in the Authorization header of every request. You can create multiple keys with different permission scopes and revoke them at any time.",
  },
  {
    question: "Is there a sandbox environment for testing?",
    answer:
      "Yes. Every API key works in sandbox mode by default. Sandbox requests process a 30-second preview of your video at no cost. Switch to production mode when you are ready to process full videos and deduct credits.",
  },
  {
    question: "What happens if a dubbing job fails?",
    answer:
      "Failed jobs return a detailed error object with a machine-readable error code and human-readable message. Common failures include unsupported formats, corrupt files, or insufficient credits. Your webhook receives a failure notification with the same error details.",
  },
];

export default function ApiPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Features", url: "https://dubsync.app/features" },
          { name: "API", url: "https://dubsync.app/features/api" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400">
            <Code className="h-3.5 w-3.5" /> API
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Video dubbing API{" "}
            <span className="gradient-text">
              for developers and teams
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Integrate AI video dubbing directly into your product. One API call
            to transcribe, translate, clone voices, and sync lips across 30+
            languages.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-button rounded-lg px-6 py-3 text-sm font-medium"
            >
              Get API access
            </Link>
            <Link
              href="/docs"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
            >
              Read the docs
            </Link>
          </div>
        </section>

        {/* Code example */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Dub a video in{" "}
            <span className="gradient-text">one request</span>
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-zinc-500 font-mono">
                terminal
              </span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
              <code className="text-zinc-300 font-[family-name:var(--font-geist-mono)]">
                {CODE_EXAMPLE}
              </code>
            </pre>
          </div>
          <p className="mt-4 text-center text-sm text-zinc-500">
            Full API reference and code examples in{" "}
            <Link href="/docs" className="text-pink-400 hover:underline">
              the documentation
            </Link>
            .
          </p>
        </section>

        {/* Key capabilities */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Key <span className="gradient-text">capabilities</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <cap.icon className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical specs */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Technical <span className="gradient-text">specs</span>
          </h2>
          <div className="rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {TECH_SPECS.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={
                      i < TECH_SPECS.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium text-zinc-300 whitespace-nowrap">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-right">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing link */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-8">
            <Server className="h-8 w-8 text-pink-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">API pricing</h2>
            <p className="text-sm text-zinc-400 mb-4 max-w-md mx-auto">
              API access is included on Pro and Enterprise plans. Pro starts at
              $29/mo with 60 minutes of dubbing. Enterprise plans include
              custom volume pricing and priority processing.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm text-pink-400 hover:gap-2 transition-all"
            >
              View full pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Start building with the DubSync API
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Create an account, generate an API key, and submit your first
              dubbing job in under 5 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="gradient-button rounded-lg px-8 py-3 text-sm font-medium"
              >
                Get started free
              </Link>
              <Link
                href="/docs"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
              >
                API documentation
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <FaqAccordion items={FAQS} />
        </section>

        {/* Related features */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">
            Related features
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/features/voice-cloning"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Voice Cloning
            </Link>
            <Link
              href="/features/lip-sync"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Lip Sync
            </Link>
            <Link
              href="/features/video-translation"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Video Translation
            </Link>
            <Link
              href="/features"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              All features
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
