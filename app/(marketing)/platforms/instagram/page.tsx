import { Metadata } from "next";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import { PlatformPage } from "@/components/platforms/platform-page";

export const metadata: Metadata = {
  title:
    "AI Dubbing for Instagram — Dub Reels and Stories in 30+ Languages",
  description:
    "Dub Instagram Reels and Stories with AI voice cloning and lip sync. Reach global followers. Free plan available.",
  alternates: {
    canonical: "https://dubsync.app/platforms/instagram",
    languages: getPlatformHreflang("/platforms/instagram"),
  },
  openGraph: {
    type: "website",
    title:
      "AI Dubbing for Instagram — Dub Reels and Stories in 30+ Languages",
    description:
      "Dub Instagram Reels and Stories with AI voice cloning and lip sync. Reach global followers.",
    url: "https://dubsync.app/platforms/instagram",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AI Dubbing for Instagram — Dub Reels and Stories in 30+ Languages",
    description:
      "Dub Instagram Reels and Stories with AI voice cloning and lip sync.",
    images: ["/og-image.png"],
  },
};

export default function InstagramPage() {
  return (
    <PlatformPage
      platformKey="instagram"
      h1="Dub Instagram Reels and Stories"
      subtitle="Upload your Reel or Story. AI clones your voice, translates, and syncs lips. Grow your international following with content that sounds native in every language."
      stat="2B+ monthly active users"
      cta="Dub Your First Reel Free"
      steps={[
        {
          title: "Upload your Reel or Story",
          description:
            "Upload your Instagram video in any format. DubSync extracts speech, preserves background music, and generates the transcript.",
        },
        {
          title: "Select languages",
          description:
            "Pick from 30+ languages. DubSync translates, clones your voice, and produces natural-sounding dubbed audio with matched pacing.",
        },
        {
          title: "Download and share",
          description:
            "Preview the dubbed video with lip sync. Download the MP4 and post to Instagram as a Reel, Story, or feed video.",
        },
      ]}
      benefits={[
        {
          title: "Grow international followers",
          description:
            "Content in the viewer's language drives higher engagement and follower conversion. Dubbed Reels reach audiences algorithms serve to local users.",
        },
        {
          title: "Native 9:16 support",
          description:
            "DubSync works with any aspect ratio including 9:16 vertical video, so your Reels and Stories look exactly as intended.",
        },
        {
          title: "Preserve music and effects",
          description:
            "Background music and sound effects stay intact. Only the speech is replaced, keeping the feel of the original content.",
        },
        {
          title: "Batch processing",
          description:
            "Dub multiple Reels at once. Upload a batch, select languages, and DubSync processes them all with consistent voice quality.",
        },
      ]}
      faqs={[
        {
          question: "Can I dub Reels with music?",
          answer:
            "Yes. DubSync separates speech from background music automatically. The music stays in the dubbed version while the voice is translated.",
        },
        {
          question: "Does DubSync support 9:16?",
          answer:
            "Yes. DubSync works with any aspect ratio. Vertical 9:16 video for Reels and Stories is fully supported with no cropping or letterboxing.",
        },
        {
          question: "Can I dub Stories?",
          answer:
            "Yes. Upload your Story video and dub it the same way as a Reel. Download the dubbed version and post it as a new Story.",
        },
        {
          question: "How to publish dubbed Reels?",
          answer:
            "Download the dubbed MP4 and upload it to Instagram as a new Reel. Use localized captions and hashtags for each language version.",
        },
      ]}
      internalLinks={[
        { label: "Voice Cloning", href: "/features/voice-cloning" },
        { label: "Lip Sync", href: "/features/lip-sync" },
        { label: "Pricing", href: "/pricing" },
        { label: "Voice Cloning for Video", href: "/blog/voice-cloning-video-translation" },
      ]}
    />
  );
}
