import type { Locale } from "./dictionaries";

/**
 * ISO 3166-1 alpha-2 country code → supported DubSync locale.
 *
 * Only countries whose primary language maps to one of our SUPPORTED
 * locales appear here. Everything else falls back to English.
 *
 * Vercel's edge network provides the country via the `x-vercel-ip-country`
 * request header, which is consumed by `proxy.ts` to auto-route visitors
 * to their native locale on first visit.
 */
const COUNTRY_LOCALE_MAP: Record<string, Locale> = {
  // Spanish (es)
  ES: "es", // Spain
  MX: "es", // Mexico
  AR: "es", // Argentina
  CO: "es", // Colombia
  CL: "es", // Chile
  PE: "es", // Peru
  VE: "es", // Venezuela
  EC: "es", // Ecuador
  GT: "es", // Guatemala
  CU: "es", // Cuba
  BO: "es", // Bolivia
  DO: "es", // Dominican Republic
  HN: "es", // Honduras
  PY: "es", // Paraguay
  SV: "es", // El Salvador
  NI: "es", // Nicaragua
  CR: "es", // Costa Rica
  PR: "es", // Puerto Rico
  UY: "es", // Uruguay
  PA: "es", // Panama
  GQ: "es", // Equatorial Guinea

  // Portuguese (pt)
  PT: "pt", // Portugal
  BR: "pt", // Brazil
  AO: "pt", // Angola
  MZ: "pt", // Mozambique
  CV: "pt", // Cape Verde
  GW: "pt", // Guinea-Bissau
  ST: "pt", // São Tomé and Príncipe
  TL: "pt", // East Timor

  // German (de)
  DE: "de", // Germany
  AT: "de", // Austria
  LI: "de", // Liechtenstein
  // Note: CH (Switzerland) has DE/FR/IT/RM — we pick DE as the plurality.
  CH: "de",

  // French (fr)
  FR: "fr", // France
  BE: "fr", // Belgium (FR is one of three official, but the biggest Web share)
  LU: "fr", // Luxembourg
  MC: "fr", // Monaco
  CI: "fr", // Côte d'Ivoire
  SN: "fr", // Senegal
  ML: "fr", // Mali
  BF: "fr", // Burkina Faso
  NE: "fr", // Niger
  TG: "fr", // Togo
  BJ: "fr", // Benin
  MG: "fr", // Madagascar
  CM: "fr", // Cameroon
  CG: "fr", // Republic of Congo
  CD: "fr", // Democratic Republic of Congo
  GA: "fr", // Gabon
  GN: "fr", // Guinea
  HT: "fr", // Haiti
  RW: "fr", // Rwanda
  BI: "fr", // Burundi
  TD: "fr", // Chad
  DJ: "fr", // Djibouti
  KM: "fr", // Comoros

  // Japanese (ja)
  JP: "ja", // Japan

  // Hindi (hi) — primary for India. Other Indian languages still
  // fall through to English for now; if we add Tamil/Bengali/etc.
  // later this map gets more entries.
  IN: "hi", // India

  // Arabic (ar) — MENA region. Egypt has the largest Arabic-speaking
  // population on the web, Saudi Arabia + UAE have the highest ad
  // spend, so both are included. Maghreb (Algeria/Morocco/Tunisia)
  // routes to French historically but could be flipped to Arabic.
  SA: "ar", // Saudi Arabia
  EG: "ar", // Egypt
  AE: "ar", // United Arab Emirates
  JO: "ar", // Jordan
  KW: "ar", // Kuwait
  QA: "ar", // Qatar
  BH: "ar", // Bahrain
  OM: "ar", // Oman
  IQ: "ar", // Iraq
  SY: "ar", // Syria
  LB: "ar", // Lebanon
  LY: "ar", // Libya
  YE: "ar", // Yemen
  SD: "ar", // Sudan
  PS: "ar", // Palestine

  // Indonesian (id)
  ID: "id", // Indonesia

  // Turkish (tr)
  TR: "tr", // Türkiye
  CY: "tr", // Cyprus (Turkish is one of two official languages; Greek
            // is not a supported locale so we route everyone here)

  // Korean (ko)
  KR: "ko", // South Korea
  KP: "ko", // North Korea — tiny traffic but correct mapping

  // Chinese Simplified (zh)
  CN: "zh", // China
  SG: "zh", // Singapore (large Chinese-speaking population)
  MY: "zh", // Malaysia (significant Chinese community)
};

/**
 * Resolve a country code to a supported locale, falling back to `en`
 * when no explicit mapping exists. Accepts any casing (Vercel sends
 * upper-case, but we normalize just in case).
 */
export function countryToLocale(
  country: string | null | undefined
): Locale {
  if (!country) return "en";
  return COUNTRY_LOCALE_MAP[country.toUpperCase()] ?? "en";
}
