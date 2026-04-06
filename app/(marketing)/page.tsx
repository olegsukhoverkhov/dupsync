import { Header } from "@/components/landing/header";
import { HeroNew } from "@/components/landing/hero-new";
import { LogoBar } from "@/components/landing/logo-bar";
import { WhatIsDubbing } from "@/components/landing/what-is-dubbing";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DemoSection } from "@/components/landing/demo-section";
import { Examples } from "@/components/landing/examples";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { StatsBanner } from "@/components/landing/stats-banner";
import { PricingNew } from "@/components/landing/pricing-new";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
export default function LandingPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main>
        <HeroNew />
        <LogoBar />
        <WhatIsDubbing />
        <HowItWorks />
        <DemoSection />
        <Examples />
        <Features />
        <Testimonials />
        <StatsBanner />
        <PricingNew />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
