import { Header } from "@/components/landing/header";
import { HeroNew } from "@/components/landing/hero-new";
import { LogoBar } from "@/components/landing/logo-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DemoSection } from "@/components/landing/demo-section";
import { Examples } from "@/components/landing/examples";
import { Features } from "@/components/landing/features";
import { UseCases } from "@/components/landing/use-cases";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { ComparisonBlock } from "@/components/landing/comparison-block";
import { Testimonials } from "@/components/landing/testimonials";
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
        <HowItWorks />
        <DemoSection />
        <Examples />
        <Features />
        <UseCases />
        <RoiCalculator />
        <ComparisonBlock />
        <Testimonials />
        <PricingNew />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
