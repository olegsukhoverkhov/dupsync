/**
 * Email service using Resend. Sends transactional emails with
 * localized templates based on user's locale.
 *
 * Emails:
 *   - confirmSignup: email verification after registration
 *   - welcomeEmail: after first login (separate from support ticket)
 *   - dubComplete: when a dubbing job finishes
 *   - creditsLow: when credits drop below 20%
 */
import { Resend } from "resend";

const FROM = "DubSync <noreply@dubsync.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dubsync.app";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

// ─── Localized strings ──────────────────────────────────────

type EmailStrings = {
  // Confirm signup
  confirmSubject: string;
  confirmHeading: string;
  confirmBody: string;
  confirmButton: string;
  // Dub complete
  dubSubject: string;
  dubHeading: string;
  dubBody: string;
  dubButton: string;
  // Credits low
  creditsSubject: string;
  creditsHeading: string;
  creditsBody: string;
  creditsButton: string;
  // Common
  footer: string;
};

const STRINGS: Record<string, EmailStrings> = {
  en: {
    confirmSubject: "Confirm your DubSync account",
    confirmHeading: "Verify your email",
    confirmBody: "Click the button below to confirm your email address and activate your DubSync account.",
    confirmButton: "Confirm Email",
    dubSubject: "Your dubbed video is ready! 🎬",
    dubHeading: "Your video is ready",
    dubBody: "Your video has been dubbed and is ready to download. Click below to view the result.",
    dubButton: "View Project",
    creditsSubject: "Your DubSync credits are running low",
    creditsHeading: "Credits running low",
    creditsBody: "You're running low on dubbing credits. Top up or upgrade your plan to keep dubbing without interruption.",
    creditsButton: "Get More Credits",
    footer: "DubSync — AI Video Dubbing",
  },
  es: {
    confirmSubject: "Confirma tu cuenta de DubSync",
    confirmHeading: "Verifica tu correo",
    confirmBody: "Haz clic en el botón para confirmar tu correo electrónico y activar tu cuenta de DubSync.",
    confirmButton: "Confirmar correo",
    dubSubject: "¡Tu video doblado está listo! 🎬",
    dubHeading: "Tu video está listo",
    dubBody: "Tu video ha sido doblado y está listo para descargar. Haz clic para ver el resultado.",
    dubButton: "Ver proyecto",
    creditsSubject: "Tus créditos de DubSync se están agotando",
    creditsHeading: "Créditos bajos",
    creditsBody: "Te quedan pocos créditos de doblaje. Recarga o mejora tu plan para seguir doblando sin interrupciones.",
    creditsButton: "Obtener más créditos",
    footer: "DubSync — Doblaje de Video con IA",
  },
  fr: {
    confirmSubject: "Confirmez votre compte DubSync",
    confirmHeading: "Vérifiez votre email",
    confirmBody: "Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte DubSync.",
    confirmButton: "Confirmer l'email",
    dubSubject: "Votre vidéo doublée est prête ! 🎬",
    dubHeading: "Votre vidéo est prête",
    dubBody: "Votre vidéo a été doublée et est prête à être téléchargée. Cliquez ci-dessous pour voir le résultat.",
    dubButton: "Voir le projet",
    creditsSubject: "Vos crédits DubSync sont bientôt épuisés",
    creditsHeading: "Crédits bientôt épuisés",
    creditsBody: "Il vous reste peu de crédits de doublage. Rechargez ou améliorez votre plan pour continuer sans interruption.",
    creditsButton: "Obtenir plus de crédits",
    footer: "DubSync — Doublage Vidéo par IA",
  },
  de: {
    confirmSubject: "Bestätige dein DubSync-Konto",
    confirmHeading: "E-Mail bestätigen",
    confirmBody: "Klicke auf den Button, um deine E-Mail-Adresse zu bestätigen und dein DubSync-Konto zu aktivieren.",
    confirmButton: "E-Mail bestätigen",
    dubSubject: "Dein synchronisiertes Video ist fertig! 🎬",
    dubHeading: "Dein Video ist fertig",
    dubBody: "Dein Video wurde synchronisiert und ist zum Download bereit. Klicke unten, um das Ergebnis zu sehen.",
    dubButton: "Projekt ansehen",
    creditsSubject: "Deine DubSync-Credits werden knapp",
    creditsHeading: "Credits werden knapp",
    creditsBody: "Du hast nur noch wenige Synchronisations-Credits. Lade nach oder upgrade deinen Plan.",
    creditsButton: "Mehr Credits holen",
    footer: "DubSync — KI-Video-Synchronisation",
  },
  pt: {
    confirmSubject: "Confirme sua conta DubSync",
    confirmHeading: "Verifique seu email",
    confirmBody: "Clique no botão abaixo para confirmar seu endereço de email e ativar sua conta DubSync.",
    confirmButton: "Confirmar email",
    dubSubject: "Seu vídeo dublado está pronto! 🎬",
    dubHeading: "Seu vídeo está pronto",
    dubBody: "Seu vídeo foi dublado e está pronto para download. Clique abaixo para ver o resultado.",
    dubButton: "Ver projeto",
    creditsSubject: "Seus créditos DubSync estão acabando",
    creditsHeading: "Créditos baixos",
    creditsBody: "Você está ficando sem créditos de dublagem. Recarregue ou faça upgrade do seu plano.",
    creditsButton: "Obter mais créditos",
    footer: "DubSync — Dublagem de Vídeo com IA",
  },
  ja: {
    confirmSubject: "DubSyncアカウントを確認してください",
    confirmHeading: "メールを確認",
    confirmBody: "下のボタンをクリックしてメールアドレスを確認し、DubSyncアカウントを有効にしてください。",
    confirmButton: "メールを確認",
    dubSubject: "吹き替えビデオの準備ができました！🎬",
    dubHeading: "ビデオの準備完了",
    dubBody: "ビデオの吹き替えが完了し、ダウンロード可能です。下のボタンをクリックして結果をご覧ください。",
    dubButton: "プロジェクトを見る",
    creditsSubject: "DubSyncのクレジットが残り少なくなっています",
    creditsHeading: "クレジット残少",
    creditsBody: "吹き替えクレジットが残り少なくなっています。チャージまたはプランをアップグレードしてください。",
    creditsButton: "クレジットを追加",
    footer: "DubSync — AI動画吹き替え",
  },
  ko: {
    confirmSubject: "DubSync 계정을 확인하세요",
    confirmHeading: "이메일 확인",
    confirmBody: "아래 버튼을 클릭하여 이메일 주소를 확인하고 DubSync 계정을 활성화하세요.",
    confirmButton: "이메일 확인",
    dubSubject: "더빙된 비디오가 준비되었습니다! 🎬",
    dubHeading: "비디오 준비 완료",
    dubBody: "비디오 더빙이 완료되어 다운로드할 수 있습니다. 아래를 클릭하여 결과를 확인하세요.",
    dubButton: "프로젝트 보기",
    creditsSubject: "DubSync 크레딧이 부족합니다",
    creditsHeading: "크레딧 부족",
    creditsBody: "더빙 크레딧이 부족합니다. 충전하거나 플랜을 업그레이드하세요.",
    creditsButton: "크레딧 추가",
    footer: "DubSync — AI 비디오 더빙",
  },
  ar: {
    confirmSubject: "أكّد حساب DubSync الخاص بك",
    confirmHeading: "تحقق من بريدك الإلكتروني",
    confirmBody: "انقر على الزر أدناه لتأكيد عنوان بريدك الإلكتروني وتفعيل حساب DubSync.",
    confirmButton: "تأكيد البريد",
    dubSubject: "فيديو الدبلجة جاهز! 🎬",
    dubHeading: "الفيديو جاهز",
    dubBody: "تم دبلجة الفيديو وهو جاهز للتنزيل. انقر أدناه لعرض النتيجة.",
    dubButton: "عرض المشروع",
    creditsSubject: "رصيد DubSync الخاص بك ينفد",
    creditsHeading: "الرصيد منخفض",
    creditsBody: "رصيد الدبلجة لديك ينفد. اشحن أو قم بترقية خطتك.",
    creditsButton: "الحصول على المزيد",
    footer: "DubSync — دبلجة فيديو بالذكاء الاصطناعي",
  },
  hi: {
    confirmSubject: "अपना DubSync अकाउंट कन्फ़र्म करें",
    confirmHeading: "ईमेल सत्यापित करें",
    confirmBody: "अपना ईमेल पता कन्फ़र्म करने और DubSync अकाउंट एक्टिवेट करने के लिए नीचे बटन पर क्लिक करें।",
    confirmButton: "ईमेल कन्फ़र्म करें",
    dubSubject: "आपका डब किया गया वीडियो तैयार है! 🎬",
    dubHeading: "वीडियो तैयार है",
    dubBody: "आपके वीडियो की डबिंग पूरी हो गई है और डाउनलोड के लिए तैयार है।",
    dubButton: "प्रोजेक्ट देखें",
    creditsSubject: "आपके DubSync क्रेडिट कम हो रहे हैं",
    creditsHeading: "क्रेडिट कम हैं",
    creditsBody: "आपके डबिंग क्रेडिट कम हो रहे हैं। रिचार्ज करें या अपना प्लान अपग्रेड करें।",
    creditsButton: "और क्रेडिट पाएं",
    footer: "DubSync — AI वीडियो डबिंग",
  },
  id: {
    confirmSubject: "Konfirmasi akun DubSync Anda",
    confirmHeading: "Verifikasi email",
    confirmBody: "Klik tombol di bawah untuk mengonfirmasi alamat email Anda dan mengaktifkan akun DubSync.",
    confirmButton: "Konfirmasi Email",
    dubSubject: "Video dubbing Anda siap! 🎬",
    dubHeading: "Video Anda siap",
    dubBody: "Video Anda telah didubbing dan siap diunduh. Klik di bawah untuk melihat hasilnya.",
    dubButton: "Lihat Proyek",
    creditsSubject: "Kredit DubSync Anda hampir habis",
    creditsHeading: "Kredit hampir habis",
    creditsBody: "Kredit dubbing Anda hampir habis. Isi ulang atau upgrade paket Anda.",
    creditsButton: "Dapatkan Lebih Banyak",
    footer: "DubSync — Dubbing Video AI",
  },
  tr: {
    confirmSubject: "DubSync hesabınızı onaylayın",
    confirmHeading: "E-postanızı doğrulayın",
    confirmBody: "E-posta adresinizi onaylamak ve DubSync hesabınızı etkinleştirmek için aşağıdaki düğmeye tıklayın.",
    confirmButton: "E-postayı Onayla",
    dubSubject: "Dublajlı videonuz hazır! 🎬",
    dubHeading: "Videonuz hazır",
    dubBody: "Videonuz dublajlandı ve indirmeye hazır. Sonucu görmek için aşağıya tıklayın.",
    dubButton: "Projeyi Gör",
    creditsSubject: "DubSync kredileriniz azalıyor",
    creditsHeading: "Krediler azalıyor",
    creditsBody: "Dublaj kredileriniz azalıyor. Yükleyin veya planınızı yükseltin.",
    creditsButton: "Daha Fazla Kredi Al",
    footer: "DubSync — Yapay Zeka Video Dublaj",
  },
};

