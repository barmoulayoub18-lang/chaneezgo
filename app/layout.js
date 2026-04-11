"use client";

import { Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { usePathname } from "next/navigation";

// إعداد الخط بشكل احترافي لدعم اللغة العربية والفرنسية والإنجليزية
const tajawal = Tajawal({ 
  subsets: ["latin"], 
  weight: ["200", "400", "500", "700", "900"],
  variable: "--font-tajawal", 
  display: 'swap', 
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // تحديد كافة المسارات التي يجب إخفاء الـ Navbar العام فيها (لوحات التحكم، الدخول)
  const hideNavbarPaths = [
    "/login", 
    "/admin", 
    "/dashboard", 
    "/onboarding"
  ];

  // التحقق مما إذا كان المسار الحالي يبدأ بأحد مسارات الإخفاء (مثلاً /admin/courses)
  const hideNavbar = hideNavbarPaths.some(path => pathname.startsWith(path));

  return (
    <html lang="ar" dir="rtl" className={`scroll-smooth ${tajawal.variable}`} suppressHydrationWarning>
      <head>
        <title>EDUSTREAM | منصتك للتميز الدراسي</title>
        <meta name="description" content="أقوى منصة تعليمية جزائرية لمتابعة الدروس والدورات التدريبية باحترافية" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        {/* تحسين سرعة الاتصال بخوادم الترجمة والملفات الخارجية */}
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="dns-prefetch" href="https://translate.google.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* كود CSS لإصلاح واجهة المستخدم وحماية الأيقونات */}
        <style>{`
          #next-logo, 
          [data-nextjs-dev-tools-button], 
          #nextjs-dev-tools-menu, 
          .nextjs-static-indicator,
          body > nextjs-portal {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          
          /* منع ترجمة الأيقونات والرموز البرمجية */
          .notranslate, i, svg, [class*="lucide-"] { 
            translate: no !important; 
          }

          /* تحسين سلاسة التمرير وتجربة المستخدم */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #020617; }
          ::-webkit-scrollbar-thumb { 
            background: #1e293b; 
            border-radius: 10px; 
          }
          ::-webkit-scrollbar-thumb:hover { background: #334155; }
        `}</style>
      </head>
      <body 
        className={`${tajawal.className} bg-[#020617] text-slate-50 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* سكريبت Cloudinary الأساسي لرفع الملفات والصور */}
        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="beforeInteractive" 
        />

        {/* --- إعدادات ترجمة جوجل (مخفية تقنياً) --- */}
        <div 
          id="google_translate_element" 
          className="notranslate"
          style={{ visibility: 'hidden', position: 'absolute', top: '-9999px' }}
          suppressHydrationWarning
        ></div>

        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'ar',
                includedLanguages: 'ar,en,fr',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            };
          `}
        </Script>

        <Script 
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive" 
        />
        {/* ------------------------------------------ */}

        {/* تأثير الإضاءة الخلفية الثابت (التصميم الأصلي) */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-blue-500/5 blur-[150px] rounded-full"></div>
        </div>

        {/* عرض القائمة العامة (Navbar) بناءً على منطق المسارات المتطور */}
        {!hideNavbar && <Navbar />}

        {/* الحاوية الرئيسية للتطبيق */}
        <div className="relative flex flex-col min-h-screen" suppressHydrationWarning>
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>

        {/* حماية ضد أي أخطاء هيدريشن ناتجة عن إضافات المتصفح */}
        <div id="portal-root"></div>
      </body>
    </html>
  );
}