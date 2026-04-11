import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

/**
 * GET /api/debug-clone?projectId=xxx — test voice clone on production
 * Temporary debug endpoint. Uses service role, no auth check.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  const service = await createServiceClient();

  // If no projectId, find latest non-demo project
  let project: Record<string, unknown> | null = null;
  if (projectId) {
    const { data } = await service.from("projects").select("*").eq("id", projectId).single();
    project = data;
  }
  if (!project) {
    const { data } = await service.from("projects")
      .select("*")
      .eq("is_demo", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    project = data;
  }
  if (!project) return NextResponse.json({ error: "No projects" });

  const debug: Record<string, unknown> = {
    projectId: project.id,
    title: project.title,
    duration: project.duration_seconds,
    originalLanguage: project.original_language,
    videoUrl: project.original_video_url,
    cartesiaKeySet: !!process.env.CARTESIA_API_KEY,
    cartesiaKeyPrefix: process.env.CARTESIA_API_KEY?.slice(0, 10) || "MISSING",
  };

  // Download voice sample
  const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
  let sampleBuffer: Buffer | null = null;
  let source = "";

  for (const name of ["extracted-audio.webm", "extracted-audio.mp4", "voice-sample.wav"]) {
    try {
      const { data } = await service.storage.from("videos").download(`${videoDir}/${name}`);
      if (data) {
        sampleBuffer = Buffer.from(await data.arrayBuffer());
        source = name;
        break;
      }
    } catch { continue; }
  }

  if (!sampleBuffer) {
    // Try signed URL download instead of Supabase .download()
    try {
      const { data: signed } = await service.storage.from("videos").createSignedUrl(project.original_video_url as string, 600);
      if (signed?.signedUrl) {
        const dlRes = await fetch(signed.signedUrl);
        if (dlRes.ok) {
          sampleBuffer = Buffer.from(await dlRes.arrayBuffer());
          source = "signed URL download";
        }
      }
    } catch (e) {
      debug.downloadError = e instanceof Error ? e.message : String(e);
    }
    // Fallback to .download()
    if (!sampleBuffer) {
      try {
        const { data } = await service.storage.from("videos").download(project.original_video_url as string);
        if (data) {
          sampleBuffer = Buffer.from(await data.arrayBuffer());
          source = "supabase download";
        }
      } catch (e) {
        debug.downloadError2 = e instanceof Error ? e.message : String(e);
      }
    }
  }

  debug.sampleSource = source;
  debug.sampleSize = sampleBuffer?.length || 0;

  if (!sampleBuffer || sampleBuffer.length < 1000) {
    debug.error = "No usable sample";
    return NextResponse.json(debug);
  }

  // MIME
  const b = sampleBuffer;
  let mime = "application/octet-stream";
  if (b[0] === 0x1a && b[1] === 0x45) mime = "audio/webm";
  else if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) mime = "video/mp4";
  else if (b[0] === 0x52 && b[1] === 0x49) mime = "audio/wav";
  debug.mime = mime;
  debug.isVideo = mime === "video/mp4";
  debug.falKeySet = !!process.env.FAL_KEY;

  debug.buildVersion = "v4-inline-clone";

  // Clone INLINE — bypass lib/cartesia.ts to debug the exact request
  try {
    const apiKey = process.env.CARTESIA_API_KEY!;
    const sendMime = mime === "video/mp4" ? "audio/mpeg" : mime;
    const sendExt = sendMime === "audio/mpeg" ? "mp3" : "wav";
    debug.sendMime = sendMime;
    debug.sendExt = sendExt;

    const boundary = `----DubSyncDebug${Date.now()}`;
    const CRLF = "\r\n";
    const parts: (Buffer | string)[] = [];

    parts.push(`--${boundary}${CRLF}`);
    parts.push(`Content-Disposition: form-data; name="clip"; filename="voice.${sendExt}"${CRLF}`);
    parts.push(`Content-Type: ${sendMime}${CRLF}`);
    parts.push(CRLF);
    parts.push(sampleBuffer);
    parts.push(CRLF);

    for (const [k, v] of [["name", `debug-${Date.now()}`], ["language", "en"], ["mode", "similarity"]]) {
      parts.push(`--${boundary}${CRLF}`);
      parts.push(`Content-Disposition: form-data; name="${k}"${CRLF}`);
      parts.push(CRLF);
      parts.push(v);
      parts.push(CRLF);
    }
    parts.push(`--${boundary}--${CRLF}`);

    const bodyParts = parts.map((p) => typeof p === "string" ? Buffer.from(p, "utf-8") : p);
    const body = Buffer.concat(bodyParts);
    debug.requestSize = body.length;
    // Check first bytes of sample to verify it's not corrupted
    debug.sampleFirstBytes = Array.from(sampleBuffer.subarray(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    debug.sampleLastBytes = Array.from(sampleBuffer.subarray(sampleBuffer.length - 8)).map(b => b.toString(16).padStart(2, '0')).join(' ');

    // Try approach 2: download file via signed URL and send fresh
    try {
      const { data: signed2 } = await service.storage.from("videos").createSignedUrl(project.original_video_url as string, 600);
      if (signed2?.signedUrl) {
        const freshDl = await fetch(signed2.signedUrl);
        const freshBuf = Buffer.from(await freshDl.arrayBuffer());
        debug.freshDownloadSize = freshBuf.length;
        debug.freshFirstBytes = Array.from(freshBuf.subarray(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ');
        debug.bytesMatch = freshBuf.equals(sampleBuffer);

        // Try clone with fresh download
        const fd = new FormData();
        fd.append("clip", new Blob([new Uint8Array(freshBuf) as BlobPart], { type: sendMime }), `voice.${sendExt}`);
        fd.append("name", `debug-fresh-${Date.now()}`);
        fd.append("language", "en");
        fd.append("mode", "similarity");

        const fdRes = await fetch("https://api.cartesia.ai/voices/clone", {
          method: "POST",
          headers: { "X-API-Key": apiKey, "Cartesia-Version": "2024-11-13" },
          body: fd,
        });
        debug.freshCloneStatus = fdRes.status;
        const fdText = await fdRes.text();
        debug.freshCloneResponse = fdText.slice(0, 200);
        if (fdRes.ok) {
          const fdData = JSON.parse(fdText);
          debug.freshCloneOk = true;
          await fetch(`https://api.cartesia.ai/voices/${fdData.id}`, {
            method: "DELETE",
            headers: { "X-API-Key": apiKey, "Cartesia-Version": "2024-11-13" },
          });
        }
      }
    } catch (e) {
      debug.freshCloneError = e instanceof Error ? e.message : String(e);
    }

    const res = await fetch("https://api.cartesia.ai/voices/clone", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Cartesia-Version": "2024-11-13",
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": String(body.length),
      },
      body: body as unknown as BodyInit,
    });

    debug.responseStatus = res.status;
    const resText = await res.text();
    debug.responseBody = resText.slice(0, 300);

    if (res.ok) {
      const data = JSON.parse(resText);
      debug.cloneOk = true;
      debug.voiceId = data.id;
      // Cleanup
      await fetch(`https://api.cartesia.ai/voices/${data.id}`, {
        method: "DELETE",
        headers: { "X-API-Key": apiKey, "Cartesia-Version": "2024-11-13" },
      });
      debug.cleaned = true;
    } else {
      debug.cloneOk = false;
    }
  } catch (e) {
    debug.cloneOk = false;
    debug.cloneError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(debug);
}
