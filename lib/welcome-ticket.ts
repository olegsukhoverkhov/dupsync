import { createServiceClient } from "./supabase/server";

const WELCOME_MESSAGES: Record<string, { subject: string; message: string }> = {
  en: {
    subject: "Welcome to DubSync! 🎬",
    message: `Hey! Thanks for signing up for DubSync.

I'm here to help you get started. A few tips:

• Your first video dub is free — just upload a video and pick a language
• We auto-detect the speaker's language, so no setup needed
• Check out the demo project on your dashboard to see a sample result

If you have any questions or need help, just reply here — I'll get back to you quickly.

Happy dubbing!`,
  },
  es: {
    subject: "¡Bienvenido a DubSync! 🎬",
    message: `¡Hola! Gracias por registrarte en DubSync.

Estoy aquí para ayudarte a comenzar. Algunos consejos:

• Tu primer doblaje de video es gratis — solo sube un video y elige un idioma
• Detectamos automáticamente el idioma del hablante, no necesitas configurar nada
• Revisa el proyecto demo en tu panel para ver un resultado de ejemplo

Si tienes alguna pregunta o necesitas ayuda, solo responde aquí — te responderé rápidamente.

¡Feliz doblaje!`,
  },
  fr: {
    subject: "Bienvenue sur DubSync ! 🎬",
    message: `Salut ! Merci de vous être inscrit sur DubSync.

Je suis là pour vous aider à démarrer. Quelques conseils :

• Votre premier doublage vidéo est gratuit — téléchargez une vidéo et choisissez une langue
• Nous détectons automatiquement la langue du locuteur, aucune configuration nécessaire
• Consultez le projet démo sur votre tableau de bord pour voir un exemple

Si vous avez des questions ou besoin d'aide, répondez simplement ici — je vous répondrai rapidement.

Bon doublage !`,
  },
  de: {
    subject: "Willkommen bei DubSync! 🎬",
    message: `Hey! Danke für deine Anmeldung bei DubSync.

Ich bin hier, um dir den Einstieg zu erleichtern. Ein paar Tipps:

• Deine erste Video-Synchronisation ist kostenlos — lade einfach ein Video hoch und wähle eine Sprache
• Wir erkennen die Sprache des Sprechers automatisch, keine Einrichtung nötig
• Schau dir das Demo-Projekt auf deinem Dashboard an, um ein Beispiel zu sehen

Bei Fragen oder wenn du Hilfe brauchst, antworte einfach hier — ich melde mich schnell zurück.

Viel Spaß beim Synchronisieren!`,
  },
  pt: {
    subject: "Bem-vindo ao DubSync! 🎬",
    message: `Oi! Obrigado por se cadastrar no DubSync.

Estou aqui para te ajudar a começar. Algumas dicas:

• Sua primeira dublagem de vídeo é gratuita — basta enviar um vídeo e escolher um idioma
• Detectamos automaticamente o idioma do falante, sem necessidade de configuração
• Confira o projeto demo no seu painel para ver um resultado de exemplo

Se tiver alguma dúvida ou precisar de ajuda, basta responder aqui — responderei rapidamente.

Boas dublagens!`,
  },
  ja: {
    subject: "DubSyncへようこそ！🎬",
    message: `こんにちは！DubSyncにご登録いただきありがとうございます。

始め方をお手伝いします。いくつかのヒント：

• 最初のビデオ吹き替えは無料です — ビデオをアップロードして言語を選ぶだけ
• 話者の言語は自動検出されるため、設定は不要です
• ダッシュボードのデモプロジェクトでサンプル結果をご覧ください

ご質問やサポートが必要な場合は、ここに返信してください — すぐにお返事します。

楽しい吹き替えを！`,
  },
  ko: {
    subject: "DubSync에 오신 것을 환영합니다! 🎬",
    message: `안녕하세요! DubSync에 가입해 주셔서 감사합니다.

시작하는 데 도움을 드리겠습니다. 몇 가지 팁:

• 첫 번째 비디오 더빙은 무료입니다 — 비디오를 업로드하고 언어를 선택하기만 하면 됩니다
• 화자의 언어를 자동으로 감지하므로 설정이 필요 없습니다
• 대시보드의 데모 프로젝트에서 샘플 결과를 확인하세요

질문이 있거나 도움이 필요하면 여기에 답장해 주세요 — 빠르게 답변드리겠습니다.

즐거운 더빙 되세요!`,
  },
  ar: {
    subject: "مرحباً بك في DubSync! 🎬",
    message: `مرحباً! شكراً لتسجيلك في DubSync.

أنا هنا لمساعدتك في البدء. بعض النصائح:

• أول دبلجة فيديو مجانية — فقط ارفع فيديو واختر لغة
• نكتشف لغة المتحدث تلقائياً، لا حاجة لأي إعداد
• تحقق من المشروع التجريبي في لوحة التحكم لرؤية نتيجة نموذجية

إذا كانت لديك أي أسئلة أو تحتاج مساعدة، فقط رد هنا — سأرد عليك بسرعة.

دبلجة سعيدة!`,
  },
  hi: {
    subject: "DubSync में आपका स्वागत है! 🎬",
    message: `नमस्ते! DubSync के लिए साइन अप करने के लिए धन्यवाद।

मैं शुरू करने में आपकी मदद के लिए यहाँ हूँ। कुछ सुझाव:

• आपकी पहली वीडियो डबिंग मुफ्त है — बस एक वीडियो अपलोड करें और भाषा चुनें
• हम स्पीकर की भाषा स्वतः पहचान लेते हैं, कोई सेटअप नहीं चाहिए
• नमूना परिणाम देखने के लिए अपने डैशबोर्ड पर डेमो प्रोजेक्ट देखें

अगर कोई सवाल है या मदद चाहिए, तो बस यहाँ जवाब दें — मैं जल्दी से वापस आऊंगा।

हैप्पी डबिंग!`,
  },
  id: {
    subject: "Selamat datang di DubSync! 🎬",
    message: `Hai! Terima kasih telah mendaftar di DubSync.

Saya di sini untuk membantu Anda memulai. Beberapa tips:

• Dubbing video pertama Anda gratis — cukup unggah video dan pilih bahasa
• Kami mendeteksi bahasa pembicara secara otomatis, tidak perlu pengaturan
• Lihat proyek demo di dasbor Anda untuk melihat contoh hasil

Jika ada pertanyaan atau butuh bantuan, cukup balas di sini — saya akan segera membalas.

Selamat dubbing!`,
  },
  zh: {
    subject: "欢迎使用DubSync！🎬",
    message: `你好！感谢注册DubSync。

我来帮你快速上手。一些小贴士：

• 你的第一个视频配音完全免费——上传视频并选择语言即可
• 我们会自动检测说话者的语言，无需任何设置
• 查看控制面板中的演示项目以了解效果

如有任何问题或需要帮助，直接在这里回复即可——我会尽快回复你。

祝配音愉快！`,
  },
  tr: {
    subject: "DubSync'e hoş geldiniz! 🎬",
    message: `Merhaba! DubSync'e kaydolduğunuz için teşekkürler.

Başlamanıza yardımcı olmak için buradayım. Birkaç ipucu:

• İlk video dublajınız ücretsiz — sadece bir video yükleyin ve dil seçin
• Konuşmacının dilini otomatik algılarız, kurulum gerekmez
• Örnek sonucu görmek için panelinizdeki demo projeye göz atın

Sorularınız varsa veya yardıma ihtiyacınız olursa, buradan yanıtlayın — hızlıca döneceğim.

Mutlu dublajlar!`,
  },
};

