"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
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

  async function handleDownload(dub: Dub) {
    if (!dub.dubbed_video_url) return;

    const supabase = createClient();
    const { data } = await supabase.storage
      .from("videos")
      .createSignedUrl(dub.dubbed_video_url, 3600);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        <Badge variant="outline">{project.status}</Badge>
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
                <Button size="sm" onClick={() => handleDownload(activeDub)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
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
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">
                Processing {dubs.filter((d) => d.status === "done").length}/
                {dubs.length} languages...
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
