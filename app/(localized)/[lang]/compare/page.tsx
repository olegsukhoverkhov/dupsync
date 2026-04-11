import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import { LOCALES, isValidLocale, LOCALE_INFO } from "@/lib/i18n/dictionaries";

type SupportedLang = "es" | "pt" | "de" | "fr" | "ja" | "hi" | "ar" | "id" | "tr" | "ko" | "zh";

const translations: Record<
  SupportedLang,
  {
    meta: { title: string; description: string; ogTitle: string; ogDescription: string; twitterTitle: string; twitterDescription: string };
    badge: string;
    h1: string;
    h1Gradient: string;
    subtitle: string;
    section1Title: string;
    table1Caption: string;
    featureCol: string;
    lipSyncMinRow: string;
    lipSyncEveryCredit: string;
    hiddenSurcharges: string;
    priceForLipSync: string;
    freePlanLipSync: string;
    cellAlways: string;
    cellSeparatePool: string;
    cellCostsCredits: string;
    cellDoublesUsage: string;
    cellLimitedPool: string;
    cellSharedPool: string;
    cellNone: string;
    cellShared: string;
    otherFeatures: string;
    table2Caption: string;
    languages: string;
    voiceCloning: string;
    apiAccess: string;
    maxResolution: string;
    productFocus: string;
    focusDubbing: string;
    focusAvatars: string;
    focusLocalization: string;
    focusAudio: string;
    paidPlans: string;
    section3Title: string;
    section3Subtitle: string;
    plan: string;
    planNeeded: string;
    creditsNeeded: string;
    creditsAvailable: string;
    result: string;
    raskResult: string;
    heygenResult: string;
    dubsyncResult: string;
    geckoLipSyncAvail: string;
    geckoLipSyncNeeded: string;
    geckoResult: string;
    section4Title: string;
    raskCostTitle: string;
    raskCostBody: string;
    heygenCostTitle: string;
    heygenCostBody: string;
    geckoCostTitle: string;
    geckoCostBody: string;
    elevenCostTitle: string;
    elevenCostBody: string;
    oneCredit: string;
    startFree: string;
    section5Title: string;
    reason1Title: string;
    reason1Body: string;
    reason2Title: string;
    reason2Body: string;
    reason3Title: string;
    reason3Body: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
    ctaTitle: string;
    ctaSubtitle: string;
    viewPricing: string;
    seeAlso: string;
    blogLinkText: string;
  }
