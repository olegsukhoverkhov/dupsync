"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VideoUpload } from "@/components/project/video-upload";
import { TranscriptEditor } from "@/components/project/transcript-editor";
import { LanguageSelector } from "@/components/project/language-selector";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile, TranscriptSegment, Project } from "@/lib/supabase/types";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ProcessingIndicator } from "@/components/ui/processing-indicator";

type Step = "upload" | "transcript" | "languages" | "processing";

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [title, setTitle] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data as Profile);
      }
    }
    loadProfile();
  }, []);

  const planLimits = profile ? PLAN_LIMITS[profile.plan] : PLAN_LIMITS.free;

  async function handleUploadComplete(path: string, file: File) {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || file.name.replace(/\.[^.]+$/, ""),
          videoPath: path,
        }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const proj = await res.json();
      setProject(proj);

      // Poll for transcription completion
      const supabase = createClient();
      const pollInterval = setInterval(async () => {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("id", proj.id)
          .single();

        if (data?.status === "ready" && data.transcript) {
          clearInterval(pollInterval);
          setTranscript(data.transcript as TranscriptSegment[]);
          setProject(data as Project);
          setStep("transcript");
          setLoading(false);
        } else if (data?.status === "error") {
          clearInterval(pollInterval);
          setLoading(false);
          alert("Transcription failed. Please try again.");
        }
      }, 3000);
    } catch {
      setLoading(false);
      alert("Failed to create project");
    }
  }

  async function handleStartDubbing() {
    if (!project || selectedLanguages.length === 0) return;

    setLoading(true);
    setStep("processing");

    try {
      const res = await fetch("/api/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          languages: selectedLanguages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start dubbing");
      }

      router.push(`/projects/${project.id}`);
    } catch (err) {
      setLoading(false);
      alert(err instanceof Error ? err.message : "Failed to start dubbing");
      setStep("languages");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {["Upload", "Transcript", "Languages"].map((label, i) => {
          const steps: Step[] = ["upload", "transcript", "languages"];
          const isActive = step === steps[i];
          const isPast =
            steps.indexOf(step) > i || step === "processing";
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className={`h-px w-8 ${isPast ? "bg-primary" : "bg-border"}`}
                />
              )}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isPast
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm ${isActive ? "font-medium" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Upload your video to get started with dubbing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title (optional)</Label>
              <Input
                id="title"
                placeholder="My Video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            {profile && (
              <VideoUpload
                userId={profile.id}
                maxSizeMB={planLimits.maxFileSize}
                onUploadComplete={handleUploadComplete}
              />
            )}

            {loading && (
              <ProcessingIndicator
                label="Transcribing your video"
                sublabel="AI is converting speech to text"
                steps={[
                  "Uploading video",
                  "Extracting audio",
                  "Running speech recognition",
                  "Generating transcript",
                ]}
                currentStep={2}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review Transcript */}
      {step === "transcript" && (
        <Card>
          <CardHeader>
            <CardTitle>Review Transcript</CardTitle>
            <CardDescription>
              Click on any segment to edit the text before dubbing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptEditor
              segments={transcript}
              onChange={setTranscript}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep("languages")}>
                Next: Select Languages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Languages */}
      {step === "languages" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Target Languages</CardTitle>
            <CardDescription>
              Choose which languages to dub your video into
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSelector
              selected={selectedLanguages}
              onChange={setSelectedLanguages}
              maxLanguages={planLimits.maxLanguages}
              excludeLanguage={project?.original_language}
            />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep("transcript")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleStartDubbing}
                disabled={selectedLanguages.length === 0 || loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Start Dubbing ({selectedLanguages.length} languages)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing state */}
      {step === "processing" && (
        <Card>
          <CardContent>
            <ProcessingIndicator
              label="Starting dubbing"
              sublabel="Preparing your video for AI processing"
              steps={[
                "Creating dub jobs",
                "Initializing AI pipeline",
                "Redirecting to project...",
              ]}
              currentStep={1}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
