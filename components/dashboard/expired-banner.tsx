"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useDashboardT } from "./locale-provider";
import { AlertTriangle } from "lucide-react";

/**
 * Shows a banner when the user's subscription has expired.
 * Prompts them to renew from the settings page.
 */
export function ExpiredBanner() {
  const [expired, setExpired] = useState(false);
  const [planName, setPlanName] = useState("");
  const t = useDashboardT();

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("subscription_expired, plan")
        .eq("id", user.id)
        .single();
      if (data?.subscription_expired && data.plan !== "free") {
        setExpired(true);
        setPlanName(data.plan.charAt(0).toUpperCase() + data.plan.slice(1));
      }
    }
    check();
  }, []);

  if (!expired) return null;

  return (
    <div className="mx-4 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center gap-3 flex-wrap">
      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
      <p className="flex-1 text-sm text-amber-200">
        {t("dashboard.expiredBanner.message",
          "Your {plan} subscription has expired. Renew to continue using premium features.",
          { plan: planName })}
      </p>
      <Link
        href="/settings"
        className="shrink-0 rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-black hover:bg-amber-400 transition-colors"
      >
        {t("dashboard.expiredBanner.renew", "Renew Subscription")}
      </Link>
    </div>
  );
}