> = {
  es: {
    meta: {
      title: "Doblaje IA con Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compara minutos reales de lip sync por d\u00f3lar en herramientas de doblaje IA. DubSync: 20 min desde $19.99. Rask AI: requiere $120/mes. Descubre los costes ocultos.",
      ogTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 \u00bfQui\u00e9n te da m\u00e1s Lip Sync?",
      ogDescription: "DubSync incluye lip sync en cada cr\u00e9dito. Rask AI cobra $120/mes. HeyGen comparte cr\u00e9ditos. Mira los n\u00fameros reales.",
      twitterTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 Precios de Lip Sync",
      twitterDescription: "20 minutos de lip sync desde $19.99/mes. Mira c\u00f3mo se compara DubSync con Rask AI, HeyGen, GeckoDub y ElevenLabs.",
    },
    badge: "Actualizado abril 2026",
    h1: "Doblaje IA con Lip Sync \u2014",
    h1Gradient: "\u00bfQui\u00e9n te da m\u00e1s?",
    subtitle: "No precios de titular \u2014 minutos reales de lip sync por d\u00f3lar.",
    section1Title: "Lo que realmente obtienes por ~$20/mes",
    table1Caption: "Comparaci\u00f3n de lip sync entre plataformas de doblaje IA por aproximadamente $20 al mes",
    featureCol: "Caracter\u00edstica",
    lipSyncMinRow: "Minutos de lip sync desde ~$20/mes",
    lipSyncEveryCredit: "Lip sync en cada cr\u00e9dito",
    hiddenSurcharges: "Cargos ocultos de lip sync",
    priceForLipSync: "Precio por acceso a lip sync",
    freePlanLipSync: "Plan gratis con lip sync",
    cellAlways: "siempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "cuesta cr\u00e9ditos",
    cellDoublesUsage: "duplica el uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartido",
    cellNone: "ninguno",
    cellShared: "compartido*",
    otherFeatures: "Otras caracter\u00edsticas",
    table2Caption: "Comparaci\u00f3n adicional de caracter\u00edsticas entre plataformas de doblaje IA",
    languages: "Idiomas",
    voiceCloning: "Clonaci\u00f3n de voz",
    apiAccess: "Acceso API",
    maxResolution: "Resoluci\u00f3n m\u00e1xima",
    productFocus: "Enfoque del producto",
    focusDubbing: "Doblaje de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localizaci\u00f3n",
    focusAudio: "Audio/TTS",
    paidPlans: "planes de pago",
    section3Title: "Coste real: v\u00eddeo de 10 min doblado a 3 idiomas",
    section3Subtitle: "Son 30 minutos de v\u00eddeo con lip sync. Esto es lo que cobra cada plataforma.",
    plan: "Plan",
    planNeeded: "Plan necesario",
    creditsNeeded: "Cr\u00e9ditos necesarios",
    creditsAvailable: "Cr\u00e9ditos disponibles",
    result: "Resultado",
    dubsyncResult: "Listo. 20 cr\u00e9ditos restantes.",
    raskResult: "Listo, us\u00f3 60% del plan en un v\u00eddeo.",
    heygenResult: "Listo, solo 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync necesarios",
    geckoResult: "Insuficiente. Necesitas Scale a \u20ac71/mes.",
    section4Title: "D\u00f3nde se esconden los costes reales",
    raskCostTitle: "Rask AI: lip sync duplica tus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro cuesta $120/mes e incluye 100 minutos de doblaje. Pero al activar lip sync, cada minuto cuesta 2 cr\u00e9ditos en vez de 1. Tu capacidad real de lip sync: ~50 minutos, no 100. Un v\u00eddeo de 10 min en 3 idiomas = 60 cr\u00e9ditos de lip sync = m\u00e1s de la mitad de tu plan.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartido",
    heygenCostBody: "HeyGen Creator te da 200 Cr\u00e9ditos Premium al mes. La traducci\u00f3n con lip sync cuesta 5 cr\u00e9ditos por minuto. Pero esos mismos cr\u00e9ditos se comparten con Avatar IV (20 cr/min), generaci\u00f3n de v\u00eddeo y otras funciones IA. Usa 5 minutos de Avatar IV = 100 cr\u00e9ditos menos. Solo quedan 100 = 20 minutos de traducci\u00f3n con lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter incluye 20 minutos de traducci\u00f3n de v\u00eddeo. Pero solo 7 de esos minutos pueden tener lip sync. Los otros 13 minutos son doblaje solo de audio. Su Creator Pro a \u20ac23/mes sube el lip sync a 15 minutos, a\u00fan menos que los 20 de DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sin lip sync",
    elevenCostBody: "ElevenLabs es una excelente plataforma de audio. Pero genera solo audio, sin v\u00eddeo ni lip sync. Necesitar\u00edas combinarlo con otra herramienta de lip sync y construir tu propio flujo. Genial para desarrolladores, no para creadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto con lip sync. Siempre. Sin excepciones.",
    startFree: "Empieza a Doblar Gratis",
    section5Title: "Por qu\u00e9 los creadores eligen DubSync",
    reason1Title: "Lip sync en todos los planes",
    reason1Body: "A diferencia de Rask AI y GeckoDub que cobran extra por lip sync, o ElevenLabs que no lo ofrece, DubSync incluye lip sync en todos los planes, incluyendo el gratuito.",
    reason2Title: "Sin trampas de cr\u00e9ditos ni multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado con lip sync. Sin multiplicadores x2, sin pools compartidos, sin buckets separados. Siempre sabes exactamente lo que pagas.",
    reason3Title: "Hecho para doblaje de v\u00eddeo",
    reason3Body: "DubSync est\u00e1 construido espec\u00edficamente para doblaje de v\u00eddeo con lip sync. No es una plataforma de avatares, ni una herramienta de audio, ni una suite de localizaci\u00f3n empresarial. Cada funci\u00f3n est\u00e1 dise\u00f1ada para creadores que doblan v\u00eddeos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "\u00bfPor qu\u00e9 DubSync es m\u00e1s barato que Rask AI para lip sync?", a: "Rask AI cobra $120/mes para acceder a lip sync y duplica el consumo de cr\u00e9ditos. DubSync incluye lip sync desde $19.99/mes, sin multiplicadores ni recargos." },
      { q: "\u00bfC\u00f3mo se compara DubSync con HeyGen para doblaje de v\u00eddeo?", a: "HeyGen es principalmente una plataforma de avatares IA. El lip sync comparte Cr\u00e9ditos Premium con otras funciones. DubSync est\u00e1 construido espec\u00edficamente para doblaje: cada cr\u00e9dito es un minuto completo de salida con lip sync." },
      { q: "\u00bfDubSync incluye lip sync en todos los planes?", a: "S\u00ed. Todos los planes de pago + el plan gratuito incluyen lip sync." },
      { q: "\u00bfQu\u00e9 significa 1 cr\u00e9dito en DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado en 1 idioma, siempre con lip sync incluido." },
      { q: "\u00bfPuedo probar DubSync antes de pagar?", a: "S\u00ed. El plan gratuito incluye 1 v\u00eddeo de hasta 15 segundos con lip sync y clonaci\u00f3n de voz. Sin tarjeta de cr\u00e9dito." },
    ],
    ctaTitle: "\u00bfListo para doblar con lip sync real?",
    ctaSubtitle: "Empieza a doblar tus v\u00eddeos gratis. Sin tarjeta de cr\u00e9dito.",
    viewPricing: "Ver Precios",
    seeAlso: "Ver tambi\u00e9n:",
    blogLinkText: "Comparaci\u00f3n de Precios de Doblaje IA 2026",
  },
  pt: {
    meta: {
      title: "Dublagem IA com Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compare minutos reais de lip sync por d\u00f3lar em ferramentas de dublagem IA. DubSync: 20 min a partir de $19.99. Rask AI: requer $120/m\u00eas. Veja os custos ocultos.",
      ogTitle: "Compara\u00e7\u00e3o de Dublagem IA 2026 \u2014 Quem te d\u00e1 mais Lip Sync?",
      ogDescription: "DubSync inclui lip sync em cada cr\u00e9dito. Rask AI cobra $120/m\u00eas. HeyGen compartilha cr\u00e9ditos. Veja os n\u00fameros reais.",
      twitterTitle: "Compara\u00e7\u00e3o de Dublagem IA 2026 \u2014 Pre\u00e7os de Lip Sync",
      twitterDescription: "20 minutos de lip sync a partir de $19.99/m\u00eas. Veja como o DubSync se compara com Rask AI, HeyGen, GeckoDub e ElevenLabs.",
    },
    badge: "Atualizado abril 2026",
    h1: "Dublagem IA com Lip Sync \u2014",
    h1Gradient: "Quem te d\u00e1 mais?",
    subtitle: "N\u00e3o pre\u00e7os de manchete \u2014 minutos reais de lip sync por d\u00f3lar.",
    section1Title: "O que voc\u00ea realmente recebe por ~$20/m\u00eas",
    table1Caption: "Compara\u00e7\u00e3o de lip sync entre plataformas de dublagem IA por aproximadamente $20 por m\u00eas",
    featureCol: "Recurso",
    lipSyncMinRow: "Minutos de lip sync a partir de ~$20/m\u00eas",
    lipSyncEveryCredit: "Lip sync em cada cr\u00e9dito",
    hiddenSurcharges: "Taxas ocultas de lip sync",
    priceForLipSync: "Pre\u00e7o para acesso ao lip sync",
    freePlanLipSync: "Plano gratu\u00edto com lip sync",
    cellAlways: "sempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "custa cr\u00e9ditos",
    cellDoublesUsage: "dobra o uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartilhado",
    cellNone: "nenhum",
    cellShared: "compartilhado*",
    otherFeatures: "Outros recursos",
    table2Caption: "Compara\u00e7\u00e3o adicional de recursos entre plataformas de dublagem IA",
    languages: "Idiomas",
    voiceCloning: "Clonagem de voz",
    apiAccess: "Acesso API",
    maxResolution: "Resolu\u00e7\u00e3o m\u00e1xima",
    productFocus: "Foco do produto",
    focusDubbing: "Dublagem de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localiza\u00e7\u00e3o",
    focusAudio: "Audio/TTS",
    paidPlans: "planos pagos",
    section3Title: "Custo real: v\u00eddeo de 10 min dublado em 3 idiomas",
    section3Subtitle: "S\u00e3o 30 minutos de v\u00eddeo com lip sync. Veja o que cada plataforma realmente cobra.",
    plan: "Plano",
    planNeeded: "Plano necess\u00e1rio",
    creditsNeeded: "Cr\u00e9ditos necess\u00e1rios",
    creditsAvailable: "Cr\u00e9ditos dispon\u00edveis",
    result: "Resultado",
    dubsyncResult: "Pronto. 20 cr\u00e9ditos restantes.",
    raskResult: "Pronto, usou 60% do plano em um v\u00eddeo.",
    heygenResult: "Pronto, apenas 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync dispon\u00edveis",
    geckoLipSyncNeeded: "Min lip sync necess\u00e1rios",
    geckoResult: "Insuficiente. Precisa do Scale a \u20ac71/m\u00eas.",
    section4Title: "Onde os custos reais se escondem",
    raskCostTitle: "Rask AI: lip sync dobra seus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro custa $120/m\u00eas e inclui 100 minutos de dublagem. Mas ao ativar lip sync, cada minuto custa 2 cr\u00e9ditos ao inv\u00e9s de 1. Sua capacidade real de lip sync: ~50 minutos, n\u00e3o 100. Um v\u00eddeo de 10 min em 3 idiomas = 60 cr\u00e9ditos de lip sync = mais da metade do seu plano.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartilhado",
    heygenCostBody: "HeyGen Creator d\u00e1 200 Cr\u00e9ditos Premium por m\u00eas. Tradu\u00e7\u00e3o com lip sync custa 5 cr\u00e9ditos por minuto. Mas esses mesmos cr\u00e9ditos s\u00e3o compartilhados com Avatar IV (20 cr/min), gera\u00e7\u00e3o de v\u00eddeo e outros recursos IA. Use 5 minutos de Avatar IV = 100 cr\u00e9ditos a menos. Restam apenas 100 = 20 minutos de tradu\u00e7\u00e3o com lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter inclui 20 minutos de tradu\u00e7\u00e3o de v\u00eddeo. Mas apenas 7 desses minutos podem ter lip sync. Os outros 13 s\u00e3o dublagem apenas de \u00e1udio. Seu Creator Pro a \u20ac23/m\u00eas aumenta o lip sync para 15 minutos, ainda menos que os 20 do DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sem lip sync",
    elevenCostBody: "ElevenLabs \u00e9 uma excelente plataforma de \u00e1udio. Mas gera apenas \u00e1udio, sem v\u00eddeo nem lip sync. Voc\u00ea precisaria combin\u00e1-lo com outra ferramenta de lip sync e construir seu pr\u00f3prio pipeline. \u00d3timo para desenvolvedores, n\u00e3o para criadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto com lip sync. Sempre. Sem exce\u00e7\u00f5es.",
    startFree: "Come\u00e7ar a Dublar Gr\u00e1tis",
    section5Title: "Por que os criadores escolhem o DubSync",
    reason1Title: "Lip sync em todos os planos",
    reason1Body: "Ao contr\u00e1rio do Rask AI e GeckoDub que cobram extra por lip sync, ou ElevenLabs que n\u00e3o oferece, o DubSync inclui lip sync em todos os planos, incluindo o gratuito.",
    reason2Title: "Sem armadilhas de cr\u00e9ditos ou multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo dublado com lip sync. Sem multiplicadores x2, sem pools compartilhados, sem buckets separados. Voc\u00ea sempre sabe exatamente o que est\u00e1 pagando.",
    reason3Title: "Feito para dublagem de v\u00eddeo",
    reason3Body: "DubSync foi constru\u00eddo especificamente para dublagem de v\u00eddeo com lip sync. N\u00e3o \u00e9 uma plataforma de avatares, nem uma ferramenta de \u00e1udio, nem uma suite de localiza\u00e7\u00e3o empresarial. Cada recurso foi projetado para criadores que dublam v\u00eddeos.",
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "Por que o DubSync \u00e9 mais barato que o Rask AI para lip sync?", a: "Rask AI cobra $120/m\u00eas para acessar lip sync e dobra o consumo de cr\u00e9ditos. DubSync inclui lip sync a partir de $19.99/m\u00eas, sem multiplicadores nem sobretaxas." },
      { q: "Como o DubSync se compara ao HeyGen para dublagem de v\u00eddeo?", a: "HeyGen \u00e9 principalmente uma plataforma de avatares IA. O lip sync compartilha Cr\u00e9ditos Premium com outros recursos. DubSync foi constru\u00eddo especificamente para dublagem: cada cr\u00e9dito \u00e9 um minuto completo de sa\u00edda com lip sync." },
      { q: "O DubSync inclui lip sync em todos os planos?", a: "Sim. Todos os planos pagos + o plano gratuito incluem lip sync." },
      { q: "O que significa 1 cr\u00e9dito no DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo dublado em 1 idioma, sempre com lip sync inclu\u00eddo." },
      { q: "Posso experimentar o DubSync antes de pagar?", a: "Sim. O plano gratuito inclui 1 v\u00eddeo de at\u00e9 15 segundos com lip sync e clonagem de voz. Sem cart\u00e3o de cr\u00e9dito." },
    ],
    ctaTitle: "Pronto para dublar com lip sync real?",
    ctaSubtitle: "Comece a dublar seus v\u00eddeos de gra\u00e7a. Sem cart\u00e3o de cr\u00e9dito.",
    viewPricing: "Ver Pre\u00e7os",
    seeAlso: "Veja tamb\u00e9m:",
    blogLinkText: "Compara\u00e7\u00e3o de Pre\u00e7os de Dublagem IA 2026",
  },
  de: {
    meta: {
      title: "KI-Synchronisation mit Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Vergleiche echte Lip-Sync-Minuten pro Dollar bei KI-Synchronisationstools. DubSync: 20 Min ab $19.99. Rask AI: erfordert $120/Monat. Versteckte Kosten aufgedeckt.",
      ogTitle: "KI-Synchronisation Vergleich 2026 \u2014 Wer bietet am meisten Lip Sync?",
      ogDescription: "DubSync enth\u00e4lt Lip Sync in jedem Credit. Rask AI verlangt $120/Monat. HeyGen teilt Credits. Sieh dir die echten Zahlen an.",
      twitterTitle: "KI-Synchronisation Vergleich 2026 \u2014 Lip Sync Preisvergleich",
      twitterDescription: "20 Lip-Sync-Minuten ab $19.99/Monat. So schneidet DubSync im Vergleich zu Rask AI, HeyGen, GeckoDub und ElevenLabs ab.",
    },
    badge: "Aktualisiert April 2026",
    h1: "KI-Synchronisation mit Lip Sync \u2014",
    h1Gradient: "Wer bietet am meisten?",
    subtitle: "Keine Schlagzeilenpreise \u2014 echte Lip-Sync-Minuten pro Dollar.",
    section1Title: "Was du f\u00fcr ~$20/Monat wirklich bekommst",
    table1Caption: "Lip-Sync-Funktionsvergleich \u00fcber KI-Synchronisationsplattformen bei ca. $20 pro Monat",
    featureCol: "Funktion",
    lipSyncMinRow: "Lip-Sync-Minuten ab ~$20/Monat",
    lipSyncEveryCredit: "Lip Sync in jedem Credit",
    hiddenSurcharges: "Versteckte Lip-Sync-Aufschl\u00e4ge",
    priceForLipSync: "Preis f\u00fcr Lip-Sync-Zugang",
    freePlanLipSync: "Gratisplan mit Lip Sync",
    cellAlways: "immer",
    cellSeparatePool: "separater Pool",
    cellCostsCredits: "kostet Credits",
    cellDoublesUsage: "verdoppelt Verbrauch",
    cellLimitedPool: "begrenzter Pool",
    cellSharedPool: "geteilter Pool",
    cellNone: "keine",
    cellShared: "geteilt*",
    otherFeatures: "Weitere Funktionen",
    table2Caption: "Zus\u00e4tzlicher Funktionsvergleich \u00fcber KI-Synchronisationsplattformen",
    languages: "Sprachen",
    voiceCloning: "Stimmklonen",
    apiAccess: "API-Zugang",
    maxResolution: "Max. Aufl\u00f6sung",
    productFocus: "Produktfokus",
    focusDubbing: "Video-Synchronisation",
    focusAvatars: "KI-Avatare",
    focusLocalization: "Lokalisierung",
    focusAudio: "Audio/TTS",
    paidPlans: "Bezahlpl\u00e4ne",
    section3Title: "Echte Kosten: 10-Min-Video in 3 Sprachen synchronisiert",
    section3Subtitle: "Das sind 30 Minuten Lip-Sync-Video. So viel berechnet jede Plattform wirklich.",
    plan: "Plan",
    planNeeded: "Ben\u00f6tigter Plan",
    creditsNeeded: "Ben\u00f6tigte Credits",
    creditsAvailable: "Verf\u00fcgbare Credits",
    result: "Ergebnis",
    dubsyncResult: "Fertig. 20 Credits \u00fcbrig.",
    raskResult: "Fertig, 60% des Plans f\u00fcr ein Video verbraucht.",
    heygenResult: "Fertig, nur 50 Credits f\u00fcr Avatare \u00fcbrig.",
    geckoLipSyncAvail: "Lip-Sync-Min verf\u00fcgbar",
    geckoLipSyncNeeded: "Lip-Sync-Min ben\u00f6tigt",
    geckoResult: "Nicht genug. Scale bei \u20ac71/Monat n\u00f6tig.",
    section4Title: "Wo sich die echten Kosten verstecken",
    raskCostTitle: "Rask AI: Lip Sync verdoppelt deine Credits",
    raskCostBody: "Rask AI Creator Pro kostet $120/Monat und enth\u00e4lt 100 Minuten Synchronisation. Aber mit Lip Sync kostet jede Minute 2 Credits statt 1. Deine echte Lip-Sync-Kapazit\u00e4t: ~50 Minuten, nicht 100. Ein 10-Min-Video in 3 Sprachen = 60 Lip-Sync-Credits = mehr als die H\u00e4lfte deines Plans.",
    heygenCostTitle: "HeyGen: geteilter Credit-Pool",
    heygenCostBody: "HeyGen Creator gibt dir 200 Premium Credits pro Monat. Lip-Sync-\u00dcbersetzung kostet 5 Credits pro Minute. Aber dieselben Credits werden mit Avatar IV (20 Cr/Min), Videogenerierung und anderen KI-Funktionen geteilt. Nutze 5 Minuten Avatar IV = 100 Credits weg. Nur 100 \u00fcbrig = 20 Minuten Lip-Sync-\u00dcbersetzung.",
    geckoCostTitle: "GeckoDub: separater Lip-Sync-Pool",
    geckoCostBody: "GeckoDub Starter enth\u00e4lt 20 Minuten Video\u00fcbersetzung. Aber nur 7 dieser Minuten k\u00f6nnen Lip Sync haben. Die anderen 13 Minuten sind nur Audio-Synchronisation. Ihr Creator Pro bei \u20ac23/Monat erh\u00f6ht Lip Sync auf 15 Minuten, immer noch weniger als DubSyncs 20 Minuten f\u00fcr $19.99.",
    elevenCostTitle: "ElevenLabs: kein Lip Sync",
    elevenCostBody: "ElevenLabs ist eine hervorragende Audio-Plattform. Aber es generiert nur Audio \u2014 kein Video, kein Lip Sync. Du m\u00fcsstest es mit einem separaten Lip-Sync-Tool kombinieren und eine eigene Pipeline aufbauen. Toll f\u00fcr Entwickler, nicht f\u00fcr Creator.",
    oneCredit: "DubSync: 1 Credit = 1 Minute mit Lip Sync. Immer. Ohne Ausnahmen.",
    startFree: "Jetzt kostenlos synchronisieren",
    section5Title: "Warum Creator DubSync w\u00e4hlen",
    reason1Title: "Lip Sync in jedem Plan",
    reason1Body: "Anders als Rask AI und GeckoDub, die extra f\u00fcr Lip Sync berechnen, oder ElevenLabs, das es gar nicht anbietet, enth\u00e4lt DubSync Lip Sync in jedem Plan \u2014 einschlie\u00dflich des kostenlosen.",
    reason2Title: "Keine Credit-Fallen oder Multiplikatoren",
    reason2Body: "1 Credit = 1 Minute synchronisiertes Video mit Lip Sync. Keine x2-Multiplikatoren, keine geteilten Pools, keine separaten Lip-Sync-Kontingente. Du wei\u00dft immer genau, wof\u00fcr du zahlst.",
    reason3Title: "Gebaut f\u00fcr Video-Synchronisation",
    reason3Body: "DubSync wurde speziell f\u00fcr Video-Synchronisation mit Lip Sync entwickelt. Keine Avatar-Plattform, kein Audio-Tool, keine Enterprise-Lokalisierungssuite. Jede Funktion ist f\u00fcr Creator konzipiert, die Videos synchronisieren.",
    faqTitle: "H\u00e4ufig gestellte Fragen",
    faqs: [
      { q: "Warum ist DubSync g\u00fcnstiger als Rask AI f\u00fcr Lip Sync?", a: "Rask AI verlangt $120/Monat f\u00fcr Lip-Sync-Zugang und verdoppelt den Credit-Verbrauch. DubSync enth\u00e4lt Lip Sync ab $19.99/Monat \u2014 ohne Multiplikatoren, ohne Aufschl\u00e4ge." },
      { q: "Wie schneidet DubSync im Vergleich zu HeyGen bei Video-Synchronisation ab?", a: "HeyGen ist in erster Linie eine KI-Avatar-Plattform. Lip Sync teilt sich Premium Credits mit anderen Funktionen. DubSync wurde speziell f\u00fcr Synchronisation gebaut \u2014 jeder Credit ist eine volle Minute Lip-Sync-Output." },
      { q: "Enth\u00e4lt DubSync Lip Sync in allen Pl\u00e4nen?", a: "Ja. Alle Bezahlpl\u00e4ne + der Gratisplan enthalten Lip Sync." },
      { q: "Was bedeutet 1 Credit bei DubSync?", a: "1 Credit = 1 Minute synchronisiertes Video in 1 Sprache, immer mit Lip Sync inklusive." },
      { q: "Kann ich DubSync vor dem Kauf testen?", a: "Ja. Der Gratisplan enth\u00e4lt 1 Video bis zu 15 Sekunden mit Lip Sync und Stimmklonen. Keine Kreditkarte erforderlich." },
    ],
    ctaTitle: "Bereit f\u00fcr echtes Lip Sync?",
    ctaSubtitle: "Starte jetzt kostenlos mit der Synchronisation. Keine Kreditkarte n\u00f6tig.",
    viewPricing: "Preise ansehen",
    seeAlso: "Siehe auch:",
    blogLinkText: "KI-Synchronisation Preisvergleich 2026",
  },
  fr: {
    meta: {
      title: "Doublage IA avec Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Comparez les minutes r\u00e9elles de lip sync par dollar dans les outils de doublage IA. DubSync : 20 min d\u00e8s $19.99. Rask AI : n\u00e9cessite $120/mois. D\u00e9couvrez les co\u00fbts cach\u00e9s.",
      ogTitle: "Comparaison Doublage IA 2026 \u2014 Qui vous donne le plus de Lip Sync ?",
      ogDescription: "DubSync inclut le lip sync dans chaque cr\u00e9dit. Rask AI facture $120/mois. HeyGen partage les cr\u00e9dits. Voyez les vrais chiffres.",
      twitterTitle: "Comparaison Doublage IA 2026 \u2014 Prix du Lip Sync",
      twitterDescription: "20 minutes de lip sync d\u00e8s $19.99/mois. D\u00e9couvrez comment DubSync se compare \u00e0 Rask AI, HeyGen, GeckoDub et ElevenLabs.",
    },
    badge: "Mis \u00e0 jour avril 2026",
    h1: "Doublage IA avec Lip Sync \u2014",
    h1Gradient: "Qui vous en donne le plus ?",
    subtitle: "Pas les prix d\u2019affiche \u2014 les vraies minutes de lip sync par dollar.",
    section1Title: "Ce que vous obtenez r\u00e9ellement pour ~$20/mois",
    table1Caption: "Comparaison de lip sync entre plateformes de doublage IA \u00e0 environ $20 par mois",
    featureCol: "Fonctionnalit\u00e9",
    lipSyncMinRow: "Minutes de lip sync d\u00e8s ~$20/mois",
    lipSyncEveryCredit: "Lip sync dans chaque cr\u00e9dit",
    hiddenSurcharges: "Frais cach\u00e9s de lip sync",
    priceForLipSync: "Prix pour l\u2019acc\u00e8s au lip sync",
    freePlanLipSync: "Plan gratuit avec lip sync",
    cellAlways: "toujours",
    cellSeparatePool: "pool s\u00e9par\u00e9",
    cellCostsCredits: "co\u00fbte des cr\u00e9dits",
    cellDoublesUsage: "double l\u2019utilisation",
    cellLimitedPool: "pool limit\u00e9",
    cellSharedPool: "pool partag\u00e9",
    cellNone: "aucun",
    cellShared: "partag\u00e9*",
    otherFeatures: "Autres fonctionnalit\u00e9s",
    table2Caption: "Comparaison compl\u00e9mentaire des fonctionnalit\u00e9s entre plateformes de doublage IA",
    languages: "Langues",
    voiceCloning: "Clonage vocal",
    apiAccess: "Acc\u00e8s API",
    maxResolution: "R\u00e9solution max.",
    productFocus: "Focus produit",
    focusDubbing: "Doublage vid\u00e9o",
    focusAvatars: "Avatars IA",
    focusLocalization: "Localisation",
    focusAudio: "Audio/TTS",
    paidPlans: "plans payants",
    section3Title: "Co\u00fbt r\u00e9el : vid\u00e9o de 10 min doubl\u00e9e en 3 langues",
    section3Subtitle: "Soit 30 minutes de vid\u00e9o avec lip sync. Voici ce que chaque plateforme facture r\u00e9ellement.",
    plan: "Plan",
    planNeeded: "Plan n\u00e9cessaire",
    creditsNeeded: "Cr\u00e9dits n\u00e9cessaires",
    creditsAvailable: "Cr\u00e9dits disponibles",
    result: "R\u00e9sultat",
    dubsyncResult: "Fait. 20 cr\u00e9dits restants.",
    raskResult: "Fait, 60% du plan utilis\u00e9 pour une vid\u00e9o.",
    heygenResult: "Fait, seulement 50 cr\u00e9dits pour les avatars.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync n\u00e9cessaires",
    geckoResult: "Insuffisant. Besoin du Scale \u00e0 \u20ac71/mois.",
    section4Title: "O\u00f9 se cachent les vrais co\u00fbts",
    raskCostTitle: "Rask AI : le lip sync double vos cr\u00e9dits",
    raskCostBody: "Rask AI Creator Pro co\u00fbte $120/mois et inclut 100 minutes de doublage. Mais en activant le lip sync, chaque minute co\u00fbte 2 cr\u00e9dits au lieu de 1. Votre capacit\u00e9 r\u00e9elle de lip sync : ~50 minutes, pas 100. Une vid\u00e9o de 10 min en 3 langues = 60 cr\u00e9dits lip sync = plus de la moiti\u00e9 de votre plan.",
    heygenCostTitle: "HeyGen : pool de cr\u00e9dits partag\u00e9",
    heygenCostBody: "HeyGen Creator vous donne 200 Cr\u00e9dits Premium par mois. La traduction lip sync co\u00fbte 5 cr\u00e9dits par minute. Mais ces m\u00eames cr\u00e9dits sont partag\u00e9s avec Avatar IV (20 cr/min), la g\u00e9n\u00e9ration vid\u00e9o et d\u2019autres fonctions IA. Utilisez 5 minutes d\u2019Avatar IV = 100 cr\u00e9dits en moins. Il ne reste que 100 = 20 minutes de traduction lip sync.",
    geckoCostTitle: "GeckoDub : pool s\u00e9par\u00e9 pour le lip sync",
    geckoCostBody: "GeckoDub Starter inclut 20 minutes de traduction vid\u00e9o. Mais seules 7 de ces minutes peuvent avoir le lip sync. Les 13 autres minutes sont du doublage audio uniquement. Leur Creator Pro \u00e0 \u20ac23/mois augmente le lip sync \u00e0 15 minutes, toujours moins que les 20 de DubSync \u00e0 $19.99.",
    elevenCostTitle: "ElevenLabs : pas de lip sync",
    elevenCostBody: "ElevenLabs est une excellente plateforme audio. Mais elle ne g\u00e9n\u00e8re que de l\u2019audio, pas de vid\u00e9o ni de lip sync. Il faudrait la combiner avec un outil de lip sync s\u00e9par\u00e9 et construire votre propre pipeline. Id\u00e9al pour les d\u00e9veloppeurs, pas pour les cr\u00e9ateurs.",
    oneCredit: "DubSync : 1 cr\u00e9dit = 1 minute avec lip sync. Toujours. Sans exception.",
    startFree: "Commencer \u00e0 Doubler Gratuitement",
    section5Title: "Pourquoi les cr\u00e9ateurs choisissent DubSync",
    reason1Title: "Lip sync dans tous les plans",
    reason1Body: "Contrairement \u00e0 Rask AI et GeckoDub qui facturent un suppl\u00e9ment pour le lip sync, ou ElevenLabs qui ne le propose pas, DubSync inclut le lip sync dans tous les plans, y compris le plan gratuit.",
    reason2Title: "Pas de pi\u00e8ges de cr\u00e9dits ni de multiplicateurs",
    reason2Body: "1 cr\u00e9dit = 1 minute de vid\u00e9o doubl\u00e9e avec lip sync. Pas de multiplicateurs x2, pas de pools partag\u00e9s, pas de buckets s\u00e9par\u00e9s. Vous savez toujours exactement ce que vous payez.",
    reason3Title: "Con\u00e7u pour le doublage vid\u00e9o",
    reason3Body: "DubSync a \u00e9t\u00e9 con\u00e7u sp\u00e9cifiquement pour le doublage vid\u00e9o avec lip sync. Pas une plateforme d\u2019avatars, pas un outil audio, pas une suite de localisation entreprise. Chaque fonctionnalit\u00e9 est con\u00e7ue pour les cr\u00e9ateurs qui doublent des vid\u00e9os.",
    faqTitle: "Questions fr\u00e9quentes",
    faqs: [
      { q: "Pourquoi DubSync est-il moins cher que Rask AI pour le lip sync ?", a: "Rask AI facture $120/mois pour l\u2019acc\u00e8s au lip sync et double la consommation de cr\u00e9dits. DubSync inclut le lip sync d\u00e8s $19.99/mois, sans multiplicateurs ni suppl\u00e9ments." },
      { q: "Comment DubSync se compare-t-il \u00e0 HeyGen pour le doublage vid\u00e9o ?", a: "HeyGen est principalement une plateforme d\u2019avatars IA. Le lip sync partage les Cr\u00e9dits Premium avec d\u2019autres fonctionnalit\u00e9s. DubSync est con\u00e7u sp\u00e9cifiquement pour le doublage : chaque cr\u00e9dit est une minute compl\u00e8te de sortie avec lip sync." },
      { q: "DubSync inclut-il le lip sync dans tous les plans ?", a: "Oui. Tous les plans payants + le plan gratuit incluent le lip sync." },
      { q: "Que signifie 1 cr\u00e9dit chez DubSync ?", a: "1 cr\u00e9dit = 1 minute de vid\u00e9o doubl\u00e9e dans 1 langue, toujours avec lip sync inclus." },
      { q: "Puis-je essayer DubSync avant de payer ?", a: "Oui. Le plan gratuit inclut 1 vid\u00e9o jusqu\u2019\u00e0 15 secondes avec lip sync et clonage vocal. Sans carte de cr\u00e9dit." },
    ],
    ctaTitle: "Pr\u00eat \u00e0 doubler avec du vrai lip sync ?",
    ctaSubtitle: "Commencez \u00e0 doubler vos vid\u00e9os gratuitement. Sans carte de cr\u00e9dit.",
    viewPricing: "Voir les Tarifs",
    seeAlso: "Voir aussi :",
    blogLinkText: "Comparaison des Prix du Doublage IA 2026",
  },
  ja: {
    meta: {
      title: "AI\u30c0\u30d3\u30f3\u30b0\u00d7\u30ea\u30c3\u30d7\u30b7\u30f3\u30af \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "AI\u30c0\u30d3\u30f3\u30b0\u30c4\u30fc\u30eb\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u5b9f\u8cea\u5206\u6570\u3092\u6bd4\u8f03\u3002DubSync\uff1a20\u5206 $19.99\u304b\u3089\u3002Rask AI\uff1a$120/\u6708\u304c\u5fc5\u8981\u3002\u96a0\u308c\u305f\u30b3\u30b9\u30c8\u3092\u78ba\u8a8d\u3002",
      ogTitle: "AI\u30c0\u30d3\u30f3\u30b0\u6bd4\u8f03 2026 \u2014 \u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u6700\u5927\u306e\u30c4\u30fc\u30eb\u306f\uff1f",
      ogDescription: "DubSync\u306f\u5168\u30af\u30ec\u30b8\u30c3\u30c8\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u3002Rask AI\u306f$120/\u6708\u3002HeyGen\u306f\u30af\u30ec\u30b8\u30c3\u30c8\u5171\u6709\u3002\u5b9f\u969b\u306e\u6570\u5b57\u3092\u78ba\u8a8d\u3002",
      twitterTitle: "AI\u30c0\u30d3\u30f3\u30b0\u6bd4\u8f03 2026 \u2014 \u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4fa1\u683c\u6bd4\u8f03",
      twitterDescription: "20\u5206\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af $19.99/\u6708\u304b\u3089\u3002DubSync\u3068Rask AI\u3001HeyGen\u3001GeckoDub\u3001ElevenLabs\u306e\u6bd4\u8f03\u3002",
    },
    badge: "2026\u5e744\u6708\u66f4\u65b0",
    h1: "AI\u30c0\u30d3\u30f3\u30b0\u00d7\u30ea\u30c3\u30d7\u30b7\u30f3\u30af \u2014",
    h1Gradient: "\u6700\u3082\u304a\u5f97\u306a\u306e\u306f\uff1f",
    subtitle: "\u898b\u51fa\u3057\u4fa1\u683c\u3067\u306f\u306a\u304f\u3001\u30c9\u30eb\u3042\u305f\u308a\u306e\u5b9f\u8cea\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u5206\u6570\u3002",
    section1Title: "\u6708\u984d\u7d04$20\u3067\u5b9f\u969b\u306b\u5f97\u3089\u308c\u308b\u3082\u306e",
    table1Caption: "\u6708\u984d\u7d04$20\u3067\u306eAI\u30c0\u30d3\u30f3\u30b0\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u9593\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u6a5f\u80fd\u6bd4\u8f03",
    featureCol: "\u6a5f\u80fd",
    lipSyncMinRow: "~$20/\u6708\u3067\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u5206\u6570",
    lipSyncEveryCredit: "\u5168\u30af\u30ec\u30b8\u30c3\u30c8\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d",
    hiddenSurcharges: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306e\u96a0\u308c\u305f\u8ffd\u52a0\u6599\u91d1",
    priceForLipSync: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u30a2\u30af\u30bb\u30b9\u4fa1\u683c",
    freePlanLipSync: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u7121\u6599\u30d7\u30e9\u30f3",
    cellAlways: "\u5e38\u6642",
    cellSeparatePool: "\u5225\u30d7\u30fc\u30eb",
    cellCostsCredits: "\u30af\u30ec\u30b8\u30c3\u30c8\u6d88\u8cbb",
    cellDoublesUsage: "\u4f7f\u7528\u91cf2\u500d",
    cellLimitedPool: "\u5236\u9650\u30d7\u30fc\u30eb",
    cellSharedPool: "\u5171\u6709\u30d7\u30fc\u30eb",
    cellNone: "\u306a\u3057",
    cellShared: "\u5171\u6709*",
    otherFeatures: "\u305d\u306e\u4ed6\u306e\u6a5f\u80fd",
    table2Caption: "AI\u30c0\u30d3\u30f3\u30b0\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u9593\u306e\u8ffd\u52a0\u6a5f\u80fd\u6bd4\u8f03",
    languages: "\u5bfe\u5fdc\u8a00\u8a9e",
    voiceCloning: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3",
    apiAccess: "API\u30a2\u30af\u30bb\u30b9",
    maxResolution: "\u6700\u5927\u89e3\u50cf\u5ea6",
    productFocus: "\u88fd\u54c1\u306e\u7126\u70b9",
    focusDubbing: "\u52d5\u753b\u30c0\u30d3\u30f3\u30b0",
    focusAvatars: "AI\u30a2\u30d0\u30bf\u30fc",
    focusLocalization: "\u30ed\u30fc\u30ab\u30e9\u30a4\u30bc\u30fc\u30b7\u30e7\u30f3",
    focusAudio: "\u30aa\u30fc\u30c7\u30a3\u30aa/TTS",
    paidPlans: "\u6709\u6599\u30d7\u30e9\u30f3",
    section3Title: "\u5b9f\u8cea\u30b3\u30b9\u30c8\uff1a10\u5206\u306e\u52d5\u753b\u30923\u8a00\u8a9e\u306b\u30c0\u30d3\u30f3\u30b0",
    section3Subtitle: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d30\u5206\u306e\u52d5\u753b\u3002\u5404\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u306e\u5b9f\u969b\u306e\u8acb\u6c42\u984d\u3002",
    plan: "\u30d7\u30e9\u30f3",
    planNeeded: "\u5fc5\u8981\u306a\u30d7\u30e9\u30f3",
    creditsNeeded: "\u5fc5\u8981\u30af\u30ec\u30b8\u30c3\u30c8",
    creditsAvailable: "\u5229\u7528\u53ef\u80fd\u30af\u30ec\u30b8\u30c3\u30c8",
    result: "\u7d50\u679c",
    dubsyncResult: "\u5b8c\u4e86\u300220\u30af\u30ec\u30b8\u30c3\u30c8\u6b8b\u308a\u3002",
    raskResult: "\u5b8c\u4e86\u30011\u672c\u306e\u52d5\u753b\u3067\u30d7\u30e9\u30f3\u306e60%\u3092\u4f7f\u7528\u3002",
    heygenResult: "\u5b8c\u4e86\u3001\u30a2\u30d0\u30bf\u30fc\u7528\u306b50\u30af\u30ec\u30b8\u30c3\u30c8\u306e\u307f\u6b8b\u308a\u3002",
    geckoLipSyncAvail: "\u5229\u7528\u53ef\u80fd\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u5206",
    geckoLipSyncNeeded: "\u5fc5\u8981\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u5206",
    geckoResult: "\u4e0d\u8db3\u3002Scale\uff08\u20ac71/\u6708\uff09\u304c\u5fc5\u8981\u3002",
    section4Title: "\u5b9f\u969b\u306e\u30b3\u30b9\u30c8\u304c\u96a0\u308c\u3066\u3044\u308b\u5834\u6240",
    raskCostTitle: "Rask AI\uff1a\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3067\u30af\u30ec\u30b8\u30c3\u30c8\u304c2\u500d\u306b",
    raskCostBody: "Rask AI Creator Pro\u306f$120/\u6708\u3067100\u5206\u306e\u30c0\u30d3\u30f3\u30b0\u3092\u542b\u307f\u307e\u3059\u3002\u3057\u304b\u3057\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u6709\u52b9\u306b\u3059\u308b\u3068\u30011\u5206\u3042\u305f\u308a2\u30af\u30ec\u30b8\u30c3\u30c8\u306b\u306a\u308a\u307e\u3059\u3002\u5b9f\u8cea\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u5bb9\u91cf\uff1a100\u5206\u3067\u306f\u306a\u304f\u7d0450\u5206\u300210\u5206\u306e\u52d5\u753b\u30923\u8a00\u8a9e = 60\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u30af\u30ec\u30b8\u30c3\u30c8 = \u30d7\u30e9\u30f3\u306e\u534a\u5206\u4ee5\u4e0a\u3002",
    heygenCostTitle: "HeyGen\uff1a\u5171\u6709\u30af\u30ec\u30b8\u30c3\u30c8\u30d7\u30fc\u30eb",
    heygenCostBody: "HeyGen Creator\u306f\u6708200\u30d7\u30ec\u30df\u30a2\u30e0\u30af\u30ec\u30b8\u30c3\u30c8\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u7ffb\u8a33\u306f1\u5206\u30425\u30af\u30ec\u30b8\u30c3\u30c8\u3002\u3057\u304b\u3057\u540c\u3058\u30af\u30ec\u30b8\u30c3\u30c8\u304cAvatar IV\uff0820cr/\u5206\uff09\u3001\u52d5\u753b\u751f\u6210\u3001\u305d\u306e\u4ed6AI\u6a5f\u80fd\u3068\u5171\u6709\u3055\u308c\u307e\u3059\u3002Avatar IV\u30925\u5206\u4f7f\u3046\u3068100\u30af\u30ec\u30b8\u30c3\u30c8\u6d88\u8cbb\u3002\u6b8b\u308a100 = \u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u7ffb\u8a33\u306f20\u5206\u306e\u307f\u3002",
    geckoCostTitle: "GeckoDub\uff1a\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u5225\u30d7\u30fc\u30eb",
    geckoCostBody: "GeckoDub Starter\u306f20\u5206\u306e\u52d5\u753b\u7ffb\u8a33\u3092\u542b\u307f\u307e\u3059\u304c\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u306f7\u5206\u306e\u307f\u3002\u6b8b\u308a13\u5206\u306f\u97f3\u58f0\u306e\u307f\u306e\u30c0\u30d3\u30f3\u30b0\u3002Creator Pro\uff08\u20ac23/\u6708\uff09\u3067\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f15\u5206\u306b\u5897\u52a0\u3057\u307e\u3059\u304c\u3001DubSync\u306e$19.99\u306720\u5206\u306b\u306f\u53ca\u3073\u307e\u305b\u3093\u3002",
    elevenCostTitle: "ElevenLabs\uff1a\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306a\u3057",
    elevenCostBody: "ElevenLabs\u306f\u512a\u308c\u305f\u30aa\u30fc\u30c7\u30a3\u30aa\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u3059\u304c\u3001\u97f3\u58f0\u306e\u307f\u306e\u751f\u6210\u3067\u3001\u52d5\u753b\u51fa\u529b\u3084\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u5225\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u30c4\u30fc\u30eb\u3068\u7d44\u307f\u5408\u308f\u305b\u3066\u72ec\u81ea\u306e\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u3092\u69cb\u7bc9\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u958b\u767a\u8005\u5411\u3051\u3067\u3042\u308a\u3001\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u5411\u3051\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
    oneCredit: "DubSync\uff1a1\u30af\u30ec\u30b8\u30c3\u30c8 = 1\u5206\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u3002\u5e38\u306b\u3002\u4f8b\u5916\u306a\u3057\u3002",
    startFree: "\u7121\u6599\u3067\u30c0\u30d3\u30f3\u30b0\u958b\u59cb",
    section5Title: "\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u304cDubSync\u3092\u9078\u3076\u7406\u7531",
    reason1Title: "\u5168\u30d7\u30e9\u30f3\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d",
    reason1Body: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306b\u8ffd\u52a0\u6599\u91d1\u3092\u8acb\u6c42\u3059\u308bRask AI\u3084GeckoDub\u3001\u63d0\u4f9b\u3057\u3066\u3044\u306a\u3044ElevenLabs\u3068\u306f\u7570\u306a\u308a\u3001DubSync\u306f\u7121\u6599\u30d7\u30e9\u30f3\u3092\u542b\u3080\u5168\u30d7\u30e9\u30f3\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u542b\u307f\u307e\u3059\u3002",
    reason2Title: "\u30af\u30ec\u30b8\u30c3\u30c8\u306e\u7f60\u3084\u4e57\u6570\u306a\u3057",
    reason2Body: "1\u30af\u30ec\u30b8\u30c3\u30c8 = \u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u30c0\u30d3\u30f3\u30b0\u52d5\u753b1\u5206\u3002x2\u4e57\u6570\u3001\u5171\u6709\u30d7\u30fc\u30eb\u3001\u5225\u30d0\u30b1\u30c3\u30c8\u306a\u3057\u3002\u652f\u6255\u3044\u5185\u5bb9\u304c\u5e38\u306b\u660e\u78ba\u3067\u3059\u3002",
    reason3Title: "\u52d5\u753b\u30c0\u30d3\u30f3\u30b0\u5c02\u7528\u8a2d\u8a08",
    reason3Body: "DubSync\u306f\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u52d5\u753b\u30c0\u30d3\u30f3\u30b0\u5c02\u7528\u306b\u69cb\u7bc9\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u30a2\u30d0\u30bf\u30fc\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u3082\u3001\u30aa\u30fc\u30c7\u30a3\u30aa\u30c4\u30fc\u30eb\u3067\u3082\u3001\u30a8\u30f3\u30bf\u30fc\u30d7\u30e9\u30a4\u30ba\u30ed\u30fc\u30ab\u30e9\u30a4\u30bc\u30fc\u30b7\u30e7\u30f3\u30b9\u30a4\u30fc\u30c8\u3067\u3082\u3042\u308a\u307e\u305b\u3093\u3002\u3059\u3079\u3066\u306e\u6a5f\u80fd\u306f\u52d5\u753b\u3092\u30c0\u30d3\u30f3\u30b0\u3059\u308b\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u306e\u305f\u3081\u306b\u8a2d\u8a08\u3055\u308c\u3066\u3044\u307e\u3059\u3002",
    faqTitle: "\u3088\u304f\u3042\u308b\u8cea\u554f",
    faqs: [
      { q: "DubSync\u304cRask AI\u3088\u308a\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u5b89\u3044\u306e\u306f\u306a\u305c\uff1f", a: "Rask AI\u306f\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u30a2\u30af\u30bb\u30b9\u306b$120/\u6708\u3092\u8acb\u6c42\u3057\u3001\u30af\u30ec\u30b8\u30c3\u30c8\u6d88\u8cbb\u3092\u500d\u5897\u3055\u305b\u307e\u3059\u3002DubSync\u306f$19.99/\u6708\u304b\u3089\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u542b\u307f\u3001\u4e57\u6570\u3084\u8ffd\u52a0\u6599\u91d1\u306f\u3042\u308a\u307e\u305b\u3093\u3002" },
      { q: "DubSync\u3068HeyGen\u306e\u52d5\u753b\u30c0\u30d3\u30f3\u30b0\u6bd4\u8f03\u306f\uff1f", a: "HeyGen\u306f\u4e3b\u306bAI\u30a2\u30d0\u30bf\u30fc\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u3059\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u30d7\u30ec\u30df\u30a2\u30e0\u30af\u30ec\u30b8\u30c3\u30c8\u3092\u4ed6\u306e\u6a5f\u80fd\u3068\u5171\u6709\u3057\u307e\u3059\u3002DubSync\u306f\u30c0\u30d3\u30f3\u30b0\u5c02\u7528\u3067\u3001\u5404\u30af\u30ec\u30b8\u30c3\u30c8\u304c\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d1\u5206\u306e\u51fa\u529b\u3067\u3059\u3002" },
      { q: "DubSync\u306f\u5168\u30d7\u30e9\u30f3\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u542b\u307e\u308c\u307e\u3059\u304b\uff1f", a: "\u306f\u3044\u3002\u5168\u6709\u6599\u30d7\u30e9\u30f3 + \u7121\u6599\u30d7\u30e9\u30f3\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002" },
      { q: "DubSync\u306e1\u30af\u30ec\u30b8\u30c3\u30c8\u306e\u610f\u5473\u306f\uff1f", a: "1\u30af\u30ec\u30b8\u30c3\u30c8 = 1\u8a00\u8a9e\u306e\u30c0\u30d3\u30f3\u30b0\u52d5\u753b1\u5206\u3001\u5e38\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u3002" },
      { q: "\u652f\u6255\u3044\u524d\u306bDubSync\u3092\u8a66\u3059\u3053\u3068\u306f\u3067\u304d\u307e\u3059\u304b\uff1f", a: "\u306f\u3044\u3002\u7121\u6599\u30d7\u30e9\u30f3\u306b\u306f\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3068\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u4ed8\u304d\u306e15\u79d2\u307e\u3067\u306e\u52d5\u753b1\u672c\u304c\u542b\u307e\u308c\u307e\u3059\u3002\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u4e0d\u8981\u3002" },
    ],
    ctaTitle: "\u672c\u7269\u306e\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3067\u30c0\u30d3\u30f3\u30b0\u3059\u308b\u6e96\u5099\u306f\uff1f",
    ctaSubtitle: "\u52d5\u753b\u306e\u30c0\u30d3\u30f3\u30b0\u3092\u7121\u6599\u3067\u958b\u59cb\u3002\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u4e0d\u8981\u3002",
    viewPricing: "\u6599\u91d1\u3092\u898b\u308b",
    seeAlso: "\u95a2\u9023\u8a18\u4e8b\uff1a",
    blogLinkText: "AI\u30c0\u30d3\u30f3\u30b0\u4fa1\u683c\u6bd4\u8f03 2026",
  },

  hi: {
    meta: {
      title: "Doblaje IA con Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compara minutos reales de lip sync por d\u00f3lar en herramientas de doblaje IA. DubSync: 20 min desde $19.99. Rask AI: requiere $120/mes. Descubre los costes ocultos.",
      ogTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 \u00bfQui\u00e9n te da m\u00e1s Lip Sync?",
      ogDescription: "DubSync incluye lip sync en cada cr\u00e9dito. Rask AI cobra $120/mes. HeyGen comparte cr\u00e9ditos. Mira los n\u00fameros reales.",
      twitterTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 Precios de Lip Sync",
      twitterDescription: "20 minutos de lip sync desde $19.99/mes. Mira c\u00f3mo se compara DubSync con Rask AI, HeyGen, GeckoDub y ElevenLabs.",
    },
    badge: "Actualizado abril 2026",
    h1: "Doblaje IA con Lip Sync \u2014",
    h1Gradient: "\u00bfQui\u00e9n te da m\u00e1s?",
    subtitle: "No precios de titular \u2014 minutos reales de lip sync por d\u00f3lar.",
    section1Title: "Lo que realmente obtienes por ~$20/mes",
    table1Caption: "Comparaci\u00f3n de lip sync entre plataformas de doblaje IA por aproximadamente $20 al mes",
    featureCol: "Caracter\u00edstica",
    lipSyncMinRow: "Minutos de lip sync desde ~$20/mes",
    lipSyncEveryCredit: "Lip sync en cada cr\u00e9dito",
    hiddenSurcharges: "Cargos ocultos de lip sync",
    priceForLipSync: "Precio por acceso a lip sync",
    freePlanLipSync: "Plan gratis con lip sync",
    cellAlways: "siempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "cuesta cr\u00e9ditos",
    cellDoublesUsage: "duplica el uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartido",
    cellNone: "ninguno",
    cellShared: "compartido*",
    otherFeatures: "Otras caracter\u00edsticas",
    table2Caption: "Comparaci\u00f3n adicional de caracter\u00edsticas entre plataformas de doblaje IA",
    languages: "Idiomas",
    voiceCloning: "Clonaci\u00f3n de voz",
    apiAccess: "Acceso API",
    maxResolution: "Resoluci\u00f3n m\u00e1xima",
    productFocus: "Enfoque del producto",
    focusDubbing: "Doblaje de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localizaci\u00f3n",
    focusAudio: "Audio/TTS",
    paidPlans: "planes de pago",
    section3Title: "Coste real: v\u00eddeo de 10 min doblado a 3 idiomas",
    section3Subtitle: "Son 30 minutos de v\u00eddeo con lip sync. Esto es lo que cobra cada plataforma.",
    plan: "Plan",
    planNeeded: "Plan necesario",
    creditsNeeded: "Cr\u00e9ditos necesarios",
    creditsAvailable: "Cr\u00e9ditos disponibles",
    result: "Resultado",
    dubsyncResult: "Listo. 20 cr\u00e9ditos restantes.",
    raskResult: "Listo, us\u00f3 60% del plan en un v\u00eddeo.",
    heygenResult: "Listo, solo 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync necesarios",
    geckoResult: "Insuficiente. Necesitas Scale a \u20ac71/mes.",
    section4Title: "D\u00f3nde se esconden los costes reales",
    raskCostTitle: "Rask AI: lip sync duplica tus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro cuesta $120/mes e incluye 100 minutos de doblaje. Pero al activar lip sync, cada minuto cuesta 2 cr\u00e9ditos en vez de 1. Tu capacidad real de lip sync: ~50 minutos, no 100. Un v\u00eddeo de 10 min en 3 idiomas = 60 cr\u00e9ditos de lip sync = m\u00e1s de la mitad de tu plan.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartido",
    heygenCostBody: "HeyGen Creator te da 200 Cr\u00e9ditos Premium al mes. La traducci\u00f3n con lip sync cuesta 5 cr\u00e9ditos por minuto. Pero esos mismos cr\u00e9ditos se comparten con Avatar IV (20 cr/min), generaci\u00f3n de v\u00eddeo y otras funciones IA. Usa 5 minutos de Avatar IV = 100 cr\u00e9ditos menos. Solo quedan 100 = 20 minutos de traducci\u00f3n con lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter incluye 20 minutos de traducci\u00f3n de v\u00eddeo. Pero solo 7 de esos minutos pueden tener lip sync. Los otros 13 minutos son doblaje solo de audio. Su Creator Pro a \u20ac23/mes sube el lip sync a 15 minutos, a\u00fan menos que los 20 de DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sin lip sync",
    elevenCostBody: "ElevenLabs es una excelente plataforma de audio. Pero genera solo audio, sin v\u00eddeo ni lip sync. Necesitar\u00edas combinarlo con otra herramienta de lip sync y construir tu propio flujo. Genial para desarrolladores, no para creadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto con lip sync. Siempre. Sin excepciones.",
    startFree: "Empieza a Doblar Gratis",
    section5Title: "Por qu\u00e9 los creadores eligen DubSync",
    reason1Title: "Lip sync en todos los planes",
    reason1Body: "A diferencia de Rask AI y GeckoDub que cobran extra por lip sync, o ElevenLabs que no lo ofrece, DubSync incluye lip sync en todos los planes, incluyendo el gratuito.",
    reason2Title: "Sin trampas de cr\u00e9ditos ni multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado con lip sync. Sin multiplicadores x2, sin pools compartidos, sin buckets separados. Siempre sabes exactamente lo que pagas.",
    reason3Title: "Hecho para doblaje de v\u00eddeo",
    reason3Body: "DubSync est\u00e1 construido espec\u00edficamente para doblaje de v\u00eddeo con lip sync. No es una plataforma de avatares, ni una herramienta de audio, ni una suite de localizaci\u00f3n empresarial. Cada funci\u00f3n est\u00e1 dise\u00f1ada para creadores que doblan v\u00eddeos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "\u00bfPor qu\u00e9 DubSync es m\u00e1s barato que Rask AI para lip sync?", a: "Rask AI cobra $120/mes para acceder a lip sync y duplica el consumo de cr\u00e9ditos. DubSync incluye lip sync desde $19.99/mes, sin multiplicadores ni recargos." },
      { q: "\u00bfC\u00f3mo se compara DubSync con HeyGen para doblaje de v\u00eddeo?", a: "HeyGen es principalmente una plataforma de avatares IA. El lip sync comparte Cr\u00e9ditos Premium con otras funciones. DubSync est\u00e1 construido espec\u00edficamente para doblaje: cada cr\u00e9dito es un minuto completo de salida con lip sync." },
      { q: "\u00bfDubSync incluye lip sync en todos los planes?", a: "S\u00ed. Todos los planes de pago + el plan gratuito incluyen lip sync." },
      { q: "\u00bfQu\u00e9 significa 1 cr\u00e9dito en DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado en 1 idioma, siempre con lip sync incluido." },
      { q: "\u00bfPuedo probar DubSync antes de pagar?", a: "S\u00ed. El plan gratuito incluye 1 v\u00eddeo de hasta 15 segundos con lip sync y clonaci\u00f3n de voz. Sin tarjeta de cr\u00e9dito." },
    ],
    ctaTitle: "\u00bfListo para doblar con lip sync real?",
    ctaSubtitle: "Empieza a doblar tus v\u00eddeos gratis. Sin tarjeta de cr\u00e9dito.",
    viewPricing: "Ver Precios",
    seeAlso: "Ver tambi\u00e9n:",
    blogLinkText: "Comparaci\u00f3n de Precios de Doblaje IA 2026",
  },
  ar: {
    meta: {
      title: "Doblaje IA con Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compara minutos reales de lip sync por d\u00f3lar en herramientas de doblaje IA. DubSync: 20 min desde $19.99. Rask AI: requiere $120/mes. Descubre los costes ocultos.",
      ogTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 \u00bfQui\u00e9n te da m\u00e1s Lip Sync?",
      ogDescription: "DubSync incluye lip sync en cada cr\u00e9dito. Rask AI cobra $120/mes. HeyGen comparte cr\u00e9ditos. Mira los n\u00fameros reales.",
      twitterTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 Precios de Lip Sync",
      twitterDescription: "20 minutos de lip sync desde $19.99/mes. Mira c\u00f3mo se compara DubSync con Rask AI, HeyGen, GeckoDub y ElevenLabs.",
    },
    badge: "Actualizado abril 2026",
    h1: "Doblaje IA con Lip Sync \u2014",
    h1Gradient: "\u00bfQui\u00e9n te da m\u00e1s?",
    subtitle: "No precios de titular \u2014 minutos reales de lip sync por d\u00f3lar.",
    section1Title: "Lo que realmente obtienes por ~$20/mes",
    table1Caption: "Comparaci\u00f3n de lip sync entre plataformas de doblaje IA por aproximadamente $20 al mes",
    featureCol: "Caracter\u00edstica",
    lipSyncMinRow: "Minutos de lip sync desde ~$20/mes",
    lipSyncEveryCredit: "Lip sync en cada cr\u00e9dito",
    hiddenSurcharges: "Cargos ocultos de lip sync",
    priceForLipSync: "Precio por acceso a lip sync",
    freePlanLipSync: "Plan gratis con lip sync",
    cellAlways: "siempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "cuesta cr\u00e9ditos",
    cellDoublesUsage: "duplica el uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartido",
    cellNone: "ninguno",
    cellShared: "compartido*",
    otherFeatures: "Otras caracter\u00edsticas",
    table2Caption: "Comparaci\u00f3n adicional de caracter\u00edsticas entre plataformas de doblaje IA",
    languages: "Idiomas",
    voiceCloning: "Clonaci\u00f3n de voz",
    apiAccess: "Acceso API",
    maxResolution: "Resoluci\u00f3n m\u00e1xima",
    productFocus: "Enfoque del producto",
    focusDubbing: "Doblaje de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localizaci\u00f3n",
    focusAudio: "Audio/TTS",
    paidPlans: "planes de pago",
    section3Title: "Coste real: v\u00eddeo de 10 min doblado a 3 idiomas",
    section3Subtitle: "Son 30 minutos de v\u00eddeo con lip sync. Esto es lo que cobra cada plataforma.",
    plan: "Plan",
    planNeeded: "Plan necesario",
    creditsNeeded: "Cr\u00e9ditos necesarios",
    creditsAvailable: "Cr\u00e9ditos disponibles",
    result: "Resultado",
    dubsyncResult: "Listo. 20 cr\u00e9ditos restantes.",
    raskResult: "Listo, us\u00f3 60% del plan en un v\u00eddeo.",
    heygenResult: "Listo, solo 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync necesarios",
    geckoResult: "Insuficiente. Necesitas Scale a \u20ac71/mes.",
    section4Title: "D\u00f3nde se esconden los costes reales",
    raskCostTitle: "Rask AI: lip sync duplica tus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro cuesta $120/mes e incluye 100 minutos de doblaje. Pero al activar lip sync, cada minuto cuesta 2 cr\u00e9ditos en vez de 1. Tu capacidad real de lip sync: ~50 minutos, no 100. Un v\u00eddeo de 10 min en 3 idiomas = 60 cr\u00e9ditos de lip sync = m\u00e1s de la mitad de tu plan.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartido",
    heygenCostBody: "HeyGen Creator te da 200 Cr\u00e9ditos Premium al mes. La traducci\u00f3n con lip sync cuesta 5 cr\u00e9ditos por minuto. Pero esos mismos cr\u00e9ditos se comparten con Avatar IV (20 cr/min), generaci\u00f3n de v\u00eddeo y otras funciones IA. Usa 5 minutos de Avatar IV = 100 cr\u00e9ditos menos. Solo quedan 100 = 20 minutos de traducci\u00f3n con lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter incluye 20 minutos de traducci\u00f3n de v\u00eddeo. Pero solo 7 de esos minutos pueden tener lip sync. Los otros 13 minutos son doblaje solo de audio. Su Creator Pro a \u20ac23/mes sube el lip sync a 15 minutos, a\u00fan menos que los 20 de DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sin lip sync",
    elevenCostBody: "ElevenLabs es una excelente plataforma de audio. Pero genera solo audio, sin v\u00eddeo ni lip sync. Necesitar\u00edas combinarlo con otra herramienta de lip sync y construir tu propio flujo. Genial para desarrolladores, no para creadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto con lip sync. Siempre. Sin excepciones.",
    startFree: "Empieza a Doblar Gratis",
    section5Title: "Por qu\u00e9 los creadores eligen DubSync",
    reason1Title: "Lip sync en todos los planes",
    reason1Body: "A diferencia de Rask AI y GeckoDub que cobran extra por lip sync, o ElevenLabs que no lo ofrece, DubSync incluye lip sync en todos los planes, incluyendo el gratuito.",
    reason2Title: "Sin trampas de cr\u00e9ditos ni multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado con lip sync. Sin multiplicadores x2, sin pools compartidos, sin buckets separados. Siempre sabes exactamente lo que pagas.",
    reason3Title: "Hecho para doblaje de v\u00eddeo",
    reason3Body: "DubSync est\u00e1 construido espec\u00edficamente para doblaje de v\u00eddeo con lip sync. No es una plataforma de avatares, ni una herramienta de audio, ni una suite de localizaci\u00f3n empresarial. Cada funci\u00f3n est\u00e1 dise\u00f1ada para creadores que doblan v\u00eddeos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "\u00bfPor qu\u00e9 DubSync es m\u00e1s barato que Rask AI para lip sync?", a: "Rask AI cobra $120/mes para acceder a lip sync y duplica el consumo de cr\u00e9ditos. DubSync incluye lip sync desde $19.99/mes, sin multiplicadores ni recargos." },
      { q: "\u00bfC\u00f3mo se compara DubSync con HeyGen para doblaje de v\u00eddeo?", a: "HeyGen es principalmente una plataforma de avatares IA. El lip sync comparte Cr\u00e9ditos Premium con otras funciones. DubSync est\u00e1 construido espec\u00edficamente para doblaje: cada cr\u00e9dito es un minuto completo de salida con lip sync." },
      { q: "\u00bfDubSync incluye lip sync en todos los planes?", a: "S\u00ed. Todos los planes de pago + el plan gratuito incluyen lip sync." },
      { q: "\u00bfQu\u00e9 significa 1 cr\u00e9dito en DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado en 1 idioma, siempre con lip sync incluido." },
      { q: "\u00bfPuedo probar DubSync antes de pagar?", a: "S\u00ed. El plan gratuito incluye 1 v\u00eddeo de hasta 15 segundos con lip sync y clonaci\u00f3n de voz. Sin tarjeta de cr\u00e9dito." },
    ],
    ctaTitle: "\u00bfListo para doblar con lip sync real?",
    ctaSubtitle: "Empieza a doblar tus v\u00eddeos gratis. Sin tarjeta de cr\u00e9dito.",
    viewPricing: "Ver Precios",
    seeAlso: "Ver tambi\u00e9n:",
    blogLinkText: "Comparaci\u00f3n de Precios de Doblaje IA 2026",
  },
  id: {
    meta: {
      title: "Doblaje IA con Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compara minutos reales de lip sync por d\u00f3lar en herramientas de doblaje IA. DubSync: 20 min desde $19.99. Rask AI: requiere $120/mes. Descubre los costes ocultos.",
      ogTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 \u00bfQui\u00e9n te da m\u00e1s Lip Sync?",
      ogDescription: "DubSync incluye lip sync en cada cr\u00e9dito. Rask AI cobra $120/mes. HeyGen comparte cr\u00e9ditos. Mira los n\u00fameros reales.",
      twitterTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 Precios de Lip Sync",
      twitterDescription: "20 minutos de lip sync desde $19.99/mes. Mira c\u00f3mo se compara DubSync con Rask AI, HeyGen, GeckoDub y ElevenLabs.",
    },
    badge: "Actualizado abril 2026",
    h1: "Doblaje IA con Lip Sync \u2014",
    h1Gradient: "\u00bfQui\u00e9n te da m\u00e1s?",
    subtitle: "No precios de titular \u2014 minutos reales de lip sync por d\u00f3lar.",
    section1Title: "Lo que realmente obtienes por ~$20/mes",
    table1Caption: "Comparaci\u00f3n de lip sync entre plataformas de doblaje IA por aproximadamente $20 al mes",
    featureCol: "Caracter\u00edstica",
    lipSyncMinRow: "Minutos de lip sync desde ~$20/mes",
    lipSyncEveryCredit: "Lip sync en cada cr\u00e9dito",
    hiddenSurcharges: "Cargos ocultos de lip sync",
    priceForLipSync: "Precio por acceso a lip sync",
    freePlanLipSync: "Plan gratis con lip sync",
    cellAlways: "siempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "cuesta cr\u00e9ditos",
    cellDoublesUsage: "duplica el uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartido",
    cellNone: "ninguno",
    cellShared: "compartido*",
    otherFeatures: "Otras caracter\u00edsticas",
    table2Caption: "Comparaci\u00f3n adicional de caracter\u00edsticas entre plataformas de doblaje IA",
    languages: "Idiomas",
    voiceCloning: "Clonaci\u00f3n de voz",
    apiAccess: "Acceso API",
    maxResolution: "Resoluci\u00f3n m\u00e1xima",
    productFocus: "Enfoque del producto",
    focusDubbing: "Doblaje de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localizaci\u00f3n",
    focusAudio: "Audio/TTS",
    paidPlans: "planes de pago",
    section3Title: "Coste real: v\u00eddeo de 10 min doblado a 3 idiomas",
    section3Subtitle: "Son 30 minutos de v\u00eddeo con lip sync. Esto es lo que cobra cada plataforma.",
    plan: "Plan",
    planNeeded: "Plan necesario",
    creditsNeeded: "Cr\u00e9ditos necesarios",
    creditsAvailable: "Cr\u00e9ditos disponibles",
    result: "Resultado",
    dubsyncResult: "Listo. 20 cr\u00e9ditos restantes.",
    raskResult: "Listo, us\u00f3 60% del plan en un v\u00eddeo.",
    heygenResult: "Listo, solo 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync necesarios",
    geckoResult: "Insuficiente. Necesitas Scale a \u20ac71/mes.",
    section4Title: "D\u00f3nde se esconden los costes reales",
    raskCostTitle: "Rask AI: lip sync duplica tus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro cuesta $120/mes e incluye 100 minutos de doblaje. Pero al activar lip sync, cada minuto cuesta 2 cr\u00e9ditos en vez de 1. Tu capacidad real de lip sync: ~50 minutos, no 100. Un v\u00eddeo de 10 min en 3 idiomas = 60 cr\u00e9ditos de lip sync = m\u00e1s de la mitad de tu plan.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartido",
    heygenCostBody: "HeyGen Creator te da 200 Cr\u00e9ditos Premium al mes. La traducci\u00f3n con lip sync cuesta 5 cr\u00e9ditos por minuto. Pero esos mismos cr\u00e9ditos se comparten con Avatar IV (20 cr/min), generaci\u00f3n de v\u00eddeo y otras funciones IA. Usa 5 minutos de Avatar IV = 100 cr\u00e9ditos menos. Solo quedan 100 = 20 minutos de traducci\u00f3n con lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter incluye 20 minutos de traducci\u00f3n de v\u00eddeo. Pero solo 7 de esos minutos pueden tener lip sync. Los otros 13 minutos son doblaje solo de audio. Su Creator Pro a \u20ac23/mes sube el lip sync a 15 minutos, a\u00fan menos que los 20 de DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sin lip sync",
    elevenCostBody: "ElevenLabs es una excelente plataforma de audio. Pero genera solo audio, sin v\u00eddeo ni lip sync. Necesitar\u00edas combinarlo con otra herramienta de lip sync y construir tu propio flujo. Genial para desarrolladores, no para creadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto con lip sync. Siempre. Sin excepciones.",
    startFree: "Empieza a Doblar Gratis",
    section5Title: "Por qu\u00e9 los creadores eligen DubSync",
    reason1Title: "Lip sync en todos los planes",
    reason1Body: "A diferencia de Rask AI y GeckoDub que cobran extra por lip sync, o ElevenLabs que no lo ofrece, DubSync incluye lip sync en todos los planes, incluyendo el gratuito.",
    reason2Title: "Sin trampas de cr\u00e9ditos ni multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado con lip sync. Sin multiplicadores x2, sin pools compartidos, sin buckets separados. Siempre sabes exactamente lo que pagas.",
    reason3Title: "Hecho para doblaje de v\u00eddeo",
    reason3Body: "DubSync est\u00e1 construido espec\u00edficamente para doblaje de v\u00eddeo con lip sync. No es una plataforma de avatares, ni una herramienta de audio, ni una suite de localizaci\u00f3n empresarial. Cada funci\u00f3n est\u00e1 dise\u00f1ada para creadores que doblan v\u00eddeos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "\u00bfPor qu\u00e9 DubSync es m\u00e1s barato que Rask AI para lip sync?", a: "Rask AI cobra $120/mes para acceder a lip sync y duplica el consumo de cr\u00e9ditos. DubSync incluye lip sync desde $19.99/mes, sin multiplicadores ni recargos." },
      { q: "\u00bfC\u00f3mo se compara DubSync con HeyGen para doblaje de v\u00eddeo?", a: "HeyGen es principalmente una plataforma de avatares IA. El lip sync comparte Cr\u00e9ditos Premium con otras funciones. DubSync est\u00e1 construido espec\u00edficamente para doblaje: cada cr\u00e9dito es un minuto completo de salida con lip sync." },
      { q: "\u00bfDubSync incluye lip sync en todos los planes?", a: "S\u00ed. Todos los planes de pago + el plan gratuito incluyen lip sync." },
      { q: "\u00bfQu\u00e9 significa 1 cr\u00e9dito en DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado en 1 idioma, siempre con lip sync incluido." },
      { q: "\u00bfPuedo probar DubSync antes de pagar?", a: "S\u00ed. El plan gratuito incluye 1 v\u00eddeo de hasta 15 segundos con lip sync y clonaci\u00f3n de voz. Sin tarjeta de cr\u00e9dito." },
    ],
    ctaTitle: "\u00bfListo para doblar con lip sync real?",
    ctaSubtitle: "Empieza a doblar tus v\u00eddeos gratis. Sin tarjeta de cr\u00e9dito.",
    viewPricing: "Ver Precios",
    seeAlso: "Ver tambi\u00e9n:",
    blogLinkText: "Comparaci\u00f3n de Precios de Doblaje IA 2026",
  },
  tr: {
    meta: {
      title: "Doblaje IA con Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compara minutos reales de lip sync por d\u00f3lar en herramientas de doblaje IA. DubSync: 20 min desde $19.99. Rask AI: requiere $120/mes. Descubre los costes ocultos.",
      ogTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 \u00bfQui\u00e9n te da m\u00e1s Lip Sync?",
      ogDescription: "DubSync incluye lip sync en cada cr\u00e9dito. Rask AI cobra $120/mes. HeyGen comparte cr\u00e9ditos. Mira los n\u00fameros reales.",
      twitterTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 Precios de Lip Sync",
      twitterDescription: "20 minutos de lip sync desde $19.99/mes. Mira c\u00f3mo se compara DubSync con Rask AI, HeyGen, GeckoDub y ElevenLabs.",
    },
    badge: "Actualizado abril 2026",
    h1: "Doblaje IA con Lip Sync \u2014",
    h1Gradient: "\u00bfQui\u00e9n te da m\u00e1s?",
    subtitle: "No precios de titular \u2014 minutos reales de lip sync por d\u00f3lar.",
    section1Title: "Lo que realmente obtienes por ~$20/mes",
    table1Caption: "Comparaci\u00f3n de lip sync entre plataformas de doblaje IA por aproximadamente $20 al mes",
    featureCol: "Caracter\u00edstica",
    lipSyncMinRow: "Minutos de lip sync desde ~$20/mes",
    lipSyncEveryCredit: "Lip sync en cada cr\u00e9dito",
    hiddenSurcharges: "Cargos ocultos de lip sync",
    priceForLipSync: "Precio por acceso a lip sync",
    freePlanLipSync: "Plan gratis con lip sync",
    cellAlways: "siempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "cuesta cr\u00e9ditos",
    cellDoublesUsage: "duplica el uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartido",
    cellNone: "ninguno",
    cellShared: "compartido*",
    otherFeatures: "Otras caracter\u00edsticas",
    table2Caption: "Comparaci\u00f3n adicional de caracter\u00edsticas entre plataformas de doblaje IA",
    languages: "Idiomas",
    voiceCloning: "Clonaci\u00f3n de voz",
    apiAccess: "Acceso API",
    maxResolution: "Resoluci\u00f3n m\u00e1xima",
    productFocus: "Enfoque del producto",
    focusDubbing: "Doblaje de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localizaci\u00f3n",
    focusAudio: "Audio/TTS",
    paidPlans: "planes de pago",
    section3Title: "Coste real: v\u00eddeo de 10 min doblado a 3 idiomas",
    section3Subtitle: "Son 30 minutos de v\u00eddeo con lip sync. Esto es lo que cobra cada plataforma.",
    plan: "Plan",
    planNeeded: "Plan necesario",
    creditsNeeded: "Cr\u00e9ditos necesarios",
    creditsAvailable: "Cr\u00e9ditos disponibles",
    result: "Resultado",
    dubsyncResult: "Listo. 20 cr\u00e9ditos restantes.",
    raskResult: "Listo, us\u00f3 60% del plan en un v\u00eddeo.",
    heygenResult: "Listo, solo 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync necesarios",
    geckoResult: "Insuficiente. Necesitas Scale a \u20ac71/mes.",
    section4Title: "D\u00f3nde se esconden los costes reales",
    raskCostTitle: "Rask AI: lip sync duplica tus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro cuesta $120/mes e incluye 100 minutos de doblaje. Pero al activar lip sync, cada minuto cuesta 2 cr\u00e9ditos en vez de 1. Tu capacidad real de lip sync: ~50 minutos, no 100. Un v\u00eddeo de 10 min en 3 idiomas = 60 cr\u00e9ditos de lip sync = m\u00e1s de la mitad de tu plan.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartido",
    heygenCostBody: "HeyGen Creator te da 200 Cr\u00e9ditos Premium al mes. La traducci\u00f3n con lip sync cuesta 5 cr\u00e9ditos por minuto. Pero esos mismos cr\u00e9ditos se comparten con Avatar IV (20 cr/min), generaci\u00f3n de v\u00eddeo y otras funciones IA. Usa 5 minutos de Avatar IV = 100 cr\u00e9ditos menos. Solo quedan 100 = 20 minutos de traducci\u00f3n con lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter incluye 20 minutos de traducci\u00f3n de v\u00eddeo. Pero solo 7 de esos minutos pueden tener lip sync. Los otros 13 minutos son doblaje solo de audio. Su Creator Pro a \u20ac23/mes sube el lip sync a 15 minutos, a\u00fan menos que los 20 de DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sin lip sync",
    elevenCostBody: "ElevenLabs es una excelente plataforma de audio. Pero genera solo audio, sin v\u00eddeo ni lip sync. Necesitar\u00edas combinarlo con otra herramienta de lip sync y construir tu propio flujo. Genial para desarrolladores, no para creadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto con lip sync. Siempre. Sin excepciones.",
    startFree: "Empieza a Doblar Gratis",
    section5Title: "Por qu\u00e9 los creadores eligen DubSync",
    reason1Title: "Lip sync en todos los planes",
    reason1Body: "A diferencia de Rask AI y GeckoDub que cobran extra por lip sync, o ElevenLabs que no lo ofrece, DubSync incluye lip sync en todos los planes, incluyendo el gratuito.",
    reason2Title: "Sin trampas de cr\u00e9ditos ni multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado con lip sync. Sin multiplicadores x2, sin pools compartidos, sin buckets separados. Siempre sabes exactamente lo que pagas.",
    reason3Title: "Hecho para doblaje de v\u00eddeo",
    reason3Body: "DubSync est\u00e1 construido espec\u00edficamente para doblaje de v\u00eddeo con lip sync. No es una plataforma de avatares, ni una herramienta de audio, ni una suite de localizaci\u00f3n empresarial. Cada funci\u00f3n est\u00e1 dise\u00f1ada para creadores que doblan v\u00eddeos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "\u00bfPor qu\u00e9 DubSync es m\u00e1s barato que Rask AI para lip sync?", a: "Rask AI cobra $120/mes para acceder a lip sync y duplica el consumo de cr\u00e9ditos. DubSync incluye lip sync desde $19.99/mes, sin multiplicadores ni recargos." },
      { q: "\u00bfC\u00f3mo se compara DubSync con HeyGen para doblaje de v\u00eddeo?", a: "HeyGen es principalmente una plataforma de avatares IA. El lip sync comparte Cr\u00e9ditos Premium con otras funciones. DubSync est\u00e1 construido espec\u00edficamente para doblaje: cada cr\u00e9dito es un minuto completo de salida con lip sync." },
      { q: "\u00bfDubSync incluye lip sync en todos los planes?", a: "S\u00ed. Todos los planes de pago + el plan gratuito incluyen lip sync." },
      { q: "\u00bfQu\u00e9 significa 1 cr\u00e9dito en DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado en 1 idioma, siempre con lip sync incluido." },
      { q: "\u00bfPuedo probar DubSync antes de pagar?", a: "S\u00ed. El plan gratuito incluye 1 v\u00eddeo de hasta 15 segundos con lip sync y clonaci\u00f3n de voz. Sin tarjeta de cr\u00e9dito." },
    ],
    ctaTitle: "\u00bfListo para doblar con lip sync real?",
    ctaSubtitle: "Empieza a doblar tus v\u00eddeos gratis. Sin tarjeta de cr\u00e9dito.",
    viewPricing: "Ver Precios",
    seeAlso: "Ver tambi\u00e9n:",
    blogLinkText: "Comparaci\u00f3n de Precios de Doblaje IA 2026",
  },
  ko: {
    meta: {
      title: "Doblaje IA con Lip Sync \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "Compara minutos reales de lip sync por d\u00f3lar en herramientas de doblaje IA. DubSync: 20 min desde $19.99. Rask AI: requiere $120/mes. Descubre los costes ocultos.",
      ogTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 \u00bfQui\u00e9n te da m\u00e1s Lip Sync?",
      ogDescription: "DubSync incluye lip sync en cada cr\u00e9dito. Rask AI cobra $120/mes. HeyGen comparte cr\u00e9ditos. Mira los n\u00fameros reales.",
      twitterTitle: "Comparaci\u00f3n de Doblaje IA 2026 \u2014 Precios de Lip Sync",
      twitterDescription: "20 minutos de lip sync desde $19.99/mes. Mira c\u00f3mo se compara DubSync con Rask AI, HeyGen, GeckoDub y ElevenLabs.",
    },
    badge: "Actualizado abril 2026",
    h1: "Doblaje IA con Lip Sync \u2014",
    h1Gradient: "\u00bfQui\u00e9n te da m\u00e1s?",
    subtitle: "No precios de titular \u2014 minutos reales de lip sync por d\u00f3lar.",
    section1Title: "Lo que realmente obtienes por ~$20/mes",
    table1Caption: "Comparaci\u00f3n de lip sync entre plataformas de doblaje IA por aproximadamente $20 al mes",
    featureCol: "Caracter\u00edstica",
    lipSyncMinRow: "Minutos de lip sync desde ~$20/mes",
    lipSyncEveryCredit: "Lip sync en cada cr\u00e9dito",
    hiddenSurcharges: "Cargos ocultos de lip sync",
    priceForLipSync: "Precio por acceso a lip sync",
    freePlanLipSync: "Plan gratis con lip sync",
    cellAlways: "siempre",
    cellSeparatePool: "pool separado",
    cellCostsCredits: "cuesta cr\u00e9ditos",
    cellDoublesUsage: "duplica el uso",
    cellLimitedPool: "pool limitado",
    cellSharedPool: "pool compartido",
    cellNone: "ninguno",
    cellShared: "compartido*",
    otherFeatures: "Otras caracter\u00edsticas",
    table2Caption: "Comparaci\u00f3n adicional de caracter\u00edsticas entre plataformas de doblaje IA",
    languages: "Idiomas",
    voiceCloning: "Clonaci\u00f3n de voz",
    apiAccess: "Acceso API",
    maxResolution: "Resoluci\u00f3n m\u00e1xima",
    productFocus: "Enfoque del producto",
    focusDubbing: "Doblaje de v\u00eddeo",
    focusAvatars: "Avatares IA",
    focusLocalization: "Localizaci\u00f3n",
    focusAudio: "Audio/TTS",
    paidPlans: "planes de pago",
    section3Title: "Coste real: v\u00eddeo de 10 min doblado a 3 idiomas",
    section3Subtitle: "Son 30 minutos de v\u00eddeo con lip sync. Esto es lo que cobra cada plataforma.",
    plan: "Plan",
    planNeeded: "Plan necesario",
    creditsNeeded: "Cr\u00e9ditos necesarios",
    creditsAvailable: "Cr\u00e9ditos disponibles",
    result: "Resultado",
    dubsyncResult: "Listo. 20 cr\u00e9ditos restantes.",
    raskResult: "Listo, us\u00f3 60% del plan en un v\u00eddeo.",
    heygenResult: "Listo, solo 50 cr\u00e9ditos para avatares.",
    geckoLipSyncAvail: "Min lip sync disponibles",
    geckoLipSyncNeeded: "Min lip sync necesarios",
    geckoResult: "Insuficiente. Necesitas Scale a \u20ac71/mes.",
    section4Title: "D\u00f3nde se esconden los costes reales",
    raskCostTitle: "Rask AI: lip sync duplica tus cr\u00e9ditos",
    raskCostBody: "Rask AI Creator Pro cuesta $120/mes e incluye 100 minutos de doblaje. Pero al activar lip sync, cada minuto cuesta 2 cr\u00e9ditos en vez de 1. Tu capacidad real de lip sync: ~50 minutos, no 100. Un v\u00eddeo de 10 min en 3 idiomas = 60 cr\u00e9ditos de lip sync = m\u00e1s de la mitad de tu plan.",
    heygenCostTitle: "HeyGen: pool de cr\u00e9ditos compartido",
    heygenCostBody: "HeyGen Creator te da 200 Cr\u00e9ditos Premium al mes. La traducci\u00f3n con lip sync cuesta 5 cr\u00e9ditos por minuto. Pero esos mismos cr\u00e9ditos se comparten con Avatar IV (20 cr/min), generaci\u00f3n de v\u00eddeo y otras funciones IA. Usa 5 minutos de Avatar IV = 100 cr\u00e9ditos menos. Solo quedan 100 = 20 minutos de traducci\u00f3n con lip sync.",
    geckoCostTitle: "GeckoDub: pool separado para lip sync",
    geckoCostBody: "GeckoDub Starter incluye 20 minutos de traducci\u00f3n de v\u00eddeo. Pero solo 7 de esos minutos pueden tener lip sync. Los otros 13 minutos son doblaje solo de audio. Su Creator Pro a \u20ac23/mes sube el lip sync a 15 minutos, a\u00fan menos que los 20 de DubSync a $19.99.",
    elevenCostTitle: "ElevenLabs: sin lip sync",
    elevenCostBody: "ElevenLabs es una excelente plataforma de audio. Pero genera solo audio, sin v\u00eddeo ni lip sync. Necesitar\u00edas combinarlo con otra herramienta de lip sync y construir tu propio flujo. Genial para desarrolladores, no para creadores.",
    oneCredit: "DubSync: 1 cr\u00e9dito = 1 minuto con lip sync. Siempre. Sin excepciones.",
    startFree: "Empieza a Doblar Gratis",
    section5Title: "Por qu\u00e9 los creadores eligen DubSync",
    reason1Title: "Lip sync en todos los planes",
    reason1Body: "A diferencia de Rask AI y GeckoDub que cobran extra por lip sync, o ElevenLabs que no lo ofrece, DubSync incluye lip sync en todos los planes, incluyendo el gratuito.",
    reason2Title: "Sin trampas de cr\u00e9ditos ni multiplicadores",
    reason2Body: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado con lip sync. Sin multiplicadores x2, sin pools compartidos, sin buckets separados. Siempre sabes exactamente lo que pagas.",
    reason3Title: "Hecho para doblaje de v\u00eddeo",
    reason3Body: "DubSync est\u00e1 construido espec\u00edficamente para doblaje de v\u00eddeo con lip sync. No es una plataforma de avatares, ni una herramienta de audio, ni una suite de localizaci\u00f3n empresarial. Cada funci\u00f3n est\u00e1 dise\u00f1ada para creadores que doblan v\u00eddeos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "\u00bfPor qu\u00e9 DubSync es m\u00e1s barato que Rask AI para lip sync?", a: "Rask AI cobra $120/mes para acceder a lip sync y duplica el consumo de cr\u00e9ditos. DubSync incluye lip sync desde $19.99/mes, sin multiplicadores ni recargos." },
      { q: "\u00bfC\u00f3mo se compara DubSync con HeyGen para doblaje de v\u00eddeo?", a: "HeyGen es principalmente una plataforma de avatares IA. El lip sync comparte Cr\u00e9ditos Premium con otras funciones. DubSync est\u00e1 construido espec\u00edficamente para doblaje: cada cr\u00e9dito es un minuto completo de salida con lip sync." },
      { q: "\u00bfDubSync incluye lip sync en todos los planes?", a: "S\u00ed. Todos los planes de pago + el plan gratuito incluyen lip sync." },
      { q: "\u00bfQu\u00e9 significa 1 cr\u00e9dito en DubSync?", a: "1 cr\u00e9dito = 1 minuto de v\u00eddeo doblado en 1 idioma, siempre con lip sync incluido." },
      { q: "\u00bfPuedo probar DubSync antes de pagar?", a: "S\u00ed. El plan gratuito incluye 1 v\u00eddeo de hasta 15 segundos con lip sync y clonaci\u00f3n de voz. Sin tarjeta de cr\u00e9dito." },
    ],
    ctaTitle: "\u00bfListo para doblar con lip sync real?",
    ctaSubtitle: "Empieza a doblar tus v\u00eddeos gratis. Sin tarjeta de cr\u00e9dito.",
    viewPricing: "Ver Precios",
    seeAlso: "Ver tambi\u00e9n:",
    blogLinkText: "Comparaci\u00f3n de Precios de Doblaje IA 2026",
  },
  zh: {
    meta: {
      title: "AI口型同步配音对比 \u2014 DubSync vs Rask AI vs HeyGen (2026)",
      description: "比较AI配音工具中每美元的真实口型同步分钟数。DubSync：20分钟起$19.99。Rask AI：需$120/月。揭示隐藏成本。",
      ogTitle: "2026 AI配音对比 \u2014 谁给你最多口型同步？",
      ogDescription: "DubSync每个积分都含口型同步。Rask AI收$120/月。HeyGen共享积分。看真实数据。",
      twitterTitle: "2026 AI配音对比 \u2014 口型同步定价",
      twitterDescription: "20分钟口型同步起$19.99/月。看DubSync与Rask AI、HeyGen、GeckoDub和ElevenLabs的对比。",
    },
    badge: "2026年4月更新",
    h1: "AI口型同步配音 \u2014",
    h1Gradient: "谁给你最多？",
    subtitle: "不看标题价格 \u2014 看每美元的真实口型同步分钟数。",
    section1Title: "~$20/月你真正得到什么",
    table1Caption: "约$20/月各AI配音平台口型同步对比",
    featureCol: "功能",
    lipSyncMinRow: "~$20/月的口型同步分钟数",
    lipSyncEveryCredit: "每个积分含口型同步",
    hiddenSurcharges: "隐藏的口型同步附加费",
    priceForLipSync: "口型同步访问价格",
    freePlanLipSync: "含口型同步的免费方案",
    cellAlways: "始终包含",
    cellSeparatePool: "独立池",
    cellCostsCredits: "消耗积分",
    cellDoublesUsage: "双倍消耗",
    cellLimitedPool: "有限池",
    cellSharedPool: "共享池",
    cellNone: "无",
    cellShared: "共享*",
    otherFeatures: "其他功能",
    table2Caption: "AI配音平台其他功能对比",
    languages: "语言",
    voiceCloning: "语音克隆",
    apiAccess: "API访问",
    maxResolution: "最大分辨率",
    productFocus: "产品定位",
    focusDubbing: "视频配音",
    focusAvatars: "AI数字人",
    focusLocalization: "本地化",
    focusAudio: "音频/TTS",
    paidPlans: "付费方案",
    section3Title: "真实成本：10分钟视频配音3种语言",
    section3Subtitle: "即30分钟含口型同步的视频。各平台收费如下。",
    plan: "方案",
    planNeeded: "所需方案",
    creditsNeeded: "所需积分",
    creditsAvailable: "可用积分",
    result: "结果",
    dubsyncResult: "完成。剩余20积分。",
    raskResult: "完成，一个视频用掉60%的方案额度。",
    heygenResult: "完成，仅剩50积分用于数字人。",
    geckoLipSyncAvail: "可用口型同步分钟",
    geckoLipSyncNeeded: "所需口型同步分钟",
    geckoResult: "不足。需要Scale方案 \u20ac71/月。",
    section4Title: "真实成本藏在哪里",
    raskCostTitle: "Rask AI：口型同步双倍消耗积分",
    raskCostBody: "Rask AI Creator Pro每月$120，含100分钟配音。但启用口型同步后，每分钟消耗2个积分而非1个。实际口型同步容量：约50分钟，而非100分钟。10分钟视频配3种语言 = 60个口型同步积分 = 超过方案的一半。",
    heygenCostTitle: "HeyGen：共享积分池",
    heygenCostBody: "HeyGen Creator每月200高级积分。含口型同步的翻译每分钟5积分。但同样的积分要与Avatar IV（20积分/分钟）、视频生成等AI功能共享。使用5分钟Avatar IV = 少100积分。仅剩100 = 20分钟含口型同步的翻译。",
    geckoCostTitle: "GeckoDub：口型同步独立池",
    geckoCostBody: "GeckoDub Starter含20分钟视频翻译。但仅7分钟可含口型同步。其余13分钟仅音频配音。Creator Pro \u20ac23/月将口型同步提升至15分钟，仍少于DubSync $19.99的20分钟。",
    elevenCostTitle: "ElevenLabs：无口型同步",
    elevenCostBody: "ElevenLabs是优秀的音频平台。但仅生成音频，无视频或口型同步。您需要搭配其他口型同步工具并自建工作流。适合开发者，不适合创作者。",
    oneCredit: "DubSync：1积分 = 1分钟含口型同步。始终如此。无例外。",
    startFree: "免费开始配音",
    section5Title: "创作者为什么选择DubSync",
    reason1Title: "所有方案均含口型同步",
    reason1Body: "不像Rask AI和GeckoDub额外收取口型同步费用，或ElevenLabs不提供口型同步，DubSync在所有方案中都包含口型同步，包括免费方案。",
    reason2Title: "无积分陷阱或倍率",
    reason2Body: "1积分 = 1分钟含口型同步的配音视频。无x2倍率，无共享池，无独立桶。您始终清楚自己付了什么。",
    reason3Title: "专为视频配音打造",
    reason3Body: "DubSync专门为含口型同步的视频配音而构建。不是数字人平台，不是音频工具，不是企业本地化套件。每个功能都为配音视频的创作者设计。",
    faqTitle: "常见问题",
    faqs: [
      { q: "为什么DubSync的口型同步比Rask AI便宜？", a: "Rask AI每月收$120才能使用口型同步，且双倍消耗积分。DubSync从$19.99/月起即含口型同步，无倍率或附加费。" },
      { q: "DubSync与HeyGen在视频配音方面如何比较？", a: "HeyGen主要是AI数字人平台。口型同步与其他功能共享高级积分。DubSync专为配音构建：每个积分就是一分钟完整的含口型同步输出。" },
      { q: "DubSync所有方案都含口型同步吗？", a: "是的。所有付费方案和免费方案均含口型同步。" },
      { q: "DubSync中1个积分是什么意思？", a: "1积分 = 1分钟配音视频1种语言，始终含口型同步。" },
      { q: "付费前可以试用DubSync吗？", a: "可以。免费方案含1个最长15秒的视频，含口型同步和语音克隆。无需信用卡。" },
    ],
    ctaTitle: "准备好用真正的口型同步配音了吗？",
    ctaSubtitle: "免费开始配音您的视频。无需信用卡。",
    viewPricing: "查看价格",
    seeAlso: "另请参阅：",
    blogLinkText: "2026 AI配音价格对比",
  },};

