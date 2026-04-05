import Anthropic from "@anthropic-ai/sdk";
import { TranscriptSegment } from "./supabase/types";

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _anthropic;
}

// Detect MIME type from filename extension
function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    webm: "video/webm",
    mkv: "video/x-matroska",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    ogg: "audio/ogg",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

// Whisper transcription via OpenAI API
export async function transcribe(
  audioBuffer: Buffer,
  filename: string
): Promise<{ segments: TranscriptSegment[]; language: string }> {
  const mimeType = getMimeType(filename);
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(audioBuffer)], { type: mimeType }),
    filename
  );
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  formData.append("timestamp_granularities[]", "segment");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error("Whisper API error:", response.status, errorBody);
    throw new Error(`Whisper API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const segments: TranscriptSegment[] = (data.segments || []).map(
    (s: { start: number; end: number; text: string }) => ({
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    })
  );

  return { segments, language: data.language || "en" };
}

// Translation via Claude
export async function translate(
  segments: TranscriptSegment[],
  sourceLang: string,
  targetLang: string
): Promise<TranscriptSegment[]> {
  const text = segments.map((s) => `[${s.start}-${s.end}] ${s.text}`).join("\n");

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Translate the following transcript segments from ${sourceLang} to ${targetLang}.
Preserve the exact timestamp format [start-end] at the beginning of each line.
Keep the translation natural and conversational, matching the tone of the original.
Only output the translated segments, nothing else.

${text}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const lines = content.text.trim().split("\n");
  return lines
    .map((line) => {
      const match = line.match(/^\[(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\]\s*(.+)$/);
      if (!match) return null;
      return {
        start: parseFloat(match[1]),
        end: parseFloat(match[2]),
        text: match[3].trim(),
      };
    })
    .filter((s): s is TranscriptSegment => s !== null);
}

// ElevenLabs voice cloning
export async function cloneVoice(
  audioBuffer: Buffer,
  name: string
): Promise<string> {
  const formData = new FormData();
  formData.append("name", `dubsync-${name}`);
  formData.append(
    "files",
    new Blob([new Uint8Array(audioBuffer)], { type: "audio/wav" }),
    "sample.wav"
  );
  formData.append("description", "Voice cloned by DubSync");

  const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs clone error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.voice_id;
}

// ElevenLabs text-to-speech
export async function textToSpeech(
  text: string,
  voiceId: string
): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS error: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// fal.ai lip sync
export async function lipSync(
  videoUrl: string,
  audioUrl: string
): Promise<string> {
  // Submit job
  const submitResponse = await fetch("https://queue.fal.run/fal-ai/lipsync", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_url: videoUrl,
      audio_url: audioUrl,
    }),
  });

  if (!submitResponse.ok) {
    throw new Error(`fal.ai submit error: ${submitResponse.statusText}`);
  }

  const { request_id } = await submitResponse.json();

  // Poll for result
  while (true) {
    const statusResponse = await fetch(
      `https://queue.fal.run/fal-ai/lipsync/requests/${request_id}/status`,
      {
        headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      }
    );

    const statusData = await statusResponse.json();

    if (statusData.status === "COMPLETED") {
      const resultResponse = await fetch(
        `https://queue.fal.run/fal-ai/lipsync/requests/${request_id}`,
        {
          headers: { Authorization: `Key ${process.env.FAL_KEY}` },
        }
      );
      const result = await resultResponse.json();
      return result.video.url;
    }

    if (statusData.status === "FAILED") {
      throw new Error(`fal.ai lip sync failed: ${statusData.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
