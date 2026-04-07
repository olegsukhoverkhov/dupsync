"use client";

import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";

// Extract audio from video using <video> + MediaRecorder API
// Works on iOS Safari without SharedArrayBuffer (unlike FFmpeg WASM)
async function extractAudioViaMediaRecorder(videoFile: globalThis.File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    // Mute the playback element so the user does NOT hear the video while we
    // extract audio from the captured stream. The MediaRecorder captures from
    // the captureStream() which is independent of the element's volume — so
    // muting here is purely cosmetic for the user.
    video.muted = true;
    video.volume = 0;
    video.playsInline = true;
    video.style.display = "none";
    video.src = URL.createObjectURL(videoFile);

    video.onloadedmetadata = () => {
      try {
        // Use captureStream to get a MediaStream from the video
        const stream = (video as HTMLVideoElement & { captureStream(): MediaStream }).captureStream();
        // Get audio tracks only
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
          console.warn("[AUDIO_EXTRACT] No audio tracks in video");
          resolve(null);
          return;
        }

        const audioStream = new MediaStream(audioTracks);
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "audio/webm";

        const recorder = new MediaRecorder(audioStream, { mimeType });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          URL.revokeObjectURL(video.src);
          video.remove();
          const ext = mimeType.includes("mp4") ? "mp4" : "webm";
          const blob = new Blob(chunks, { type: mimeType });
          console.log(`[AUDIO_EXTRACT] Recorded ${(blob.size / 1024).toFixed(0)}KB as ${ext}`);
          resolve(blob);
        };

        recorder.onerror = () => {
          URL.revokeObjectURL(video.src);
          resolve(null);
        };

        // Start recording and play video
        recorder.start();
        video.play().catch(() => resolve(null));

        // Stop when video ends
        video.onended = () => recorder.stop();

        // Safety timeout (max 60 seconds of recording)
        setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, 60000);
      } catch {
        URL.revokeObjectURL(video.src);
        resolve(null);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };
  });
}

interface VideoUploadProps {
  userId: string;
  maxSizeMB: number;
  /** Plan limit on video duration in seconds. 0 = unlimited. */
  maxDurationSec?: number;
  /** Plan name for error messages, e.g. "Free" */
  planName?: string;
  onUploadComplete: (path: string, file: globalThis.File) => void;
}

/**
 * Read a video file's duration (in seconds) by loading its metadata.
 * Resolves with the duration or null if it can't be determined.
 */
function probeVideoDuration(file: globalThis.File): Promise<number | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      const dur = video.duration;
      URL.revokeObjectURL(video.src);
      video.remove();
      resolve(Number.isFinite(dur) && dur > 0 ? dur : null);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };
    // Safety timeout in case metadata never loads
    setTimeout(() => resolve(null), 8000);
  });
}

export function VideoUpload({
  userId,
  maxSizeMB,
  maxDurationSec = 0,
  planName = "your",
  onUploadComplete,
}: VideoUploadProps) {
  const [file, setFile] = useState<globalThis.File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = useCallback(
    async (f: globalThis.File) => {
      setError(null);

      if (f.size > maxSizeMB * 1024 * 1024) {
        const sizeMB = (f.size / (1024 * 1024)).toFixed(0);
        setError(
          `File too large (${sizeMB}MB). The ${planName} plan allows max ${maxSizeMB}MB. Upgrade your plan to upload larger files.`
        );
        return;
      }

      const validTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
        "video/x-matroska",
      ];
      if (!validTypes.includes(f.type)) {
        setError("Unsupported format. Use MP4, MOV, AVI, WebM, or MKV.");
        return;
      }

      // Check video duration against the plan limit (0 = unlimited)
      if (maxDurationSec > 0) {
        const duration = await probeVideoDuration(f);
        if (duration !== null && duration > maxDurationSec) {
          const dur = duration.toFixed(1);
          const limit =
            maxDurationSec >= 60
              ? `${(maxDurationSec / 60).toFixed(0)} min`
              : `${maxDurationSec} sec`;
          setError(
            `Video too long (${dur}s). The ${planName} plan allows max ${limit}. Upgrade your plan to dub longer videos.`
          );
          return;
        }
      }

      setFile(f);
      // Create preview URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(f));
    },
    [maxSizeMB, maxDurationSec, planName, previewUrl]
  );

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const supabase = createClient();
      const projectDir = `${userId}/${crypto.randomUUID()}`;
      const ext = file.name.split(".").pop() || "mp4";
      const videoPath = `${projectDir}/original.${ext}`;

      // Step 1: Upload video (0-50%)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 45));
      }, 500);

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(videoPath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);
      if (uploadError) throw new Error(uploadError.message);
      setProgress(50);

      // Step 2: Extract audio via MediaRecorder (works on iOS Safari)
      try {
        setProgress(55);
        const audioBlob = await extractAudioViaMediaRecorder(file);
        if (audioBlob && audioBlob.size > 1000) {
          setProgress(75);
          const audioExt = audioBlob.type.includes("mp4") ? "mp4" : "webm";
          await supabase.storage
            .from("videos")
            .upload(`${projectDir}/extracted-audio.${audioExt}`, audioBlob, {
              contentType: audioBlob.type,
              upsert: false,
            });
          console.log(`[UPLOAD] Extracted audio: ${(audioBlob.size / 1024).toFixed(0)}KB ${audioExt}`);
        }
      } catch (audioErr) {
        console.warn("Audio extraction failed:", audioErr);
      }
      setProgress(90);

      setProgress(100);
      onUploadComplete(videoPath, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) handleFile(droppedFile);
          }}
        >
          <Upload className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm font-medium">
            Drag and drop your video here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            MP4, MOV, AVI, WebM, MKV up to {maxSizeMB}MB
          </p>
          <label className="mt-4">
            <Button variant="outline" size="sm" render={<span />}>
              Choose File
            </Button>
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {/* Video preview */}
          {previewUrl && (
            <div className="bg-black">
              <video
                src={previewUrl}
                controls
                className="w-full max-h-48 object-contain"
                preload="metadata"
              />
            </div>
          )}
          <div className="p-4">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            {!uploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                  if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Uploading video...</span>
                <span className="text-white font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 text-center">
                {progress < 50 ? "Sending file to server..." : progress < 90 ? "Almost there..." : "Finalizing upload..."}
              </p>
            </div>
          )}

          {!uploading && progress === 0 && (
            <Button className="mt-3 w-full" onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
