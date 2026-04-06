import Link from "next/link";
import { Languages } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare", href: "/compare" },
    { label: "Platforms", href: "/platforms" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DubSync</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              AI-powered video dubbing and localization for creators and teams.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
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
            <span className="flex items-center gap-1">🔒 SSL Secured</span>
            <span className="flex items-center gap-1">🛡️ PCI DSS</span>
            <span className="flex items-center gap-1">🛡️ GDPR</span>
            <span className="flex items-center gap-1">🛡️ SOC 2</span>
            <span className="flex items-center gap-1.5">
              💳
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-blue-400">VISA</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-orange-400">MC</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-cyan-400">AMEX</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-blue-300">PayPal</span>
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6">
          <p className="text-xs text-zinc-600 text-center">
            &copy; {new Date().getFullYear()} DubSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
