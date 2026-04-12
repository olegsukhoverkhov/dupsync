import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Terms of Service — DubSync",
  description:
    "Terms of Service for the DubSync AI video dubbing platform.",
};

export default function TermsPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-zinc-400 mb-10">Last updated: April 2026</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            By accessing or using DubSync (&quot;the Service&quot;), you agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            do not use the Service. We may update these terms at any time, and
            continued use after changes constitutes acceptance.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Accounts</h2>
          <p className="text-zinc-300 leading-relaxed">
            You must provide accurate information when creating an account. You
            are responsible for maintaining the security of your account
            credentials and for all activity that occurs under your account. You
            must be at least 18 years old to create an account. Notify us
            immediately if you suspect unauthorized access to your account.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            3. Usage Limits
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            Each plan has defined limits on dubbing minutes, number of
            languages, video length, and API calls. Usage beyond your plan
            limits will be throttled or may incur overage charges as described
            on our pricing page. We reserve the right to modify plan limits with
            30 days&apos; notice.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            4. Acceptable Use
          </h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            You agree not to use DubSync to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Upload content you do not have the right to use or distribute.</li>
            <li>Generate deepfakes or misleading content intended to deceive.</li>
            <li>Violate any applicable laws, regulations, or third-party rights.</li>
            <li>Attempt to reverse-engineer, decompile, or extract our models or algorithms.</li>
            <li>Overload, disrupt, or interfere with the Service or its infrastructure.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            You retain full ownership of the videos you upload and the dubbed
            output generated from your content. DubSync retains ownership of the
            platform, AI models, algorithms, and all underlying technology. You
            grant us a limited, non-exclusive license to process your content
            solely for the purpose of providing the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            6. Billing and Payments
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            Paid plans are billed monthly in advance. All fees are
            non-refundable except where required by law. You may cancel your
            subscription at any time; access continues until the end of the
            current billing period. We reserve the right to change pricing with
            30 days&apos; notice. Failed payments may result in downgrade to the
            free plan after a 7-day grace period.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            DubSync is provided &quot;as is&quot; without warranties of any kind, express
            or implied. We are not liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Service. Our total liability is limited to the amount you paid us in
            the 12 months preceding the claim.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            8. Termination
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            We may suspend or terminate your account if you violate these terms
            or engage in activity that harms the Service or other users. Upon
            termination, your right to use the Service ceases immediately. You
            may request export of your data within 30 days of termination.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            9. Modifications
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            We may modify these Terms of Service at any time. Material changes
            will be communicated via email or a notice on the platform at least
            30 days before taking effect. Your continued use of DubSync after
            the effective date constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            10. Governing Law
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            These terms are governed by and construed in accordance with the
            laws of the State of Delaware, United States, without regard to
            conflict of law principles. Any disputes will be resolved in the
            courts of Delaware.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">11. Contact</h2>
          <p className="text-zinc-300 leading-relaxed">
            Questions about these terms? Contact us at{" "}
            <a href="mailto:legal@dubsync.app" className="text-pink-400 hover:text-pink-300">
              legal@dubsync.app
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
      <BreadcrumbSchema items={[{ name: "Terms", url: "https://dubsync.app/terms" }]} />
    </div>
  );
}
