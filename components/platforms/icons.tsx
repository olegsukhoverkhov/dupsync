import { GraduationCap, Mic } from "lucide-react";

export function YouTubeIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="white" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M19 7.5V2h-3.5c0 3-2 4.5-4.5 5v6.5c0 2.5-2 4.5-4.5 4.5S2 16 2 13.5 4 9 6.5 9c.5 0 1 .1 1.5.2V12c-.5-.1-1-.2-1.5-.2C5.1 11.8 4 12.5 4 13.5S5.1 15.2 6.5 15.2 9 14 9 13V2h4c0 0 0 3.5 3 5 .7.3 1.5.5 2.5.5h.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="ig-platform" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#5851DB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-platform)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#ig-platform)" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-platform)" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        d="M15.5 8H14c-1.1 0-1.5.7-1.5 1.5V11h3l-.5 3h-2.5v7h-3v-7H8v-3h1.5V9c0-2.2 1.3-3.5 3.5-3.5h2.5v2.5z"
        fill="white"
      />
    </svg>
  );
}

export function ELearningIcon({ className = "h-8 w-8" }: { className?: string }) {
  return <GraduationCap className={`${className} text-white`} />;
}

export function PodcastIcon({ className = "h-8 w-8" }: { className?: string }) {
  return <Mic className={`${className} text-white`} />;
}

export const PLATFORM_META = {
  youtube: { name: "YouTube", icon: YouTubeIcon, href: "/platforms/youtube" },
  tiktok: { name: "TikTok", icon: TikTokIcon, href: "/platforms/tiktok" },
  instagram: { name: "Instagram", icon: InstagramIcon, href: "/platforms/instagram" },
  facebook: { name: "Facebook", icon: FacebookIcon, href: "/platforms/facebook" },
  elearning: { name: "E-Learning", icon: ELearningIcon, href: "/platforms/elearning" },
  podcasts: { name: "Podcasts", icon: PodcastIcon, href: "/platforms/podcasts" },
} as const;

export type PlatformKey = keyof typeof PLATFORM_META;
