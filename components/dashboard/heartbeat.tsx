"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

/**
 * Invisible component that sends a heartbeat every 30s to track
 * online presence. Placed in the dashboard layout so it runs on
 * every dashboard page. Fire-and-forget — never blocks UI.
 */
export function Heartbeat() {
  useEffect(() => {
    const supabase = createClient();

    async function beat() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        supabase.rpc("heartbeat", { p_user_id: user.id }).then(() => {});
      }
    }

    // Send immediately on mount
    beat();
    const interval = setInterval(beat, HEARTBEAT_INTERVAL);

    // Stamp country if missing (fire-and-forget, once)
    fetch("/api/profile/country", { method: "PATCH" }).catch(() => {});

    return () => clearInterval(interval);
  }, []);

  return null;
}
