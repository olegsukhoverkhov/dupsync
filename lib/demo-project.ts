import { createServiceClient } from "./supabase/server";
import { LANDING_DUB_LANGUAGES } from "./landing-dubs";

const DEMO_TITLE = "Welcome Demo";
const DEMO_DURATION_SECONDS = 24;
const DEMO_ORIGINAL_LANGUAGE = "en";

/**
 * Create a demo project for a newly registered user.
 * Uses the same public videos from the landing page.
 * Idempotent — skips if a demo project already exists.
 */
export async function createDemoProject(userId: string): Promise<void> {
  const supabase = await createServiceClient();

  // Check if demo already exists for this user
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .eq("is_demo", true)
    .limit(1)
    .single();

  if (existing) return; // Already has demo

  const original = LANDING_DUB_LANGUAGES.find((l) => l.code === "original");
  if (!original) return;

  // Insert demo project
  const { data: project, error: projErr } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title: DEMO_TITLE,
      status: "done",
      is_demo: true,
      original_video_url: original.url,
      original_language: DEMO_ORIGINAL_LANGUAGE,
      duration_seconds: DEMO_DURATION_SECONDS,
      transcript: [
        { start: 0, end: 4, text: "Hi everyone, welcome to my channel!" },
        { start: 4, end: 8, text: "Today I want to show you something amazing." },
        { start: 8, end: 14, text: "DubSync can dub your videos into any language." },
        { start: 14, end: 20, text: "With AI voice cloning and perfect lip sync." },
        { start: 20, end: 24, text: "Let me show you how it works." },
      ],
    })
    .select("id")
    .single();

  if (projErr || !project) {
    console.error("[DEMO] Failed to create demo project:", projErr?.message);
    return;
  }

  // Insert dubs for each dubbed language
  const dubLanguages = LANDING_DUB_LANGUAGES.filter((l) => l.code !== "original");
  const dubs = dubLanguages.map((lang) => ({
    project_id: project.id,
    target_language: lang.code,
    status: "done" as const,
    dubbed_video_url: lang.url,
    voice_source: "cloned" as const,
    progress: 100,
    has_burned_subs: false,
  }));

  const { error: dubErr } = await supabase.from("dubs").insert(dubs);
  if (dubErr) {
    console.error("[DEMO] Failed to create demo dubs:", dubErr.message);
  }
}

/**
 * Check if a video URL is a public landing-assets URL (demo project).
 * Demo videos don't need signed URLs — they're in a public bucket.
 */
export function isDemoVideoUrl(url: string | null): boolean {
  if (!url) return false;
  return url.includes("/storage/v1/object/public/landing-assets/");
}
