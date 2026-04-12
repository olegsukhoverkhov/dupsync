/**
 * URL import utilities — validates social media video URLs
 * and provides platform detection for YouTube, Instagram, TikTok, Facebook.
 */

const PLATFORM_PATTERNS: Array<{
  platform: "youtube" | "instagram" | "tiktok" | "facebook";
  label: string;
  patterns: RegExp[];
}> = [
  {
    platform: "youtube",
    label: "YouTube",
    patterns: [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
      /^https?:\/\/youtu\.be\//,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\//,
      /^https?:\/\/m\.youtube\.com\/watch\?v=/,
    ],
  },
  {
    platform: "instagram",
    label: "Instagram",
    patterns: [
      /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\//,
    ],
  },
  {
    platform: "tiktok",
    label: "TikTok",
    patterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@[^/]+\/video\//,
      /^https?:\/\/vm\.tiktok\.com\//,
      /^https?:\/\/(www\.)?tiktok\.com\/t\//,
    ],
  },
  {
    platform: "facebook",
    label: "Facebook",
    patterns: [
      /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\//,
      /^https?:\/\/(www\.)?facebook\.com\/watch\//,
      /^https?:\/\/fb\.watch\//,
      /^https?:\/\/(www\.)?facebook\.com\/reel\//,
    ],
  },
];

export type Platform = "youtube" | "instagram" | "tiktok" | "facebook";

export function detectPlatform(url: string): { valid: boolean; platform: Platform | null; label: string } {
  for (const { platform, label, patterns } of PLATFORM_PATTERNS) {
    if (patterns.some((p) => p.test(url))) {
      return { valid: true, platform, label };
    }
  }
  return { valid: false, platform: null, label: "" };
}

export function isValidVideoUrl(url: string): boolean {
  return detectPlatform(url).valid;
}
