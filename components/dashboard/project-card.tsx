import Link from "next/link";
import { Video, Clock, CreditCard } from "lucide-react";
import type { ProjectWithDubs, ProjectStatus } from "@/lib/supabase/types";

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

export function ProjectCard({ project }: { project: ProjectWithDubs }) {
  const doneDubs = project.dubs.filter((d) => d.status === "done").length;
  const totalDubs = project.dubs.length;

  return (
    <Link href={`/projects/${project.id}`} className="h-full">
      <div className="h-full rounded-2xl border border-white/10 bg-slate-800/50 p-5 hover:bg-slate-800/80 hover:border-white/20 transition-all cursor-pointer flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-white truncate pr-2">
            {project.title}
          </h3>
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
              {doneDubs}/{totalDubs} languages
            </span>
          )}
          {project.status === "done" && (
            <span className="text-slate-600">
              {new Date(project.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
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
      </div>
    </Link>
  );
}
