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

CRITICAL REQUIREMENTS:
1. Preserve the exact timestamp format [start-end] at the beginning of each line
2. Keep the translation CONCISE — try to match the original word count as closely as possible
3. Aim for similar speaking duration (in ${targetLang}, NOT longer than the original)
4. Use natural, conversational language matching the original tone
5. Prefer shorter synonyms when available
6. Only output the translated segments, nothing else

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
    mp4: "audio/mp4", mp3: "audio/mpeg", wav: "audio/wav",
    m4a: "audio/mp4", webm: "audio/webm", mov: "video/mp4",
    avi: "video/mp4", mkv: "video/mp4",
  };
  const mimeType = mimeMap[ext] || "video/mp4";
  const audioExtensions = new Set(["wav", "mp3", "m4a", "webm", "mp4"]);
  const fileName = audioExtensions.has(ext) ? `voice.${ext}` : "voice.mp3";

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

/**
 * Generate per-segment TTS at NATURAL speed and place each segment at its
 * original timestamp. Preserves the original video's timing exactly:
 *
 *   - If the original speaker is silent for the first 5s, the dub is silent
 *     for the first 5s.
 *   - Each translated segment plays at its natural speed starting at the
 *     original `start` timestamp.
 *   - If the dubbed segment is shorter than the original window, the
 *     remaining time is filled with silence.
 *   - If the dubbed segment is longer than its window, it overlaps the next
 *     segment's window (rare; Claude is asked to keep translations concise).
 *   - Final WAV duration = original video duration. No extra padding, no
 *     time stretching, no audio shifting.
 *
 * This means the dubbed audio plays in sync with the original mouth movements
 * even if the dubbed words finish slightly earlier than the original — which
 * the user explicitly requested ("if the speaker is silent at the start, the
 * dub should be silent at the start too").
 */
export async function generateTimedAudio(
  segments: TranscriptSegment[],
  voiceId: string,
  originalVideoDuration: number
): Promise<{ wav: Buffer; durationSec: number }> {
  const SAMPLE_RATE = 24000;
  console.log(
    `[TTS_TIMED] Generating ${segments.length} segments at natural speed, video=${originalVideoDuration}s`
  );

  async function ttsNatural(text: string): Promise<Buffer | null> {
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
            stability: 0.5,
            similarity_boost: 0.95,
            style: 0.3,
            use_speaker_boost: true,
          },
          // No speed parameter — generate at the cloned voice's natural speed
        }),
      }
    );
    if (!response.ok) {
      const err = await response.text().catch(() => "");
      console.warn(`[TTS_TIMED] TTS failed ${response.status}: ${err.slice(0, 200)}`);
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  }

  // Generate every segment at natural speed
  const generated: { pcm: Buffer; start: number; naturalSec: number; text: string }[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg.text.trim()) continue;
    try {
      const pcm = await ttsNatural(seg.text);
      if (!pcm) continue;
      const naturalSec = pcm.length / 2 / SAMPLE_RATE;
      generated.push({ pcm, start: seg.start, naturalSec, text: seg.text });
      if (i % 5 === 0) {
        console.log(
          `[TTS_TIMED] ${i + 1}/${segments.length}: ${naturalSec.toFixed(2)}s natural at ${seg.start.toFixed(2)}s "${seg.text.slice(0, 40)}..."`
        );
      }
    } catch (err) {
      console.warn(`[TTS_TIMED] Segment ${i} exception:`, err);
    }
  }

  // Total duration = max of (original video, last segment end + small tail)
  // This ensures we never truncate audio that overflows the video, but
  // normally the file matches the original video length exactly.
  let lastEnd = originalVideoDuration;
  for (const g of generated) {
    lastEnd = Math.max(lastEnd, g.start + g.naturalSec);
  }
  const totalSec = Math.max(originalVideoDuration, lastEnd) + 0.1;
  const totalSamples = Math.ceil(totalSec * SAMPLE_RATE);
  const pcmOutput = Buffer.alloc(totalSamples * 2); // 16-bit silence

  // Place each segment at its ORIGINAL start timestamp
  for (const g of generated) {
    const startSample = Math.floor(g.start * SAMPLE_RATE);
    const destOffset = startSample * 2;
    const copyBytes = Math.min(g.pcm.length, pcmOutput.length - destOffset);
    if (destOffset >= 0 && copyBytes > 0) {
      g.pcm.copy(pcmOutput, destOffset, 0, copyBytes);
    }
  }

  // Build WAV header
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

  console.log(
    `[TTS_TIMED] Done: ${(wavSize / 1024).toFixed(0)}KB, ${totalSec.toFixed(2)}s (original video=${originalVideoDuration}s)`
  );
  return { wav, durationSec: totalSec };
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

