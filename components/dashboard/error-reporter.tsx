"use client";

import { useEffect } from "react";

/**
 * Invisible component that patches window.fetch to auto-report
 * 4xx/5xx API responses to /api/log-error. Placed in dashboard layout.
 */
export function ErrorReporter() {
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async function patchedFetch(input, init) {
      const response = await originalFetch(input, init);

      // Only log our own API errors, not external requests
      try {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
        if (url.startsWith("/api/") && response.status >= 400 && !url.includes("/api/log-error")) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const cloned = response.clone();
            const body = await cloned.json();
            if (body?.error) errorMessage = String(body.error).slice(0, 500);
          } catch {}

          // Fire-and-forget
          originalFetch("/api/log-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              statusCode: response.status,
              method: init?.method || "GET",
              path: url,
              errorMessage,
            }),
          }).catch(() => {});
        }
      } catch {}

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
