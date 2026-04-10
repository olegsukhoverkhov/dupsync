"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SuspendedModal } from "./suspended-modal";

/**
 * Client component that checks if the current user is suspended.
 * Renders a blocking modal that covers the entire dashboard.
 * Placed in the dashboard layout so it runs on every page.
 */
export function SuspendedCheck() {
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("is_suspended")
        .eq("id", user.id)
        .single();
      if (data?.is_suspended) setSuspended(true);
    }
    check();
  }, []);

  if (!suspended) return null;
  return <SuspendedModal />;
}
