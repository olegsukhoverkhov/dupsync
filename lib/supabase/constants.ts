import { PlanType } from "./types";

/**
 * All supported languages — matches Cartesia Sonic-3's full 47 language list.
 * Used for both source language selection and target language selection.
 */
export const SUPPORTED_LANGUAGES = [
  // Europe — Western
  { code: "en", name: "English", region: "Europe", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "es", name: "Spanish", region: "Europe", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "fr", name: "French", region: "Europe", flag: "\ud83c\uddeb\ud83c\uddf7" },
  { code: "de", name: "German", region: "Europe", flag: "\ud83c\udde9\ud83c\uddea" },
  { code: "it", name: "Italian", region: "Europe", flag: "\ud83c\uddee\ud83c\uddf9" },
  { code: "pt", name: "Portuguese", region: "Europe", flag: "\ud83c\udde7\ud83c\uddf7" },
  { code: "nl", name: "Dutch", region: "Europe", flag: "\ud83c\uddf3\ud83c\uddf1" },
  { code: "sv", name: "Swedish", region: "Europe", flag: "\ud83c\uddf8\ud83c\uddea" },
  { code: "da", name: "Danish", region: "Europe", flag: "\ud83c\udde9\ud83c\uddf0" },
  { code: "no", name: "Norwegian", region: "Europe", flag: "\ud83c\uddf3\ud83c\uddf4" },
  { code: "fi", name: "Finnish", region: "Europe", flag: "\ud83c\uddeb\ud83c\uddee" },
  { code: "el", name: "Greek", region: "Europe", flag: "\ud83c\uddec\ud83c\uddf7" },
  // Europe — Eastern
  { code: "pl", name: "Polish", region: "Europe", flag: "\ud83c\uddf5\ud83c\uddf1" },
  { code: "cs", name: "Czech", region: "Europe", flag: "\ud83c\udde8\ud83c\uddff" },
  { code: "ro", name: "Romanian", region: "Europe", flag: "\ud83c\uddf7\ud83c\uddf4" },
  { code: "uk", name: "Ukrainian", region: "Europe", flag: "\ud83c\uddfa\ud83c\udde6" },
  { code: "hu", name: "Hungarian", region: "Europe", flag: "\ud83c\udded\ud83c\uddfa" },
  { code: "bg", name: "Bulgarian", region: "Europe", flag: "\ud83c\udde7\ud83c\uddec" },
  { code: "hr", name: "Croatian", region: "Europe", flag: "\ud83c\udded\ud83c\uddf7" },
  { code: "sk", name: "Slovak", region: "Europe", flag: "\ud83c\uddf8\ud83c\uddf0" },
  { code: "ru", name: "Russian", region: "Europe", flag: "\ud83c\uddf7\ud83c\uddfa" },
  { code: "ka", name: "Georgian", region: "Europe", flag: "\ud83c\uddec\ud83c\uddea" },
  // Asia
  { code: "zh", name: "Chinese (Mandarin)", region: "Asia", flag: "\ud83c\udde8\ud83c\uddf3" },
  { code: "ja", name: "Japanese", region: "Asia", flag: "\ud83c\uddef\ud83c\uddf5" },
  { code: "ko", name: "Korean", region: "Asia", flag: "\ud83c\uddf0\ud83c\uddf7" },
  { code: "hi", name: "Hindi", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "th", name: "Thai", region: "Asia", flag: "\ud83c\uddf9\ud83c\udded" },
  { code: "vi", name: "Vietnamese", region: "Asia", flag: "\ud83c\uddfb\ud83c\uddf3" },
  { code: "id", name: "Indonesian", region: "Asia", flag: "\ud83c\uddee\ud83c\udde9" },
  { code: "ms", name: "Malay", region: "Asia", flag: "\ud83c\uddf2\ud83c\uddfe" },
  { code: "tl", name: "Filipino", region: "Asia", flag: "\ud83c\uddf5\ud83c\udded" },
  // Asia — Indian languages
  { code: "ta", name: "Tamil", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "bn", name: "Bengali", region: "Asia", flag: "\ud83c\udde7\ud83c\udde9" },
  { code: "te", name: "Telugu", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "gu", name: "Gujarati", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "kn", name: "Kannada", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "ml", name: "Malayalam", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "mr", name: "Marathi", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "pa", name: "Punjabi", region: "Asia", flag: "\ud83c\uddee\ud83c\uddf3" },
  // Middle East
  { code: "ar", name: "Arabic", region: "Middle East", flag: "\ud83c\uddf8\ud83c\udde6" },
  { code: "tr", name: "Turkish", region: "Middle East", flag: "\ud83c\uddf9\ud83c\uddf7" },
  { code: "he", name: "Hebrew", region: "Middle East", flag: "\ud83c\uddee\ud83c\uddf1" },
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
