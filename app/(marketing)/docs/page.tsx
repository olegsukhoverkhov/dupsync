import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Documentation — DubSync API",
  description:
    "DubSync API documentation. Endpoints, authentication, and code examples for integrating AI video dubbing into your app.",
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/v1/dubs",
    description: "Create a new dubbing job from a video URL or file upload.",
  },
  {
    method: "GET",
    path: "/v1/dubs/:id",
    description: "Retrieve the status and result of a dubbing job.",
  },
  {
    method: "GET",
    path: "/v1/dubs",
    description: "List all dubbing jobs for the authenticated account.",
  },
  {
    method: "DELETE",
    path: "/v1/dubs/:id",
    description: "Delete a dubbing job and its associated files.",
  },
  {
    method: "GET",
    path: "/v1/languages",
    description: "List all supported languages and their codes.",
  },
  {
    method: "GET",
    path: "/v1/usage",
    description: "Get current usage stats and remaining quota for the billing period.",
  },
];

export default function DocsPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Documentation</h1>
          <p className="text-zinc-300 text-lg mb-12">
            Everything you need to integrate DubSync into your application.
          </p>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              All API requests require a Bearer token. Generate an API key from
              your{" "}
              <span className="text-pink-400">Dashboard &rarr; Settings &rarr; API Keys</span>.
            </p>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
              <pre>{`curl https://api.dubsync.app/v1/dubs \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
            </div>
          </section>

          {/* Base URL */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Base URL</h2>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-sm text-zinc-300">
              https://api.dubsync.app
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
            <div className="space-y-4">
              {ENDPOINTS.map((ep) => (
                <div
                  key={ep.method + ep.path}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${
                        ep.method === "POST"
                          ? "bg-green-500/20 text-green-400"
                          : ep.method === "DELETE"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-sm text-white">{ep.path}</code>
                  </div>
                  <p className="text-sm text-zinc-400">{ep.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Example */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Quick Example</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Create a dubbing job that translates a video into Spanish and
              French:
            </p>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
              <pre>{`curl -X POST https://api.dubsync.app/v1/dubs \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_url": "https://example.com/video.mp4",
    "target_languages": ["es", "fr"],
    "voice_clone": true,
    "lip_sync": true
  }'`}</pre>
            </div>
          </section>

          {/* Rate Limits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
            <p className="text-zinc-300 leading-relaxed">
              API rate limits depend on your plan. Free accounts are limited to
              10 requests per minute. Starter and Pro plans allow 60 and 200
              requests per minute respectively. Enterprise customers receive
              custom rate limits. Rate limit headers are included in every
              response.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
