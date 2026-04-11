"use client";
import Link from "next/link";
import { 
  BookOpen, GraduationCap, Sparkles, 
  ArrowRight, Trophy, Target, Zap, 
  Star, ChevronRight, PlayCircle
} from "lucide-react";

export default function ReadingMainPage() {
  const levels = [
    {
      id: "4ap",
      title: "4ème Année",
      arabicTitle: "السنة الرابعة ابتدائي",
      description: "نصوص ممتعة وسهلة مصممة خصيصاً لبناء ثقتك الأولى في القراءة باللغة الفرنسية.",
      color: "from-[#6c5ce7] to-[#a29bfe]",
      lightColor: "bg-[#f8f7ff]",
      textColor: "text-[#6c5ce7]",
      accentColor: "#6c5ce7",
      shadowColor: "shadow-purple-200/50",
      icon: <BookOpen size={40} strokeWidth={2.5} />,
      stats: "20+ Textes",
      xp: "1500 XP Dispo"
    },
    {
      id: "5ap",
      title: "5ème Année",
      arabicTitle: "السنة الخامسة ابتدائي",
      description: "تحضر لشهادة التعليم الابتدائي؟ نصوص متقدمة ستجعلك تتحدث كالمحترفين وتتفوق في الامتحان.",
      color: "from-[#ff7675] to-[#fab1a0]",
      lightColor: "bg-[#fffafa]",
      textColor: "text-[#ff7675]",
      accentColor: "#ff7675",
      shadowColor: "shadow-red-200/50",
      icon: <GraduationCap size={40} strokeWidth={2.5} />,
      stats: "25+ Textes",
      xp: "2000 XP Dispo"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-indigo-100 selection:text-indigo-900" dir="rtl">
      
      {/* 🌟 Dynamic Hero Header */}
      <header className="relative bg-white pt-20 pb-32 border-b border-slate-100 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[100px] opacity-60" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full mb-8 border border-indigo-100 shadow-sm transition-transform hover:scale-105 cursor-default">
            <Sparkles size={16} className="text-yellow-500 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Plateforme de Lecture IA</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 mb-8 tracking-tight leading-none">
            أتقن <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">الفرنسية</span> <br className="hidden md:block"/> بذكاء وطلاقة
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            تجربة قراءة تفاعلية مدعومة بالذكاء الاصطناعي لتحسين نطقك، سرعة قراءتك، وثقتك بنفسك.
          </p>

          {/* Quick Stats Summary */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <QuickStat icon={<Star className="text-yellow-400 fill-yellow-400" />} label="نظام نجوم" />
            <QuickStat icon={<Target className="text-emerald-500" />} label="تحليل فوري" />
            <QuickStat icon={<Zap className="text-orange-500 fill-orange-400" />} label="تطوير مهارات" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-16 relative z-20 pb-32">
        
        {/* 🏆 Featured Daily Goal */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-xl px-10 py-5 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-white flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-200 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-800 font-black text-lg">تحدي اليوم</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Mission Quotidienne</p>
              </div>
            </div>
            <div className="h-px md:h-10 w-20 md:w-px bg-slate-200" />
            <p className="text-slate-600 font-bold text-center md:text-right">
              اقرأ نصاً واحداً بمستوى <span className="text-indigo-600 font-black">"جيد جداً"</span> لتحصل على <span className="underline decoration-yellow-400 decoration-4">200 XP إضافية!</span>
            </p>
          </div>
        </div>

        {/* 📚 Levels Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {levels.map((level) => (
            <Link key={level.id} href={`/reading/${level.id}`} className="group outline-none">
              <div className="relative bg-white rounded-[4rem] p-2 shadow-sm border border-slate-100 h-full overflow-hidden transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-3 group-focus:ring-4 group-focus:ring-indigo-100">
                
                <div className="p-10 md:p-14 flex flex-col h-full">
                  {/* Icon & Badges */}
                  <div className="flex justify-between items-start mb-10">
                    <div className={`w-24 h-24 rounded-[2.5rem] ${level.lightColor} ${level.textColor} flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-[-8deg] transition-all duration-500`}>
                      {level.icon}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-4 py-1.5 rounded-full ${level.lightColor} ${level.textColor} text-[10px] font-black uppercase tracking-widest`}>
                        {level.stats}
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                        {level.xp}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className={`text-xl font-black italic mb-2 tracking-wide opacity-70 ${level.textColor}`}>{level.title}</h3>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{level.arabicTitle}</h2>
                  </div>

                  <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">
                    {level.description}
                  </p>

                  <div className={`mt-auto flex items-center justify-between p-3 rounded-[2rem] transition-all bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100 shadow-sm`}>
                    <div className="flex items-center gap-3 pr-4">
                      <PlayCircle size={20} className={level.textColor} />
                      <span className="font-black text-slate-700 text-sm uppercase tracking-[0.2em]">Commencer</span>
                    </div>
                    <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${level.color} text-white flex items-center justify-center shadow-xl ${level.shadowColor} group-hover:translate-x-[-8px] transition-all`}>
                      <ChevronRight size={28} className="rotate-180" />
                    </div>
                  </div>
                </div>

                {/* Subtle Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-40 group-hover:scale-150 transition-transform duration-1000" />
              </div>
            </Link>
          ))}
        </div>

        {/* ⚡ Pro Features / Why Us? */}
        <div className="mt-40">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">لماذا مساعد القراءة الذكي؟</h2>
              <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard 
                icon={<Target size={32} />} 
                title="Précision IA" 
                arabicTitle="تقييم فوري دقيق"
                desc="تحليل ذكي لكل كلمة تنطقها مع تحديد الأخطاء وتصحيحها فوراً."
                color="hover:border-indigo-500/30"
                iconBg="bg-indigo-50 text-indigo-600"
              />
              <FeatureCard 
                icon={<Zap size={32} />} 
                title="Vitesse & Fluidité" 
                arabicTitle="قياس سرعة القراءة"
                desc="نظام WPM متطور يقيس تطور طلاقتك اللغوية مقارنة بالمعايير العالمية."
                color="hover:border-orange-500/30"
                iconBg="bg-orange-50 text-orange-600"
              />
              <FeatureCard 
                icon={<Star size={32} />} 
                title="Gamification" 
                arabicTitle="نظام رتب ومكافآت"
                desc="حول التعلم إلى لعبة! اجمع الـ XP، افتح الإنجازات، وكن الأول في صفك."
                color="hover:border-emerald-500/30"
                iconBg="bg-emerald-50 text-emerald-600"
              />
           </div>
        </div>
      </main>
    </div>
  );
}

function QuickStat({ icon, label }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-50 transition-all hover:shadow-md">
      {icon}
      <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, arabicTitle, desc, color, iconBg }) {
  return (
    <div className={`p-10 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 ${color}`}>
        <div className={`w-20 h-20 ${iconBg} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner`}>
          {icon}
        </div>
        <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">{title}</h5>
        <h4 className="text-2xl font-black text-slate-800 mb-4">{arabicTitle}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}