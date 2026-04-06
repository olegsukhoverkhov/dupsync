"use client";

import Link from "next/link";
import { useState } from "react";

const endpoints = [
  { method: "POST", path: "/v1/projects", description: "Create a project and upload video" },
  { method: "POST", path: "/v1/projects/:id/dub", description: "Start dubbing" },
  { method: "GET", path: "/v1/projects/:id", description: "Get project status" },
  { method: "GET", path: "/v1/projects/:id/dubs", description: "List dubs with download URLs" },
  { method: "GET", path: "/v1/languages", description: "List supported languages" },
];

const curlExample = `curl -X POST https://api.dubsync.app/v1/projects \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "video=@video.mp4" \\
  -F "title=My Video" \\
  -F "source_language=en"`;

const nodeExample = `const form = new FormData();
form.append("video", fs.createReadStream("video.mp4"));
form.append("title", "My Video");
form.append("source_language", "en");

const res = await fetch("https://api.dubsync.app/v1/projects", {
  method: "POST",
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  body: form,
});

const project = await res.json();
console.log(project.id);`;

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "node">("curl");

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">API Access</h1>
        <p className="mt-2 text-slate-400">
          Integrate DubSync into your workflow
        </p>
      </div>

      {/* API Key Section */}
      <section className="rounded-xl border border-white/10 bg-slate-800/50 p-5 space-y-4">
        <h2 className="text-xl font-bold text-white">Your API Key</h2>
        <div className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300">
          sk-dub-••••••••••••••••
        </div>
        <div className="flex items-center gap-4">
          <button className="gradient-button rounded-xl px-5 py-2.5 text-sm font-semibold">
            Generate API Key
          </button>
          <span className="text-sm text-slate-400">
            Available on Pro and Enterprise plans
          </span>
        </div>
      </section>

      {/* Base URL */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Base URL</h2>
        <div className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300 overflow-x-auto">
          https://api.dubsync.app/v1
        </div>
      </section>

      {/* Authentication */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Authentication</h2>
        <p className="text-sm text-slate-400">
          Include your API key in the <code className="text-pink-400">Authorization</code> header of every request:
        </p>
        <div className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300 overflow-x-auto">
          Authorization: Bearer YOUR_API_KEY
        </div>
      </section>

      {/* Endpoints */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Endpoints</h2>
        <div className="space-y-2">
          {endpoints.map((ep) => (
            <div
              key={ep.path + ep.method}
              className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300 overflow-x-auto flex flex-col sm:flex-row items-start gap-2 sm:gap-3"
            >
              <span
                className={
                  ep.method === "POST"
                    ? "shrink-0 rounded bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400"
                    : "shrink-0 rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400"
                }
              >
                {ep.method}
              </span>
              <span>{ep.path}</span>
              <span className="sm:ml-auto text-slate-500 font-sans text-xs">
                {ep.description}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Code Example</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("curl")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "curl"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            cURL
          </button>
          <button
            onClick={() => setActiveTab("node")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "node"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Node.js
          </button>
        </div>
        <pre className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
          {activeTab === "curl" ? curlExample : nodeExample}
        </pre>
      </section>

      {/* Rate Limits */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Rate Limits</h2>
        <div className="rounded-xl border border-white/10 bg-slate-800/50 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Pro</p>
              <p className="text-lg font-bold text-white">60 requests/min</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Enterprise</p>
              <p className="text-lg font-bold text-white">300 requests/min</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="rounded-xl border border-white/10 bg-slate-800/50 p-5">
        <p className="text-sm text-slate-400">
          API access is available on Pro ($79/mo) and Enterprise ($199/mo) plans.{" "}
          <Link href="/settings" className="text-pink-400 hover:text-pink-300">
            Upgrade your plan
          </Link>
        </p>
      </section>
    </div>
  );
}
