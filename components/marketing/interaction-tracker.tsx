"use client";

import { useEffect } from "react";

/**
 * Tracks a pageview only after the user interacts with the page
 * (scroll, click, mousemove, touch, keydown). This filters out
 * bots that don't execute JS or don't produce interaction events.
 *
 * Fallback: if no interaction after 5s but UA looks human, still record.
 */
export function InteractionTracker() {
  useEffect(() => {
    let sent = false;

    function sendPageView() {
      if (sent) return;
      sent = true;

      fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: window.location.pathname,
          hasInteraction: true,
        }),
        keepalive: true,
      }).catch(() => {});
    }

    // Record after first real interaction
    const events = ["mousemove", "touchstart", "scroll", "keydown", "click"];
    const handler = () => sendPageView();

    for (const e of events) {
      document.addEventListener(e, handler, { once: true, passive: true });
    }

    // Fallback: mobile users might just read without interaction.
    // After 5s, send if UA looks human (no webdriver, has language).
    const fallbackTimer = setTimeout(() => {
      if (!sent && !navigator.webdriver && navigator.language) {
        const ua = navigator.userAgent.toLowerCase();
        const looksLikeBot = /(bot|crawler|spider|scraper|headless|phantom|selenium)/i.test(ua);
        if (!looksLikeBot) {
          sendPageView();
        }
      }
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
      for (const e of events) {
        document.removeEventListener(e, handler);
      }
    };
  }, []);

  return null;
}
