import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — DubSync",
  description:
    "Learn how DubSync collects, stores, and protects your data. GDPR compliant.",
};

export default function PrivacyPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-zinc-400 mb-10">Last updated: April 2026</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Introduction</h2>
          <p className="text-zinc-300 leading-relaxed">
            DubSync (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the dubsync.app platform. This
            Privacy Policy explains how we collect, use, store, and protect your
            personal information when you use our AI-powered video dubbing
            service.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Data We Collect</h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            We collect the following categories of data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>
              <strong>Account information:</strong> Name, email address, and
              payment details when you create an account or subscribe to a paid
              plan.
            </li>
            <li>
              <strong>Video and audio content:</strong> Videos you upload for
              dubbing, including extracted audio tracks, transcriptions, and
              generated dubbed audio.
            </li>
            <li>
              <strong>Usage data:</strong> Information about how you interact
              with our platform, including pages visited, features used, dubbing
              history, and API calls.
            </li>
            <li>
              <strong>Device and browser data:</strong> IP address, browser
              type, operating system, and device identifiers collected
              automatically through server logs.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            3. How We Use Your Data
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>To provide and improve our dubbing, translation, voice cloning, and lip-sync services.</li>
            <li>To process payments and manage your subscription.</li>
            <li>To communicate with you about your account, updates, and support requests.</li>
            <li>To detect and prevent fraud, abuse, and security incidents.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            4. Storage and Security
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            Your data is stored on secure, encrypted servers. Video and audio
            files are encrypted at rest using AES-256 and in transit using
            TLS 1.3. We retain uploaded videos and generated dubs for 30 days
            after processing unless you choose to delete them sooner. Account
            data is retained for the duration of your account plus 90 days after
            deletion.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Cookies</h2>
          <p className="text-zinc-300 leading-relaxed">
            We use essential cookies to keep you logged in and remember your
            preferences. We also use analytics cookies to understand how our
            platform is used. You can disable non-essential cookies through your
            browser settings at any time. We do not use cookies for
            cross-site advertising.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            6. GDPR Compliance
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            If you are located in the European Economic Area (EEA), you have
            rights under the General Data Protection Regulation (GDPR). We
            process your data based on legitimate interest (providing our
            service), contractual necessity, and your consent where applicable.
            We have appointed a Data Protection Officer and maintain records of
            all processing activities.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            7. Your Rights
          </h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;).</li>
            <li>Export your data in a portable format.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Withdraw consent at any time where processing is based on consent.</li>
          </ul>
          <p className="text-zinc-300 leading-relaxed mt-3">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@dubsync.app" className="text-pink-400 hover:text-pink-300">
              privacy@dubsync.app
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            8. Third-Party Services
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            We use third-party services for payment processing, analytics, and
            infrastructure. These providers are contractually obligated to
            protect your data and process it only as directed by us. We do not
            sell your personal data to third parties.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            9. Changes to This Policy
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by email or through a notice on our
            platform. Continued use of DubSync after changes constitutes
            acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">10. Contact</h2>
          <p className="text-zinc-300 leading-relaxed">
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:privacy@dubsync.app" className="text-pink-400 hover:text-pink-300">
              privacy@dubsync.app
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
