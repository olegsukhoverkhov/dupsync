import { Metadata } from "next";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import { PlatformPage } from "@/components/platforms/platform-page";

export const metadata: Metadata = {
  title: "AI Video Dubbing for YouTube — Dub Videos in 30+ Languages",
  description:
    "Dub YouTube videos, shorts, and tutorials with AI voice cloning and lip sync. Grow your global audience. Free plan available.",
  alternates: {
    canonical: "https://dubsync.app/platforms/youtube",
    languages: getPlatformHreflang("/platforms/youtube"),
  },
  openGraph: {
    type: "website",
    title: "AI Video Dubbing for YouTube — Dub Videos in 30+ Languages",
    description:
      "Dub YouTube videos, shorts, and tutorials with AI voice cloning and lip sync. Grow your global audience.",
    url: "https://dubsync.app/platforms/youtube",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Dubbing for YouTube — Dub Videos in 30+ Languages",
    description:
      "Dub YouTube videos, shorts, and tutorials with AI voice cloning and lip sync.",
    images: ["/og-image.png"],
  },
};

export default function YouTubePage() {
  return (
    <PlatformPage
      platformKey="youtube"
      h1="Dub YouTube videos in 30+ languages"
      subtitle="Upload your video. AI clones your voice, translates, and syncs lips. Publish to YouTube in 30+ languages — grow subscribers and watch time globally."
      stat="2B+ monthly active users"
      cta="Dub Your First YouTube Video Free"
      steps={[
        {
          title: "Upload your video",
          description:
            "Drop your YouTube video or paste a link. DubSync extracts the audio, identifies speakers, and prepares the transcript automatically.",
        },
        {
          title: "Select languages",
          description:
            "Choose from 30+ target languages. DubSync translates the script, clones your voice, and generates dubbed audio with natural pronunciation.",
        },
        {
          title: "Download and publish",
          description:
            "Preview the dubbed video with lip-synced visuals. Download the MP4 and upload it to your YouTube channel as a new language version.",
        },
      ]}
      benefits={[
        {
          title: "Grow global subscribers",
          description:
            "Reach viewers in their native language. Dubbed content drives higher watch time and subscriber conversion in non-English markets.",
        },
        {
          title: "Keep your authentic voice",
          description:
            "AI voice cloning preserves your unique tone, pitch, and delivery so your audience connects with the real you in every language.",
        },
        {
          title: "Works with Shorts and long-form",
          description:
            "Dub 15-second Shorts or 2-hour tutorials. DubSync handles any length with consistent voice quality and lip sync accuracy.",
        },
        {
          title: "SEO-friendly multilingual content",
          description:
            "Publish dubbed videos with translated titles and descriptions. Each language version builds search visibility in its market.",
        },
      ]}
      faqs={[
        {
          question: "Can I dub YouTube Shorts?",
          answer:
            "Yes. DubSync handles Shorts the same as long-form videos. Upload the Short, select languages, and download the dubbed version ready for publishing.",
        },
        {
          question: "Does dubbing affect my YouTube SEO?",
          answer:
            "Dubbed videos help SEO by letting you publish native-language versions with localized titles, descriptions, and tags, which rank in local search results.",
        },
        {
          question: "Can I dub from a YouTube URL?",
          answer:
            "Yes. Paste a YouTube URL and DubSync downloads and processes the video automatically. You need to own or have rights to the content.",
        },
        {
          question: "Will subscribers notice it's AI?",
          answer:
            "DubSync's voice cloning and lip sync are designed to sound and look natural. Most viewers cannot distinguish dubbed output from original recordings.",
        },
      ]}
      internalLinks={[
        { label: "Voice Cloning", href: "/features/voice-cloning" },
        { label: "Lip Sync", href: "/features/lip-sync" },
        { label: "Pricing", href: "/pricing" },
        { label: "AI Dubbing for YouTube", href: "/blog/ai-dubbing-for-youtube" },
      ]}
    />
  );
}
