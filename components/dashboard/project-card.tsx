import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock } from "lucide-react";
import type { ProjectWithDubs, ProjectStatus } from "@/lib/supabase/types";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  uploading: "bg-yellow-100 text-yellow-800",
  transcribing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  dubbing: "bg-purple-100 text-purple-800",
  done: "bg-emerald-100 text-emerald-800",
  error: "bg-red-100 text-red-800",
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
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{project.title}</CardTitle>
            <Badge
              variant="secondary"
              className={STATUS_COLORS[project.status]}
            >
              {project.status}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-4 text-xs">
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
          </CardDescription>
        </CardHeader>
        {totalDubs > 0 && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {project.dubs.map((dub) => (
                <Badge
                  key={dub.id}
                  variant="outline"
                  className="text-xs font-normal"
                >
                  {dub.target_language}
                  {dub.status === "done" && " ✓"}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
