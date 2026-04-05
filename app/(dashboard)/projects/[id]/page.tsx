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
} from "lucide-react";

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

      setLoading(false);
    }

    fetchData();

    // Poll while processing
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = useCallback(async () => {
    const supabase = createClient();
    await supabase.from("dubs").delete().eq("project_id", id);
    await supabase.from("projects").delete().eq("id", id);
    router.push("/dashboard");
  }, [id, router]);

  async function handlePreview(dub: Dub) {
    if (!dub.dubbed_video_url) return;
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("videos")
      .createSignedUrl(dub.dubbed_video_url, 3600);
    if (data?.signedUrl) setPreviewUrl(data.signedUrl);
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
      a.download = `${project?.title || "dubbed"}-${dub.target_language}.mp3`;
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

      <div className="flex items-start justify-between mb-6">
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
      <div className="flex gap-2 flex-wrap mb-6">
        <Button
          variant={activeTab === "original" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("original")}
        >
          Original
        </Button>
        {dubs.map((dub) => (
          <Button
            key={dub.id}
            variant={activeTab === dub.target_language ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(dub.target_language)}
            className="gap-2"
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
            <CardTitle>Original Transcript</CardTitle>
            <CardDescription>
              The original transcription of your video
            </CardDescription>
          </CardHeader>
          <CardContent>
            {project.transcript ? (
              <TranscriptEditor
                segments={project.transcript}
                onChange={() => {}}
                readOnly
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No transcript available
              </p>
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(activeDub)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(activeDub)}
                    className="gradient-button rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
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
              <div className="rounded-lg bg-red-50 p-4 mb-6">
                <p className="text-sm text-red-800">
                  {activeDub.error_message || "An error occurred during dubbing"}
                </p>
              </div>
            )}

            {activeDub.translated_transcript && (
              <TranscriptEditor
                segments={activeDub.translated_transcript}
                onChange={() => {}}
                readOnly
              />
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Overall progress when processing */}
      {isProcessing && (
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">
                  Dubbing in progress
                </span>
                <span className="text-slate-400">
                  {dubs.filter((d) => d.status === "done").length}/{dubs.length} languages done
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500"
                  style={{
                    width: `${dubs.length > 0 ? dubs.reduce((sum, d) => sum + d.progress, 0) / dubs.length : 0}%`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {dubs.map((dub) => (
                  <span
                    key={dub.id}
                    className={`inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 ${
                      dub.status === "done"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : dub.status === "error"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-white/5 text-slate-400 border border-white/10"
                    }`}
                  >
                    {dub.target_language}
                    {dub.status === "done" && " ✓"}
                    {dub.status === "error" && " ✗"}
                    {!["done", "error"].includes(dub.status) && ` ${dub.progress}%`}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio/Video Preview */}
      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewUrl(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-semibold text-white mb-4">Preview</h3>
            <audio controls autoPlay className="w-full" src={previewUrl}>
              Your browser does not support audio playback.
            </audio>
          </div>
        </div>
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
