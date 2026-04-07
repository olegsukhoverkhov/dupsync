"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ConfirmModal } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { ProjectWithDubs, Profile } from "@/lib/supabase/types";
import {
  Plus,
  FolderOpen,
  Clock,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Archive,
  ArchiveRestore,
  Trash2,
  X,
  CheckSquare,
} from "lucide-react";

type DashboardView = "active" | "archived";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithDubs[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Tab + selection state
  const [view, setView] = useState<DashboardView>("active");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const projRes = await fetch(`/api/projects?view=${view}`);
      if (projRes.ok) setProjects(await projRes.json());

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) setProfile(data as Profile);
      }
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // When switching tabs, clear any in-progress selection
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectMode(false);
  }, [view]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(projects.map((p) => p.id)));
  }, [projects]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectMode(false);
  }, []);

  const runBulkAction = useCallback(
    async (action: "delete" | "archive" | "unarchive") => {
      if (selectedIds.size === 0) return;
      setBulkLoading(true);
      try {
        const res = await fetch("/api/projects/bulk-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: Array.from(selectedIds),
            action,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Failed: ${err.error || res.statusText}`);
          return;
        }
        clearSelection();
        await fetchData();
      } finally {
        setBulkLoading(false);
        setShowDeleteConfirm(false);
      }
    },
    [selectedIds, clearSelection, fetchData]
  );

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
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const plan = profile ? PLAN_LIMITS[profile.plan] : PLAN_LIMITS.free;
  const creditsTotal = plan.credits === -1 ? Infinity : plan.credits;
  const creditsUsed = creditsTotal === Infinity ? 0 : creditsTotal - (profile?.credits_remaining ?? 0);
  const usagePercent = creditsTotal === Infinity ? 0 : Math.round((creditsUsed / creditsTotal) * 100);

  return (
    <div>
      {/* Plan info bar */}
      {profile && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Plan</p>
                <p className="text-sm font-semibold text-white">{plan.name}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Credits Left</p>
                <p className="text-sm font-semibold text-white">
                  {profile.credits_remaining === -1 ? "Unlimited" : `${profile.credits_remaining.toFixed(1)} credits`}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Credits Used</p>
                <p className="text-sm font-semibold text-white">{creditsUsed.toFixed(1)} credits</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4 flex items-center">
            {profile.plan === "free" ? (
              <Link href="/settings" className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors font-medium">
                Upgrade Plan <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <div>
                <p className="text-xs text-slate-500">Usage</p>
                <div className="mt-1 h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full" style={{ width: `${usagePercent}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{usagePercent}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs + actions header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <div className="ml-2 inline-flex rounded-lg border border-white/10 bg-slate-800/40 p-1">
            <button
              onClick={() => setView("active")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === "active"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setView("archived")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === "archived"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              Archive
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {projects.length > 0 && !selectMode && (
            <button
              onClick={() => setSelectMode(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <CheckSquare className="h-4 w-4" />
              Select
            </button>
          )}
          {view === "active" && (
            <Link
              href="/projects/new"
              className="gradient-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          )}
        </div>
      </div>

      {/* Selection action bar (sticky) */}
      {selectMode && (
        <div className="sticky top-0 z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-pink-500/30 bg-slate-900/80 backdrop-blur px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-white">
              {selectedIds.size} selected
            </span>
            <button
              onClick={selectAll}
              className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              Select all
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {view === "active" && (
              <button
                onClick={() => runBulkAction("archive")}
                disabled={selectedIds.size === 0 || bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </button>
            )}
            {view === "archived" && (
              <button
                onClick={() => runBulkAction("unarchive")}
                disabled={selectedIds.size === 0 || bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArchiveRestore className="h-3.5 w-3.5" />
                Restore
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={selectedIds.size === 0 || bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 border-dashed bg-slate-800/30 py-20">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            {view === "active" ? (
              <FolderOpen className="h-8 w-8 text-slate-600" />
            ) : (
              <Archive className="h-8 w-8 text-slate-600" />
            )}
          </div>
          <h3 className="text-lg font-medium text-white">
            {view === "active" ? "No projects yet" : "No archived projects"}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {view === "active"
              ? "Upload your first video to get started"
              : "Projects you archive will appear here"}
          </p>
          {view === "active" && (
            <Link
              href="/projects/new"
              className="mt-6 gradient-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              selectMode={selectMode}
              selected={selectedIds.has(project.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => runBulkAction("delete")}
        title={`Delete ${selectedIds.size} project${selectedIds.size === 1 ? "" : "s"}?`}
        message="This will permanently delete the selected projects and all their dubs. This action cannot be undone."
        confirmLabel={bulkLoading ? "Deleting..." : "Delete"}
        destructive
      />
    </div>
  );
}
