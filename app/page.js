"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, BookOpen, ChevronLeft, Rocket, 
  Layers, Clock, Sparkles, Globe, 
  Zap, ShieldCheck, ArrowUpRight, 
  Star, Users, Code, Cpu, LayoutGrid,
  Loader2
} from 'lucide-react';
// استيراد الـ Hook لضمان التوافق مع حالة الجاهزية ونظام الترجمة العالمي للمنصة
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  // تفعيل الـ Hook لضمان مزامنة اللغة المحفوظة تلقائياً عبر الملفات
  const { changeLanguage } = useGoogleTranslate();

  useEffect(() => {
    // مراقبة التمرير لتغيير نمط الـ Navbar
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    async function fetchData() {
      try {
        // 1. جلب بيانات المستخدم لضمان ظهور زر "لوحة التحكم" بدلاً من "دخول الطلاب"
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // 2. جلب أحدث 3 مسارات تعليمية للعرض في القسم الرئيسي
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        // تأثير تحميل سلس جداً يتوافق مع سرعة استجابة Next.js
        setTimeout(() => setLoading(false), 600);
      }
    }

    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden" dir="rtl">
      
      {/* --- شاشة التحميل الاحترافية (Overlay) --- */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center gap-6 transition-opacity duration-700">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500/20"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-t-indigo-500 animate-spin"></div>
            <Zap className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={24} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-white font-black tracking-[0.3em] text-[10px] uppercase italic opacity-80">DIDACTILECT 2026</p>
            <div className="h-[1px] w-12 bg-indigo-500/50"></div>
          </div>
        </div>
      )}

      {/* Dynamic Background Elements - المحافظة على الهوية البصرية */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation - متوافق مع Layout.js */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? "py-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-indigo-500/5" : "py-7 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center gap-3">
              
  <div className="p-2 md:p-3 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/20 backdrop-blur-md border border-white/10 shadow-lg">
  <img 
    src="/images/logo.png" 
    alt="Logo" 
    className="h-14 md:h-16 w-auto object-contain scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
  />
</div>
</div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-10">
            {/* نظام تبديل اللغات المدمج */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-sm">
              {['ar', 'en', 'fr'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => changeLanguage(lang)} 
                  className="px-4 py-1.5 text-[10px] font-black hover:bg-white/10 rounded-xl transition-all uppercase tracking-widest text-slate-400 hover:text-indigo-400"
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-10">
              <Link href="/courses" className="text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest italic">المسارات التعليمية</Link>
              <Link href="#" className="text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest italic">المجتمع</Link>
            </div>
            
            {user ? (
              <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl font-black text-[11px] transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 uppercase tracking-tighter italic">
                لوحة التحكم <ArrowUpRight size={14} />
              </Link>
            ) : (
              <Link href="/login" className="bg-white text-black px-7 py-3 rounded-xl font-black text-[11px] hover:bg-indigo-50 transition-all shadow-xl shadow-white/10 active:scale-95 uppercase tracking-tighter italic">
                دخول الطلاب
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - تصميم فائق الحداثة */}
      <header className="relative pt-48 pb-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-[1.6] space-y-8 text-center lg:text-right">
            <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full animate-bounce-slow">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] italic">مستقبلك يبدأ من هنا</span>
            </div>
           <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tighter italic">
  مرحبًا بك في رحلتك لإتقان القراءة! 📚
</h1>

<p className="text-slate-400 max-w-2xl text-lg md:text-xl leading-relaxed font-bold mx-auto lg:mr-0 opacity-80 italic">
القراءة ليست مجرد التعرف على الكلمات…
بل هي قراءة بسلاسة، بثقة، وبمتعة.
</p>

<p className="text-slate-400 max-w-2xl text-lg md:text-xl leading-relaxed font-bold mx-auto lg:mr-0 opacity-80 italic mt-4">
هنا ستتدرّب، تتطوّر، وتصبح قارئًا متمكنًا خطوة بخطوة.
</p>

<p className="text-slate-300 max-w-2xl text-lg md:text-xl font-black mx-auto lg:mr-0 mt-4">
👉 انضم إلينا وابدأ رحلتك الآن! ✨
</p>

            <div className="flex flex-wrap items-center gap-5 justify-center lg:justify-start pt-6">
              <Link href="/courses" className="group bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/40 active:scale-95">
                ابدأ رحلتك التعليمية <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md transition-colors hover:bg-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-10 w-10 rounded-xl bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-[12px] font-black italic`}>A{i}</div>
                  ))}
                </div>
                <span className="text-slate-300 font-black text-[11px] uppercase tracking-widest">+3,000 طالب علم</span>
              </div>
            </div>
            <div className="w-full mt-10 flex justify-center">
  <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/-dFK3zIwIFI?autoplay=1&mute=1&rel=0"
      title="Intro Video"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  </div>
</div>
          </div>

          {/* Right Section - Feature Cards */}
          <div className="flex-1 w-full grid grid-cols-2 gap-5 h-auto relative">
            <div className="bg-indigo-600 rounded-[3rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-indigo-500 transition-all hover:-translate-y-3 shadow-2xl shadow-indigo-600/30 min-h-[250px] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-all"></div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Globe size={30} className="text-white animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-black text-white leading-tight italic tracking-tighter uppercase">مسارات <br/> عالمية</h3>
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center gap-3 flex-1 hover:border-indigo-500/50 transition-colors group">
                <Users size={28} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">مجتمع تفاعلي</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center gap-2 flex-1 hover:bg-white/10 transition-colors">
                <span className="text-4xl font-black text-indigo-400 tracking-tighter italic">100%</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">محتوى أصلي حصري</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Courses Preview Feed - المحافظة على الربط مع Supabase */}
      <section id="courses" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-right space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">أحدث المسارات التعليمية</h2>
            <div className="h-1 w-20 bg-indigo-600 rounded-full mx-auto md:mr-0"></div>
          </div>
          <Link href="/courses" className="flex items-center gap-3 text-indigo-400 font-black text-[11px] uppercase tracking-[0.25em] hover:text-white transition-all group bg-white/5 px-6 py-3 rounded-xl border border-white/5 italic">
            عرض كل التخصصات <LayoutGrid size={18} className="group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Link 
                href={`/course/${course.id}`} 
                key={course.id} 
                className="group bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden hover:border-indigo-500/40 transition-all flex flex-col shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.98]"
              >
                <div className="h-56 bg-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-transparent to-transparent z-10 opacity-60"></div>
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-90" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                      <Play size={64} className="text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-5 right-5 z-20">
                     <span className="bg-indigo-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg italic border border-white/10">New Path</span>
                  </div>
                </div>

                <div className="p-9 flex flex-col flex-1 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1 italic tracking-tighter">{course.title}</h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed font-bold line-clamp-2 opacity-80">{course.description || "انضم لهذا المسار لتعلم مهارات جديدة وبناء قاعدة معرفية قوية."}</p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                        <Clock size={16} className="text-indigo-500 animate-pulse" />
                        <span>{course.duration || 'محتوى شامل'}</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-lg group-hover:shadow-indigo-600/30">
                        <ChevronLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center rounded-[4rem] border-2 border-dashed border-white/5 bg-white/[0.01] backdrop-blur-sm">
              <Cpu size={32} className="text-slate-700 mx-auto mb-5 animate-pulse" />
              <p className="text-slate-500 font-black italic uppercase tracking-[0.3em] text-[12px]">المسارات الجديدة قيد التجهيز الآن..</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - المحافظة على التوقيع الشخصي */}
      <footer className="bg-slate-950/90 border-t border-white/5 py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="text-center md:text-right space-y-5">
            <div dir="ltr" className="text-3xl font-black text-white italic uppercase tracking-tighter group cursor-pointer inline-block text-left">
  DID<span className="text-indigo-500">ACTILECT</span>
</div>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm font-black uppercase tracking-widest opacity-60">نحن نؤمن أن العلم هو القوة الحقيقية لتغيير العالم. مهمتنا هي توفير بيئة تعليمية ملهمة للجميع.</p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] italic">
            <Link href="/courses" className="hover:text-indigo-400 transition-all hover:-translate-y-1">المسارات</Link>
            <Link href="#" className="hover:text-indigo-400 transition-all hover:-translate-y-1">عن المنصة</Link>
            <Link href="#" className="hover:text-indigo-400 transition-all hover:-translate-y-1">اتصل بنا</Link>
          </div>

          <div className="text-slate-700 text-[10px] font-black tracking-[0.3em] uppercase italic bg-white/5 px-6 py-3 rounded-full border border-white/5 shadow-inner">
            &copy; 2026 DIDACTILECT <span className="text-indigo-500/80"></span>
          </div>
        </div>
      </footer>

      {/* التنسيقات العالمية المخصصة للمنصة */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        
        ::selection { background-color: #4f46e5; color: white; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
        ::-webkit-scrollbar-thumb:hover { background: #312e81; }
      `}</style>
    </div>
  );
}