function getStrings(locale: string | null): EmailStrings {
  return STRINGS[locale || "en"] || STRINGS.en;
}

// ─── HTML template ──────────────────────────────────────────

function emailTemplate(opts: {
  heading: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
  footer: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden">
<tr><td style="padding:32px 32px 0;text-align:center">
<div style="display:inline-block;width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#ec4899,#3b82f6)"></div>
<div style="margin-top:8px;font-size:18px;font-weight:700;color:#fff">DubSync</div>
</td></tr>
<tr><td style="padding:24px 32px">
<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;text-align:center">${opts.heading}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;text-align:center">${opts.body}</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<a href="${opts.buttonUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600">${opts.buttonText}</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
<p style="margin:0;font-size:11px;color:#475569">${opts.footer}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Email senders ──────────────────────────────────────────

/**
 * Send "dub complete" notification.
 */
async function logEmailSent(type: string, recipient: string) {
  try {
    const { createServiceClient } = await import("./supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("email_log").insert({ email_type: type, recipient });
  } catch {}
}

export async function sendDubCompleteEmail(opts: {
  to: string;
  projectId: string;
  projectTitle: string;
  locale: string | null;
}): Promise<void> {
  try {
    const t = getStrings(opts.locale);
    const resend = getResend();
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: t.dubSubject,
      html: emailTemplate({
        heading: t.dubHeading,
        body: `${t.dubBody}<br><br><strong style="color:#fff">${opts.projectTitle}</strong>`,
        buttonText: t.dubButton,
        buttonUrl: `${APP_URL}/projects/${opts.projectId}`,
        footer: t.footer,
      }),
    });
    await logEmailSent("dub_complete", opts.to);
  } catch (err) {
    console.error("[EMAIL] dub complete failed:", err);
  }
}

/**
 * Send "credits low" warning.
 */
export async function sendCreditsLowEmail(opts: {
  to: string;
  creditsRemaining: number;
  locale: string | null;
}): Promise<void> {
  try {
    const t = getStrings(opts.locale);
    const resend = getResend();
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: t.creditsSubject,
      html: emailTemplate({
        heading: t.creditsHeading,
        body: `${t.creditsBody}<br><br><span style="color:#ec4899;font-size:24px;font-weight:700">${opts.creditsRemaining}</span> <span style="color:#64748b">credits remaining</span>`,
        buttonText: t.creditsButton,
        buttonUrl: `${APP_URL}/credits`,
        footer: t.footer,
      }),
    });
    await logEmailSent("credits_low", opts.to);
  } catch (err) {
    console.error("[EMAIL] credits low failed:", err);
  }
}

/**
 * Send custom email (for admin use).
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const resend = getResend();
  await resend.emails.send({ from: FROM, ...opts });
}
