import { Metadata } from "next";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import { PlatformPage } from "@/components/platforms/platform-page";

export const metadata: Metadata = {
  title: "AI Dubbing for TikTok — Go Viral in 30+ Languages",
  description:
    "Dub TikTok videos with AI voice cloning and lip sync. Keep the energy, reach global audiences. Free plan available.",
  alternates: {
    canonical: "https://dubsync.app/platforms/tiktok",
    languages: getPlatformHreflang("/platforms/tiktok"),
  },
  openGraph: {
    type: "website",
    title: "AI Dubbing for TikTok — Go Viral in 30+ Languages",
    description:
      "Dub TikTok videos with AI voice cloning and lip sync. Keep the energy, reach global audiences.",
    url: "https://dubsync.app/platforms/tiktok",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dubbing for TikTok — Go Viral in 30+ Languages",
    description:
      "Dub TikTok videos with AI voice cloning and lip sync. Keep the energy, reach global audiences.",
    images: ["/og-image.png"],
  },
};

export default function TikTokPage() {
  return (
    <PlatformPage
      platformKey="tiktok"
      h1="Dub TikTok videos — go viral globally"
      subtitle="Upload your TikTok video. AI clones your voice, translates, and syncs lips. Reach new audiences while keeping the energy and timing that makes content go viral."
      stat="1B+ monthly active users"
      cta="Dub Your First TikTok Free"
      steps={[
        {
          title: "Upload your TikTok",
          description:
            "Upload your video file. DubSync separates speech from background music and sound effects, preserving the original audio mix.",
        },
        {
          title: "Choose target languages",
          description:
            "Select from 30+ languages. The AI translates your script, clones your voice, and matches the pacing to keep the energy of the original.",
        },
        {
          title: "Export and post",
          description:
            "Download the dubbed MP4 with synced lips and original sound effects intact. Post directly to TikTok for each language audience.",
        },
      ]}
      benefits={[
        {
          title: "Preserve the energy",
          description:
            "TikTok thrives on energy and timing. DubSync matches speech pacing and emotional inflection so dubbed videos feel as dynamic as the original.",
        },
        {
          title: "Keep original sound effects",
          description:
            "Background music and sound effects are preserved automatically. Only the speech is replaced with the dubbed version.",
        },
        {
          title: "Fast turnaround",
          description:
            "Short-form content is processed in minutes. Dub a 60-second TikTok into 10 languages and have all versions ready to post the same day.",
        },
        {
          title: "Reach new markets",
          description:
            "TikTok's algorithm surfaces content to local audiences. Dubbed videos in the local language get recommended to viewers in that region.",
        },
      ]}
      faqs={[
        {
          question: "Can I dub with original sound effects?",
          answer:
            "Yes. DubSync separates speech from background audio. Sound effects and music remain in the dubbed version while only the voice is replaced.",
        },
        {
          question: "Does DubSync preserve video quality?",
          answer:
            "Yes. The video track is untouched. Only the audio is replaced, so visual quality remains identical to the original file.",
        },
        {
          question: "Can I dub duets and stitches?",
          answer:
            "You can dub any video file you upload. Export the duet or stitch as a single video, then upload it to DubSync for dubbing.",
        },
        {
          question: "Best way to publish dubbed TikToks?",
          answer:
            "Post each language version as a separate TikTok. Use localized captions and hashtags to maximize reach in each market.",
        },
      ]}
      internalLinks={[
        { label: "Voice Cloning", href: "/features/voice-cloning" },
        { label: "Lip Sync", href: "/features/lip-sync" },
        { label: "Pricing", href: "/pricing" },
        { label: "What Is AI Dubbing", href: "/blog/what-is-ai-video-dubbing" },
      ]}
    />
  );
}
