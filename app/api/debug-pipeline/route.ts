import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 300;

export async function GET() {
  const results: Record<string, string> = {};

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    results["auth"] = user ? user.email || "authenticated" : "not authenticated";

    // Find latest project with dubs
    const { createClient: createSC } = await import("@supabase/supabase-js");
    const supa = createSC(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: latestDub } = await supa
      .from("dubs")
      .select("*, projects(*)")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!latestDub) {
      results["dub"] = "no dubs found";
      return NextResponse.json(results);
    }

    const project = (latestDub as Record<string, unknown>).projects as Record<string, unknown>;
    results["dub_id"] = latestDub.id;
    results["dub_status"] = latestDub.status;
    results["dub_error"] = latestDub.error_message || "none";
    results["dub_output"] = latestDub.dubbed_video_url || "none";
    results["project_video"] = (project?.original_video_url as string) || "none";

    // Check if voice-sample.wav exists
    const videoDir = ((project?.original_video_url as string) || "").split("/").slice(0, -1).join("/");
    const voiceSamplePath = `${videoDir}/voice-sample.wav`;

    const { data: sampleData, error: sampleErr } = await supa.storage
      .from("videos")
      .download(voiceSamplePath);

    if (sampleData && !sampleErr) {
      const buf = await sampleData.arrayBuffer();
      results["voice_sample"] = `found: ${(buf.byteLength / 1024).toFixed(0)}KB at ${voiceSamplePath}`;

      // Test voice clone with the sample
      try {
        const formData = new FormData();
        formData.append("name", "debug-test-clone");
        formData.append(
          "files",
          new Blob([new Uint8Array(buf)], { type: "audio/wav" }),
          "sample.wav"
        );
        formData.append("description", "Debug test");

        const cloneRes = await fetch("https://api.elevenlabs.io/v1/voices/add", {
          method: "POST",
          headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
          body: formData,
        });

        if (cloneRes.ok) {
          const cloneData = await cloneRes.json();
          results["voice_clone"] = `SUCCESS: voice_id=${cloneData.voice_id}`;

          // Clean up - delete the test voice
          await fetch(`https://api.elevenlabs.io/v1/voices/${cloneData.voice_id}`, {
            method: "DELETE",
            headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
          });
          results["clone_cleanup"] = "deleted test voice";
        } else {
          const errBody = await cloneRes.text();
          results["voice_clone"] = `FAILED ${cloneRes.status}: ${errBody.slice(0, 300)}`;
        }
      } catch (e) {
        results["voice_clone"] = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
      }
    } else {
      results["voice_sample"] = `NOT FOUND at ${voiceSamplePath} (${sampleErr?.message || "no error"})`;
    }

    // Check fal.ai lip sync availability
    try {
      const falRes = await fetch("https://queue.fal.run/fal-ai/latentsync", {
        method: "POST",
        headers: {
          "Authorization": `Key ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_url: "https://example.com/test.mp4", audio_url: "https://example.com/test.mp3" }),
      });
      const falData = await falRes.json();
      results["fal_lipsync"] = falRes.ok ? `AVAILABLE: request_id=${falData.request_id}` : `STATUS ${falRes.status}: ${JSON.stringify(falData).slice(0, 200)}`;
    } catch (e) {
      results["fal_lipsync"] = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }

    // Check ElevenLabs API key validity
    try {
      const voicesRes = await fetch("https://api.elevenlabs.io/v1/user", {
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
      });
      if (voicesRes.ok) {
        const userData = await voicesRes.json();
        results["elevenlabs_user"] = `OK: tier=${userData.subscription?.tier}, character_count=${userData.subscription?.character_count}/${userData.subscription?.character_limit}`;
      } else {
        results["elevenlabs_user"] = `FAILED ${voicesRes.status}`;
      }
    } catch (e) {
      results["elevenlabs_user"] = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }

  } catch (e) {
    results["error"] = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
