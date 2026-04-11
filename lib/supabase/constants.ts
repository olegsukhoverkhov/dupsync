import { PlanType } from "./types";

/**
 * All supported languages — matches Cartesia Sonic-3's full 47 language list.
 * Used for both source language selection and target language selection.
 */
export const SUPPORTED_LANGUAGES = [
  // Europe — Western
  { code: "en", name: "English", region: "Europe" },
  { code: "es", name: "Spanish", region: "Europe" },
  { code: "fr", name: "French", region: "Europe" },
  { code: "de", name: "German", region: "Europe" },
  { code: "it", name: "Italian", region: "Europe" },
  { code: "pt", name: "Portuguese", region: "Europe" },
  { code: "nl", name: "Dutch", region: "Europe" },
  { code: "sv", name: "Swedish", region: "Europe" },
  { code: "da", name: "Danish", region: "Europe" },
  { code: "no", name: "Norwegian", region: "Europe" },
  { code: "fi", name: "Finnish", region: "Europe" },
  { code: "el", name: "Greek", region: "Europe" },
  // Europe — Eastern
  { code: "pl", name: "Polish", region: "Europe" },
  { code: "cs", name: "Czech", region: "Europe" },
  { code: "ro", name: "Romanian", region: "Europe" },
  { code: "uk", name: "Ukrainian", region: "Europe" },
  { code: "hu", name: "Hungarian", region: "Europe" },
  { code: "bg", name: "Bulgarian", region: "Europe" },
  { code: "hr", name: "Croatian", region: "Europe" },
  { code: "sk", name: "Slovak", region: "Europe" },
  { code: "ru", name: "Russian", region: "Europe" },
  { code: "ka", name: "Georgian", region: "Europe" },
  // Asia
  { code: "zh", name: "Chinese (Mandarin)", region: "Asia" },
  { code: "ja", name: "Japanese", region: "Asia" },
  { code: "ko", name: "Korean", region: "Asia" },
  { code: "hi", name: "Hindi", region: "Asia" },
  { code: "th", name: "Thai", region: "Asia" },
  { code: "vi", name: "Vietnamese", region: "Asia" },
  { code: "id", name: "Indonesian", region: "Asia" },
  { code: "ms", name: "Malay", region: "Asia" },
  { code: "tl", name: "Filipino", region: "Asia" },
  // Asia — Indian languages
  { code: "ta", name: "Tamil", region: "Asia" },
  { code: "bn", name: "Bengali", region: "Asia" },
  { code: "te", name: "Telugu", region: "Asia" },
  { code: "gu", name: "Gujarati", region: "Asia" },
  { code: "kn", name: "Kannada", region: "Asia" },
  { code: "ml", name: "Malayalam", region: "Asia" },
  { code: "mr", name: "Marathi", region: "Asia" },
  { code: "pa", name: "Punjabi", region: "Asia" },
  // Middle East
  { code: "ar", name: "Arabic", region: "Middle East" },
  { code: "tr", name: "Turkish", region: "Middle East" },
  { code: "he", name: "Hebrew", region: "Middle East" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l.name])
) as Record<string, string>;

export const PLAN_LIMITS: Record<
  PlanType,
  {
    name: string;
    price: number; // cents monthly
    priceAnnual: number; // cents monthly (annual billing)
    credits: number; // minutes per month, -1 = unlimited
    maxFileSize: number; // MB
    maxLanguages: number;
    maxProjects: number;
    maxVideoSeconds: number; // 0 = unlimited, 15 for free
    resolution: string;
    features: string[];
  }
> = {
  free: {
    name: "Free",
    price: 0,
    priceAnnual: 0,
    credits: 1, // 1 free credit on signup = 1 video up to 1 min × 1 lang
    maxFileSize: 100,
    maxLanguages: 1,
    maxProjects: 1,
    maxVideoSeconds: 60,
    resolution: "720p",
    features: [
      "1 video",
      "1 target language",
      "720p output",
      "100MB max file size",
      "Voice cloning",
      "Lip sync included",
      "AI subtitles",
      "No watermark",
    ],
  },
  starter: {
    name: "Starter",
    price: 1999, // $19.99
    priceAnnual: 1599, // $15.99
    credits: 20,
    maxFileSize: 500,
    maxLanguages: 5,
    maxProjects: 3,
    maxVideoSeconds: 0,
    resolution: "1080p",
    features: [
      "20 credits/month",
      "Up to 5 languages",
      "1080p output",
      "500MB max file size",
      "Voice cloning",
      "Lip sync included",
      "AI subtitles + SRT export",
      "No watermark",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: 4999, // $49.99
    priceAnnual: 3999, // $39.99
    credits: 50,
    maxFileSize: 2000,
    maxLanguages: 30,
    maxProjects: 10,
    maxVideoSeconds: 0,
    resolution: "4K",
    features: [
      "50 credits/month",
      "All 30+ languages",
      "4K output",
      "2GB max file size",
      "Voice cloning",
      "Lip sync included",
      "AI subtitles + SRT/VTT export",
      "Custom subtitle styling",
      "No watermark",
      "API access",
      "Priority processing",
    ],
  },
  enterprise: {
    name: "Business",
    price: 14999, // $149.99
    priceAnnual: 11999, // $119.99
    credits: 150,
    maxFileSize: 5000,
    maxLanguages: 30,
    maxProjects: 50,
    maxVideoSeconds: 0,
    resolution: "4K",
    features: [
      "150 credits/month",
      "All 30+ languages",
      "4K output",
      "5GB max file size",
      "Voice cloning",
      "Lip sync included",
      "AI subtitles + SRT/VTT export",
      "Custom subtitle styling",
      "No watermark",
      "API access",
      "Priority processing",
      "Custom voice profiles",
      "Dedicated support",
      "Unlimited projects",
    ],
  },
};
