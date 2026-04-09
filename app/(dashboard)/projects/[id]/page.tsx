"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SmoothDubProgress, SmoothDubBadge } from "@/components/project/smooth-dub-progress";
import { TranscriptEditor } from "@/components/project/transcript-editor";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGE_MAP } from "@/lib/supabase/constants";
import type {
  Project,
  Dub,
  DubStatus,
  TranscriptSegment,
} from "@/lib/supabase/types";
import {
  ArrowLeft,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Play,
  X,
  RefreshCw,
  ArrowUpRight,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { AlertModal } from "@/components/ui/modal";
import { UpgradeModal } from "@/components/dashboard/upgrade-modal";
import { TopupModal } from "@/components/dashboard/topup-modal";
import { LanguageSelector } from "@/components/project/language-selector";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile, PlanType } from "@/lib/supabase/types";
import { useDashboardT } from "@/components/dashboard/locale-provider";

// Video info card showing quality details and upgrade CTA
function DubInfoCard({ dub, plan }: { dub: Dub; plan: PlanType }) {
  const t = useDashboardT();
  const langName = LANGUAGE_MAP[dub.target_language] || dub.target_language;
  const isVideo = dub.dubbed_video_url?.includes("dubbed-video");
  const planLimits = PLAN_LIMITS[plan];

  const qualityMap: Record<string, { video: string; audio: string; next: string; nextPlan: string }> = {
    free: { video: "720p", audio: "Standard", next: "1080p video + HD audio", nextPlan: "Starter ($29/mo)" },
    starter: { video: "1080p", audio: "HD", next: "4K video + Studio audio", nextPlan: "Pro ($79/mo)" },
    pro: { video: "4K", audio: "Studio", next: "Custom voice profiles", nextPlan: "Enterprise ($199/mo)" },
    enterprise: { video: "4K", audio: "Studio", next: "", nextPlan: "" },
  };
  const quality = qualityMap[plan] || qualityMap.free;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-800/30 p-4 mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="text-slate-500 mb-0.5">{t("dashboard.projectDetail.quality.language", "Language")}</p>
          <p className="text-white font-medium">{langName}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">{t("dashboard.projectDetail.quality.output", "Output")}</p>
          <p className="text-white font-medium">{isVideo ? t("dashboard.projectDetail.quality.videoAndAudio", "Video + Audio") : t("dashboard.projectDetail.quality.audioOnly", "Audio Only")}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">{t("dashboard.projectDetail.quality.videoQuality", "Video Quality")}</p>
          <p className="text-white font-medium">{quality.video}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">{t("dashboard.projectDetail.quality.audioQuality", "Audio Quality")}</p>
          <p className="text-white font-medium">{quality.audio}</p>
        </div>
      </div>
      {plan !== "enterprise" && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-slate-500 mb-2">{t("dashboard.projectDetail.upgradeForBetter", "Upgrade for better quality:")}</p>
          <div className="flex flex-wrap gap-2">
            {plan === "free" && (
              <>
                <span className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">Starter — 1080p + HD audio</span>
                <span className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">Pro — 4K + Studio audio</span>
                <span className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">Enterprise — Custom voices</span>
              </>
            )}
            {plan === "starter" && (
              <>
                <span className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">Pro — 4K + Studio audio</span>
                <span className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">Enterprise — Custom voices</span>
              </>
            )}
            {plan === "pro" && (
              <span className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">Enterprise — Custom voices + Dedicated support</span>
            )}
          </div>
          <Link href="/settings" className="mt-2 inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-medium">
            {t("dashboard.projectDetail.upgradePlanCta", "Upgrade Plan")} <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

// Inline video/audio player for completed dubs
function DubInlinePlayer({ dub }: { dub: Dub }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!dub.dubbed_video_url) return;
    const supabase = createClient();
    supabase.storage.from("videos").createSignedUrl(dub.dubbed_video_url, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [dub.dubbed_video_url]);

  if (!url) return <div className="h-12 bg-white/5 rounded-lg animate-pulse" />;

  const isVideo = dub.dubbed_video_url?.includes("dubbed-video");
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black mb-4">
      {isVideo ? (
        <video controls className="w-full max-h-64 object-contain" src={url} preload="metadata" />
      ) : (
        <div className="p-4">
          <audio controls className="w-full" src={url} preload="metadata" />
        </div>
      )}
    </div>
  );
}

