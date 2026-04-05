import { Clock } from "lucide-react";

const AUTHOR = {
  name: "Alex Marchenko",
  role: "AI & Video Tech Editor at DubSync",
  bio: "Covers AI dubbing, voice cloning, and video localization. Tests every tool hands-on before writing.",
  initials: "AM",
};

export function AuthorCardInline({
  date,
  readingTime,
}: {
  date: string;
  readingTime: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
        {AUTHOR.initials}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{AUTHOR.name}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AuthorCardFull() {
  return (
    <div className="mt-12 rounded-2xl border border-white/10 bg-slate-800/50 p-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
          {AUTHOR.initials}
        </div>
        <div>
          <p className="font-semibold text-white">{AUTHOR.name}</p>
          <p className="text-sm text-pink-400">{AUTHOR.role}</p>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {AUTHOR.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export function getAuthorSchema() {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: "AI & Video Tech Editor",
    url: "https://dubsync.app/about",
  };
}
