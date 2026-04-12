"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SuspendedModal } from "./suspended-modal";

/**
 * Client component that checks if the current user is suspended.
 * Renders a blocking modal that covers the entire dashboard,
 * EXCEPT on /support where the user can create a ticket.
 */
export function SuspendedCheck() {
  const [suspended, setSuspended] = useState(false);
  const pathname = usePathname();

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

  // Allow suspended users to access /support page
  if (!suspended || pathname === "/support") return null;
  return <SuspendedModal />;
}
