"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Code,
  Languages,
  LogOut,
  Plus,
  BarChart3,
  Gauge,
  LineChart,
  LifeBuoy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useDashboardT } from "./locale-provider";
import { LanguageSwitcher } from "./language-switcher";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const t = useDashboardT();

  // is_admin is loaded client-side on mount. We deliberately keep
  // this in a small dedicated effect instead of piggybacking on the
  // dashboard page's profile fetch — the sidebar is rendered in the
  // layout above every dashboard route, so it has no other way to
  // see the profile. A brief flash (admin link appears ~100ms after
  // paint) is acceptable because the /admin/stats page itself is
  // server-side gated.
  const [isAdmin, setIsAdmin] = useState(false);
  const [supportBadge, setSupportBadge] = useState(0);
  useEffect(() => {
    let cancelled = false;
    async function loadAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (!cancelled) {
        const admin = Boolean(data?.is_admin);
        setIsAdmin(admin);
        // Fetch unread ticket count
        // Admin: open + waiting_admin (needs attention)
        // User: waiting_user (support replied)
        if (admin) {
          const { count } = await supabase
            .from("support_tickets")
            .select("id", { count: "exact", head: true })
            .in("status", ["open", "waiting_admin"]);
          if (!cancelled) setSupportBadge(count || 0);
        } else {
          const { count } = await supabase
            .from("support_tickets")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "waiting_user");
          if (!cancelled) setSupportBadge(count || 0);
        }
      }
    }
    loadAdmin();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build nav items using the locale hook so labels are translated.
  // Identity is recreated on every render but the list is tiny so
  // the cost is negligible.
  const navigation = [
    { name: t("dashboard.nav.dashboard", "Dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("dashboard.nav.settings", "Settings"), href: "/settings", icon: Settings },
    { name: t("dashboard.nav.credits", "Credits"), href: "/credits", icon: CreditCard },
    { name: t("dashboard.nav.api", "API"), href: "/api-keys", icon: Code },
    ...(!isAdmin
      ? [{ name: t("dashboard.nav.support", "Support"), href: "/support", icon: LifeBuoy, badge: supportBadge }]
      : []),
    ...(isAdmin
      ? [
          {
            name: t("dashboard.nav.analytics", "Site Analytics"),
            href: "/admin/analytics",
            icon: LineChart,
          },
          {
            name: t("dashboard.nav.admin", "Users"),
            href: "/admin/stats",
            icon: BarChart3,
          },
          {
            name: t("dashboard.nav.usage", "Usage"),
            href: "/admin/usage",
            icon: Gauge,
          },
          {
            name: t("dashboard.nav.supportAdmin", "Support"),
            href: "/admin/support",
            icon: LifeBuoy,
            badge: supportBadge,
          },
        ]
      : []),
  ];
  const mobileNavItems = navigation;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden lg:flex h-full w-64 flex-col border-r border-white/5 bg-slate-900/50">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/5 px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
              <Languages className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DubSync</span>
          </Link>
        </div>

        {/* New Project button */}
        <div className="p-4">
          <Link
            href="/projects/new"
            className="gradient-button flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold w-full"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard.nav.newProject", "New Project")}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const badge = (item as { badge?: number }).badge;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-white/10 text-white font-medium"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.name}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-bold text-white">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Language + Sign out */}
        <div className="border-t border-white/5 p-3 space-y-1">
          <LanguageSwitcher />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t("dashboard.nav.signOut", "Sign Out")}
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation — visible only on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-around border-t border-white/10 bg-slate-900/95 backdrop-blur-sm h-16">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const badge = (item as { badge?: number }).badge;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 min-w-[3rem] h-11 w-11 rounded-xl transition-colors",
                isActive
                  ? "text-white"
                  : "text-slate-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Floating New Project button */}
        <Link
          href="/projects/new"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-blue-600 shadow-lg shadow-pink-500/20"
          aria-label={t("dashboard.nav.newProject", "New Project")}
        >
          <Plus className="h-5 w-5 text-white" />
        </Link>
      </nav>
    </>
  );
}
