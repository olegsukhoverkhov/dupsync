import { notFound } from "next/navigation";
import { LOCALES, isValidLocale, getDictionary, LOCALE_INFO } from "@/lib/i18n/dictionaries";
import { LocalizedLanding } from "@/components/landing/localized-landing";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export async function generateStaticParams() {
  return LOCALES.filter((l) => l !== "en").map((lang) => ({ lang }));
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <LocalizedLanding dict={dict} lang={lang} />
      <BreadcrumbSchema items={[{ name: LOCALE_INFO[lang].nativeName, url: `https://dubsync.app/${lang}/` }]} />
    </>
  );
}
