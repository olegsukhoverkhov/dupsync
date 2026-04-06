import { ShieldCheck, Lock, CreditCard } from "lucide-react";

export function TrustBar() {
  return (
    <div className="border-b border-white/5 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 sm:gap-8 py-2.5 flex-wrap">
          {/* SSL */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3 w-3 text-green-500" />
            <span>SSL Secured</span>
          </div>

          {/* PCI DSS */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3 w-3 text-blue-400" />
            <span>PCI DSS Compliant</span>
          </div>

          {/* GDPR */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3 w-3 text-violet-400" />
            <span>GDPR Ready</span>
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CreditCard className="h-3 w-3" />
            <div className="flex items-center gap-1.5">
              {/* Visa */}
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">VISA</span>
              {/* Mastercard */}
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">MC</span>
              {/* Amex */}
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">AMEX</span>
              {/* PayPal */}
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">PayPal</span>
            </div>
          </div>

          {/* SOC 2 */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>SOC 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
