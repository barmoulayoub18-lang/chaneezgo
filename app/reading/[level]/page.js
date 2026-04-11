"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { texts4ap } from "@/data/texts/4ap";
import { texts5ap } from "@/data/texts/5ap";
import TextCard from "@/components/Reading/TextCard";
import Progress from "@/components/Reading/Progress";
import { BookOpen, ArrowLeft, LayoutGrid, Sparkles, Trophy, Loader2, Shuffle } from "lucide-react";

export default function LevelPage() {
  const { level } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [shuffledTexts, setShuffledTexts] = useState([]);
  const [userStats, setUserStats] = useState({
    points: 0,
    completedTextsCount: 0,
    bestWpm: 0,
    avgAccuracy: 0,
    rank: "Débutant",
  });

  // 1. تحديد النصوص المصدرية بناءً على المستوى
  const isLevel4 = level?.toLowerCase() === "4ap";
  const sourceTexts = useMemo(() => (isLevel4 ? texts4ap : texts5ap), [isLevel4]);
  const levelTitle = isLevel4 ? "السنة الرابعة ابتدائي" : "السنة الخامسة ابتدائي";
  const themeColor = isLevel4 ? "from-blue-600 to-indigo-700" : "from-orange-500 to-red-600";
  const accentColor = isLevel4 ? "bg-blue-600" : "bg-orange-500";

  // 2. وظيفة الخلط العشوائي (Fisher-Yates Shuffle) لضمان تغير الصور والتمارين
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        
        // خلط النصوص عشوائياً في كل مرة يتم فيها تحميل الصفحة
        setShuffledTexts(shuffleArray(sourceTexts));

        // جلب إحصائيات المستخدم
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('reading_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('level', level.toUpperCase())
            .single();

          if (data && !error) {
            setUserStats({
              points: data.points || 0,
              completedTextsCount: data.completed_count || 0,
              bestWpm: data.best_wpm || 0,
              avgAccuracy: data.avg_accuracy || 0,
              rank: data.rank || "Débutant",
              totalTexts: sourceTexts.length
            });
          }
        }
      } catch (err) {
        console.error("Error initializing page:", err);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [level, sourceTexts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="text-indigo-500 animate-spin" size={48} />
          <Shuffle className="absolute inset-0 m-auto text-indigo-300 animate-pulse" size={20} />
        </div>
        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse">جاري خلط التمارين والمفاجآت...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans" dir="rtl">
      
      {/* 🚀 Hero Section */}
      <div className={`w-full pt-10 pb-20 mb-[-40px] text-white bg-gradient-to-br ${themeColor} shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[10%] w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-right">
          <button
            onClick={() => router.push('/reading')}
            className="group inline-flex items-center gap-2 mb-8 bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
            العودة لقائمة المستويات
          </button>
          
          <div className="flex flex-col lg:flex-row-reverse lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-[10px] font-black uppercase tracking-tighter">قائمة متجددة دائماً</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                {levelTitle}
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                في كل مرة تزورنا، سنختار لك قصصاً بترتيب مختلف لتحدي قدراتك!
              </p>
            </div>

            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 flex items-center gap-4 shadow-2xl min-w-[180px]">
                  <div className={`p-3 rounded-2xl text-white shadow-lg ${accentColor}`}>
                    <Trophy size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">إنجازك الكلي</p>
                    <p className="text-2xl font-black leading-none">{userStats.completedTextsCount}/{sourceTexts.length}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 📊 الجانب الأيمن: إحصائيات التلميذ */}
          <div className="lg:col-span-4 space-y-8 order-last lg:order-first">
            <div className="sticky top-10">
              <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 px-2 text-right">لوحة الإنجازات</h3>
              <Progress userStats={{...userStats, totalTexts: sourceTexts.length}} currentLevel={level} />
              
              <div className="mt-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group text-right">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="text-slate-800 font-black mb-3 flex items-center justify-end gap-2">
                   تحدي التجديد <LayoutGrid size={20} className="text-indigo-500" />
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  هل لاحظت؟ التمارين تغير أماكنها! هذا يساعدك على التركيز على المحتوى وليس فقط حفظ أماكن الصور.
                </p>
              </div>
            </div>
          </div>

          {/* 📚 الجانب الأيسر: قائمة النصوص المختلطة */}
          <div className="lg:col-span-8 text-right">
            <div className="flex flex-col md:flex-row-reverse md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">مكتبة النصوص الذكية</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">ترتيب عشوائي لضمان أفضل تجربة تعليمية</p>
              </div>

              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit flex-row-reverse">
                <button className="px-5 py-2 bg-white rounded-xl text-xs font-black text-indigo-600 shadow-sm transition-all">الكل</button>
                <button className="px-5 py-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-all">القصص</button>
                <button className="px-5 py-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-all">الحوارات</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {shuffledTexts.map((text) => (
                <div key={text.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <TextCard
                    text={{...text, level: level.toUpperCase()}}
                  />
                </div>
              ))}
            </div>

            {shuffledTexts.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                   <BookOpen size={40} />
                </div>
                <p className="text-slate-400 font-black text-xl uppercase tracking-widest">قريباً..</p>
                <p className="text-slate-400 font-medium">نحن نجهز نصوصاً رائعة خصيصاً لك!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}