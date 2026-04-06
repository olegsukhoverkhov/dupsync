import { Metadata } from "next";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import { PlatformPage } from "@/components/platforms/platform-page";

export const metadata: Metadata = {
  title:
    "AI Dubbing for E-Learning — Dub Online Courses in 30+ Languages",
  description:
    "Dub online courses and training videos with AI voice cloning and lip sync. Reach global learners. Free plan available.",
  alternates: {
    canonical: "https://dubsync.app/platforms/elearning",
    languages: getPlatformHreflang("/platforms/elearning"),
  },
  openGraph: {
    type: "website",
    title:
      "AI Dubbing for E-Learning — Dub Online Courses in 30+ Languages",
    description:
      "Dub online courses and training videos with AI voice cloning. Reach global learners.",
    url: "https://dubsync.app/platforms/elearning",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AI Dubbing for E-Learning — Dub Online Courses in 30+ Languages",
    description:
      "Dub online courses and training videos with AI voice cloning.",
    images: ["/og-image.png"],
  },
};

export default function ELearningPage() {
  return (
    <PlatformPage
      platformKey="elearning"
      h1="Dub online courses for global learners"
      subtitle="Upload your course videos. AI clones the instructor's voice, translates, and syncs lips. Deliver training content in 30+ languages while maintaining the teaching style learners trust."
      stat="400M+ online learners worldwide"
      cta="Dub Your First Course Free"
      steps={[
        {
          title: "Upload course videos",
          description:
            "Upload individual lessons or entire modules. DubSync extracts speech, identifies the instructor, and generates an editable transcript.",
        },
        {
          title: "Select languages",
          description:
            "Choose target languages for your learner base. DubSync translates the script, clones the instructor's voice, and produces dubbed audio.",
        },
        {
          title: "Download and deploy",
          description:
            "Preview dubbed lessons with lip sync. Download MP4 files and upload them to your LMS, course platform, or website.",
        },
      ]}
      benefits={[
        {
          title: "Maintain instructor presence",
          description:
            "AI voice cloning keeps the instructor's unique voice across every language. Learners hear the same trusted voice in their native language.",
        },
        {
          title: "Scale to global markets",
          description:
            "Dub entire course libraries without re-recording. Reach learners in 30+ languages from a single set of source videos.",
        },
        {
          title: "Accurate for technical content",
          description:
            "DubSync handles specialized vocabulary in fields like medicine, engineering, and finance with high translation accuracy.",
        },
        {
          title: "Screen recording support",
          description:
            "Dub screen recordings and slide presentations. The AI handles voiceover-style content where the speaker may not appear on camera.",
        },
      ]}
      faqs={[
        {
          question: "Can I dub entire course libraries?",
          answer:
            "Yes. Upload multiple videos and DubSync processes them with consistent voice cloning across all lessons in the course.",
        },
        {
          question: "Works with LMS platforms?",
          answer:
            "Yes. DubSync outputs standard MP4 files compatible with Moodle, Canvas, Thinkific, Teachable, and any LMS that accepts video uploads.",
        },
        {
          question: "Can I dub screen recordings?",
          answer:
            "Yes. Screen recordings with voiceover are fully supported. The AI dubs the narration while keeping the original screen content intact.",
        },
        {
          question: "How accurate for technical content?",
          answer:
            "DubSync uses context-aware translation that handles technical terminology well. You can review and edit the translated script before dubbing.",
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
