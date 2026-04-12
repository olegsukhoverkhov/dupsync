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
import { PLAN_LIMITS, SUPPORTED_LANGUAGES } from "@/lib/supabase/constants";
import type { Profile, TranscriptSegment, Project } from "@/lib/supabase/types";
import { ArrowLeft, ArrowRight, Loader2, Check, AlertTriangle, Globe, Upload, Link2 } from "lucide-react";
import { ProcessingIndicator } from "@/components/ui/processing-indicator";
import { AlertModal, Modal } from "@/components/ui/modal";
import { LANGUAGE_MAP } from "@/lib/supabase/constants";
import { useDashboardT } from "@/components/dashboard/locale-provider";
import { UpgradeModal } from "@/components/dashboard/upgrade-modal";
import { TopupModal } from "@/components/dashboard/topup-modal";
import { SubsChoiceModal } from "@/components/project/subs-choice-modal";

type Step = "upload" | "confirm-language" | "transcript" | "languages" | "processing";

// Source languages — use the full Cartesia-supported list from constants
const SOURCE_LANGUAGES = SUPPORTED_LANGUAGES.map((l) => ({ code: l.code, name: l.name, flag: l.flag }));

export default function NewProjectPage() {
  const router = useRouter();
  const t = useDashboardT();
  const [step, setStep] = useState<Step>("upload");
  const [title, setTitle] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const isAdmin = profile?.is_admin === true;
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [correctedLanguage, setCorrectedLanguage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    title: string;
    message: string;
    type: "error" | "success" | "info";
    actionHref?: string;
    actionLabel?: string;
    actionOnClick?: () => void;
    secondaryActionLabel?: string;
    secondaryActionOnClick?: () => void;
  } | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  // Pre-dub subtitles choice modal. Split from handleStartDubbing so
  // the user sees the cost breakdown before any credits are reserved.
  const [subsChoiceOpen, setSubsChoiceOpen] = useState(false);
  const [duplicateNameOpen, setDuplicateNameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

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
        if (data) {
          setProfile(data as Profile);
          if ((data as Profile).is_admin) setUploadMode("url");
        }
      }
    }
    loadProfile();
  }, []);

  const planLimits = profile ? PLAN_LIMITS[profile.plan] : PLAN_LIMITS.free;

  function handleUploadComplete(path: string, file: File) {
    setUploadedPath(path);
    setUploadedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    // Don't auto-start — let the user pick source language first
  }

  async function createProject(path?: string, fallbackTitle?: string) {
    const videoPath = path || uploadedPath;
    const projectTitle = fallbackTitle || title || t("dashboard.newProject.untitled", "Untitled");
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
        throw new Error(errData.error || t("dashboard.newProject.failedToCreateProject", "Failed to create project"));
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
        // Surface the classified error_message written by runTranscription
        // (e.g. "Your video has no audio track…"). Fall back to the generic
        // message only when the backend didn't attach a specific reason.
        setAlertModal({
          title: t("dashboard.newProject.transcriptionFailedTitle", "Transcription Failed"),
          message:
            proj.error_message ||
            t(
              "dashboard.newProject.transcriptionFailedMessage",
              "Could not transcribe the video. Please try again."
            ),
          type: "error",
          actionLabel: t(
            "dashboard.projectCard.uploadNewVideo",
            "Upload new video"
          ),
          // State was already reset above (uploadedPath/File/project=null)
          // so just closing the modal drops the user back into the upload
          // step ready to drop another file. Use onClick instead of a
          // same-URL href which Next.js would treat as a no-op nav.
          actionOnClick: () => setStep("upload"),
        });
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
          // Prefer the specific classified error (e.g. "no audio track")
          // over the generic fallback so users understand what to fix.
          setAlertModal({
            title: t(
              "dashboard.newProject.transcriptionFailedTitle",
              "Transcription Failed"
            ),
            message:
              (data.error_message as string | null) ||
              t(
                "dashboard.newProject.transcriptionFailedRetryMessage",
                "Could not transcribe the video. Please try again or use a different file."
              ),
            type: "error",
            actionLabel: t(
              "dashboard.projectCard.uploadNewVideo",
              "Upload new video"
            ),
            actionOnClick: () => setStep("upload"),
          });
        }
      }, 3000);
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : t("dashboard.newProject.failedToCreateProjectDot", "Failed to create project.");
      if (msg.includes("already exists")) {
        setNewTitle(title);
        setDuplicateNameOpen(true);
      } else {
        setAlertModal({
          title: t("dashboard.newProject.errorTitle", "Error"),
          message: msg,
          type: "error",
        });
      }
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
          setAlertModal({
            title: t(
              "dashboard.newProject.transcriptionFailedTitle",
              "Transcription Failed"
            ),
            message:
              (data.error_message as string | null) ||
              t(
                "dashboard.newProject.transcriptionFailedRetryMessage",
                "Could not transcribe the video. Please try again or use a different file."
              ),
            type: "error",
            actionLabel: t(
              "dashboard.projectCard.uploadNewVideo",
              "Upload new video"
            ),
            // Clear the current project so "Upload new video" restarts
            // the wizard from scratch instead of re-running transcription
            // on the same broken file.
            actionOnClick: () => {
              setUploadedPath(null);
              setUploadedFile(null);
              setProject(null);
              setStep("upload");
            },
          });
          setStep("confirm-language");
        }
      }, 3000);
    } catch {
      setLoading(false);
      setAlertModal({
        title: t("dashboard.newProject.errorTitle", "Error"),
        message: t("dashboard.newProject.retranscriptionFailed", "Re-transcription failed. Please try again."),
        type: "error",
      });
      setStep("confirm-language");
    }
  }

  // First click from the Languages step — opens the subs-choice
  // modal. The actual API call happens in `startDubbing(withSubs)`
  // which is invoked from the modal.
  function handleStartDubbing() {
    if (!project || selectedLanguages.length === 0) return;
    // Free plan only has 1 credit — subs cost +1 per language,
    // so skip the subs choice modal and go straight to dubbing.
    if (profile?.plan === "free") {
      startDubbing(false);
      return;
    }
    setSubsChoiceOpen(true);
  }

  async function startDubbing(withSubs: boolean) {
    if (!project || selectedLanguages.length === 0) return;
    setSubsChoiceOpen(false);
    setLoading(true);
    setStep("processing");

    try {
      const res = await fetch("/api/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          languages: selectedLanguages,
          burnSubs: withSubs,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const e = new Error(
          data.error || t("dashboard.newProject.failedToStartDubbing", "Failed to start dubbing")
        ) as Error & { code?: string };
        if (data.code) e.code = data.code;
        throw e;
      }

      // Redirect immediately — don't wait for dubbing to finish.
      // Project detail page will show progress via polling.
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setLoading(false);
      const errMsg =
        err instanceof Error
          ? err.message
          : t("dashboard.newProject.failedToStartDubbing", "Failed to start dubbing");
      const errCode =
        err instanceof Error && "code" in err
          ? (err as Error & { code?: string }).code
          : undefined;

      // Insufficient credits gets a dedicated title ("Insufficient
      // credits" instead of "Dubbing Error") and two CTAs: the primary
      // opens the UpgradeModal used on the dashboard, the secondary
      // opens the TopupModal for one-time credit purchase.
      const isInsufficient =
        errCode === "insufficient_credits" ||
        errMsg.startsWith("Insufficient credits");

      if (isInsufficient) {
        setAlertModal({
          title: t(
            "dashboard.newProject.insufficientCreditsTitle",
            "Insufficient credits"
          ),
          message: errMsg,
          type: "error",
          actionLabel: t("dashboard.home.upgrade", "Upgrade"),
          actionOnClick: () => setUpgradeOpen(true),
          secondaryActionLabel: t(
            "dashboard.credits.buyMoreCredits",
            "Buy more credits"
          ),
          secondaryActionOnClick: () => setTopupOpen(true),
        });
      } else {
        setAlertModal({
          title: t("dashboard.newProject.dubbingErrorTitle", "Dubbing Error"),
          message: errMsg,
          type: "error",
        });
      }
      setStep("languages");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("dashboard.newProject.backToDashboard", "Back to Dashboard")}
        </Button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[
          t("dashboard.newProject.stepUpload", "Upload"),
          t("dashboard.newProject.stepTranscript", "Transcript"),
          t("dashboard.newProject.stepLanguages", "Languages"),
        ].map((label, i) => {
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
            <CardTitle>{t("dashboard.newProject.uploadVideo", "Upload Video")}</CardTitle>
            <CardDescription>
              {t("dashboard.newProject.uploadVideoDescription", "Upload your video to get started with dubbing")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hide settings while transcription is in progress */}
            {!loading && (
              <>
                {/* Video upload — show before file is uploaded */}
                {profile && !uploadedPath && (
                  <>
                    <div>
                      <Label htmlFor="title">{t("dashboard.newProject.projectTitleLabel", "Project Title (optional)")}</Label>
                      <Input
                        id="title"
                        placeholder={t("dashboard.newProject.projectTitlePlaceholder", "My Video")}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Upload mode toggle — URL import only for admins */}
                    {isAdmin && (
                      <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 gap-1">
                        <button
                          onClick={() => setUploadMode("url")}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                            uploadMode === "url" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Link2 className="h-4 w-4" />
                          {t("dashboard.newProject.importFromUrl", "Import from URL")}
                        </button>
                        <button
                          onClick={() => setUploadMode("file")}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                            uploadMode === "file" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Upload className="h-4 w-4" />
                          {t("dashboard.newProject.uploadFile", "Upload File")}
                        </button>
                      </div>
                    )}

                    {uploadMode === "file" || !isAdmin ? (
                      <VideoUpload
                        userId={profile.id}
                        maxSizeMB={planLimits.maxFileSize}
                        maxDurationSec={planLimits.maxVideoSeconds}
                        planName={planLimits.name}
                        onUploadComplete={handleUploadComplete}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                          <p className="text-xs text-slate-400 mb-3">
                            {t("dashboard.newProject.importUrlDescription", "Paste a link from YouTube, Instagram, TikTok, or Facebook")}
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              value={importUrl}
                              onChange={(e) => setImportUrl(e.target.value)}
                              disabled={importLoading}
                              className="flex-1"
                            />
                            <Button
                              onClick={async () => {
                                if (!importUrl.trim()) return;
                                setImportLoading(true);
                                try {
                                  const res = await fetch("/api/projects/import-url", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      url: importUrl.trim(),
                                      language: sourceLanguage || "auto",
                                    }),
                                  });
                                  const data = await res.json();
                                  if (!res.ok) {
                                    setAlertModal({
                                      title: t("dashboard.newProject.importError", "Import Failed"),
                                      message: (data.error || "Failed to import video") + "\n\nMake sure the video is public and not age-restricted.",
                                      type: "error",
                                    });
                                    return;
                                  }
                                  // Project created + transcription done
                                  setProject(data);
                                  setUploadedPath(data.original_video_url);
                                  if (data.transcript) setTranscript(data.transcript);
                                  if (data.original_language) {
                                    setDetectedLanguage(data.original_language);
                                    setCorrectedLanguage(data.original_language);
                                  }
                                  setStep("confirm-language");
                                } catch {
                                  setAlertModal({
                                    title: t("dashboard.newProject.importError", "Import Failed"),
                                    message: "Network error. Please try again.",
                                    type: "error",
                                  });
                                } finally {
                                  setImportLoading(false);
                                }
                              }}
                              disabled={importLoading || !importUrl.trim()}
                            >
                              {importLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                t("dashboard.newProject.importButton", "Import")
                              )}
                            </Button>
                          </div>
                          {importLoading && (
                            <div className="mt-4 flex items-center gap-3">
                              <Loader2 className="h-4 w-4 animate-spin text-pink-400" />
                              <p className="text-sm text-slate-300">
                                {t("dashboard.newProject.importingVideo", "Downloading and processing video...")}
                              </p>
                            </div>
                          )}
                          <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-600">
                            <span>YouTube</span>
                            <span>Instagram</span>
                            <span>TikTok</span>
                            <span>Facebook</span>
                          </div>
                          <p className="mt-3 text-xs text-amber-400/80">
                            {t("dashboard.newProject.importPublicOnly", "Video must be public and not age-restricted")}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* After upload succeeded — show language selector + start */}
                {uploadedPath && !project && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{t("dashboard.newProject.videoUploadedSuccess", "Video uploaded successfully")}</p>
                          <p className="text-xs text-slate-400">{uploadedFile?.name} ({((uploadedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB)</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">{t("dashboard.newProject.projectTitleLabel", "Project Title (optional)")}</Label>
                      <Input
                        id="title"
                        placeholder={t("dashboard.newProject.projectTitlePlaceholder", "My Video")}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>
                        {t("dashboard.newProject.sourceLanguageLabel", "What language is the speaker in your video using?")}
                      </Label>
                      <p className="mt-1 text-xs text-slate-500">
                        {t(
                          "dashboard.newProject.sourceLanguageHelp",
                          "This is the original language of the speech in your video — not the language you want to translate it to. You'll choose target languages in the next step."
                        )}
                      </p>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SOURCE_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setSourceLanguage(lang.code)}
                            className={`rounded-xl border px-3 py-2.5 text-sm transition-all cursor-pointer ${
                              sourceLanguage === lang.code
                                ? "border-pink-500/50 bg-pink-500/10 text-white"
                                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {lang.flag} {lang.name}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSourceLanguage("auto")}
                          className={`rounded-xl border px-3 py-2.5 text-sm transition-all cursor-pointer ${
                            sourceLanguage === "auto"
                              ? "border-pink-500/50 bg-pink-500/10 text-white"
                              : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {t("dashboard.newProject.autoDetect", "Auto-detect")}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => createProject()}
                      disabled={!sourceLanguage}
                      className="w-full gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {t("dashboard.newProject.createProject", "Create Project")}
                    </button>
                  </div>
                )}
              </>
            )}

            {loading && (
              <ProcessingIndicator
                label={t("dashboard.newProject.transcribingLabel", "Transcribing your video")}
                sublabel={t("dashboard.newProject.transcribingSublabel", "AI is converting speech to text")}
                steps={[
                  t("dashboard.newProject.stepUploadingVideo", "Uploading video"),
                  t("dashboard.newProject.stepExtractingAudio", "Extracting audio"),
                  t("dashboard.newProject.stepSpeechRecognition", "Running speech recognition"),
                  t("dashboard.newProject.stepGeneratingTranscript", "Generating transcript"),
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
              <h3 className="text-lg font-semibold text-white">{t("dashboard.newProject.languageDetected", "Language Detected")}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {t("dashboard.newProject.detectedAs", "We detected the original language as:")}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {LANGUAGE_MAP[detectedLanguage || ""] || detectedLanguage || t("dashboard.newProject.unknown", "Unknown")}
              </p>
            </div>

            {/* Preview first few transcript lines */}
            {transcript.length > 0 && (
              <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 max-h-32 overflow-y-auto">
                <p className="text-xs text-slate-500 mb-2">{t("dashboard.newProject.transcriptPreview", "Transcript preview:")}</p>
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
                {t("dashboard.newProject.yesCorrect", "Yes, this is correct")}
              </button>
              <button
                onClick={() => setCorrectedLanguage(detectedLanguage || "")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                {t("dashboard.newProject.noWrongLanguage", "No, wrong language")}
              </button>
            </div>

            {/* Language correction selector */}
            {correctedLanguage !== "" && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm text-slate-400 mb-3">{t("dashboard.newProject.selectCorrectLanguage", "Select the correct original language:")}</p>
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
                      {lang.flag} {lang.name}
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
                    <>{t("dashboard.newProject.reTranscribeWith", "Re-transcribe with {language}", { language: SOURCE_LANGUAGES.find(l => l.code === correctedLanguage)?.name || correctedLanguage })}</>
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
            <CardTitle>{t("dashboard.newProject.reviewTranscript", "Review Transcript")}</CardTitle>
            <CardDescription>
              {t("dashboard.newProject.reviewTranscriptDescription", "Click on any segment to edit the text before dubbing")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptEditor
              segments={transcript}
              onChange={setTranscript}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep("languages")}>
                {t("dashboard.newProject.nextSelectLanguages", "Next: Select Languages")}
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
            <CardTitle>{t("dashboard.newProject.selectTargetLanguages", "Select Target Languages")}</CardTitle>
            <CardDescription>
              {t("dashboard.newProject.selectTargetLanguagesDescription", "Choose which languages to dub your video into")}
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
                {t("dashboard.newProject.back", "Back")}
              </Button>
              <Button
                onClick={handleStartDubbing}
                disabled={selectedLanguages.length === 0 || loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("dashboard.newProject.startDubbingCount", "Start Dubbing ({count} languages)", { count: String(selectedLanguages.length) })}
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
              label={t("dashboard.newProject.startingDubbingLabel", "Starting dubbing")}
              sublabel={t("dashboard.newProject.startingDubbingSublabel", "Preparing your video for AI processing")}
              steps={[
                t("dashboard.newProject.stepCreatingDubJobs", "Creating dub jobs"),
                t("dashboard.newProject.stepInitializingAi", "Initializing AI pipeline"),
                t("dashboard.newProject.stepRedirecting", "Redirecting to project..."),
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
          actionHref={alertModal.actionHref}
          actionLabel={alertModal.actionLabel}
          actionOnClick={alertModal.actionOnClick}
          secondaryActionLabel={alertModal.secondaryActionLabel}
          secondaryActionOnClick={alertModal.secondaryActionOnClick}
        />
      )}

      {/* Upgrade plan modal — opened from the "Insufficient credits"
          alert's primary CTA. Matches the dashboard Plan card flow. */}
      {profile && (
        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          currentPlan={profile.plan}
        />
      )}

      {/* Topup modal — opened from the "Insufficient credits" alert's
          secondary "Buy more credits" CTA. Stacks on top of the alert. */}
      <TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />

      {/* Pre-dub subtitles choice — shown when the user clicks Start
          Dubbing. Passes the user's selection into startDubbing which
          hits /api/dub with the `burnSubs` flag. */}
      <SubsChoiceModal
        open={subsChoiceOpen}
        onClose={() => setSubsChoiceOpen(false)}
        onConfirm={(withSubs) => startDubbing(withSubs)}
        durationMin={Math.ceil((project?.duration_seconds || 0) / 60)}
        languageCount={selectedLanguages.length}
        submitting={loading}
      />

      {/* Duplicate name — rename inline and retry */}
      <Modal open={duplicateNameOpen} onClose={() => setDuplicateNameOpen(false)}>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("dashboard.newProject.duplicateNameTitle", "Duplicate Name")}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {t("dashboard.newProject.duplicateNameMessage", "A project with this name already exists. Choose a different title.")}
          </p>
          <div className="mt-4">
            <Label htmlFor="newTitle">{t("dashboard.newProject.projectTitleLabel", "Project Title")}</Label>
            <Input
              id="newTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t("dashboard.newProject.projectTitlePlaceholder", "My Video")}
              className="mt-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTitle.trim()) {
                  setTitle(newTitle.trim());
                  setDuplicateNameOpen(false);
                  createProject(undefined, newTitle.trim());
                }
              }}
            />
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setDuplicateNameOpen(false)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {t("dashboard.support.cancel", "Cancel")}
            </button>
            <button
              type="button"
              disabled={!newTitle.trim()}
              onClick={() => {
                setTitle(newTitle.trim());
                setDuplicateNameOpen(false);
                createProject(undefined, newTitle.trim());
              }}
              className="flex-1 gradient-button rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-40 cursor-pointer"
            >
              {t("dashboard.newProject.continue", "Continue")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
