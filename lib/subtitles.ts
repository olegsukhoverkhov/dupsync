import type { TranscriptSegment } from "@/lib/supabase/types";

/**
 * SRT / WebVTT generators for dubbed transcripts.
 *
 * Both formats share the same shape — a list of cues with a start,
 * end, and text — so we generate them from the same normalized data.
 * The dub pipeline stores `translated_transcript` as an array of
 * `{start, end, text}` segments keyed on seconds, which is exactly
 * what these helpers need.
 */

/** WebVTT uses `HH:MM:SS.mmm`, SRT uses `HH:MM:SS,mmm`. */
function formatTimestamp(totalSeconds: number, separator: "." | ","): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = Math.floor(safe % 60);
  const millis = Math.floor((safe % 1) * 1000);
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const ms = String(millis).padStart(3, "0");
  return `${hh}:${mm}:${ss}${separator}${ms}`;
}

/** Target limits used by the SRT/VTT generators as a safety net
 *  in case something upstream didn't already chunk the segments.
 *  Tuned for the 1920x1080 burn-in pipeline: ~40 chars per line ×
 *  2 lines = 80 chars total. */
const MAX_CHARS_PER_CUE = 80;
const MAX_SECONDS_PER_CUE = 5;

export type RechunkLimits = {
  maxChars?: number;
  maxSeconds?: number;
  /** Minimum on-screen time for any chunk, so a 3-character tail
   *  doesn't flash for 0.1s. Defaults to 0.8s. */
  minSeconds?: number;
};

/**
 * Split a single long segment into multiple shorter sub-cues that
 * each fit within the requested char / time limits. Time is
 * distributed proportionally to character count within the
 * original cue's duration. Word boundaries are respected
 * (we never split mid-word). Works for RTL, CJK, and Latin
 * scripts because the chunking runs on characters / whitespace.
 *
 * Exported so the pipeline can call it in two places:
 *  - `runTranscription` uses an aggressive target (~2.5s) so the
 *    whole downstream pipeline (translation → TTS → SRT) operates
 *    on fine-grained segments. Goal: TTS audio boundaries line up
 *    with on-screen caption boundaries so the viewer hears exactly
 *    what they read, word-for-word.
 *  - `toSrt` / `toVtt` use a permissive fallback (~5s) to catch
 *    anything that somehow slipped past transcription re-chunking
 *    (legacy dubs, edits from the transcript editor, etc.).
 */
export function splitSegment(
  seg: TranscriptSegment,
  limits: Required<RechunkLimits>
): TranscriptSegment[] {
  const text = seg.text.trim();
  const duration = Math.max(0.05, seg.end - seg.start);
  const fitsLength = text.length <= limits.maxChars;
  const fitsDuration = duration <= limits.maxSeconds;
  if (fitsLength && fitsDuration) return [{ ...seg, text }];

  // Compute how many chunks we need based on whichever dimension
  // overflows the most.
  const byChars = Math.ceil(text.length / limits.maxChars);
  const byTime = Math.ceil(duration / limits.maxSeconds);
  const targetChunks = Math.max(byChars, byTime, 2);

  // Greedy word packing: fill a chunk up to the char budget, then
  // start a new one on a word boundary. For CJK scripts where
  // there are no spaces, fall back to character-level split.
  const words = text.split(/\s+/).filter(Boolean);
  const hasWords = words.length > 1;
  const budget = Math.max(1, Math.ceil(text.length / targetChunks));

  const chunks: string[] = [];
  if (hasWords) {
    let current = "";
    for (const w of words) {
      if (current && current.length + 1 + w.length > budget) {
        chunks.push(current);
        current = w;
      } else {
        current = current ? `${current} ${w}` : w;
      }
    }
    if (current) chunks.push(current);
  } else {
    for (let i = 0; i < text.length; i += budget) {
      chunks.push(text.slice(i, i + budget));
    }
  }

  // Distribute the original cue's duration proportionally so chunks
  // line up roughly with when the TTS voice speaks each phrase.
  const totalChars = chunks.reduce((n, c) => n + c.length, 0) || 1;
  const out: TranscriptSegment[] = [];
  let cursor = seg.start;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const share = chunk.length / totalChars;
    let chunkDur = duration * share;
    chunkDur = Math.max(
      limits.minSeconds,
      Math.min(limits.maxSeconds, chunkDur)
    );
    const chunkStart = cursor;
    const chunkEnd =
      i === chunks.length - 1 ? seg.end : Math.min(seg.end, cursor + chunkDur);
    out.push({ start: chunkStart, end: chunkEnd, text: chunk });
    cursor = chunkEnd;
  }
  return out;
}

/**
 * Public re-chunker for use by the pipeline. Runs the dedup /
 * clamp / non-overlap pass, then splits each segment according
 * to the supplied limits.
 */
export function rechunkSegments(
  segments: TranscriptSegment[],
  limits: RechunkLimits = {}
): TranscriptSegment[] {
  const full: Required<RechunkLimits> = {
    maxChars: limits.maxChars ?? MAX_CHARS_PER_CUE,
    maxSeconds: limits.maxSeconds ?? MAX_SECONDS_PER_CUE,
    minSeconds: limits.minSeconds ?? 0.8,
  };

  const filtered = segments
    .filter((s) => typeof s.text === "string" && s.text.trim().length > 0)
    .map((s, i, arr) => {
      const start = Math.max(0, Number(s.start) || 0);
      let end = Math.max(start + 0.05, Number(s.end) || start + 1);
      const nextStart = arr[i + 1]?.start;
      if (typeof nextStart === "number" && end > nextStart) {
        end = Math.max(start + 0.05, nextStart - 0.01);
      }
      return { start, end, text: s.text.trim() };
    });

  const out: TranscriptSegment[] = [];
  for (const seg of filtered) {
    for (const piece of splitSegment(seg, full)) out.push(piece);
  }
  return out;
}

/** SRT/VTT safety-net normalization. Uses the permissive 5s cap
 *  so segments that are already short-chunked stay as they are. */
function normalize(segments: TranscriptSegment[]): TranscriptSegment[] {
  return rechunkSegments(segments, {
    maxChars: MAX_CHARS_PER_CUE,
    maxSeconds: MAX_SECONDS_PER_CUE,
  });
}

/**
 * Build a SubRip (.srt) file as a plain string. Cues are 1-indexed
 * and separated by a blank line — the canonical format.
 */
export function toSrt(segments: TranscriptSegment[]): string {
  const cues = normalize(segments);
  return cues
    .map((c, i) => {
      const start = formatTimestamp(c.start, ",");
      const end = formatTimestamp(c.end, ",");
      return `${i + 1}\n${start} --> ${end}\n${c.text}\n`;
    })
    .join("\n");
}

/**
 * Build a WebVTT (.vtt) file as a plain string. Identical structure
 * to SRT but with `WEBVTT` header and `.` millisecond separator so
 * the file works as a `<track>` source in HTML5 video players.
 */
export function toVtt(segments: TranscriptSegment[]): string {
  const cues = normalize(segments);
  const body = cues
    .map((c) => {
      const start = formatTimestamp(c.start, ".");
      const end = formatTimestamp(c.end, ".");
      return `${start} --> ${end}\n${c.text}\n`;
    })
    .join("\n");
  return `WEBVTT\n\n${body}`;
}
