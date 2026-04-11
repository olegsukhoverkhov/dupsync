"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  Check,
  Trash2,
  Loader2,
  Plus,
  KeyRound,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useDashboardT } from "@/components/dashboard/locale-provider";

const curlExample = `curl -X POST https://dubsync.app/v1/projects \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "video=@video.mp4" \\
  -F "title=My Video" \\
  -F "source_language=en"`;

const nodeExample = `const form = new FormData();
form.append("video", fs.createReadStream("video.mp4"));
form.append("title", "My Video");
form.append("source_language", "en");

const res = await fetch("https://dubsync.app/v1/projects", {
  method: "POST",
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  body: form,
});

const project = await res.json();
console.log(project.id);`;

type ApiKey = {
  id: string;
  name: string | null;
  key_prefix: string;
  last_used_at: string | null;
  last_used_ip: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export default function ApiKeysPage() {
  const t = useDashboardT();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curl" | "node">("curl");

  // Creation flow state
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);

  // One-time reveal modal state — shown right after POST returns the
  // plaintext key so the user can copy it before it disappears forever.
  const [revealed, setRevealed] = useState<{
    name: string | null;
    plaintext: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Revoke confirmation
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const loadKeys = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/keys");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to load keys (${res.status})`);
        return;
      }
      const data = (await res.json()) as { keys: ApiKey[] };
      setKeys(data.keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed (${res.status})`);
        return;
      }
      // Surface plaintext ONCE in the reveal modal
      setRevealed({ name: data.key.name, plaintext: data.key.plaintext });
      setCreateOpen(false);
      setNewKeyName("");
      // Refresh list (doesn't include plaintext)
      loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    setRevoking(id);
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to revoke (${res.status})`);
        return;
      }
      setConfirmRevoke(null);
      loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setRevoking(null);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const activeKeys = keys.filter((k) => !k.revoked_at);

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {t("dashboard.apiKeys.title", "API Access")}
        </h1>
        <p className="mt-2 text-slate-400">
          {t("dashboard.apiKeys.subtitle", "Integrate DubSync into your workflow")}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* API Keys Section */}
      <section className="rounded-xl border border-white/10 bg-slate-800/50 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {t("dashboard.apiKeys.yourApiKey", "Your API Keys")}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t("dashboard.apiKeys.availableOnPlans", "Available on Pro and Business plans")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="gradient-button shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard.apiKeys.generateApiKey", "Generate Key")}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : activeKeys.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/30 p-6 text-center">
            <KeyRound className="h-6 w-6 mx-auto text-slate-600 mb-2" />
            <p className="text-sm text-slate-400">
              No active API keys. Generate one to start using the API.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4"
              >
                <KeyRound className="h-4 w-4 text-pink-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white truncate">
                      {key.name || "Unnamed key"}
                    </span>
                    <code className="text-xs text-slate-500 font-mono">
                      {key.key_prefix}…
                    </code>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Created {new Date(key.created_at).toLocaleDateString()}
                    {key.last_used_at
                      ? ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`
                      : " · Never used"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmRevoke(key.id)}
                  disabled={revoking === key.id}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {revoking === key.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Base URL */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">
          {t("dashboard.apiKeys.baseUrl", "Base URL")}
        </h2>
        <div className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300 overflow-x-auto">
          https://dubsync.app/v1
        </div>
      </section>

      {/* Authentication */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">
          {t("dashboard.apiKeys.authentication", "Authentication")}
        </h2>
        <p className="text-sm text-slate-400">
          {t(
            "dashboard.apiKeys.authenticationDescription",
            "Include your API key in the Authorization header of every request:"
          )}
        </p>
        <div className="rounded-xl bg-slate-800/80 border border-white/10 p-4 font-mono text-sm text-slate-300 overflow-x-auto">
          Authorization: Bearer YOUR_API_KEY
        </div>
      </section>

      {/* Endpoints */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">
          {t("dashboard.apiKeys.endpoints", "Endpoints")}
        </h2>
        <div className="space-y-2">
          {[
            { method: "POST", path: "/v1/projects", description: t("dashboard.apiKeys.endpointCreateProject", "Create a project and upload video") },
            { method: "POST", path: "/v1/projects/:id/dub", description: t("dashboard.apiKeys.endpointStartDubbing", "Start dubbing") },
            { method: "GET", path: "/v1/projects/:id", description: t("dashboard.apiKeys.endpointGetProject", "Get project status") },
            { method: "GET", path: "/v1/projects/:id/dubs", description: t("dashboard.apiKeys.endpointListDubs", "List dubs with download URLs") },
            { method: "GET", path: "/v1/languages", description: t("dashboard.apiKeys.endpointListLanguages", "List supported languages") },
          ].map((ep) => (
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
        <div className="pt-2">
          <Link
            href="/docs/api"
            className="inline-flex items-center gap-1.5 text-sm text-pink-400 hover:text-pink-300"
          >
            Full OpenAPI reference <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">
          {t("dashboard.apiKeys.codeExample", "Code Example")}
        </h2>
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
        <h2 className="text-xl font-bold text-white">
          {t("dashboard.apiKeys.rateLimits", "Rate Limits")}
        </h2>
        <div className="rounded-xl border border-white/10 bg-slate-800/50 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Pro</p>
              <p className="text-lg font-bold text-white">
                {t("dashboard.apiKeys.proRateLimit", "60 requests/min")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Business</p>
              <p className="text-lg font-bold text-white">
                {t("dashboard.apiKeys.enterpriseRateLimit", "300 requests/min")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Create key modal */}
      {createOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => !creating && setCreateOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">New API Key</h3>
            <p className="text-sm text-slate-400 mb-4">
              Give this key a descriptive name so you can identify it later.
            </p>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Production server, CI pipeline"
              maxLength={80}
              disabled={creating}
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 disabled:opacity-50"
              autoFocus
            />
            <div className="mt-5 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                disabled={creating}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="gradient-button inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate Key"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* One-time reveal modal — plaintext key, shown ONCE */}
      {revealed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-lg rounded-2xl border border-pink-500/30 bg-slate-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Copy your key now
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  This is the only time you&apos;ll see this key. Store it somewhere safe — we can&apos;t show it to you again.
                </p>
              </div>
            </div>

            {revealed.name && (
              <p className="text-xs text-slate-500 mb-2">
                Name: <span className="text-slate-300">{revealed.name}</span>
              </p>
            )}

            <div className="flex gap-2">
              <code className="flex-1 rounded-xl bg-slate-800 border border-white/10 p-3 font-mono text-sm text-pink-300 overflow-x-auto select-all">
                {revealed.plaintext}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(revealed.plaintext)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "gradient-button"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setRevealed(null);
                setCopied(false);
              }}
              className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10"
            >
              I saved my key
            </button>
          </div>
        </div>
      )}

      {/* Revoke confirmation */}
      {confirmRevoke && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setConfirmRevoke(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">Revoke key?</h3>
            <p className="text-sm text-slate-400 mb-5">
              This key will stop working immediately. Any integrations using it will fail with 401 Unauthorized.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmRevoke(null)}
                disabled={revoking !== null}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRevoke(confirmRevoke)}
                disabled={revoking !== null}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
              >
                {revoking !== null ? (
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                ) : (
                  "Revoke"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