const SUPPORTED_LANGS: SupportedLang[] = [
  "es", "pt", "de", "fr", "ja",
  "hi", "ar", "id", "tr", "ko", "zh",
];

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang as SupportedLang)) return {};

  const t = translations[lang as SupportedLang];
  const langAlternates: Record<string, string> = {
    en: "https://dubsync.app/compare",
    "x-default": "https://dubsync.app/compare",
  };
  for (const l of SUPPORTED_LANGS) {
    langAlternates[l] = `https://dubsync.app/${l}/compare`;
  }

  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/compare`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url: `https://dubsync.app/${lang}/compare`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.twitterTitle,
      description: t.meta.twitterDescription,
    },
  };
}

function CellPositive({ children }: { children: React.ReactNode }) {
  return <span className="text-green-400 font-medium">{children}</span>;
}

function CellNegative({ children }: { children: React.ReactNode }) {
  return <span className="text-red-400/80 font-medium">{children}</span>;
}

function CellMixed({ children }: { children: React.ReactNode }) {
  return <span className="text-yellow-400 font-medium">{children}</span>;
}

function HiddenCostCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-slate-800/40 overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4" />
      </summary>
      <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
        {children}
      </div>
    </details>
  );
}

export default async function LocalizedComparePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang as SupportedLang)) notFound();

  const t = translations[lang as SupportedLang];

  return (
    <>
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 text-center mb-20">
          <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400 mb-6">
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t.h1}{" "}
            <span className="gradient-text">{t.h1Gradient}</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </section>

        {/* Section 1: What you actually get for ~$20/month */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t.section1Title}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">{t.table1Caption}</caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-400 font-medium">
                    {t.featureCol}
                  </th>
                  <th scope="col" className="p-4 text-pink-400 font-medium bg-pink-500/10">
                    DubSync
                  </th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">
                    <Link href="/vs/geckodub" className="hover:text-pink-400 transition-colors">
                      GeckoDub
                    </Link>
                  </th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">
                    <Link href="/vs/heygen" className="hover:text-pink-400 transition-colors">
                      HeyGen
                    </Link>
                  </th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">
                    <Link href="/vs/rask-ai" className="hover:text-pink-400 transition-colors">
                      Rask AI
                    </Link>
                  </th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">
                    <Link href="/vs/elevenlabs" className="hover:text-pink-400 transition-colors">
                      ElevenLabs
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 text-slate-300 font-medium">
                    {t.lipSyncMinRow}
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>20 min</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>7 min</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>{t.cellShared}</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 text-slate-300 font-medium">
                    {t.lipSyncEveryCredit}
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>{t.cellAlways}</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>{t.cellSeparatePool}</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>{t.cellCostsCredits}</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>2x</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 text-slate-300 font-medium">
                    {t.hiddenSurcharges}
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>{t.cellNone}</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>{t.cellLimitedPool}</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>{t.cellSharedPool}</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>{t.cellDoublesUsage}</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 text-slate-300 font-medium">
                    {t.priceForLipSync}
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>$19.99/mo</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>&euro;12/mo</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>$29/mo</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>$120/mo</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 text-slate-300 font-medium">
                    {t.freePlanLipSync}
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>
                      <Check className="h-4 w-4 mx-auto" aria-label="Yes" />
                    </CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Other features */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h3 className="text-lg font-semibold text-slate-400 text-center mb-6">
            {t.otherFeatures}
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">{t.table2Caption}</caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-500 font-medium">
                    {t.featureCol}
                  </th>
                  <th scope="col" className="p-4 text-pink-400/70 font-medium bg-pink-500/5">
                    DubSync
                  </th>
                  <th scope="col" className="p-4 text-slate-500 font-medium">GeckoDub</th>
                  <th scope="col" className="p-4 text-slate-500 font-medium">HeyGen</th>
                  <th scope="col" className="p-4 text-slate-500 font-medium">Rask AI</th>
                  <th scope="col" className="p-4 text-slate-500 font-medium">ElevenLabs</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 font-medium">{t.languages}</th>
                  <td className="p-4 text-center bg-pink-500/5">30+</td>
                  <td className="p-4 text-center">30+</td>
                  <td className="p-4 text-center">175+</td>
                  <td className="p-4 text-center">130+</td>
                  <td className="p-4 text-center">29+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 font-medium">{t.voiceCloning}</th>
                  <td className="p-4 text-center bg-pink-500/5">
                    <Check className="h-4 w-4 text-green-400/70 mx-auto" aria-label="All plans" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-4 w-4 text-green-400/70 mx-auto" aria-label="All plans" />
                  </td>
                  <td className="p-4 text-center text-xs">{t.paidPlans}</td>
                  <td className="p-4 text-center text-xs">Creator+</td>
                  <td className="p-4 text-center text-xs">Starter+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 font-medium">{t.apiAccess}</th>
                  <td className="p-4 text-center bg-pink-500/5 text-xs">Pro $49.99</td>
                  <td className="p-4 text-center text-xs">?</td>
                  <td className="p-4 text-center text-xs">from $5</td>
                  <td className="p-4 text-center text-xs">Enterprise</td>
                  <td className="p-4 text-center text-xs">from $5</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 font-medium">{t.maxResolution}</th>
                  <td className="p-4 text-center bg-pink-500/5">4K</td>
                  <td className="p-4 text-center">?</td>
                  <td className="p-4 text-center">4K</td>
                  <td className="p-4 text-center">4K</td>
                  <td className="p-4 text-center text-xs">N/A ({t.focusAudio.toLowerCase().split("/")[0]})</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="text-left p-4 font-medium">{t.productFocus}</th>
                  <td className="p-4 text-center bg-pink-500/5 text-xs">{t.focusDubbing}</td>
                  <td className="p-4 text-center text-xs">{t.focusDubbing}</td>
                  <td className="p-4 text-center text-xs">{t.focusAvatars}</td>
                  <td className="p-4 text-center text-xs">{t.focusLocalization}</td>
                  <td className="p-4 text-center text-xs">{t.focusAudio}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Real cost scenario */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-3">
            {t.section3Title}
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            {t.section3Subtitle}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* DubSync card */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-pink-500 via-violet-500 to-blue-500">
              <div className="rounded-[15px] bg-slate-900 p-6 h-full">
                <h3 className="text-lg font-bold text-pink-400 mb-4">DubSync</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t.plan}</dt>
                    <dd className="text-white font-medium">Pro $49.99/mo</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t.creditsNeeded}</dt>
                    <dd className="text-white">30</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t.creditsAvailable}</dt>
                    <dd className="text-white">50</dd>
                  </div>
                  <div className="flex justify-between items-start pt-2 border-t border-white/10">
                    <dt className="text-slate-400">{t.result}</dt>
                    <dd className="text-green-400 text-right">
                      <Check className="h-4 w-4 inline mr-1" />
                      {t.dubsyncResult}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-lg font-bold text-white">$49.99</p>
              </div>
            </div>

            {/* Rask AI card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Rask AI</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.planNeeded}</dt>
                  <dd className="text-white font-medium">Creator Pro $120/mo</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.creditsNeeded}</dt>
                  <dd className="text-white">
                    60{" "}
                    <span className="text-red-400/60 text-xs">(30 min x 2x)</span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.creditsAvailable}</dt>
                  <dd className="text-white">100</dd>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-white/10">
                  <dt className="text-slate-400">{t.result}</dt>
                  <dd className="text-yellow-400 text-right text-xs">
                    {t.raskResult}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-bold text-white">$120</p>
            </div>

            {/* HeyGen card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">HeyGen</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.plan}</dt>
                  <dd className="text-white font-medium">Creator $29/mo</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.creditsNeeded}</dt>
                  <dd className="text-white">
                    150{" "}
                    <span className="text-slate-500 text-xs">(30 min x 5 cr/min)</span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.creditsAvailable}</dt>
                  <dd className="text-white">200 (shared)</dd>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-white/10">
                  <dt className="text-slate-400">{t.result}</dt>
                  <dd className="text-yellow-400 text-right text-xs">
                    {t.heygenResult}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-bold text-white">$29</p>
            </div>

            {/* GeckoDub card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">GeckoDub</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.planNeeded}</dt>
                  <dd className="text-white font-medium">Creator Pro &euro;23/mo</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.geckoLipSyncAvail}</dt>
                  <dd className="text-white">15</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.geckoLipSyncNeeded}</dt>
                  <dd className="text-white">30</dd>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-white/10">
                  <dt className="text-slate-400">{t.result}</dt>
                  <dd className="text-red-400 text-right text-xs">
                    <X className="h-3 w-3 inline mr-1" />
                    {t.geckoResult}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-bold text-white">&euro;71</p>
            </div>
          </div>
        </section>

        {/* Section 4: Where the real costs hide */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t.section4Title}
          </h2>
          <div className="space-y-4">
            <HiddenCostCard title={t.raskCostTitle}>
              <p>{t.raskCostBody}</p>
            </HiddenCostCard>
            <HiddenCostCard title={t.heygenCostTitle}>
              <p>{t.heygenCostBody}</p>
            </HiddenCostCard>
            <HiddenCostCard title={t.geckoCostTitle}>
              <p>{t.geckoCostBody}</p>
            </HiddenCostCard>
            <HiddenCostCard title={t.elevenCostTitle}>
              <p>{t.elevenCostBody}</p>
            </HiddenCostCard>
          </div>
          <div className="mt-10 text-center">
            <p className="text-lg font-semibold text-white mb-4">
              {t.oneCredit}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
            >
              {t.startFree}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Section 5: Why creators choose DubSync */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t.section5Title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {t.reason1Title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t.reason1Body}
              </p>
            </div>
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {t.reason2Title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t.reason2Body}
              </p>
            </div>
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {t.reason3Title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t.reason3Body}
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t.faqTitle}
          </h2>
          <div className="space-y-4">
            {t.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-semibold text-white">{faq.q}</h3>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl font-bold text-white">
              {t.ctaTitle}
            </h2>
            <p className="mt-3 text-slate-400">
              {t.ctaSubtitle}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
              >
                {t.startFree}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${lang}/#pricing`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                {t.viewPricing}
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {t.seeAlso}{" "}
              <Link
                href="/blog/ai-dubbing-pricing-comparison-2026"
                className="text-pink-400/70 hover:text-pink-400 transition-colors"
              >
                {t.blogLinkText}
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: LOCALE_INFO[lang as SupportedLang]?.nativeName ?? lang, url: `https://dubsync.app/${lang}/` },
          { name: t.meta.title.split(" \u2014 ")[0], url: `https://dubsync.app/${lang}/compare` },
        ]}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </>
  );
}
