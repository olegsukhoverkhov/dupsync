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
} from "lucide-react";
import Link from "next/link";
import { AlertModal } from "@/components/ui/modal";
import { LanguageSelector } from "@/components/project/language-selector";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile, PlanType } from "@/lib/supabase/types";

// Video info card showing quality details and upgrade CTA
function DubInfoCard({ dub, plan }: { dub: Dub; plan: PlanType }) {
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
          <p className="text-slate-500 mb-0.5">Language</p>
          <p className="text-white font-medium">{langName}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">Output</p>
          <p className="text-white font-medium">{isVideo ? "Video + Audio" : "Audio Only"}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">Video Quality</p>
          <p className="text-white font-medium">{quality.video}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">Audio Quality</p>
          <p className="text-white font-medium">{quality.audio}</p>
        </div>
      </div>
      {plan !== "enterprise" && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-slate-500 mb-2">Upgrade for better quality:</p>
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
            Upgrade Plan <ArrowUpRight className="h-3 w-3" />
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

const STATUS_LABELS: Record<DubStatus, string> = {
  pending: "Waiting...",
  translating: "Translating",
  generating_voice: "Generating Voice",
  lip_syncing: "Syncing Lips",
  merging: "Finalizing",
  done: "Complete",
  error: "Failed",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [dubs, setDubs] = useState<Dub[]>([]);
  const [activeTab, setActiveTab] = useState<string>("original");
  const [loading, setLoading] = useState(true);

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
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [dubError, setDubError] = useState<string | null>(null);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [newLanguages, setNewLanguages] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [startingDub, setStartingDub] = useState(false);

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

    // Get failed/pending dub languages
    const failedDubs = dubs.filter((d) => d.status === "error" || d.status === "pending");
    if (failedDubs.length === 0) return;

    const languages = failedDubs.map((d) => d.target_language);

    // Delete failed dubs first
    const supabase = createClient();
    for (const dub of failedDubs) {
      await supabase.from("dubs").delete().eq("id", dub.id);
    }

    // Re-create dubs
    try {
      const res = await fetch("/api/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, languages }),
      });

      if (!res.ok) {
        const data = await res.json();
        setDubError(data.error || "Failed to restart dubbing");
      }
    } catch {
      setDubError("Failed to restart dubbing");
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
        setDubError(data.error || "Failed to start dubbing");
      } else {
        setShowLanguageSelect(false);
        setNewLanguages([]);
      }
    } catch {
      setDubError("Failed to start dubbing");
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
          <p className="text-sm text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
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
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-muted-foreground">
            Original language:{" "}
            {LANGUAGE_MAP[project.original_language] || project.original_language}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{project.status}</Badge>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3 inline mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex gap-2 overflow-x-auto flex-nowrap pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <Button
          variant={activeTab === "original" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("original")}
          className="shrink-0"
        >
          Original
        </Button>
        {dubs.map((dub) => (
          <Button
            key={dub.id}
            variant={activeTab === dub.target_language ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(dub.target_language)}
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
            <CardTitle>Original</CardTitle>
            <CardDescription>
              Original video and transcription
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Original video player */}
            <OriginalVideoPlayer videoPath={project.original_video_url} />

            {project.transcript && (
              <div className="mt-6">
                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">Transcript</p>
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
                  {STATUS_LABELS[activeDub.status]}
                </CardDescription>
              </div>
              {activeDub.status === "done" && (
                <button
                  onClick={() => handleDownload(activeDub)}
                  className="gradient-button rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Inline player + info for completed dubs */}
            {activeDub.status === "done" && (
              <>
                <DubInlinePlayer dub={activeDub} />
                {profile && <DubInfoCard dub={activeDub} plan={profile.plan} />}
              </>
            )}

            {!["done", "error"].includes(activeDub.status) && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>{STATUS_LABELS[activeDub.status]}</span>
                  <span>{activeDub.progress}%</span>
                </div>
                <Progress value={activeDub.progress} />
              </div>
            )}

            {activeDub.status === "error" && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 mb-6">
                <p className="text-sm text-red-400">
                  {activeDub.error_message || "An error occurred during dubbing"}
                </p>
              </div>
            )}

            {activeDub.translated_transcript && (
              <div className="mt-6">
                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">Translation</p>
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
                {isProcessing ? "Dubbing in progress" : `${dubs.filter((d) => d.status === "done").length}/${dubs.length} languages completed`}
              </span>
              {isProcessing && (
                <span className="text-slate-500 text-xs">
                  {Math.round(dubs.reduce((sum, d) => sum + d.progress, 0) / dubs.length)}% overall
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
                          {dub.dubbed_video_url?.includes("dubbed-video") ? "Video" : "Audio"}
                          <span className="text-slate-600">|</span>
                          {(() => { const q: Record<string, string> = { free: "720p", starter: "1080p", pro: "4K", enterprise: "4K" }; return q[profile.plan] || "720p"; })()}
                          <span className="text-slate-600">|</span>
                          Done
                        </span>
                      )}
                      {dub.status === "done" && !profile && (
                        <span className="text-xs text-green-400">Done</span>
                      )}
                      {dub.status === "error" && (
                        <span className="text-xs text-red-400">Failed</span>
                      )}
                      {isActive && (
                        <span className="text-xs text-pink-400 flex items-center gap-1.5">
                          {STATUS_LABELS[dub.status]} {dub.progress}%
                          <span className="inline-flex gap-[3px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.8s" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "200ms", animationDuration: "0.8s" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "400ms", animationDuration: "0.8s" }} />
                          </span>
                        </span>
                      )}
                      {isPending && (
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          Waiting
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
                  {dubs.filter((d) => d.status === "error").length} dub(s) failed
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {dubs.find((d) => d.status === "error")?.error_message || "An error occurred during dubbing"}
                </p>
                {dubError && (
                  <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                    <p className="text-xs text-red-400">{dubError}</p>
                    {dubError.includes("Insufficient credits") || dubError.includes("Upgrade") ? (
                      <Link
                        href="/settings"
                        className="inline-flex items-center gap-1 mt-2 text-xs text-pink-400 hover:text-pink-300 font-medium"
                      >
                        Upgrade your plan <ArrowUpRight className="h-3 w-3" />
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
                  Retry Failed Dubs
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue dubbing — show language selector inline */}
      {(project.status === "ready" || project.status === "error" || (
        project.status === "done" && !isProcessing &&
        profile && profile.credits_remaining > 0 &&
        dubs.filter(d => d.status === "done").length < PLAN_LIMITS[profile.plan].maxLanguages
      )) && (
        <Card className="mt-6">
          <CardContent className="py-5">
            {!showLanguageSelect ? (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  {dubs.length === 0
                    ? "Transcription is ready. Select languages to start dubbing."
                    : "Add more languages to this project."}
                </p>
                <button
                  onClick={() => setShowLanguageSelect(true)}
                  className="mt-3 inline-flex items-center gap-2 gradient-button rounded-xl px-5 py-2.5 text-sm font-semibold"
                >
                  {dubs.length === 0 ? "Start Dubbing" : "Add Languages"}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Select target languages</h3>
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
                        Upgrade plan <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => { setShowLanguageSelect(false); setNewLanguages([]); setDubError(null); }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartNewDubs}
                    disabled={newLanguages.length === 0 || startingDub}
                    className="gradient-button rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    {startingDub ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    Start Dubbing ({newLanguages.length})
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
        title="Delete Project"
        message="Are you sure you want to delete this project? This will remove all dubs and cannot be undone."
        confirmLabel="Delete Project"
        destructive
      />
    </div>
  );
}
