"use client";
import { Rocket, Target, Users2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-20 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-right space-y-6">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-tight">
            نحن نبني مستقبل <br/> <span className="text-indigo-500">التعليم الرقمي</span> في الجزائر.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            منصة "إيدو لينك" (EduLink) هي بيئة تعليمية متطورة تهدف إلى تمكين الطلاب من الوصول إلى أفضل المسارات التعليمية التقنية بأسلوب حديث وتفاعلي.
          </p>
        </section>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
            <div className="p-3 bg-indigo-500/10 w-fit rounded-2xl border border-indigo-500/20 text-indigo-500">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-black italic">رؤيتنا</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              توفير منصة تعليمية جزائرية بمواصفات عالمية، تركز على جودة المحتوى وسهولة الوصول، لتخريج جيل مبدع في مجالات التكنولوجيا.
            </p>
          </div>

          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
            <div className="p-3 bg-emerald-500/10 w-fit rounded-2xl border border-emerald-500/20 text-emerald-500">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-black italic">مهمتنا</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              تبسيط تجربة التعلم عبر الإنترنت، من خلال تنظيم الدروس، دعم الطلاب فنياً، وتوفير بيئة آمنة ومنظمة لكل مشترك.
            </p>
          </div>
        </div>

        {/* Why Us? */}
        <div className="border-t border-slate-800 pt-16 space-y-8">
          <div className="flex items-center gap-4">
             <Users2 className="text-indigo-500" size={32} />
             <h2 className="text-2xl font-black italic uppercase tracking-tighter">لماذا يختارنا الطلاب؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="p-4 border-r border-slate-800 italic">محتوى حصري ومحدث</div>
            <div className="p-4 border-r border-slate-800 italic">دعم فني متواصل 24/7</div>
            <div className="p-4 border-r border-slate-800 italic">تجربة مستخدم سريعة وسلسة</div>
          </div>
        </div>

        {/* Call to Action */}
        <footer className="bg-indigo-600 p-10 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-indigo-600/20">
          <h2 className="text-2xl font-black italic">جاهز لبدء رحلتك التعليمية؟</h2>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
              سجل الآن <ChevronLeft size={14}/>
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
}