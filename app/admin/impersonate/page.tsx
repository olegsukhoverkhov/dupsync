"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

/**
 * Admin impersonation landing page.
 *
 * Opened in a NEW TAB by the admin "Login" button on /admin/stats.
 * URL: /admin/impersonate?email=X&otp=Y
 *
 * On mount it calls `supabase.auth.verifyOtp({ email, token, type: 'email' })`
 * which exchanges the one-time token for a proper session cookie.
 * Once the session is set, redirects to /dashboard — the admin is
 * now browsing as the target user in this tab.
 *
 * The original admin tab keeps its own session intact because
 * cookies are per-tab for Supabase SSR.
 */
export default function ImpersonatePage() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = params.get("email");
    const otp = params.get("otp");

    if (!email || !otp) {
      setError("Missing email or otp in URL");
      return;
    }

    const supabase = createClient();

    // Sign out current session first so the new OTP verification
    // starts fresh and doesn't conflict with the admin's cookie.
    supabase.auth
      .signOut()
      .then(() =>
        supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "email",
        })
      )
      .then(({ error: verifyErr }) => {
        if (verifyErr) {
          setError(verifyErr.message);
          return;
        }
        // Session cookie is now set for the target user.
        router.replace("/dashboard");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 max-w-md">
            <p className="text-sm font-medium text-red-300">
              Impersonation failed
            </p>
            <p className="mt-2 text-xs text-red-400">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-pink-400 animate-spin" />
            <p className="text-sm text-slate-400">
              Logging in as user…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
