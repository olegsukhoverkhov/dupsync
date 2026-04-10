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
  title: "DubSync — AI Video Dubbing with Lip Sync | From $19.99/mo",
  description:
    "AI video dubbing with lip sync in 30+ languages. No watermark, even on the free plan. From $19.99/mo.",
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
      "hi": "https://dubsync.app/hi/",
      "ar": "https://dubsync.app/ar/",
      "id": "https://dubsync.app/id/",
      "tr": "https://dubsync.app/tr/",
      "ko": "https://dubsync.app/ko/",
      "x-default": "https://dubsync.app/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "DubSync",
    title: "DubSync — AI Video Dubbing with Lip Sync",
    description:
      "Dub videos into 30+ languages with AI lip sync from $19.99/mo. 1 credit = 1 minute with lip sync included. No hidden fees.",
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
    title: "DubSync — AI Video Dubbing with Lip Sync",
    description:
      "Dub videos into 30+ languages. Lip sync included in every credit from $19.99/mo.",
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
