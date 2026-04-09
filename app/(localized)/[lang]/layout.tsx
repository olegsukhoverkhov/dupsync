import type { Metadata } from "next";
import { LOCALES, isValidLocale, getDictionary, LOCALE_INFO, isRtlLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { LocalizedHeader } from "@/components/landing/localized-header";
import { LocalizedFooter } from "@/components/landing/localized-footer";

export async function generateStaticParams() {
  return LOCALES.filter((l) => l !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") return {};

  const dict = await getDictionary(lang);
  const langAlternates: Record<string, string> = {};
  for (const l of LOCALES) {
    langAlternates[l] = l === "en" ? "https://dubsync.app/" : `https://dubsync.app/${l}/`;
  }
  langAlternates["x-default"] = "https://dubsync.app/";

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/`,
      languages: langAlternates,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `https://dubsync.app/${lang}/`,
      locale: `${lang}_${lang.toUpperCase()}`,
    },
  };
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();

  const dict = await getDictionary(lang);
  const dir = isRtlLocale(lang) ? "rtl" : "ltr";

  return (
    <div
      className="landing-dark bg-[#0F172A] text-white min-h-screen"
      lang={lang}
      dir={dir}
    >
      <script
        // Mirror the route locale onto <html> on initial render AND
        // on client navigation. Same idea for `dir` so RTL locales
        // (currently only `ar`) flip the whole body on arrival.
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}";document.documentElement.dir="${dir}"`,
        }}
      />
      <LocalizedHeader dict={dict} lang={lang} />
      {children}
      <LocalizedFooter dict={dict} lang={lang} />
    </div>
  );
}
