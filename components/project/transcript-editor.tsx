"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { TranscriptSegment } from "@/lib/supabase/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TranscriptEditorProps {
  segments: TranscriptSegment[];
  onChange: (segments: TranscriptSegment[]) => void;
  readOnly?: boolean;
}

export function TranscriptEditor({
  segments,
  onChange,
  readOnly = false,
}: TranscriptEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function handleTextChange(index: number, text: string) {
    const updated = [...segments];
    updated[index] = { ...updated[index], text };
    onChange(updated);
  }

  return (
    <div className="space-y-2">
      {segments.map((segment, i) => (
        <div
          key={`${segment.start}-${segment.end}`}
          className="flex gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
        >
          <div className="shrink-0 text-xs text-muted-foreground font-mono pt-1 w-20">
            {formatTime(segment.start)} - {formatTime(segment.end)}
          </div>
          <div className="flex-1">
            {editingIndex === i && !readOnly ? (
              <Textarea
                value={segment.text}
                onChange={(e) => handleTextChange(i, e.target.value)}
                onBlur={() => setEditingIndex(null)}
                className="min-h-[60px] text-sm"
                autoFocus
              />
            ) : (
              <p
                className={`text-sm ${!readOnly ? "cursor-pointer" : ""}`}
                onClick={() => !readOnly && setEditingIndex(i)}
              >
                {segment.text}
              </p>
            )}
          </div>
        </div>
      ))}

      {segments.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No transcript available
        </p>
      )}
    </div>
  );
}