// Original video player
function OriginalVideoPlayer({ videoPath }: { videoPath: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!videoPath) return;
    const supabase = createClient();
    supabase.storage.from("videos").createSignedUrl(videoPath, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [videoPath]);

  if (!videoPath) return null;
  if (!url) return <div className="h-40 bg-white/5 rounded-xl animate-pulse" />;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
      <video controls className="w-full max-h-64 object-contain" src={url} preload="metadata" />
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const t = useDashboardT();
  const [project, setProject] = useState<Project | null>(null);
  const [dubs, setDubs] = useState<Dub[]>([]);
  const [activeTab, setActiveTab] = useState<string>("original");
  const [loading, setLoading] = useState(true);

  const statusLabel = (s: DubStatus) => {
    const map: Record<DubStatus, { key: string; fallback: string }> = {
      pending: { key: "dashboard.projectDetail.statusLabels.pending", fallback: "Waiting..." },
      translating: { key: "dashboard.projectDetail.statusLabels.translating", fallback: "Translating" },
      generating_voice: { key: "dashboard.projectDetail.statusLabels.generatingVoice", fallback: "Generating Voice" },
      audio_ready: { key: "dashboard.projectDetail.statusLabels.audioReady", fallback: "Audio Ready — Syncing Lips..." },
      lip_syncing: { key: "dashboard.projectDetail.statusLabels.lipSyncing", fallback: "Syncing Lips" },
      merging: { key: "dashboard.projectDetail.statusLabels.merging", fallback: "Finalizing" },
      done: { key: "dashboard.projectDetail.statusLabels.done", fallback: "Complete" },
      error: { key: "dashboard.projectDetail.statusLabels.error", fallback: "Failed" },
    };
    return t(map[s].key, map[s].fallback);
  };

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const { data: proj } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (proj) {
        setProject(proj as Project);
      }

      const { data: dubsData } = await supabase
        .from("dubs")
        .select("*")
        .eq("project_id", id)
        .order("created_at");

      if (dubsData) {
        setDubs(dubsData as Dub[]);

        // Reconcile: if every dub is in a TRULY terminal state but the project
        // is still "dubbing", patch the project status client-side. This is a
        // safety net for cases where the server-side checkProjectComplete
        // didn't run (e.g. Vercel killed the function before it could update).
        //
        // NOTE: `audio_ready` is NOT terminal — it's the intermediate state
        // between Stage 1 (TTS done) and Stage 2 (lip sync). Including it
        // here would mark the project as "done" before lip sync even starts.
        const allFinished = dubsData.length > 0 && dubsData.every((d) =>
          ["done", "error"].includes((d as Dub).status)
        );
        if (allFinished && proj && (proj as Project).status === "dubbing") {
          const anyDone = dubsData.some((d) => (d as Dub).status === "done");
          await supabase
            .from("projects")
            .update({ status: anyDone ? "done" : "error" })
            .eq("id", id);
        }
      }

      // Load profile for plan limits
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (prof) setProfile(prof as Profile);
      }

      setLoading(false);
    }

    fetchData();

    // Poll while processing
    let pollCount = 0;
    const interval = setInterval(() => {
      fetchData();
      pollCount++;
      // Check for stuck dubs every ~30 seconds (every 10th poll)
      if (pollCount % 10 === 0) {
        fetch("/api/check-stuck").catch(() => {});
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const [lipSyncTriggered, setLipSyncTriggered] = useState<Set<string>>(new Set());
  const [userSwitchedTab, setUserSwitchedTab] = useState(false);

  // Auto-follow the currently-processing dub as it moves through the queue.
  // We process dubs sequentially (server Stage 1 + client Stage 2), so the
  // "active" dub is the first one that is not yet done/error. As each
  // language finishes and the next begins, the tab follows along — unless
  // the user has manually clicked a different tab (then we stop).
  useEffect(() => {
    if (userSwitchedTab) return;
    const sorted = [...dubs].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );
    const active = sorted.find((d) => !["done", "error"].includes(d.status));
    if (active && active.target_language !== activeTab) {
      setActiveTab(active.target_language);
    }
  }, [dubs, activeTab, userSwitchedTab]);

  // Auto-trigger lip sync for audio_ready dubs, STRICTLY one at a time.
  //
  // Previously this effect fired /api/dub/lipsync for every audio_ready
  // dub without waiting — so multiple languages ran lip sync in parallel
  // on fal.ai and the progress bar showed them all at once. Now we:
  //   1. Process dubs in creation order (= order the user picked languages)
  //   2. Only fire a new lip sync when NO other dub is in lip_syncing or
  //      merging status, AND nothing we already triggered is still pending.
  //   3. Consider triggered-but-not-yet-lip_syncing dubs as "in progress"
  //      so we don't accidentally fire a second one during the brief window
  //      while the server is updating the status.
  useEffect(() => {
    // Is any dub actively being processed (server-confirmed OR just fired)?
    const anyInFlight = dubs.some((d) => {
      if (d.status === "lip_syncing" || d.status === "merging") return true;
      // Triggered by us but server hasn't moved it past audio_ready yet
      if (d.status === "audio_ready" && lipSyncTriggered.has(d.id)) return true;
      return false;
    });
    if (anyInFlight) return;

    // Pick the NEXT audio_ready dub in user-selected order (= creation order)
    const sorted = [...dubs].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );
    const nextDub = sorted.find(
      (d) => d.status === "audio_ready" && !lipSyncTriggered.has(d.id)
    );
    if (!nextDub) return;

    setLipSyncTriggered((prev) => new Set(prev).add(nextDub.id));
    fetch("/api/dub/lipsync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dubId: nextDub.id }),
    }).catch(() => {});
  }, [dubs, lipSyncTriggered]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [dubError, setDubError] = useState<string | null>(null);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [newLanguages, setNewLanguages] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [startingDub, setStartingDub] = useState(false);
  // Dedicated modal state for the "Insufficient credits" error. Uses
  // the same UpgradeModal + TopupModal combo as the new-project wizard
  // so the user can either upgrade the plan or buy one-time top-up
  // credits without leaving the page. Other dubbing errors continue to
  // render inline under the language selector.
  const [creditsAlertOpen, setCreditsAlertOpen] = useState(false);
  const [creditsAlertMessage, setCreditsAlertMessage] = useState<string>("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    const supabase = createClient();
    await supabase.from("dubs").delete().eq("project_id", id);
    await supabase.from("projects").delete().eq("id", id);
    router.push("/dashboard");
  }, [id, router]);

  async function handleRetryDubs() {
    if (!project) return;
    setRetryLoading(true);
    setDubError(null);

    const failedDubs = dubs.filter((d) => d.status === "error");
    if (failedDubs.length === 0) return;

    const languages = failedDubs.map((d) => d.target_language);

    // Delete failed dubs
    const supabase = createClient();
    for (const dub of failedDubs) {
      await supabase.from("dubs").delete().eq("id", dub.id);
    }

    // Remove failed dubs from local state immediately
    setDubs((prev) => prev.filter((d) => d.status !== "error"));

    // Re-create dubs with same languages
    try {
      const res = await fetch("/api/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, languages }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg =
          data.error ||
          t("dashboard.projectDetail.failedToRestartDubbing", "Failed to restart dubbing");
        // Detect insufficient credits both by structured code (preferred)
        // and by the stable English message prefix so this still works
        // even if an older cached chunk from the API doesn't include the
        // code field yet.
        const isInsufficient =
          data.code === "insufficient_credits" ||
          (typeof msg === "string" && msg.startsWith("Insufficient credits"));
        if (isInsufficient) {
          setCreditsAlertMessage(msg);
          setCreditsAlertOpen(true);
        } else {
          setDubError(msg);
        }
      }
    } catch {
      setDubError(t("dashboard.projectDetail.failedToRestartDubbing", "Failed to restart dubbing"));
    } finally {
      setRetryLoading(false);
    }
  }

  async function handleStartNewDubs() {
    if (!project || newLanguages.length === 0) return;
    setStartingDub(true);
    setDubError(null);
    try {
      const res = await fetch("/api/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, languages: newLanguages }),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg =
          data.error ||
          t("dashboard.projectDetail.failedToStartDubbing", "Failed to start dubbing");
        // Insufficient credits → dedicated alert modal with upgrade +
        // buy credits CTAs, matching the new-project wizard. Other
        // errors stay inline so the user keeps their language
        // selection and can adjust.
        // Detect insufficient credits both by structured code (preferred)
        // and by the stable English message prefix so this still works
        // even if an older cached chunk from the API doesn't include the
        // code field yet.
        const isInsufficient =
          data.code === "insufficient_credits" ||
          (typeof msg === "string" && msg.startsWith("Insufficient credits"));
        if (isInsufficient) {
          setCreditsAlertMessage(msg);
          setCreditsAlertOpen(true);
        } else {
          setDubError(msg);
        }
      } else {
        setShowLanguageSelect(false);
        setNewLanguages([]);
      }
    } catch {
      setDubError(t("dashboard.projectDetail.failedToStartDubbing", "Failed to start dubbing"));
    } finally {
      setStartingDub(false);
    }
  }

  async function handleDownload(dub: Dub) {
    if (!dub.dubbed_video_url) return;
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("videos")
      .createSignedUrl(dub.dubbed_video_url, 3600);
    if (data?.signedUrl) {
      // Fetch as blob to force download (signed URLs ignore download attribute)
      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = dub.dubbed_video_url?.includes("dubbed-video") ? "mp4" : "mp3";
      a.download = `${project?.title || "dubbed"}-${dub.target_language}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative h-12 w-12 mx-auto mb-3">
            <svg className="h-12 w-12 -rotate-90 animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="url(#pg)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" />
              <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
            </svg>
          </div>
          <p className="text-sm text-slate-400">{t("dashboard.projectDetail.loading", "Loading project...")}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">{t("dashboard.projectDetail.projectNotFound", "Project not found")}</h2>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
          {t("dashboard.projectDetail.backToDashboard", "Back to Dashboard")}
        </Button>
      </div>
    );
  }

  const activeDub = dubs.find((d) => d.target_language === activeTab);
  const isProcessing = dubs.some(
    (d) => !["done", "error"].includes(d.status)
  );

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("dashboard.projectDetail.backToDashboard", "Back to Dashboard")}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.projectDetail.speakerLanguage", "Speaker's language (original): {language}", {
              language: LANGUAGE_MAP[project.original_language] || project.original_language,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{project.status}</Badge>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3 inline mr-1" />
            {t("dashboard.projectDetail.delete", "Delete")}
          </button>
        </div>
      </div>

      {/* Friendly error message for failed projects — surfaces the reason
          transcription/pipeline failed so the user knows what to fix
          (e.g. "video has no audio track"). Written by runTranscription's
          catch block; only rendered when present. The "Upload new video"
          CTA is the standard recovery path for any classified error. */}
      {project.status === "error" && project.error_message && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4">
          <div className="flex items-start gap-3 flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-300">
                {t("dashboard.projectDetail.projectFailed", "Project failed")}
              </p>
              <p className="text-sm text-red-200/90 mt-0.5 leading-relaxed">
                {project.error_message}
              </p>
            </div>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-400/40 bg-red-400/20 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-400/30 hover:text-white transition-colors self-start"
          >
            <Upload className="h-3.5 w-3.5" />
            {t("dashboard.projectDetail.uploadNewVideo", "Upload new video")}
          </Link>
        </div>
      )}

      {/* Language tabs */}
      <div className="flex gap-2 overflow-x-auto flex-nowrap pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <Button
          variant={activeTab === "original" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setActiveTab("original");
            setUserSwitchedTab(true);
          }}
          className="shrink-0"
        >
          {t("dashboard.projectDetail.originalTab", "Original")}
        </Button>
        {dubs.map((dub) => (
          <Button
            key={dub.id}
            variant={activeTab === dub.target_language ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab(dub.target_language);
              setUserSwitchedTab(true);
            }}
            className="gap-2 shrink-0"
          >
            {LANGUAGE_MAP[dub.target_language] || dub.target_language}
            {dub.status === "done" && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
            {dub.status === "error" && (
              <AlertCircle className="h-3 w-3 text-red-500" />
            )}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "original" ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.projectDetail.originalTitle", "Original")}</CardTitle>
            <CardDescription>
              {t("dashboard.projectDetail.originalDescription", "Original video and transcription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Original video player */}
            <OriginalVideoPlayer videoPath={project.original_video_url} />

            {project.transcript && (
              <div className="mt-6">
                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">{t("dashboard.projectDetail.transcriptLabel", "Transcript")}</p>
                <TranscriptEditor
                  segments={project.transcript}
                  onChange={() => {}}
                  readOnly
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : activeDub ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>
                  {LANGUAGE_MAP[activeDub.target_language] ||
                    activeDub.target_language}
                </CardTitle>
                <CardDescription>
                  {statusLabel(activeDub.status)}
                </CardDescription>
              </div>
              {(activeDub.status === "done" || activeDub.status === "audio_ready") && activeDub.dubbed_video_url && (
                <button
                  onClick={() => handleDownload(activeDub)}
                  className="gradient-button rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  {activeDub.status === "audio_ready" ? t("dashboard.projectDetail.downloadAudio", "Download Audio") : t("dashboard.projectDetail.download", "Download")}
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Inline player + info for completed/audio_ready dubs */}
            {(activeDub.status === "done" || activeDub.status === "audio_ready") && activeDub.dubbed_video_url && (
              <>
                <DubInlinePlayer dub={activeDub} />
                {profile && <DubInfoCard dub={activeDub} plan={profile.plan} />}
              </>
            )}

            {!["done", "error"].includes(activeDub.status) && (
              <SmoothDubProgress
                status={activeDub.status as Parameters<typeof SmoothDubProgress>[0]["status"]}
                backendProgress={activeDub.progress}
                videoDurationSec={project.duration_seconds || 30}
                label={statusLabel(activeDub.status)}
              />
            )}

            {activeDub.status === "error" && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 mb-6">
                <p className="text-sm text-red-400">
                  {activeDub.error_message || t("dashboard.projectDetail.defaultDubError", "An error occurred during dubbing")}
                </p>
              </div>
            )}

            {activeDub.translated_transcript && (
              <div className="mt-6">
                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">{t("dashboard.projectDetail.translationLabel", "Translation")}</p>
                <TranscriptEditor
                  segments={activeDub.translated_transcript}
                  onChange={() => {}}
                  readOnly
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Overall progress — per-language status list */}
      {dubs.length > 0 && (
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-white font-medium">
                {isProcessing
                  ? t("dashboard.projectDetail.dubbingInProgress", "Dubbing in progress")
                  : t("dashboard.projectDetail.languagesCompleted", "{done}/{total} languages completed", {
                      done: String(dubs.filter((d) => d.status === "done").length),
                      total: String(dubs.length),
                    })}
              </span>
              {isProcessing && (
                <span className="text-slate-500 text-xs">
                  {t("dashboard.projectDetail.overallPercent", "{n}% overall", {
                    n: String(Math.round(dubs.reduce((sum, d) => sum + d.progress, 0) / dubs.length)),
                  })}
                </span>
              )}
            </div>

            {/* Per-language list */}
            <div className="space-y-2">
              {dubs.map((dub) => {
                const langName = LANGUAGE_MAP[dub.target_language] || dub.target_language;
                const isActive = !["done", "error"].includes(dub.status) && dub.progress > 0;
                const isPending = dub.status === "pending" && dub.progress === 0;

                return (
                  <div
                    key={dub.id}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                      dub.status === "done"
                        ? "border-green-500/20 bg-green-500/5"
                        : dub.status === "error"
                          ? "border-red-500/20 bg-red-500/5"
                          : isActive
                            ? "border-pink-500/20 bg-pink-500/5"
                            : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Status icon */}
                      {dub.status === "done" && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                      {dub.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                      {isActive && (
                        <div className="h-4 w-4 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                        </div>
                      )}
                      {isPending && (
                        <div className="h-4 w-4 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-slate-600" />
                        </div>
                      )}

                      <span className={`text-sm font-medium ${
                        dub.status === "done" ? "text-green-400" :
                        dub.status === "error" ? "text-red-400" :
                        isActive ? "text-white" : "text-slate-500"
                      }`}>
                        {langName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {dub.status === "done" && profile && (
                        <span className="text-xs text-green-400 flex items-center gap-2">
                          {dub.dubbed_video_url?.includes("dubbed-video") ? t("dashboard.projectDetail.video", "Video") : t("dashboard.projectDetail.audio", "Audio")}
                          <span className="text-slate-600">|</span>
                          {(() => { const q: Record<string, string> = { free: "720p", starter: "1080p", pro: "4K", enterprise: "4K" }; return q[profile.plan] || "720p"; })()}
                          <span className="text-slate-600">|</span>
                          {t("dashboard.projectDetail.done", "Done")}
                        </span>
                      )}
                      {dub.status === "done" && !profile && (
                        <span className="text-xs text-green-400">{t("dashboard.projectDetail.done", "Done")}</span>
                      )}
                      {dub.status === "error" && (
                        <span className="text-xs text-red-400">{t("dashboard.projectDetail.failed", "Failed")}</span>
                      )}
                      {isActive && (
                        <SmoothDubBadge
                          status={dub.status as Parameters<typeof SmoothDubBadge>[0]["status"]}
                          backendProgress={dub.progress}
                          videoDurationSec={project.duration_seconds || 30}
                          label={statusLabel(dub.status)}
                        />
                      )}
                      {isPending && (
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          {t("dashboard.projectDetail.waiting", "Waiting")}
                          <span className="inline-flex gap-[3px]">
                            <span className="h-1 w-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="h-1 w-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: "300ms" }} />
                            <span className="h-1 w-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: "600ms" }} />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall progress bar */}
            {isProcessing && (
              <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500"
                  style={{
                    width: `${dubs.reduce((sum, d) => sum + d.progress, 0) / dubs.length}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Retry failed dubs + error with upgrade CTA */}
      {!isProcessing && dubs.some((d) => d.status === "error") && (
        <Card className="mt-6">
          <CardContent className="py-5">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {t("dashboard.projectDetail.dubsFailedCount", "{n} dub(s) failed", { n: String(dubs.filter((d) => d.status === "error").length) })}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {dubs.find((d) => d.status === "error")?.error_message || t("dashboard.projectDetail.defaultDubError", "An error occurred during dubbing")}
                </p>
                {dubError && (
                  <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                    <p className="text-xs text-red-400">{dubError}</p>
                    {dubError.includes("Insufficient credits") || dubError.includes("Upgrade") ? (
                      <Link
                        href="/settings"
                        className="inline-flex items-center gap-1 mt-2 text-xs text-pink-400 hover:text-pink-300 font-medium"
                      >
                        {t("dashboard.projectDetail.upgradeYourPlan", "Upgrade your plan")} <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                )}
                <button
                  onClick={handleRetryDubs}
                  disabled={retryLoading}
                  className="mt-3 inline-flex items-center gap-2 gradient-button rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
                >
                  {retryLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  {t("dashboard.projectDetail.retryFailedDubs", "Retry Failed Dubs")}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue dubbing — show language selector inline */}
      {(() => {
        const doneLangs = dubs.filter(d => d.status === "done").length;
        const maxLangs = profile ? PLAN_LIMITS[profile.plan].maxLanguages : 2;
        // Effective balance = plan credits + one-time top-up credits
        const hasCredits = profile
          ? Number(profile.credits_remaining) + Number(profile.topup_credits ?? 0) > 0
          : false;
        const canAddNewLanguages = doneLangs < maxLangs && hasCredits;
        const hasNoDubs = dubs.length === 0;

        // Show if: ready (first time), OR can add new languages on done projects
        const shouldShow = (
          (project.status === "ready" && hasNoDubs) ||
          (project.status === "done" && !isProcessing && canAddNewLanguages) ||
          (project.status === "error" && hasNoDubs && hasCredits)
        );
        return shouldShow;
      })() && (
        <Card className="mt-6">
          <CardContent className="py-5">
            {!showLanguageSelect ? (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  {dubs.length === 0
                    ? t("dashboard.projectDetail.transcriptionReadyPrompt", "Transcription is ready. Select languages to start dubbing.")
                    : t("dashboard.projectDetail.addMoreLanguagesPrompt", "Add more languages to this project.")}
                </p>
                <button
                  onClick={() => setShowLanguageSelect(true)}
                  className="mt-3 inline-flex items-center gap-2 gradient-button rounded-xl px-5 py-2.5 text-sm font-semibold"
                >
                  {dubs.length === 0 ? t("dashboard.projectDetail.startDubbing", "Start Dubbing") : t("dashboard.projectDetail.addLanguages", "Add Languages")}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">{t("dashboard.projectDetail.selectTargetLanguagesHeading", "Select target languages")}</h3>
                <LanguageSelector
                  selected={newLanguages}
                  onChange={setNewLanguages}
                  maxLanguages={profile ? PLAN_LIMITS[profile.plan].maxLanguages : 2}
                  excludeLanguage={project.original_language}
                />
                {dubError && (
                  <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                    <p className="text-xs text-red-400">{dubError}</p>
                    {dubError.includes("Upgrade") && (
                      <Link href="/settings" className="inline-flex items-center gap-1 mt-1 text-xs text-pink-400 hover:text-pink-300 font-medium">
                        {t("dashboard.projectDetail.upgradePlan", "Upgrade plan")} <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => { setShowLanguageSelect(false); setNewLanguages([]); setDubError(null); }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10 cursor-pointer"
                  >
                    {t("dashboard.projectDetail.cancel", "Cancel")}
                  </button>
                  <button
                    onClick={handleStartNewDubs}
                    disabled={newLanguages.length === 0 || startingDub}
                    className="gradient-button rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    {startingDub ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    {t("dashboard.projectDetail.startDubbingCount", "Start Dubbing ({n})", { n: String(newLanguages.length) })}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t("dashboard.projectDetail.deleteModalTitle", "Delete Project")}
        message={t("dashboard.projectDetail.deleteModalMessage", "Are you sure you want to delete this project? This will remove all dubs and cannot be undone.")}
        confirmLabel={t("dashboard.projectDetail.deleteModalConfirm", "Delete Project")}
        destructive
      />

      {/* Insufficient credits alert — primary CTA opens the same
          UpgradeModal used on the dashboard Plan card; secondary CTA
          opens the TopupModal for one-time credit purchase. */}
      <AlertModal
        open={creditsAlertOpen}
        onClose={() => setCreditsAlertOpen(false)}
        title={t("dashboard.newProject.insufficientCreditsTitle", "Insufficient credits")}
        message={creditsAlertMessage}
        type="error"
        actionLabel={t("dashboard.home.upgrade", "Upgrade")}
        actionOnClick={() => setUpgradeOpen(true)}
        secondaryActionLabel={t("dashboard.credits.buyMoreCredits", "Buy more credits")}
        secondaryActionOnClick={() => setTopupOpen(true)}
      />

      {profile && (
        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          currentPlan={profile.plan}
        />
      )}

      <TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />
    </div>
  );
}
