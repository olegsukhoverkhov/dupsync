export function StructuredData() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DubSync",
    url: "https://dubsync.app",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "AI-powered video dubbing and localization with lip sync technology",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "149.99",
      priceCurrency: "USD",
      offerCount: "4",
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
