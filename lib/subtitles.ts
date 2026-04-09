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

/** Collapse runs of blank segments and clamp zero-length cues so a
 *  SRT reader never chokes. */
function normalize(segments: TranscriptSegment[]): TranscriptSegment[] {
  return segments
    .filter((s) => typeof s.text === "string" && s.text.trim().length > 0)
    .map((s, i, arr) => {
      const start = Math.max(0, Number(s.start) || 0);
      let end = Math.max(start + 0.05, Number(s.end) || start + 1);
      // Never let a cue overlap the next one — trim to next start.
      const nextStart = arr[i + 1]?.start;
      if (typeof nextStart === "number" && end > nextStart) {
        end = Math.max(start + 0.05, nextStart - 0.01);
      }
      return { start, end, text: s.text.trim() };
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
