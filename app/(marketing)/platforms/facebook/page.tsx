import { Metadata } from "next";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import { PlatformPage } from "@/components/platforms/platform-page";

export const metadata: Metadata = {
  title:
    "AI Dubbing for Facebook — Localize Video Ads in 30+ Languages",
  description:
    "Dub Facebook video ads and content with AI voice cloning and lip sync. Reach 3B+ users in their native language. Free plan available.",
  alternates: {
    canonical: "https://dubsync.app/platforms/facebook",
    languages: getPlatformHreflang("/platforms/facebook"),
  },
  openGraph: {
    type: "website",
    title:
      "AI Dubbing for Facebook — Localize Video Ads in 30+ Languages",
    description:
      "Dub Facebook video ads and content with AI voice cloning and lip sync. Reach 3B+ users.",
    url: "https://dubsync.app/platforms/facebook",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AI Dubbing for Facebook — Localize Video Ads in 30+ Languages",
    description:
      "Dub Facebook video ads and content with AI voice cloning and lip sync.",
    images: ["/og-image.png"],
  },
};

export default function FacebookPage() {
  return (
    <PlatformPage
      platformKey="facebook"
      h1="Dub Facebook video ads and content"
      subtitle="Upload your video ad or branded content. AI clones the speaker's voice, translates, and syncs lips. Localize campaigns for 3B+ Facebook users in 30+ languages."
      stat="3B+ monthly active users"
      cta="Dub Your First Facebook Video Free"
      steps={[
        {
          title: "Upload your video",
          description:
            "Upload your Facebook video ad, product demo, or branded content. DubSync extracts the audio and generates the transcript.",
        },
        {
          title: "Select target markets",
          description:
            "Choose languages for each market you want to reach. DubSync translates, clones the voice, and produces localized audio.",
        },
        {
          title: "Download and launch",
          description:
            "Preview dubbed versions with lip sync. Download MP4 files and upload them to Ads Manager or your Page for each language audience.",
        },
      ]}
      benefits={[
        {
          title: "Lower cost per acquisition",
          description:
            "Localized video ads perform better than subtitled versions. Native-language ads drive higher click-through rates and lower CPAs across markets.",
        },
        {
          title: "Scale campaigns globally",
          description:
            "Dub one creative into 30+ languages instead of producing separate videos for each market. Save production time and budget.",
        },
        {
          title: "Consistent brand voice",
          description:
            "AI voice cloning keeps the same speaker voice across every language, maintaining brand consistency in all markets.",
        },
        {
          title: "Works with any video format",
          description:
            "DubSync accepts MP4, MOV, AVI, WebM, and MKV. Output is MP4, ready for Facebook Ads Manager or organic posting.",
        },
      ]}
      faqs={[
        {
          question: "Can I dub video ads?",
          answer:
            "Yes. Upload your video ad and DubSync dubs it into any language. Download the localized version and use it in Facebook Ads Manager.",
        },
        {
          question: "Works with Business Manager?",
          answer:
            "Yes. Download the dubbed MP4 and upload it directly to Facebook Business Manager as a new ad creative for each language campaign.",
        },
        {
          question: "Can I dub Live recordings?",
          answer:
            "Yes. Export your Facebook Live recording as a video file, upload it to DubSync, and dub it into any language for reposting.",
        },
        {
          question: "What formats does Facebook accept?",
          answer:
            "Facebook accepts MP4, MOV, and other formats. DubSync outputs MP4 which is universally supported across Facebook placements.",
        },
      ]}
      internalLinks={[
        { label: "Voice Cloning", href: "/features/voice-cloning" },
        { label: "Lip Sync", href: "/features/lip-sync" },
        { label: "Pricing", href: "/pricing" },
        { label: "AI Dubbing vs Traditional", href: "/blog/ai-dubbing-vs-traditional" },
      ]}
    />
  );
}
