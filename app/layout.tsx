import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DubSync — AI Video Dubbing & Voice Cloning | Dub Videos in 30+ Languages",
  description:
    "Dub videos into 30+ languages with AI voice cloning and lip sync. Upload a video, get studio-quality dubbing in minutes. Free plan available — no credit card required.",
  metadataBase: new URL("https://dubsync.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "https://dubsync.app/",
      "es": "https://dubsync.app/es/",
      "pt": "https://dubsync.app/pt/",
      "de": "https://dubsync.app/de/",
      "fr": "https://dubsync.app/fr/",
      "ja": "https://dubsync.app/ja/",
      "x-default": "https://dubsync.app/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "DubSync",
    title: "DubSync — AI Video Dubbing & Voice Cloning",
    description:
      "Upload a video. AI clones the speaker's voice, translates, and syncs lips — automatically. Go global in minutes.",
    url: "https://dubsync.app",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DubSync - AI Video Dubbing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync — AI Video Dubbing & Voice Cloning",
    description:
      "Upload a video. AI clones the voice, translates, and syncs lips — automatically.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]">
        {children}
      </body>
    </html>
  );
}
