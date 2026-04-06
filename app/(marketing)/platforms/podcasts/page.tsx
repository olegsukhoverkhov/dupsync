import { Metadata } from "next";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import { PlatformPage } from "@/components/platforms/platform-page";

export const metadata: Metadata = {
  title:
    "AI Dubbing for Podcasts — Translate Episodes in 30+ Languages",
  description:
    "Dub podcast episodes with AI voice cloning. Preserve your voice and reach global listeners in 30+ languages. Free plan available.",
  alternates: {
    canonical: "https://dubsync.app/platforms/podcasts",
    languages: getPlatformHreflang("/platforms/podcasts"),
  },
  openGraph: {
    type: "website",
    title:
      "AI Dubbing for Podcasts — Translate Episodes in 30+ Languages",
    description:
      "Dub podcast episodes with AI voice cloning. Preserve your voice and reach global listeners.",
    url: "https://dubsync.app/platforms/podcasts",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AI Dubbing for Podcasts — Translate Episodes in 30+ Languages",
    description:
      "Dub podcast episodes with AI voice cloning. Preserve your voice.",
    images: ["/og-image.png"],
  },
};

export default function PodcastsPage() {
  return (
    <PlatformPage
      platformKey="podcasts"
      h1="Dub your podcast into any language"
      subtitle="Upload your episode. AI clones your voice, translates, and produces natural-sounding audio in 30+ languages. Expand your listener base globally while keeping the voice your audience knows."
      stat="500M+ podcast listeners"
      cta="Dub Your First Episode Free"
      steps={[
        {
          title: "Upload your episode",
          description:
            "Upload audio or video podcast files. DubSync identifies speakers, separates intros and outros, and generates an editable transcript.",
        },
        {
          title: "Select languages",
          description:
            "Choose target languages for your audience. DubSync translates, clones each host's voice, and produces dubbed audio with natural pacing.",
        },
        {
          title: "Download and distribute",
          description:
            "Preview the dubbed episode. Download as MP3, WAV, or MP4 and publish to your podcast host for each language feed.",
        },
      ]}
      benefits={[
        {
          title: "Preserve your voice",
          description:
            "AI voice cloning captures your unique vocal identity. Listeners in every language hear the same host they trust, not a generic voice.",
        },
        {
          title: "Multi-host support",
          description:
            "DubSync detects and clones each speaker independently. Conversations between multiple hosts sound natural with distinct voices in every language.",
        },
        {
          title: "Audio-only episodes",
          description:
            "No video required. Upload audio-only podcast files and DubSync produces dubbed audio ready for any podcast platform.",
        },
        {
          title: "Keep intros and outros",
          description:
            "DubSync preserves intro music, outro segments, and ad breaks. Only the spoken content is translated and dubbed.",
        },
      ]}
      faqs={[
        {
          question: "Can I dub audio-only episodes?",
          answer:
            "Yes. DubSync works with audio-only files including MP3, WAV, FLAC, and AAC. No video track is required.",
        },
        {
          question: "Preserves intro/outro?",
          answer:
            "Yes. DubSync separates music and speech automatically. Intro jingles, outro segments, and ad breaks remain untouched in the dubbed output.",
        },
        {
          question: "Multi-host podcasts?",
          answer:
            "Yes. DubSync detects multiple speakers and clones each voice independently, preserving the conversational dynamic between hosts.",
        },
        {
          question: "What audio formats supported?",
          answer:
            "DubSync accepts MP3, WAV, FLAC, AAC, OGG, and M4A for audio-only input. Video formats like MP4 and MOV are also supported for video podcasts.",
        },
      ]}
      internalLinks={[
        { label: "Voice Cloning", href: "/features/voice-cloning" },
        { label: "Lip Sync", href: "/features/lip-sync" },
        { label: "Pricing", href: "/pricing" },
        { label: "How to Clone Voice for Video", href: "/blog/how-to-clone-voice-for-video" },
      ]}
    />
  );
}
