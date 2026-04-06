import Anthropic from "@anthropic-ai/sdk";
import { TranscriptSegment } from "./supabase/types";

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _anthropic;
}

// Whisper supported formats
const WHISPER_FORMATS = new Set(["flac", "m4a", "mp3", "mp4", "mpeg", "mpga", "oga", "ogg", "wav", "webm"]);

// Map unsupported formats to supported ones for Whisper
function getWhisperFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";
  if (WHISPER_FORMATS.has(ext)) return `audio.${ext}`;
  // MOV (iPhone) → try as m4a first (better compatibility with AAC audio)
  if (ext === "mov") return "audio.m4a";
  // AVI, MKV → send as mp4
  return "audio.mp4";
}

function getWhisperMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4", m4a: "audio/mp4", mp3: "audio/mpeg",
    wav: "audio/wav", webm: "video/webm", ogg: "audio/ogg",
    oga: "audio/ogg", flac: "audio/flac", mpeg: "video/mpeg",
    mpga: "audio/mpeg",
  };
  // For unsupported formats (mov, avi, mkv), use mp4 mime type
  return mimeTypes[ext] || "video/mp4";
}

// Transcription via AssemblyAI REST API — accepts ANY format including HEVC MOV
export async function transcribeWithAssemblyAI(
  audioBuffer: Buffer,
  languageHint?: string
): Promise<{ segments: TranscriptSegment[]; language: string }> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY!;

  // Step 1: Upload file
  console.log(`[ASSEMBLYAI] Uploading ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)}MB...`);
  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(audioBuffer),
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text().catch(() => "");
    throw new Error(`AssemblyAI upload failed: ${uploadRes.status} ${err.slice(0, 200)}`);
  }

  const { upload_url } = await uploadRes.json();
  console.log(`[ASSEMBLYAI] Uploaded: ${upload_url}`);

  // Step 2: Start transcription
  const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: upload_url,
      speech_models: ["universal-2"],
      language_code: languageHint && languageHint !== "auto" ? languageHint : undefined,
      language_detection: !languageHint || languageHint === "auto",
    }),
  });

  if (!transcriptRes.ok) throw new Error(`AssemblyAI create failed: ${transcriptRes.status}`);
  const { id: transcriptId } = await transcriptRes.json();

  // Step 3: Poll for completion
  console.log(`[ASSEMBLYAI] Polling transcript ${transcriptId}...`);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { Authorization: apiKey },
    });
    const data = await pollRes.json();

    if (data.status === "completed") {
      const segments: TranscriptSegment[] = (data.words || []).reduce(
        (acc: TranscriptSegment[], word: { start: number; end: number; text: string }) => {
          const lastSeg = acc[acc.length - 1];
          const wStart = (word.start || 0) / 1000;
          const wEnd = (word.end || 0) / 1000;

          if (!lastSeg || wStart - lastSeg.end > 1.0 || wEnd - lastSeg.start > 5.0) {
            acc.push({ start: wStart, end: wEnd, text: word.text || "" });
          } else {
            lastSeg.end = wEnd;
            lastSeg.text += " " + (word.text || "");
          }
          return acc;
        },
        []
      );

      const lang = data.language_code || languageHint || "en";
      console.log(`[ASSEMBLYAI] Done: ${segments.length} segments, lang=${lang}`);
      return { segments, language: lang };
    }

    if (data.status === "error") {
      throw new Error(`AssemblyAI error: ${data.error}`);
    }
  }

  throw new Error("AssemblyAI transcription timed out");
}

// Transcription: Whisper (primary) → AssemblyAI (fallback for unsupported formats)
export async function transcribe(
  audioBuffer: Buffer,
  filename: string,
  languageHint?: string
): Promise<{ segments: TranscriptSegment[]; language: string }> {
  // Try Whisper first
  const whisperFilename = getWhisperFilename(filename);
  const mimeType = getWhisperMimeType(whisperFilename);
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(audioBuffer)], { type: mimeType }),
    whisperFilename
  );
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  formData.append("timestamp_granularities[]", "segment");
  if (languageHint && languageHint !== "auto") {
    formData.append("language", languageHint);
  }

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
    console.error("Whisper API error:", response.status, errorBody.slice(0, 200));

    // Fallback to AssemblyAI (accepts ALL formats including HEVC MOV)
    if (process.env.ASSEMBLYAI_API_KEY) {
      console.log("[TRANSCRIBE] Whisper failed, trying AssemblyAI...");
      return await transcribeWithAssemblyAI(audioBuffer, languageHint);
    }

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

// Get a pre-made ElevenLabs multilingual voice
export async function getMultilingualVoice(): Promise<string> {
  // Use "Laura" — ElevenLabs pre-made multilingual female voice
  // Fallback list of known pre-made voice IDs that support multilingual
  const PREMADE_VOICES = [
    "FGY2WhTYpPnrIDTdsKH5", // Laura
    "EXAVITQu4vr4xnSDxMaL", // Sarah
    "XrExE9yKIg1WjnnlVkGX", // Matilda
  ];

  // Try to verify the first voice exists
  for (const id of PREMADE_VOICES) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, {
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
      });
      if (res.ok) return id;
    } catch {
      continue;
    }
  }

  // Fallback to first
  return PREMADE_VOICES[0];
}

