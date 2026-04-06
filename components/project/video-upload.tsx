"use client";

import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";

// Extract audio from video using FFmpeg WASM (works with ALL formats including iPhone MOV/HEVC)
async function extractAudioFromVideo(videoFile: globalThis.File): Promise<Blob> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();

  console.log("[FFMPEG] Loading FFmpeg WASM...");
  await ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm",
  });

  const ext = videoFile.name.split(".").pop()?.toLowerCase() || "mp4";
  const inputName = `input.${ext}`;

  console.log(`[FFMPEG] Converting ${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(1)}MB) to WAV...`);
  await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

  // Extract first 30 seconds of audio as 16kHz mono WAV
  await ffmpeg.exec([
    "-i", inputName,
    "-vn",             // no video
    "-ar", "16000",    // 16kHz sample rate
    "-ac", "1",        // mono
    "-t", "30",        // max 30 seconds
    "-f", "wav",
    "output.wav",
  ]);

  const data = await ffmpeg.readFile("output.wav") as Uint8Array;
  ffmpeg.terminate();

  console.log(`[FFMPEG] Extracted WAV: ${data.length} bytes`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Blob([data as any], { type: "audio/wav" });
}

interface VideoUploadProps {
  userId: string;
  maxSizeMB: number;
  onUploadComplete: (path: string, file: globalThis.File) => void;
}

export function VideoUpload({
  userId,
  maxSizeMB,
  onUploadComplete,
}: VideoUploadProps) {
  const [file, setFile] = useState<globalThis.File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = useCallback(
    (f: globalThis.File) => {
      setError(null);

      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max size is ${maxSizeMB}MB.`);
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

      setFile(f);
      // Create preview URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(f));
    },
    [maxSizeMB]
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

      // Step 2: Extract audio from video in browser (50-90%)
      try {
        const audioBlob = await extractAudioFromVideo(file);
        setProgress(75);

        const audioPath = `${projectDir}/voice-sample.wav`;
        const { error: audioUploadError } = await supabase.storage
          .from("videos")
          .upload(audioPath, audioBlob, {
            contentType: "audio/wav",
            upsert: false,
          });

        if (audioUploadError) {
          console.warn("Audio extraction upload failed:", audioUploadError.message);
        }
        setProgress(90);
      } catch (audioErr) {
        console.warn("Audio extraction failed, will use pre-made voice:", audioErr);
        setProgress(90);
      }

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