// fal.ai lip sync — tries sync-labs first, falls back to latentsync.
// sync-labs model is faster (~30s for short clips) and more reliable.
export async function lipSync(
  videoUrl: string,
  audioUrl: string
): Promise<string> {
  // Try sync-labs first (faster, more reliable)
  try {
    return await runLipSyncModel("fal-ai/sync-lipsync", videoUrl, audioUrl, {
      video_url: videoUrl,
      audio_url: audioUrl,
      model: "lipsync-1.9.0-beta",
      sync_mode: "loop",
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown";
    console.warn(`[LIP_SYNC] sync-lipsync failed: ${errMsg}, trying latentsync...`);
    return await runLipSyncModel("fal-ai/latentsync", videoUrl, audioUrl, {
      video_url: videoUrl,
      audio_url: audioUrl,
    });
  }
}

async function runLipSyncModel(
  modelPath: string,
  videoUrl: string,
  audioUrl: string,
  body: Record<string, unknown>
): Promise<string> {
  console.log(`[LIP_SYNC] Submitting to ${modelPath}...`);

  const submitResponse = await fetch(`https://queue.fal.run/${modelPath}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!submitResponse.ok) {
    const errBody = await submitResponse.text().catch(() => "");
    console.error(`[LIP_SYNC] ${modelPath} submit failed ${submitResponse.status}: ${errBody}`);
    throw new Error(`fal.ai submit error: ${submitResponse.status} ${errBody.slice(0, 200)}`);
  }

  const { request_id } = await submitResponse.json();
  console.log(`[LIP_SYNC] ${modelPath} job submitted: ${request_id}`);

  // Poll for result (max 4 minutes)
  const maxAttempts = 120; // 120 * 2s = 4 minutes
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusResponse = await fetch(
      `https://queue.fal.run/${modelPath}/requests/${request_id}/status`,
      {
        headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      }
    );

    const statusData = await statusResponse.json();
    if (i % 5 === 0) console.log(`[LIP_SYNC] ${modelPath} poll ${i}: ${statusData.status}`);

    if (statusData.status === "COMPLETED") {
      const resultResponse = await fetch(
        `https://queue.fal.run/${modelPath}/requests/${request_id}`,
        {
          headers: { Authorization: `Key ${process.env.FAL_KEY}` },
        }
      );
      const result = await resultResponse.json();
      console.log(`[LIP_SYNC] ${modelPath} completed`);
      return result.video?.url || result.video;
    }

    if (statusData.status === "FAILED") {
      const detail = statusData.error || statusData.detail || "Unknown error";
      console.error(`[LIP_SYNC] ${modelPath} failed: ${JSON.stringify(detail).slice(0, 300)}`);
      throw new Error(`Lip sync failed: ${typeof detail === "string" ? detail : JSON.stringify(detail).slice(0, 200)}`);
    }
  }

  throw new Error(`${modelPath} timed out after 4 minutes`);
}

/**
 * Slow down a video to match a target duration using fal.ai ffmpeg.
 * Returns a URL to the slowed video.
 */
export async function slowDownVideo(
  videoUrl: string,
  targetDurationSec: number,
  originalDurationSec: number
): Promise<string> {
  const speedFactor = originalDurationSec / targetDurationSec;
  console.log(`[FFMPEG] Slowing video from ${originalDurationSec}s to ${targetDurationSec}s (speed=${speedFactor.toFixed(3)})`);

  if (speedFactor >= 0.95) {
    console.log(`[FFMPEG] Speed factor too small, returning original`);
    return videoUrl;
  }

  const submitResponse = await fetch("https://queue.fal.run/fal-ai/ffmpeg-api/compose", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracks: [
        {
          id: "v1",
          type: "video",
          keyframes: [
            {
              url: videoUrl,
              timestamp: 0,
              duration: targetDurationSec,
            },
          ],
        },
      ],
    }),
  });

  if (!submitResponse.ok) {
    const err = await submitResponse.text().catch(() => "");
    console.warn(`[FFMPEG] Submit failed: ${submitResponse.status} ${err.slice(0, 200)}`);
    return videoUrl; // fallback to original
  }

  const { request_id } = await submitResponse.json();

  // Poll for result
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(`https://queue.fal.run/fal-ai/ffmpeg-api/requests/${request_id}/status`, {
      headers: { Authorization: `Key ${process.env.FAL_KEY}` },
    });
    const status = await statusRes.json();
    if (status.status === "COMPLETED") {
      const resultRes = await fetch(`https://queue.fal.run/fal-ai/ffmpeg-api/requests/${request_id}`, {
        headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      });
      const result = await resultRes.json();
      console.log(`[FFMPEG] Slowed video ready`);
      return result.video_url || result.video?.url || result.url || videoUrl;
    }
    if (status.status === "FAILED") {
      console.warn(`[FFMPEG] Failed: ${JSON.stringify(status).slice(0, 200)}`);
      return videoUrl;
    }
  }
  return videoUrl;
}
