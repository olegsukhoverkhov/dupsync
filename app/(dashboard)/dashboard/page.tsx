"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Plus, FolderOpen, Loader2 } from "lucide-react";
import type { ProjectWithDubs } from "@/lib/supabase/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithDubs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative h-12 w-12 mx-auto mb-3">
            <svg className="h-12 w-12 -rotate-90 animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="url(#dpg)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" />
              <defs><linearGradient id="dpg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
            </svg>
          </div>
          <p className="text-sm text-slate-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400">
            Manage your video dubbing projects
          </p>
        </div>
        <Link
          href="/projects/new"
          className="gradient-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 border-dashed bg-slate-800/30 py-20">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white">No projects yet</h3>
          <p className="mt-1 text-sm text-slate-400">
            Upload your first video to get started
          </p>
          <Link
            href="/projects/new"
            className="mt-6 gradient-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
