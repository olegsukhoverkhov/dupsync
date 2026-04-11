"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gauge, Users, LifeBuoy, CreditCard, AlertTriangle } from "lucide-react";

const TABS = [
  { href: "/admin/analytics", label: "Site Analytics", icon: BarChart3 },
  { href: "/admin/stats", label: "Users", icon: Users },
  { href: "/admin/usage", label: "Usage", icon: Gauge },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/errors", label: "Errors", icon: AlertTriangle },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-slate-800/30 p-1">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