// ElevenLabs voice cloning with high-quality settings
export async function cloneVoice(
  fileBuffer: Buffer,
  name: string,
  fileExt: string = "mp4"
): Promise<string> {
  const ext = fileExt.toLowerCase();
  const mimeMap: Record<string, string> = {
    mp4: "video/mp4", mp3: "audio/mpeg", wav: "audio/wav",
    m4a: "audio/mp4", webm: "video/webm", mov: "video/mp4",
    avi: "video/mp4", mkv: "video/mp4",
  };
  const mimeType = mimeMap[ext] || "video/mp4";
  const fileName = `sample.${WHISPER_FORMATS.has(ext) ? ext : "mp4"}`;

  const formData = new FormData();
  formData.append("name", `dubsync-${name.slice(0, 8)}-${Date.now()}`);
  formData.append(
    "files",
    new Blob([new Uint8Array(fileBuffer)], { type: mimeType }),
    fileName
  );
  formData.append("description", "Voice cloned by DubSync for video dubbing");
  // Labels help ElevenLabs optimize the voice model
  formData.append("labels", JSON.stringify({
    use_case: "dubbing",
    source: "video",
  }));

  console.log(`[VOICE_CLONE] Uploading ${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)}MB as ${fileName} (${mimeType})`);

  const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error(`[VOICE_CLONE] Error ${response.status}: ${errBody}`);
    throw new Error(`ElevenLabs clone error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`[VOICE_CLONE] Success: voice_id=${data.voice_id}`);
  return data.voice_id;
}

// Delete a cloned voice after use to keep the account clean
export async function deleteClonedVoice(voiceId: string): Promise<void> {
  try {
    await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      method: "DELETE",
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
    });
    console.log(`[VOICE_CLONE] Deleted voice ${voiceId}`);
  } catch {
    console.warn(`[VOICE_CLONE] Failed to delete voice ${voiceId}`);
  }
}

// ElevenLabs text-to-speech
export async function textToSpeech(
  text: string,
  voiceId: string
): Promise<Buffer> {
  return textToSpeechWithSpeed(text, voiceId, 1.0);
}

// ElevenLabs TTS with adjustable speed (0.5 - 2.0)
export async function textToSpeechWithSpeed(
  text: string,
  voiceId: string,
  speed: number
): Promise<Buffer> {
  const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
  console.log(`[TTS] Generating: ${text.length} chars, voice=${voiceId}, speed=${clampedSpeed.toFixed(2)}`);

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
          stability: 0.3,
          similarity_boost: 0.95,
          style: 0.4,
          use_speaker_boost: true,
        },
        speed: clampedSpeed,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error(`[TTS] Error ${response.status}: ${errBody.slice(0, 200)}`);
    throw new Error(`ElevenLabs TTS error: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// Generate per-segment TTS with exact timing matching original video
// Each segment is placed at its original timestamp, speed-adjusted to fit
export async function generateTimedAudio(
  segments: TranscriptSegment[],
  voiceId: string,
  totalDurationSec: number
): Promise<Buffer> {
  const SAMPLE_RATE = 24000;
  const totalSamples = Math.ceil(totalDurationSec * SAMPLE_RATE);
  const pcmOutput = Buffer.alloc(totalSamples * 2); // 16-bit PCM = 2 bytes/sample

  console.log(`[TTS_TIMED] ${segments.length} segments, total=${totalDurationSec}s, ${totalSamples} samples`);

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg.text.trim()) continue;

    const segStart = seg.start;
    const segEnd = seg.end;
    const segDuration = segEnd - segStart;
    if (segDuration <= 0) continue;

    // Estimate natural speech duration for this text
    const estimatedSpeechSec = seg.text.length / 14; // ~14 chars/sec average
    // Calculate speed to fit speech into segment duration
    // If estimated > segment duration → speed up (max 1.5x)
    // If estimated < segment duration → slow down (min 0.7x)
    const speed = Math.max(0.7, Math.min(1.5, estimatedSpeechSec / segDuration));

    try {
      // Get PCM for this segment
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_24000`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: seg.text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.3,
              similarity_boost: 0.95,
              style: 0.4,
              use_speaker_boost: true,
            },
            speed,
          }),
        }
      );

      if (!response.ok) {
        console.warn(`[TTS_TIMED] Segment ${i} failed: ${response.status}`);
        continue;
      }

      const segPcm = Buffer.from(await response.arrayBuffer());
      const segSamples = segPcm.length / 2;

      // Place PCM at the correct position in the output
      const startSample = Math.floor(segStart * SAMPLE_RATE);
      const maxSegSamples = Math.floor(segDuration * SAMPLE_RATE);
      const copyBytes = Math.min(segPcm.length, maxSegSamples * 2);
      const destOffset = startSample * 2;

      if (destOffset >= 0 && destOffset + copyBytes <= pcmOutput.length) {
        segPcm.copy(pcmOutput, destOffset, 0, copyBytes);
      }

      if (i % 5 === 0) {
        console.log(`[TTS_TIMED] Segment ${i}/${segments.length}: "${seg.text.slice(0, 30)}..." at ${segStart}s, speed=${speed.toFixed(2)}`);
      }
    } catch (err) {
      console.warn(`[TTS_TIMED] Segment ${i} exception:`, err);
    }
  }

  // Build WAV with exact duration
  const wavSize = 44 + totalSamples * 2;
  const wav = Buffer.alloc(wavSize);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wavSize - 8, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(totalSamples * 2, 40);
  pcmOutput.copy(wav, 44);

  console.log(`[TTS_TIMED] WAV: ${(wavSize / 1024).toFixed(0)}KB, ${totalDurationSec}s exact`);
  return wav;
}

// Generate TTS as PCM and pad to exact duration as WAV (legacy single-segment)
export async function textToSpeechPadded(
  text: string,
  voiceId: string,
  targetDurationSec: number,
  speed: number = 1.0
): Promise<Buffer> {
  const SAMPLE_RATE = 24000;
  const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
  console.log(`[TTS_PADDED] ${text.length} chars, target=${targetDurationSec}s, speed=${clampedSpeed.toFixed(2)}`);

  // Get PCM audio from ElevenLabs
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_24000`,
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
          stability: 0.3,         // lower = more expressive, closer to original
          similarity_boost: 0.95, // maximum similarity to cloned voice
          style: 0.4,             // some style transfer from original
          use_speaker_boost: true, // enhance speaker similarity
        },
        speed: clampedSpeed,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`ElevenLabs TTS error: ${response.status} ${errBody.slice(0, 200)}`);
  }

  const pcmBuffer = Buffer.from(await response.arrayBuffer());
  const pcmSamples = pcmBuffer.length / 2; // 16-bit = 2 bytes per sample
  const pcmDuration = pcmSamples / SAMPLE_RATE;

  console.log(`[TTS_PADDED] PCM: ${pcmSamples} samples = ${pcmDuration.toFixed(2)}s`);

  // Target total samples for exact video duration
  const targetSamples = Math.ceil(targetDurationSec * SAMPLE_RATE);

  // Build WAV with EXACT target duration — trim if speech longer, pad if shorter
  const totalSamples = targetSamples; // ALWAYS exact target duration
  const wavSize = 44 + totalSamples * 2;
  const wav = Buffer.alloc(wavSize); // zeros = silence for padding

  // WAV header
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wavSize - 8, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // mono
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(totalSamples * 2, 40);

  // Copy PCM data (rest is zeros = silence)
  pcmBuffer.copy(wav, 44, 0, Math.min(pcmBuffer.length, totalSamples * 2));

  console.log(`[TTS_PADDED] WAV: ${totalSamples} samples = ${(totalSamples / SAMPLE_RATE).toFixed(2)}s (padded ${Math.max(0, targetSamples - pcmSamples)} samples silence)`);

  return wav;
}

