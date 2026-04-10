"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ConfirmModal } from "@/components/ui/modal";
import { UpgradeModal } from "@/components/dashboard/upgrade-modal";
import { TopupModal } from "@/components/dashboard/topup-modal";
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard";
import { useDashboardT } from "@/components/dashboard/locale-provider";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { ProjectWithDubs, Profile } from "@/lib/supabase/types";
import {
  Plus,
  FolderOpen,
  Clock,
  CreditCard,
  TrendingUp,
  Archive,
  ArchiveRestore,
  Trash2,
  X,
  CheckSquare,
  Sparkles,
} from "lucide-react";

type DashboardView = "active" | "archived";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithDubs[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const t = useDashboardT();

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

  // Show onboarding wizard for new users
  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed && projects.length <= 1) {
      setShowOnboarding(true);
    }
  }, [loading, profile, projects.length]);

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
          alert(t("dashboard.home.bulkActionFailed", "Failed: {error}", { error: err.error || res.statusText }));
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
          <p className="text-sm text-slate-400">{t("dashboard.home.loading", "Loading...")}</p>
        </div>
      </div>
    );
  }

  const plan = profile ? PLAN_LIMITS[profile.plan] : PLAN_LIMITS.free;
  const creditsTotal = plan.credits === -1 ? Infinity : plan.credits;
  const creditsRemaining = Number(profile?.credits_remaining ?? 0);
  const topupCredits = Number(profile?.topup_credits ?? 0);
  // Effective balance = plan + top-up. This is what we show in the
  // "Credits Left" card because it's the number the user can actually
  // spend right now.
  const effectiveCredits =
    creditsTotal === Infinity
      ? Infinity
      : creditsRemaining + topupCredits;
  const creditsUsed =
    creditsTotal === Infinity ? 0 : Math.max(0, creditsTotal - creditsRemaining);
  const usagePercent =
    creditsTotal === Infinity || creditsTotal === 0
      ? 0
      : Math.round((Math.max(0, creditsUsed) / creditsTotal) * 100);

  return (
    <div>
      {/* Plan info bar */}
      {profile && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-pink-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{t("dashboard.home.plan", "Plan")}</p>
                  <p className="text-sm font-semibold text-white truncate">{plan.name}</p>
                </div>
              </div>
              {/* Upgrade button — shown for every tier except Business/enterprise.
                  Opens a modal with all higher-tier plan cards. */}
              {profile && profile.plan !== "enterprise" && (
                <button
                  type="button"
                  onClick={() => setUpgradeOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="h-3 w-3" />
                  {t("dashboard.home.upgrade", "Upgrade")}
                </button>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">{t("dashboard.home.creditsLeft", "Credits Left")}</p>
                <p className="text-sm font-semibold text-white">
                  {effectiveCredits === Infinity
                    ? t("dashboard.home.unlimited", "Unlimited")
                    : `${Math.floor(effectiveCredits)} / ${creditsTotal}${
                        topupCredits > 0 ? ` + ${Math.floor(topupCredits)} ${t("dashboard.home.topup", "top-up")}` : ""
                      }`}
                </p>
              </div>
              {/* Buy credits CTA — opens the same TopupModal used from
                  the insufficient-credits alert in the dubbing flow. */}
              {effectiveCredits !== Infinity && (
                <button
                  type="button"
                  onClick={() => setTopupOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-pink-500/40 bg-pink-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-pink-200 hover:bg-pink-500/20 transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  {t("dashboard.credits.buyCredits", "Buy credits")}
                </button>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("dashboard.home.creditsUsed", "Credits Used")}</p>
                <p className="text-sm font-semibold text-white">{Math.floor(creditsUsed)} {t("dashboard.home.credits", "credits")}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4 flex items-center">
            <div className="w-full">
              <p className="text-xs text-slate-500">{t("dashboard.home.usage", "Usage")}</p>
              <div className="mt-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-[width]"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{usagePercent}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade modal — mounted at dashboard level so it overlays the
          whole page. Closed by default; opened from the Plan stat card. */}
      {profile && (
        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          currentPlan={profile.plan}
        />
      )}

      {/* Topup modal — opened from the "Buy credits" CTA inside the
          Credits Left stat card. */}
      <TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />

      {/* Onboarding wizard for new users */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={() => setShowOnboarding(false)}
          demoProjectId={projects.find((p) => p.is_demo)?.id}
        />
      )}

      {/* Tabs + actions header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">{t("dashboard.home.projects", "Projects")}</h1>
          <div className="ml-2 inline-flex rounded-lg border border-white/10 bg-slate-800/40 p-1">
            <button
              onClick={() => setView("active")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === "active"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {t("dashboard.home.active", "Active")}
            </button>
            <button
              onClick={() => setView("archived")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === "archived"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {t("dashboard.home.archive", "Archive")}
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
              {t("dashboard.home.select", "Select")}
            </button>
          )}
          {view === "active" && (
            <Link
              href="/projects/new"
              className="gradient-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              {t("dashboard.home.newProject", "New Project")}
            </Link>
          )}
        </div>
      </div>

      {/* Selection action bar (sticky) */}
      {selectMode && (
        <div className="sticky top-0 z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-pink-500/30 bg-slate-900/80 backdrop-blur px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-white">
              {t("dashboard.home.selectedCount", "{n} selected", { n: String(selectedIds.size) })}
            </span>
            <button
              onClick={selectAll}
              className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              {t("dashboard.home.selectAll", "Select all")}
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
                {t("dashboard.home.archiveAction", "Archive")}
              </button>
            )}
            {view === "archived" && (
              <button
                onClick={() => runBulkAction("unarchive")}
                disabled={selectedIds.size === 0 || bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArchiveRestore className="h-3.5 w-3.5" />
                {t("dashboard.home.restore", "Restore")}
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={selectedIds.size === 0 || bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("dashboard.home.delete", "Delete")}
            </button>
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              {t("dashboard.home.cancel", "Cancel")}
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
            {view === "active"
              ? t("dashboard.home.noProjectsTitle", "No projects yet")
              : t("dashboard.home.noArchivedTitle", "No archived projects")}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {view === "active"
              ? t("dashboard.home.noProjectsBodyInline", "Upload your first video to get started")
              : t("dashboard.home.noArchivedBodyInline", "Projects you archive will appear here")}
          </p>
          {view === "active" && (
            <Link
              href="/projects/new"
              className="mt-6 gradient-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> {t("dashboard.home.createProject", "Create Project")}
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
        title={
          selectedIds.size === 1
            ? t("dashboard.home.deleteConfirmTitle", "Delete {n} project?", { n: String(selectedIds.size) })
            : t("dashboard.home.deleteConfirmTitlePlural", "Delete {n} projects?", { n: String(selectedIds.size) })
        }
        message={t(
          "dashboard.home.deleteConfirmMessage",
          "This will permanently delete the selected projects and all their dubs. This action cannot be undone."
        )}
        confirmLabel={bulkLoading ? t("dashboard.home.deleting", "Deleting...") : t("dashboard.home.delete", "Delete")}
        destructive
      />
    </div>
  );
}
