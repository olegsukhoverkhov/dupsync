import Link from "next/link";
import { Languages } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/dictionaries";

/** Safe accessor for nested dict keys that may not exist in all locales. */
function d(obj: any, path: string, fallback: string): string {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return fallback;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : fallback;
}

export function LocalizedFooter({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const footerLinks = {
    [dict.footer.product]: [
      { label: d(dict, "footer.features", "Features"), href: `/${lang}/features` },
      { label: d(dict, "footer.pricing", d(dict, "header.pricing", "Pricing")), href: `/${lang}/pricing` },
      { label: d(dict, "footer.compare", "Compare"), href: `/${lang}/compare` },
      { label: d(dict, "footer.platforms", "Platforms"), href: `/${lang}/platforms` },
      { label: d(dict, "footer.changelog", "Changelog"), href: "/changelog" },
    ],
    [dict.footer.company]: [
      { label: d(dict, "footer.about", "About"), href: "/about" },
      { label: d(dict, "footer.blog", "Blog"), href: `/${lang}/blog` },
      { label: d(dict, "footer.contact", "Contact"), href: "/contact" },
    ],
    [dict.footer.resources]: [
      { label: d(dict, "footer.docs", "Documentation"), href: "/docs" },
    ],
    [dict.footer.legal]: [
      { label: d(dict, "footer.privacy", "Privacy"), href: "/privacy" },
      { label: d(dict, "footer.terms", "Terms"), href: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DubSync</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">{dict.footer.tagline}</p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Trust badges */}
        <div className="border-t border-white/5 pt-6 pb-4">
          <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap text-[11px] text-slate-500">
            <span className="flex items-center gap-1">SSL Secured</span>
            <span className="flex items-center gap-1">PCI DSS</span>
            <span className="flex items-center gap-1">GDPR</span>
            <span className="flex items-center gap-1">SOC 2</span>
            <span className="flex items-center gap-1.5">
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-blue-400">VISA</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-orange-400">MC</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-cyan-400">AMEX</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-blue-300">PayPal</span>
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col items-center gap-1">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <p className="text-[10px] text-zinc-700">
            Apptica OÜ (17398194) · Harju maakond, Tallinn, Kesklinna linnaosa, Kaupmehe tn 7-120, 10114
          </p>
        </div>
      </div>
    </footer>
  );
}
