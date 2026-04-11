"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Languages, ArrowRight, Loader2, Mail, Lock, User, AlertCircle, MailOpen, Globe } from "lucide-react";
import { LOCALES, LOCALE_INFO } from "@/lib/i18n/dictionaries";

/** Small DOM helper to read a cookie value from document.cookie by name. */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

const AUTH_STRINGS: Record<string, Record<string, string>> = {
  en: {
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    signInSubtitle: "Sign in to continue dubbing videos",
    signUpSubtitle: "Start dubbing videos in 30+ languages",
    continueGoogle: "Continue with Google",
    orEmail: "or continue with email",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    namePlaceholder: "John Doe",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Your password",
    passwordPlaceholderNew: "Min. 6 characters",
    signIn: "Sign In",
    createAccountBtn: "Create Account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUpLink: "Sign up",
    signInLink: "Sign in",
    terms: "By continuing, you agree to DubSync's",
    termsLink: "Terms",
    and: "and",
    privacyLink: "Privacy Policy",
    checkEmail: "Check your email",
    sentLink: "We've sent a confirmation link to",
    clickLink: "Click the link in the email to activate your account and start dubbing videos.",
    goToSignIn: "Go to Sign In",
    differentEmail: "Use a different email",
    checkSpam: "Didn't receive the email? Check your spam folder.",
    authFailed: "Authentication failed. Please try again.",
    somethingWrong: "Something went wrong. Please try again.",
  },
  es: {
    welcomeBack: "Bienvenido de nuevo",
    createAccount: "Crea tu cuenta",
    signInSubtitle: "Inicia sesión para continuar doblando videos",
    signUpSubtitle: "Comienza a doblar videos en más de 30 idiomas",
    continueGoogle: "Continuar con Google",
    orEmail: "o continúa con email",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    password: "Contraseña",
    namePlaceholder: "Juan Pérez",
    emailPlaceholder: "tu@ejemplo.com",
    passwordPlaceholder: "Tu contraseña",
    passwordPlaceholderNew: "Mín. 6 caracteres",
    signIn: "Iniciar sesión",
    createAccountBtn: "Crear cuenta",
    noAccount: "¿No tienes cuenta?",
    hasAccount: "¿Ya tienes cuenta?",
    signUpLink: "Regístrate",
    signInLink: "Inicia sesión",
    terms: "Al continuar, aceptas los",
    termsLink: "Términos",
    and: "y la",
    privacyLink: "Política de privacidad",
    checkEmail: "Revisa tu correo",
    sentLink: "Hemos enviado un enlace de confirmación a",
    clickLink: "Haz clic en el enlace del correo para activar tu cuenta y comenzar a doblar videos.",
    goToSignIn: "Ir a iniciar sesión",
    differentEmail: "Usar otro correo",
    checkSpam: "¿No recibiste el correo? Revisa tu carpeta de spam.",
    authFailed: "Autenticación fallida. Inténtalo de nuevo.",
    somethingWrong: "Algo salió mal. Inténtalo de nuevo.",
  },
  fr: {
    welcomeBack: "Bon retour",
    createAccount: "Créez votre compte",
    signInSubtitle: "Connectez-vous pour continuer à doubler vos vidéos",
    signUpSubtitle: "Commencez à doubler des vidéos en 30+ langues",
    continueGoogle: "Continuer avec Google",
    orEmail: "ou continuez par email",
    fullName: "Nom complet",
    email: "Email",
    password: "Mot de passe",
    namePlaceholder: "Jean Dupont",
    emailPlaceholder: "vous@exemple.com",
    passwordPlaceholder: "Votre mot de passe",
    passwordPlaceholderNew: "Min. 6 caractères",
    signIn: "Se connecter",
    createAccountBtn: "Créer un compte",
    noAccount: "Pas encore de compte ?",
    hasAccount: "Déjà un compte ?",
    signUpLink: "S'inscrire",
    signInLink: "Se connecter",
    terms: "En continuant, vous acceptez les",
    termsLink: "Conditions",
    and: "et la",
    privacyLink: "Politique de confidentialité",
    checkEmail: "Vérifiez votre email",
    sentLink: "Nous avons envoyé un lien de confirmation à",
    clickLink: "Cliquez sur le lien dans l'email pour activer votre compte et commencer à doubler des vidéos.",
    goToSignIn: "Aller à la connexion",
    differentEmail: "Utiliser un autre email",
    checkSpam: "Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam.",
    authFailed: "Échec de l'authentification. Veuillez réessayer.",
    somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
  },
  de: {
    welcomeBack: "Willkommen zurück",
    createAccount: "Konto erstellen",
    signInSubtitle: "Melde dich an, um Videos weiter zu synchronisieren",
    signUpSubtitle: "Beginne Videos in 30+ Sprachen zu synchronisieren",
    continueGoogle: "Weiter mit Google",
    orEmail: "oder weiter mit E-Mail",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    password: "Passwort",
    namePlaceholder: "Max Mustermann",
    emailPlaceholder: "du@beispiel.de",
    passwordPlaceholder: "Dein Passwort",
    passwordPlaceholderNew: "Min. 6 Zeichen",
    signIn: "Anmelden",
    createAccountBtn: "Konto erstellen",
    noAccount: "Noch kein Konto?",
    hasAccount: "Schon ein Konto?",
    signUpLink: "Registrieren",
    signInLink: "Anmelden",
    terms: "Mit der Fortsetzung akzeptierst du die",
    termsLink: "AGB",
    and: "und die",
    privacyLink: "Datenschutzrichtlinie",
    checkEmail: "Prüfe deine E-Mail",
    sentLink: "Wir haben einen Bestätigungslink gesendet an",
    clickLink: "Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren und Videos zu synchronisieren.",
    goToSignIn: "Zur Anmeldung",
    differentEmail: "Andere E-Mail verwenden",
    checkSpam: "Keine E-Mail erhalten? Prüfe deinen Spam-Ordner.",
    authFailed: "Authentifizierung fehlgeschlagen. Bitte erneut versuchen.",
    somethingWrong: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  pt: {
    welcomeBack: "Bem-vindo de volta",
    createAccount: "Crie sua conta",
    signInSubtitle: "Entre para continuar dublando vídeos",
    signUpSubtitle: "Comece a dublar vídeos em mais de 30 idiomas",
    continueGoogle: "Continuar com Google",
    orEmail: "ou continue com email",
    fullName: "Nome completo",
    email: "Email",
    password: "Senha",
    namePlaceholder: "João Silva",
    emailPlaceholder: "voce@exemplo.com",
    passwordPlaceholder: "Sua senha",
    passwordPlaceholderNew: "Mín. 6 caracteres",
    signIn: "Entrar",
    createAccountBtn: "Criar conta",
    noAccount: "Não tem conta?",
    hasAccount: "Já tem conta?",
    signUpLink: "Cadastre-se",
    signInLink: "Entrar",
    terms: "Ao continuar, você concorda com os",
    termsLink: "Termos",
    and: "e a",
    privacyLink: "Política de Privacidade",
    checkEmail: "Verifique seu email",
    sentLink: "Enviamos um link de confirmação para",
    clickLink: "Clique no link do email para ativar sua conta e começar a dublar vídeos.",
    goToSignIn: "Ir para login",
    differentEmail: "Usar outro email",
    checkSpam: "Não recebeu o email? Verifique sua pasta de spam.",
    authFailed: "Falha na autenticação. Tente novamente.",
    somethingWrong: "Algo deu errado. Tente novamente.",
  },
  ja: {
    welcomeBack: "おかえりなさい",
    createAccount: "アカウントを作成",
    signInSubtitle: "ログインしてビデオの吹き替えを続けましょう",
    signUpSubtitle: "30以上の言語でビデオの吹き替えを始めましょう",
    continueGoogle: "Googleで続ける",
    orEmail: "またはメールで続ける",
    fullName: "氏名",
    email: "メール",
    password: "パスワード",
    namePlaceholder: "山田太郎",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "パスワード",
    passwordPlaceholderNew: "6文字以上",
    signIn: "ログイン",
    createAccountBtn: "アカウント作成",
    noAccount: "アカウントをお持ちでない方",
    hasAccount: "すでにアカウントをお持ちの方",
    signUpLink: "登録する",
    signInLink: "ログイン",
    terms: "続けることで、DubSyncの",
    termsLink: "利用規約",
    and: "と",
    privacyLink: "プライバシーポリシー",
    checkEmail: "メールを確認してください",
    sentLink: "確認リンクを送信しました：",
    clickLink: "メール内のリンクをクリックしてアカウントを有効にし、ビデオの吹き替えを始めましょう。",
    goToSignIn: "ログインへ",
    differentEmail: "別のメールを使用",
    checkSpam: "メールが届かない場合は、迷惑メールフォルダをご確認ください。",
    authFailed: "認証に失敗しました。もう一度お試しください。",
    somethingWrong: "エラーが発生しました。もう一度お試しください。",
  },
  ko: {
    welcomeBack: "다시 오신 것을 환영합니다",
    createAccount: "계정 만들기",
    signInSubtitle: "로그인하여 비디오 더빙을 계속하세요",
    signUpSubtitle: "30개 이상의 언어로 비디오 더빙을 시작하세요",
    continueGoogle: "Google로 계속",
    orEmail: "또는 이메일로 계속",
    fullName: "이름",
    email: "이메일",
    password: "비밀번호",
    namePlaceholder: "홍길동",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "비밀번호",
    passwordPlaceholderNew: "최소 6자",
    signIn: "로그인",
    createAccountBtn: "계정 만들기",
    noAccount: "계정이 없으신가요?",
    hasAccount: "이미 계정이 있으신가요?",
    signUpLink: "가입하기",
    signInLink: "로그인",
    terms: "계속하면 DubSync의",
    termsLink: "이용약관",
    and: "및",
    privacyLink: "개인정보처리방침",
    checkEmail: "이메일을 확인하세요",
    sentLink: "확인 링크를 보냈습니다:",
    clickLink: "이메일의 링크를 클릭하여 계정을 활성화하고 비디오 더빙을 시작하세요.",
    goToSignIn: "로그인으로 이동",
    differentEmail: "다른 이메일 사용",
    checkSpam: "이메일을 받지 못하셨나요? 스팸 폴더를 확인해 주세요.",
    authFailed: "인증에 실패했습니다. 다시 시도해 주세요.",
    somethingWrong: "문제가 발생했습니다. 다시 시도해 주세요.",
  },
  ar: {
    welcomeBack: "مرحباً بعودتك",
    createAccount: "أنشئ حسابك",
    signInSubtitle: "سجّل الدخول لمتابعة دبلجة الفيديوهات",
    signUpSubtitle: "ابدأ بدبلجة الفيديوهات بأكثر من 30 لغة",
    continueGoogle: "المتابعة مع Google",
    orEmail: "أو تابع بالبريد الإلكتروني",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    namePlaceholder: "أحمد محمد",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "كلمة المرور",
    passwordPlaceholderNew: "6 أحرف على الأقل",
    signIn: "تسجيل الدخول",
    createAccountBtn: "إنشاء حساب",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    signUpLink: "سجّل",
    signInLink: "سجّل الدخول",
    terms: "بالمتابعة، أنت توافق على",
    termsLink: "الشروط",
    and: "و",
    privacyLink: "سياسة الخصوصية",
    checkEmail: "تحقق من بريدك الإلكتروني",
    sentLink: "لقد أرسلنا رابط تأكيد إلى",
    clickLink: "انقر على الرابط في البريد الإلكتروني لتفعيل حسابك والبدء في دبلجة الفيديوهات.",
    goToSignIn: "الذهاب لتسجيل الدخول",
    differentEmail: "استخدام بريد إلكتروني آخر",
    checkSpam: "لم تستلم البريد؟ تحقق من مجلد البريد المزعج.",
    authFailed: "فشل المصادقة. يرجى المحاولة مرة أخرى.",
    somethingWrong: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },
  hi: {
    welcomeBack: "वापस आने पर स्वागत है",
    createAccount: "अपना अकाउंट बनाएं",
    signInSubtitle: "वीडियो डबिंग जारी रखने के लिए साइन इन करें",
    signUpSubtitle: "30+ भाषाओं में वीडियो डबिंग शुरू करें",
    continueGoogle: "Google से जारी रखें",
    orEmail: "या ईमेल से जारी रखें",
    fullName: "पूरा नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    namePlaceholder: "राहुल शर्मा",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "आपका पासवर्ड",
    passwordPlaceholderNew: "न्यूनतम 6 अक्षर",
    signIn: "साइन इन",
    createAccountBtn: "अकाउंट बनाएं",
    noAccount: "अकाउंट नहीं है?",
    hasAccount: "पहले से अकाउंट है?",
    signUpLink: "साइन अप करें",
    signInLink: "साइन इन करें",
    terms: "जारी रखकर, आप DubSync की",
    termsLink: "शर्तों",
    and: "और",
    privacyLink: "गोपनीयता नीति",
    checkEmail: "अपना ईमेल जांचें",
    sentLink: "हमने एक पुष्टि लिंक भेजा है:",
    clickLink: "अपना अकाउंट सक्रिय करने और वीडियो डबिंग शुरू करने के लिए ईमेल में दिए गए लिंक पर क्लिक करें।",
    goToSignIn: "साइन इन पर जाएं",
    differentEmail: "दूसरा ईमेल इस्तेमाल करें",
    checkSpam: "ईमेल नहीं मिला? अपना स्पैम फ़ोल्डर जांचें।",
    authFailed: "प्रमाणीकरण विफल। कृपया पुनः प्रयास करें।",
    somethingWrong: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
  },
  id: {
    welcomeBack: "Selamat datang kembali",
    createAccount: "Buat akun Anda",
    signInSubtitle: "Masuk untuk melanjutkan dubbing video",
    signUpSubtitle: "Mulai dubbing video dalam 30+ bahasa",
    continueGoogle: "Lanjutkan dengan Google",
    orEmail: "atau lanjutkan dengan email",
    fullName: "Nama lengkap",
    email: "Email",
    password: "Kata sandi",
    namePlaceholder: "Budi Santoso",
    emailPlaceholder: "anda@contoh.com",
    passwordPlaceholder: "Kata sandi Anda",
    passwordPlaceholderNew: "Min. 6 karakter",
    signIn: "Masuk",
    createAccountBtn: "Buat Akun",
    noAccount: "Belum punya akun?",
    hasAccount: "Sudah punya akun?",
    signUpLink: "Daftar",
    signInLink: "Masuk",
    terms: "Dengan melanjutkan, Anda menyetujui",
    termsLink: "Ketentuan",
    and: "dan",
    privacyLink: "Kebijakan Privasi",
    checkEmail: "Periksa email Anda",
    sentLink: "Kami telah mengirim tautan konfirmasi ke",
    clickLink: "Klik tautan di email untuk mengaktifkan akun Anda dan mulai dubbing video.",
    goToSignIn: "Ke halaman masuk",
    differentEmail: "Gunakan email lain",
    checkSpam: "Tidak menerima email? Periksa folder spam Anda.",
    authFailed: "Autentikasi gagal. Silakan coba lagi.",
    somethingWrong: "Terjadi kesalahan. Silakan coba lagi.",
  },
  zh: {
    welcomeBack: "欢迎回来",
    createAccount: "创建你的账户",
    signInSubtitle: "登录以继续视频配音",
    signUpSubtitle: "开始30+种语言的视频配音",
    continueGoogle: "使用Google继续",
    orEmail: "或使用邮箱继续",
    fullName: "姓名",
    email: "邮箱",
    password: "密码",
    namePlaceholder: "张三",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "你的密码",
    passwordPlaceholderNew: "最少6个字符",
    signIn: "登录",
    createAccountBtn: "创建账户",
    noAccount: "没有账户？",
    hasAccount: "已有账户？",
    signUpLink: "注册",
    signInLink: "登录",
    terms: "继续即表示你同意DubSync的",
    termsLink: "服务条款",
    and: "和",
    privacyLink: "隐私政策",
    checkEmail: "请查看你的邮箱",
    sentLink: "我们已发送确认链接至",
    clickLink: "点击邮件中的链接以激活你的账户并开始视频配音。",
    goToSignIn: "去登录",
    differentEmail: "使用其他邮箱",
    checkSpam: "没有收到邮件？请检查垃圾邮件文件夹。",
    authFailed: "认证失败，请重试。",
    somethingWrong: "出了点问题，请重试。",
  },
  tr: {
    welcomeBack: "Tekrar hoş geldiniz",
    createAccount: "Hesabınızı oluşturun",
    signInSubtitle: "Video dublajına devam etmek için giriş yapın",
    signUpSubtitle: "30'dan fazla dilde video dublajına başlayın",
    continueGoogle: "Google ile devam et",
    orEmail: "veya e-posta ile devam et",
    fullName: "Ad Soyad",
    email: "E-posta",
    password: "Şifre",
    namePlaceholder: "Ahmet Yılmaz",
    emailPlaceholder: "siz@ornek.com",
    passwordPlaceholder: "Şifreniz",
    passwordPlaceholderNew: "Min. 6 karakter",
    signIn: "Giriş Yap",
    createAccountBtn: "Hesap Oluştur",
    noAccount: "Hesabınız yok mu?",
    hasAccount: "Zaten hesabınız var mı?",
    signUpLink: "Kaydol",
    signInLink: "Giriş yap",
    terms: "Devam ederek DubSync'in",
    termsLink: "Şartlarını",
    and: "ve",
    privacyLink: "Gizlilik Politikasını",
    checkEmail: "E-postanızı kontrol edin",
    sentLink: "Onay bağlantısı gönderdik:",
    clickLink: "Hesabınızı etkinleştirmek ve video dublajına başlamak için e-postadaki bağlantıya tıklayın.",
    goToSignIn: "Giriş sayfasına git",
    differentEmail: "Farklı e-posta kullan",
    checkSpam: "E-posta almadınız mı? Spam klasörünüzü kontrol edin.",
    authFailed: "Kimlik doğrulama başarısız. Lütfen tekrar deneyin.",
    somethingWrong: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
  },
};

function useAuthStrings(): { strings: Record<string, string>; locale: string; setLocale: (l: string) => void } {
  const [locale, setLocaleState] = useState(() => readCookie("dubsync_locale") || "en");

  function setLocale(l: string) {
    document.cookie = `dubsync_locale=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    setLocaleState(l);
  }

  return { strings: AUTH_STRINGS[locale] || AUTH_STRINGS.en, locale, setLocale };
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { strings: t, locale: currentLocale, setLocale } = useAuthStrings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_failed" ? t.authFailed : null
  );
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleGoogleLogin() {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const localeFromCookie = readCookie("dubsync_locale");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              ...(localeFromCookie ? { locale: localeFromCookie } : {}),
            },
            emailRedirectTo: `${window.location.origin}/callback`,
          },
        });

        if (error) throw error;
        setRegistered(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.somethingWrong
      );
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="landing-dark bg-[#0F172A] min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />

      <div className="relative w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
              <Languages className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">DubSync</span>
          </Link>
        </div>

        {/* Email confirmation screen */}
        {registered && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
              <MailOpen className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.checkEmail}</h1>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {t.sentLink}<br />
              <span className="text-white font-medium">{email}</span>
            </p>
            <p className="mt-4 text-sm text-slate-500">{t.clickLink}</p>
            <div className="mt-8 space-y-3">
              <Link
                href="/login"
                className="block w-full gradient-button rounded-xl px-4 py-3.5 text-sm font-semibold text-center"
              >
                {t.goToSignIn}
              </Link>
              <button
                onClick={() => { setRegistered(false); setEmail(""); setPassword(""); setFullName(""); }}
                className="block w-full text-sm text-slate-500 hover:text-slate-300 transition-colors py-2"
              >
                {t.differentEmail}
              </button>
            </div>
            <p className="mt-6 text-xs text-slate-600">{t.checkSpam}</p>
          </div>
        )}

        {/* Card */}
        {!registered && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? t.welcomeBack : t.createAccount}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {isLogin ? t.signInSubtitle : t.signUpSubtitle}
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t.continueGoogle}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-3 text-slate-500">{t.orEmail}</span>
            </div>
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? t.passwordPlaceholder : t.passwordPlaceholderNew}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3">
                <p className="text-sm text-green-400">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-button flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? t.signIn : t.createAccountBtn}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? (
              <>
                {t.noAccount}{" "}
                <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                  {t.signUpLink}
                </Link>
              </>
            ) : (
              <>
                {t.hasAccount}{" "}
                <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                  {t.signInLink}
                </Link>
              </>
            )}
          </p>
        </div>
        )}

        {/* Footer */}
        {!registered && (
          <>
            <p className="mt-6 text-center text-xs text-slate-600">
              {t.terms}{" "}
              <Link href="/terms" className="text-slate-500 hover:text-slate-400 underline">{t.termsLink}</Link>{" "}
              {t.and}{" "}
              <Link href="/privacy" className="text-slate-500 hover:text-slate-400 underline">{t.privacyLink}</Link>
            </p>

            {/* Language switcher */}
            <div className="mt-4 flex justify-center">
              <div className="relative">
                <select
                  value={currentLocale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="appearance-none rounded-lg border border-white/10 bg-white/5 pl-8 pr-6 py-1.5 text-xs text-slate-400 hover:text-white focus:outline-none cursor-pointer"
                >
                  {LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {LOCALE_INFO[l].flag} {LOCALE_INFO[l].nativeName}
                    </option>
                  ))}
                </select>
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
