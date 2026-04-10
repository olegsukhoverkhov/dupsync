import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getElevenLabsQuota, getFalAiBalance } from "@/lib/ai";
import { getFishAudioQuota } from "@/lib/fish-audio";
import { QuotaCard } from "@/components/admin/quota-card";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Mic,
  Archive,
  Fish,
  Type,
  Video,
  Key,
  Database,
  Check,
  X,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminUsagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) notFound();

  const [elevenLabsQuota, fishQuota, falBalance] = await Promise.all([
    getElevenLabsQuota(),
    getFishAudioQuota(),
    getFalAiBalance(),
  ]);

  // Check which API keys are configured (non-empty, non-placeholder)
  const keyStatus = (envVar: string | undefined): boolean =>
    !!envVar && envVar.length > 10 && !envVar.startsWith("placeholder") && !envVar.startsWith("sk-placeholder");

  const services = [
    { name: "Supabase", key: "SUPABASE_SERVICE_ROLE_KEY", configured: keyStatus(process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { name: "Anthropic", key: "ANTHROPIC_API_KEY", configured: keyStatus(process.env.ANTHROPIC_API_KEY) },
    { name: "OpenAI", key: "OPENAI_API_KEY", configured: keyStatus(process.env.OPENAI_API_KEY) },
    { name: "Shotstack", key: "SHOTSTACK_API_KEY", configured: keyStatus(process.env.SHOTSTACK_API_KEY) },
    { name: "Stripe", key: "STRIPE_SECRET_KEY", configured: keyStatus(process.env.STRIPE_SECRET_KEY) },
  ];

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Service Usage
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          API quotas, balances, and service status for all external providers.
        </p>
      </header>

      <AdminNav />

      {/* ── fal.ai ──────────────────────────────────────────── */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          fal.ai — Lip sync & video processing
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <div className={`rounded-2xl border p-5 ${
          falBalance && falBalance.balance < 1
            ? "border-red-500/20 bg-slate-800/50"
            : "border-white/10 bg-slate-800/50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              falBalance && falBalance.balance < 1
                ? "bg-red-500/10"
                : "bg-violet-500/10"
            }`}>
              <Video className={`h-5 w-5 ${
                falBalance && falBalance.balance < 1
                  ? "text-red-400"
                  : "text-violet-400"
              }`} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Account balance
            </p>
          </div>
          <p className={`mt-3 text-3xl font-bold tabular-nums ${
            falBalance && falBalance.balance < 1
              ? "text-red-400"
              : "text-violet-400"
          }`}>
            {falBalance ? `$${falBalance.balance.toFixed(2)}` : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {falBalance && falBalance.balance < 1
              ? "⚠ Balance exhausted — lip sync will fail"
              : "Lip sync (latentsync) + ffmpeg compose"}
          </p>
        </div>
      </div>

      {/* ── Voice cloning: Fish Audio (active) ──────────────── */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Voice cloning
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
            <Fish className="h-3 w-3" />
            Fish Audio — active
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Fish Audio: primary (all plans, unlimited clones). ElevenLabs: fallback only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Fish className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              API credits
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-emerald-400">
            {fishQuota ? `$${fishQuota.credit.toFixed(2)}` : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Pay-as-you-go · ~$0.0006/clone · No monthly quota
          </p>
        </div>
        <QuotaCard
          icon={<Mic className="h-5 w-5" />}
          label="Private voice slots"
          used={fishQuota?.privateModelsUsed}
          max={fishQuota?.privateModelsMax}
          subtitle="Models created by DubSync — freed after each dub"
        />
      </div>

      {/* ── ElevenLabs (fallback) ────────────────────────────── */}
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            ElevenLabs
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            fallback only
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Pre-made voices for unsupported languages
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <QuotaCard
          icon={<Mic className="h-5 w-5" />}
          label="Voice clones / month"
          used={elevenLabsQuota?.voiceAddEditUsed}
          max={elevenLabsQuota?.voiceAddEditMax}
          subtitle="voice_add_edit_counter — blocks new clones when full"
        />
        <QuotaCard
          icon={<Archive className="h-5 w-5" />}
          label="Voice slots"
          used={elevenLabsQuota?.voiceSlotsUsed}
          max={elevenLabsQuota?.voiceSlotsMax}
          subtitle="Cleanup orphaned clones to free slots"
        />
        <QuotaCard
          icon={<Type className="h-5 w-5" />}
          label="TTS characters"
          used={elevenLabsQuota?.characterUsed}
          max={elevenLabsQuota?.characterMax}
          subtitle="Monthly character allowance for TTS"
        />
      </div>

      {/* ── Other services ──────────────────────────────────── */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Other services
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          API key status — green means configured, red means missing or placeholder
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/50 px-5 py-4"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              s.configured ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}>
              {s.configured ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <X className="h-4 w-4 text-red-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{s.name}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                {s.key}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
