"use client";

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

  // Build nav items using the locale hook so labels are translated.
  // Identity is recreated on every render but the list is tiny (4 items)
  // so the cost is negligible.
  const navigation = [
    { name: t("dashboard.nav.dashboard", "Dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("dashboard.nav.settings", "Settings"), href: "/settings", icon: Settings },
    { name: t("dashboard.nav.credits", "Credits"), href: "/credits", icon: CreditCard },
    { name: t("dashboard.nav.api", "API"), href: "/api-keys", icon: Code },
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
              return (
                <li key={item.name}>
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
                    {item.name}
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
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[3rem] h-11 w-11 rounded-xl transition-colors",
                isActive
                  ? "text-white"
                  : "text-slate-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
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
