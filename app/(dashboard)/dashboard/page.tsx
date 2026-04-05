"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/dashboard/project-card";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { ProjectWithDubs, Profile } from "@/lib/supabase/types";
import { Plus, FolderOpen, Clock, CreditCard, TrendingUp, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithDubs[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes] = await Promise.all([fetch("/api/projects")]);
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
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
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
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                <p className="text-xs text-slate-500">Remaining</p>
                <p className="text-sm font-semibold text-white">
                  {profile.credits_remaining === -1 ? "Unlimited" : `${Math.floor(profile.credits_remaining)}m ${Math.round((profile.credits_remaining % 1) * 60)}s`}
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
                <p className="text-xs text-slate-500">Used</p>
                <p className="text-sm font-semibold text-white">{Math.floor(creditsUsed)}m {Math.round((creditsUsed % 1) * 60)}s</p>
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

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
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
          <p className="mt-1 text-sm text-slate-400">Upload your first video to get started</p>
          <Link
            href="/projects/new"
            className="mt-6 gradient-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Create Project
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