// fal.ai lip sync using latentsync model
export async function lipSync(
  videoUrl: string,
  audioUrl: string
): Promise<string> {
  console.log("[LIP_SYNC] Submitting to fal-ai/latentsync...");

  const submitResponse = await fetch("https://queue.fal.run/fal-ai/latentsync", {
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
    const errBody = await submitResponse.text().catch(() => "");
    console.error(`[LIP_SYNC] Submit failed ${submitResponse.status}: ${errBody}`);
    throw new Error(`fal.ai submit error: ${submitResponse.status} ${errBody.slice(0, 200)}`);
  }

  const { request_id } = await submitResponse.json();
  console.log(`[LIP_SYNC] Job submitted: ${request_id}`);

  // Poll for result (max 3 minutes to stay within Vercel after() limits)
  const maxAttempts = 90; // 90 * 2s = 3 minutes
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusResponse = await fetch(
      `https://queue.fal.run/fal-ai/latentsync/requests/${request_id}/status`,
      {
        headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      }
    );

    const statusData = await statusResponse.json();
    if (i % 5 === 0) console.log(`[LIP_SYNC] Poll ${i}: ${statusData.status}`);

    if (statusData.status === "COMPLETED") {
      const resultResponse = await fetch(
        `https://queue.fal.run/fal-ai/latentsync/requests/${request_id}`,
        {
          headers: { Authorization: `Key ${process.env.FAL_KEY}` },
        }
      );
      const result = await resultResponse.json();
      console.log(`[LIP_SYNC] Completed successfully`);
      return result.video?.url || result.video;
    }

    if (statusData.status === "FAILED") {
      const detail = statusData.error || statusData.detail || "Unknown error";
      console.error(`[LIP_SYNC] Failed: ${JSON.stringify(detail).slice(0, 300)}`);
      throw new Error(`Lip sync failed: ${typeof detail === "string" ? detail : JSON.stringify(detail).slice(0, 200)}`);
    }
  }

  throw new Error("Lip sync timed out after 4 minutes");
}
