import { PlanType } from "./types";

export const SUPPORTED_LANGUAGES = [
  // European
  { code: "en", name: "English", region: "Europe" },
  { code: "es", name: "Spanish", region: "Europe" },
  { code: "fr", name: "French", region: "Europe" },
  { code: "de", name: "German", region: "Europe" },
  { code: "it", name: "Italian", region: "Europe" },
  { code: "pt", name: "Portuguese", region: "Europe" },
  { code: "nl", name: "Dutch", region: "Europe" },
  { code: "pl", name: "Polish", region: "Europe" },
  { code: "sv", name: "Swedish", region: "Europe" },
  { code: "da", name: "Danish", region: "Europe" },
  { code: "no", name: "Norwegian", region: "Europe" },
  { code: "fi", name: "Finnish", region: "Europe" },
  { code: "el", name: "Greek", region: "Europe" },
  { code: "cs", name: "Czech", region: "Europe" },
  { code: "ro", name: "Romanian", region: "Europe" },
  { code: "uk", name: "Ukrainian", region: "Europe" },
  { code: "hu", name: "Hungarian", region: "Europe" },
  { code: "bg", name: "Bulgarian", region: "Europe" },
  // Asian
  { code: "zh", name: "Chinese (Mandarin)", region: "Asia" },
  { code: "ja", name: "Japanese", region: "Asia" },
  { code: "ko", name: "Korean", region: "Asia" },
  { code: "hi", name: "Hindi", region: "Asia" },
  { code: "th", name: "Thai", region: "Asia" },
  { code: "vi", name: "Vietnamese", region: "Asia" },
  { code: "id", name: "Indonesian", region: "Asia" },
  { code: "ms", name: "Malay", region: "Asia" },
  { code: "tl", name: "Filipino", region: "Asia" },
  // Middle East & Africa
  { code: "ar", name: "Arabic", region: "Middle East & Africa" },
  { code: "tr", name: "Turkish", region: "Middle East & Africa" },
  { code: "he", name: "Hebrew", region: "Middle East & Africa" },
  // Americas
  { code: "pt-BR", name: "Portuguese (Brazilian)", region: "Americas" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l.name])
) as Record<string, string>;

export const PLAN_LIMITS: Record<
  PlanType,
  {
    name: string;
    price: number;
    credits: number; // minutes per month, -1 = unlimited
    maxFileSize: number; // MB
    maxLanguages: number;
    features: string[];
  }
> = {
  free: {
    name: "Free",
    price: 0,
    credits: 5,
    maxFileSize: 100,
    maxLanguages: 2,
    features: [
      "5 minutes/month",
      "2 target languages",
      "100MB max file size",
      "720p output",
    ],
  },
  starter: {
    name: "Starter",
    price: 2900, // cents
    credits: 60,
    maxFileSize: 500,
    maxLanguages: 10,
    features: [
      "60 minutes/month",
      "10 target languages",
      "500MB max file size",
      "1080p output",
      "Priority processing",
    ],
  },
  pro: {
    name: "Pro",
    price: 7900,
    credits: 300,
    maxFileSize: 2000,
    maxLanguages: 30,
    features: [
      "300 minutes/month",
      "All 30+ languages",
      "2GB max file size",
      "4K output",
      "Priority processing",
      "API access",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 19900,
    credits: -1,
    maxFileSize: 5000,
    maxLanguages: 30,
    features: [
      "Unlimited minutes",
      "All 30+ languages",
      "5GB max file size",
      "4K output",
      "Priority processing",
      "API access",
      "Custom voice profiles",
      "Dedicated support",
    ],
  },
};