/**
 * Create a welcome support ticket for a newly registered user.
 * Uses the user's locale for the message language.
 * Idempotent — checks if a welcome ticket already exists.
 */
export async function createWelcomeTicket(
  userId: string,
  locale: string | null
): Promise<void> {
  const supabase = await createServiceClient();

  // Check if welcome ticket already exists
  const { data: existing } = await supabase
    .from("support_tickets")
    .select("id")
    .eq("user_id", userId)
    .ilike("subject", "%Welcome%DubSync%")
    .limit(1)
    .single();

  if (existing) return;

  const lang = locale && WELCOME_MESSAGES[locale] ? locale : "en";
  const { subject, message } = WELCOME_MESSAGES[lang];

  // Create ticket owned by user, status waiting_user so they see the badge
  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: userId,
      subject,
      status: "waiting_user",
    })
    .select("id")
    .single();

  if (error || !ticket) {
    console.error("[WELCOME_TICKET] Failed to create:", error?.message);
    return;
  }

  // Find an admin to be the sender
  const { data: admin } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_admin", true)
    .limit(1)
    .single();

  await supabase.from("support_messages").insert({
    ticket_id: ticket.id,
    sender_id: admin?.id || userId,
    message,
    is_admin: true,
  });

  console.log(`[WELCOME_TICKET] Created for user ${userId.slice(0, 8)} (${lang})`);
}
