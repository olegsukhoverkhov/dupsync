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
import { ArrowLeft, ArrowRight, Loader2, Check, AlertTriangle, Globe } from "lucide-react";
import { ProcessingIndicator } from "@/components/ui/processing-indicator";
import { AlertModal } from "@/components/ui/modal";
import { LANGUAGE_MAP } from "@/lib/supabase/constants";

type Step = "upload" | "confirm-language" | "transcript" | "languages" | "processing";

const SOURCE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "it", name: "Italian" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ru", name: "Russian" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "pl", name: "Polish" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [title, setTitle] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [correctedLanguage, setCorrectedLanguage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; type: "error" | "success" | "info" } | null>(null);

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

  function handleUploadComplete(path: string, file: File) {
    setUploadedPath(path);
    setUploadedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    // Auto-start project creation
    createProject(path, file.name.replace(/\.[^.]+$/, ""));
  }

  async function createProject(path?: string, fallbackTitle?: string) {
    const videoPath = path || uploadedPath;
    const projectTitle = title || fallbackTitle || "Untitled";
    if (!videoPath) return;

    setLoading(true);
    setAlertModal(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          videoPath,
          language: sourceLanguage,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create project");
      }

      const proj = await res.json();
      setProject(proj);

      // Transcription now runs synchronously — check if already done
      if (proj.status === "ready" && proj.transcript) {
        setTranscript(proj.transcript);
        setDetectedLanguage(proj.original_language || "en");
        setStep("confirm-language");
        setLoading(false);
        return;
      }
      if (proj.status === "error") {
        setUploadedPath(null);
        setUploadedFile(null);
        setProject(null);
        setLoading(false);
        setAlertModal({ title: "Transcription Failed", message: "Could not transcribe the video. Please try again.", type: "error" });
        return;
      }

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
          setDetectedLanguage(data.original_language || "en");
          setStep("confirm-language");
          setLoading(false);
        } else if (data?.status === "error") {
          clearInterval(pollInterval);
          setLoading(false);
          setUploadedPath(null);
          setUploadedFile(null);
          setProject(null);
          setAlertModal({ title: "Transcription Failed", message: "Could not transcribe the video. Please try again or use a different file.", type: "error" });
        }
      }, 3000);
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to create project.";
      setAlertModal({
        title: msg.includes("already exists") ? "Duplicate Name" : "Error",
        message: msg,
        type: "error",
      });
    }
  }

  async function handleRetranscribe(lang: string) {
    if (!project) return;
    setLoading(true);
    setStep("upload"); // show processing indicator

    try {
      const supabase = createClient();
      // Update project language and reset status
      await supabase
        .from("projects")
        .update({ original_language: lang, status: "transcribing", transcript: null })
        .eq("id", project.id);

      // Trigger re-transcription
      await fetch("/api/projects/retranscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, language: lang }),
      });

      // Poll again
      const pollInterval = setInterval(async () => {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("id", project.id)
          .single();

        if (data?.status === "ready" && data.transcript) {
          clearInterval(pollInterval);
          setTranscript(data.transcript as TranscriptSegment[]);
          setProject(data as Project);
          setDetectedLanguage(data.original_language || lang);
          setStep("confirm-language");
          setLoading(false);
        } else if (data?.status === "error") {
          clearInterval(pollInterval);
          setLoading(false);
          setAlertModal({ title: "Transcription Failed", message: "Could not transcribe the video. Please try again or use a different file.", type: "error" });
          setStep("confirm-language");
        }
      }, 3000);
    } catch {
      setLoading(false);
      setAlertModal({ title: "Error", message: "Re-transcription failed. Please try again.", type: "error" });
      setStep("confirm-language");
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
      setAlertModal({ title: "Dubbing Error", message: err instanceof Error ? err.message : "Failed to start dubbing", type: "error" });
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
                className={`text-sm hidden sm:inline ${isActive ? "font-medium" : "text-muted-foreground"}`}
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

            <div>
              <Label htmlFor="language">
                What language is the speaker in your video using?
              </Label>
              <p className="mt-1 text-xs text-slate-500">
                This is the <strong className="text-slate-300">original</strong> language of the speech in your video — not the language you want to translate it to. You&apos;ll choose target languages in the next step.
              </p>
              <select
                id="language"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50"
              >
                <option value="auto">Auto-detect (recommended)</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
                <option value="it">Italian</option>
                <option value="tr">Turkish</option>
                <option value="uk">Ukrainian</option>
                <option value="ru">Russian</option>
              </select>
            </div>

            {/* Video upload — hide after file is uploaded */}
            {profile && !uploadedPath && (
              <VideoUpload
                userId={profile.id}
                maxSizeMB={planLimits.maxFileSize}
                maxDurationSec={planLimits.maxVideoSeconds}
                planName={planLimits.name}
                onUploadComplete={handleUploadComplete}
              />
            )}

            {/* After upload succeeded but project creation failed (e.g. duplicate name) */}
            {uploadedPath && !loading && !project && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Video uploaded successfully</p>
                    <p className="text-xs text-slate-400">{uploadedFile?.name} ({((uploadedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB)</p>
                  </div>
                </div>
                <button
                  onClick={() => createProject()}
                  className="w-full gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                >
                  Create Project
                </button>
              </div>
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

      {/* Step 1.5: Confirm detected language */}
      {step === "confirm-language" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
                <Globe className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Language Detected</h3>
              <p className="mt-2 text-sm text-slate-400">
                We detected the original language as:
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {LANGUAGE_MAP[detectedLanguage || ""] || detectedLanguage || "Unknown"}
              </p>
            </div>

            {/* Preview first few transcript lines */}
            {transcript.length > 0 && (
              <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 max-h-32 overflow-y-auto">
                <p className="text-xs text-slate-500 mb-2">Transcript preview:</p>
                <p className="text-sm text-slate-300 italic">
                  &ldquo;{transcript.slice(0, 3).map(s => s.text).join(" ")}&rdquo;
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setStep("transcript")}
                className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
              >
                <Check className="h-4 w-4" />
                Yes, this is correct
              </button>
              <button
                onClick={() => setCorrectedLanguage(detectedLanguage || "")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                No, wrong language
              </button>
            </div>

            {/* Language correction selector */}
            {correctedLanguage !== "" && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm text-slate-400 mb-3">Select the correct original language:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {SOURCE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setCorrectedLanguage(lang.code)}
                      className={`rounded-xl border px-3 py-2.5 text-sm transition-all cursor-pointer ${
                        correctedLanguage === lang.code
                          ? "border-pink-500/50 bg-pink-500/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (correctedLanguage) {
                      handleRetranscribe(correctedLanguage);
                      setCorrectedLanguage("");
                    }
                  }}
                  disabled={!correctedLanguage || loading}
                  className="w-full gradient-button flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Re-transcribe with {SOURCE_LANGUAGES.find(l => l.code === correctedLanguage)?.name || correctedLanguage}</>
                  )}
                </button>
              </div>
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
      {/* Alert Modal */}
      {alertModal && (
        <AlertModal
          open={true}
          onClose={() => setAlertModal(null)}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      )}
    </div>
  );
}
