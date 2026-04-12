import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getElevenLabsQuota, getFalAiBalance } from "@/lib/ai";
import { getFishAudioQuota } from "@/lib/fish-audio";
import { getCartesiaQuota } from "@/lib/cartesia";
import { QuotaCard } from "@/components/admin/quota-card";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Mic,
  Archive,
  Fish,
  Type,
  Video,
  Database,
  Check,
  X,
  Brain,
  Sparkles,
  Clapperboard,
  CreditCard,
  Link2,
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

  const [elevenLabsQuota, fishQuota, falBalance, shotstackUsage, cartesiaQuota, emailUsage] = await Promise.all([
    getElevenLabsQuota(),
    getFishAudioQuota(),
    getFalAiBalance(),
    getShotstackUsage(),
    getCartesiaQuota(),
    getEmailUsage(),
  ]);

  // Check which API keys are configured (non-empty, non-placeholder)
  const keyStatus = (envVar: string | undefined): boolean =>
    !!envVar && envVar.length > 10 && !envVar.startsWith("placeholder") && !envVar.startsWith("sk-placeholder");

  const shotstackConfigured = keyStatus(process.env.SHOTSTACK_API_KEY);
  const dodoConfigured = keyStatus(process.env.DODO_PAYMENTS_API_KEY);
  const supabaseConfigured = keyStatus(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const openaiConfigured = keyStatus(process.env.OPENAI_API_KEY);
  const anthropicConfigured = keyStatus(process.env.ANTHROPIC_API_KEY);
  const cobaltUrl = process.env.COBALT_API_URL || "https://cobalt-production-eda4.up.railway.app";
  const cobaltConfigured = cobaltUrl.length > 10;

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

      {/* ── Voice cloning: Cartesia (primary) + Fish (fallback) ── */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Voice cloning
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
            Cartesia — primary
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            <Fish className="h-3 w-3" />
            Fish — fallback
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Cartesia Sonic-3: 47 languages, instant clone. Fish Audio: fallback for 13 languages. ElevenLabs: premade voices only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <BalanceCard
          icon={<Mic className="h-5 w-5" />}
          label="Cartesia credits"
          value={cartesiaQuota ? `${cartesiaQuota.credits.toLocaleString()}` : "—"}
          color="emerald"
          subtitle="15 credits/sec audio · Pro plan 100K/mo"
        />
        <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Fish className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Fish Audio credits
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-emerald-400">
            {fishQuota ? `$${fishQuota.credit.toFixed(2)}` : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Fallback · Pay-as-you-go
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

      {/* ── Resend — Email ──────────────────────────────────── */}
      <div className="mt-10 mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Resend — Email notifications
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <BalanceCard
          icon={<Mic className="h-5 w-5" />}
          label="Emails sent this month"
          value={emailUsage ? String(emailUsage.sentThisMonth) : "—"}
          color={emailUsage && emailUsage.sentThisMonth > 2500 ? "pink" : "emerald"}
          subtitle="Free tier: 3,000/month"
        />
        <BalanceCard
          icon={<Mic className="h-5 w-5" />}
          label="Remaining"
          value={emailUsage ? String(Math.max(0, 3000 - emailUsage.sentThisMonth)) : "—"}
          color={emailUsage && emailUsage.sentThisMonth > 2500 ? "pink" : "emerald"}
          subtitle="Resets monthly"
        />
      </div>

      {/* ── Other services (status only) ───────────────────── */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Other services
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatusCard name="OpenAI" icon={<Sparkles className="h-4 w-4" />} configured={openaiConfigured} envKey="OPENAI_API_KEY" />
        <StatusCard name="Anthropic" icon={<Brain className="h-4 w-4" />} configured={anthropicConfigured} envKey="ANTHROPIC_API_KEY" />
        <StatusCard name="Supabase" icon={<Database className="h-4 w-4" />} configured={supabaseConfigured} envKey="SUPABASE_SERVICE_ROLE_KEY" />
        <StatusCard name="Shotstack" icon={<Clapperboard className="h-4 w-4" />} configured={shotstackConfigured} envKey="SHOTSTACK_API_KEY" />
        <StatusCard name="Dodo Payments" icon={<CreditCard className="h-4 w-4" />} configured={dodoConfigured} envKey="DODO_PAYMENTS_API_KEY" />
        <StatusCard name="Cobalt (Video Import)" icon={<Link2 className="h-4 w-4" />} configured={cobaltConfigured} envKey={cobaltUrl} />
      </div>

      {/* ── Shotstack usage tracking ─────────────────────────── */}
      <div className="mt-10 mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Shotstack — Subtitle burn-in
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BalanceCard
          icon={<Clapperboard className="h-5 w-5" />}
          label="Credits remaining"
          value={shotstackUsage ? `${shotstackUsage.remaining.toFixed(2)}` : null}
          color={shotstackUsage && shotstackUsage.remaining < 0.5 ? "pink" : "violet"}
          subtitle="Update SHOTSTACK_CREDITS env when balance changes"
        />
        <BalanceCard
          icon={<Clapperboard className="h-5 w-5" />}
          label="Videos burned"
          value={shotstackUsage ? String(shotstackUsage.burnCount) : null}
          color="violet"
          subtitle="Total subtitle burn-in renders"
        />
      </div>
    </div>
  );
}

/* ── Helper components ─────────────────────────────────────── */

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400" },
} as const;

function BalanceCard({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  color: keyof typeof COLOR_MAP;
  subtitle: string;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
      <p className={`mt-3 text-3xl font-bold tabular-nums ${value ? c.text : "text-slate-500"}`}>
        {value ?? "—"}
      </p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function StatusCard({
  name,
  icon,
  configured,
  envKey,
}: {
  name: string;
  icon: React.ReactNode;
  configured: boolean;
  envKey: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/50 px-5 py-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
        configured ? "bg-emerald-500/10" : "bg-red-500/10"
      }`}>
        {configured ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <X className="h-4 w-4 text-red-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{icon}</span>
          <p className="text-sm font-medium text-white">{name}</p>
        </div>
        <p className="text-[10px] text-slate-500 font-mono truncate">{envKey}</p>
      </div>
    </div>
  );
}

/* ── Data fetchers ─────────────────────────────────────────── */

/**
 * Track Shotstack usage. Shotstack has no billing API, so:
 * - SHOTSTACK_CREDITS = current remaining balance from their dashboard
 * - We count our own renders from the DB for "videos burned" stat
 *
 * When you top up or see a new balance on dashboard.shotstack.io,
 * update SHOTSTACK_CREDITS in Vercel env to match.
 */
async function getShotstackUsage(): Promise<{
  remaining: number;
  burnCount: number;
} | null> {
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    const { count } = await supabase
      .from("dubs")
      .select("id", { count: "exact", head: true })
      .eq("has_burned_subs", true)
      .not("dubbed_video_with_subs_url", "is", null);

    const remaining = Number(process.env.SHOTSTACK_CREDITS || 0);
    return {
      remaining,
      burnCount: count || 0,
    };
  } catch {
    return null;
  }
}

/**
 * Count emails sent this month from email_log table.
 */
async function getEmailUsage(): Promise<{ sentThisMonth: number } | null> {
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    return { sentThisMonth: count || 0 };
  } catch {
    return null;
  }
}
