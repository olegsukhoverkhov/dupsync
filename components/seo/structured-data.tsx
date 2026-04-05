export function StructuredData() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DubSync",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: "https://dubsync.app",
    description:
      "AI-powered video dubbing platform with voice cloning and lip sync technology. Translate videos into 30+ languages automatically.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "5 minutes/month, 2 languages, 720p",
      },
      {
        "@type": "Offer",
        name: "Starter",
        price: "29",
        priceCurrency: "USD",
        billingPeriod: "P1M",
        description: "60 minutes/month, 10 languages, 1080p",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "79",
        priceCurrency: "USD",
        billingPeriod: "P1M",
        description: "300 minutes/month, all languages, 4K",
      },
      {
        "@type": "Offer",
        name: "Enterprise",
        price: "199",
        priceCurrency: "USD",
        billingPeriod: "P1M",
        description:
          "Unlimited minutes, custom voice profiles, dedicated support",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2000",
      bestRating: "5",
    },
    featureList: [
      "AI Voice Cloning",
      "Lip Synchronization",
      "30+ Language Support",
      "4K Video Output",
      "REST API Access",
      "Real-time Processing",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does voice cloning work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DubSync uses AI to analyze the speaker's voice characteristics — pitch, tone, accent, and emotion — from the original video. It then generates new speech in the target language that preserves these characteristics, so the dubbed version sounds like the same person speaking a different language.",
        },
      },
      {
        "@type": "Question",
        name: "What video formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DubSync supports MP4, MOV, AVI, and other common video formats. The maximum file size depends on your plan: 100MB for Free, 500MB for Starter, 2GB for Pro, and 5GB for Enterprise.",
        },
      },
      {
        "@type": "Question",
        name: "How long does dubbing take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most videos are processed in 2-5 minutes. A typical 10-minute video takes about 3 minutes to dub into one language. Processing time may vary based on video length and server load.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a free plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DubSync offers a free plan with 5 minutes of dubbing per month, 2 target languages, and 720p output. No credit card is required to get started.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is the lip sync?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DubSync uses AI lip-sync technology to automatically adjust mouth movements to match the new audio. Our users report a 95-98% accuracy rate, making it nearly indistinguishable from native speech.",
        },
      },
      {
        "@type": "Question",
        name: "Can I edit the translation before dubbing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. After the AI generates the translation, you can review and edit the script before generating the final dubbed audio. This gives you full control over the accuracy and tone of the translation.",
        },
      },
      {
        "@type": "Question",
        name: "What languages does DubSync support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DubSync supports over 30 languages including Spanish, French, German, Japanese, Korean, Chinese, Hindi, Arabic, Portuguese, Italian, Turkish, Indonesian, and many more.",
        },
      },
      {
        "@type": "Question",
        name: "Can DubSync handle multiple speakers in one video?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DubSync automatically detects and separates multiple speakers, cloning each voice individually. This is ideal for interviews, panel discussions, and multi-speaker presentations.",
        },
      },
      {
        "@type": "Question",
        name: "How much does AI video dubbing cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DubSync offers plans starting from free (5 min/month) to Enterprise ($199/month for unlimited dubbing). The Starter plan at $29/month includes 60 minutes, and the Pro plan at $79/month includes 300 minutes with 4K output and API access.",
        },
      },
      {
        "@type": "Question",
        name: "Is DubSync better than traditional dubbing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI dubbing with DubSync is significantly faster and more affordable than traditional dubbing. A 10-minute video takes minutes instead of days, and costs a fraction of hiring voice actors. While professional studios still excel for theatrical releases, DubSync delivers studio-quality results for digital content, marketing, e-learning, and social media.",
        },
      },
    ],
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DubSync",
    url: "https://dubsync.app",
    logo: "https://dubsync.app/logo.png",
    description:
      "AI-powered video dubbing and localization platform for creators and teams.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
