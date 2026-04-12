"use client";

import { useRouter } from "next/navigation";
import { Ban, LogOut, LifeBuoy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useDashboardT } from "./locale-provider";

/**
 * Full-screen blocking modal for suspended accounts.
 * Cannot be closed or dismissed — the user must contact support.
 */
export function SuspendedModal() {
  const t = useDashboardT();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-[440px] max-w-[90vw] rounded-3xl border border-red-500/20 bg-slate-900 p-10 text-center">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
          <Ban className="h-8 w-8 text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          {t("dashboard.suspended.title", "Account Suspended")}
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {t(
            "dashboard.suspended.message",
            "Your account has been suspended. If you believe this is a mistake, please contact our support team for assistance."
          )}
        </p>

        <button
          onClick={() => router.push("/support")}
          className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <LifeBuoy className="h-4 w-4" />
          {t("dashboard.suspended.contactSupport", "Contact Support")}
        </button>

        <button
          onClick={handleLogout}
          className="mt-3 inline-flex items-center justify-center gap-2 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {t("dashboard.suspended.logout", "Log out")}
        </button>

        <p className="mt-4 text-xs text-slate-600">
          support@dubsync.app
        </p>
      </div>
    </div>
  );
}
