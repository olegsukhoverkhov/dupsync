"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Video, Clock, Check, Coins, AlertCircle, Upload } from "lucide-react";
import type { ProjectWithDubs, ProjectStatus } from "@/lib/supabase/types";
import type { MouseEvent } from "react";
import { useDashboardT } from "./locale-provider";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  uploading: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  transcribing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ready: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  dubbing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  done: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

function formatDuration(seconds: number | null) {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ProjectCardProps {
  project: ProjectWithDubs;
  /** Selection mode toggle. When true, clicking the card toggles selection
   *  instead of navigating to the project. */
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function ProjectCard({
  project,
  selectMode = false,
  selected = false,
  onToggleSelect,
}: ProjectCardProps) {
  const router = useRouter();
  const t = useDashboardT();
  const doneDubs = project.dubs.filter((d) => d.status === "done").length;
  const totalDubs = project.dubs.length;

  const cardBody = (
    <div
      className={`relative h-full rounded-2xl border p-5 transition-all flex flex-col ${
        selected
          ? "border-pink-500/60 bg-pink-500/10"
          : "border-white/10 bg-slate-800/50 hover:bg-slate-800/80 hover:border-white/20"
      } ${selectMode ? "cursor-pointer" : "cursor-pointer"}`}
    >
      {/* Selection checkbox (only shown in select mode) */}
      {selectMode && (
        <div
          className={`absolute top-3 left-3 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
            selected
              ? "bg-pink-500 border-pink-500"
              : "bg-slate-900/80 border-white/20"
          }`}
        >
          {selected && <Check className="h-3 w-3 text-white" />}
        </div>
      )}

      <div className={`flex items-start justify-between mb-3 ${selectMode ? "pl-7" : ""}`}>
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {project.title}
          </h3>
          {project.is_demo && (
            <span className="shrink-0 inline-flex items-center rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
              Demo
            </span>
          )}
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(project.duration_seconds)}
        </span>
        {totalDubs > 0 && (
          <span className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            {doneDubs}/{totalDubs} {t("dashboard.projectCard.languages", "languages")}
          </span>
        )}
        {/* For completed projects we surface the total credits this project
            burned instead of the timestamp — users care far more about cost
            than when they hit "Done". Timestamp is still available via the
            project detail page. */}
      </div>

      {totalDubs > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.dubs.map((dub) => (
            <span
              key={dub.id}
              className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-400"
            >
              {dub.target_language}
              {dub.status === "done" && (
                <span className="ml-1 text-green-400">&#10003;</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Friendly error message for failed projects. We only render this
          when the backend wrote a user-facing message; otherwise the
          status pill ("error") alone is the UI signal.
          The "Upload new video" button below is a recovery CTA — any
          classified error (no audio, unsupported format, too long…) can
          be fixed by uploading a different file, so we always offer it
          when the project is in an `error` state. */}
      {project.status === "error" && project.error_message && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 leading-relaxed">
              {project.error_message}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              // The whole card is wrapped in a <Link> to /projects/:id,
              // so we must swallow the click BEFORE it bubbles up or the
              // user ends up on the failed project's detail page instead
              // of the upload flow.
              e.preventDefault();
              e.stopPropagation();
              router.push("/projects/new");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-200 hover:bg-red-500/20 hover:text-white transition-colors"
          >
            <Upload className="h-3 w-3" />
            {t("dashboard.projectCard.uploadNewVideo", "Upload new video")}
          </button>
        </div>
      )}
    </div>
  );

  if (selectMode) {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onToggleSelect?.(project.id);
    };
    return (
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onToggleSelect?.(project.id);
          }
        }}
        className="h-full"
      >
        {cardBody}
      </div>
    );
  }

  return (
    <Link href={`/projects/${project.id}`} className="h-full">
      {cardBody}
    </Link>
  );
}
