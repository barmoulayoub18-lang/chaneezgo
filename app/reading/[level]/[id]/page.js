"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, BrainCircuit, BookOpen } from "lucide-react";

// استيراد البيانات
// الكود الصحيح
import { texts4ap } from "@/data/texts/4ap";
import { texts5ap } from "@/data/texts/5ap";

import { useReadingSession } from "@/hooks/useReadingSession";
import Recorder from "@/components/Reading/Recorder";
import ScoreBoard from "@/components/Reading/ScoreBoard";
import Chrono from "@/components/Reading/Chrono";
import Exercises from "@/components/Reading/Exercises";

import { supabase } from "@/lib/supabaseClient";

// =========================================
// ✅ STATIC PATHS GENERATION (لحل خطأ التصدير)
// =========================================
// ملاحظة: هذه الدالة تعمل فقط في Server Components، ولكن بما أن الملف "use client"
// فإن Next.js سيتجاهلها هنا. الحل الصارم هو التأكد من أن التوجيه يتم بدقة.
// إذا كنت تستخدم output: export، يفضل فصل هذه الدالة في ملف layout أو استخدام صفحة ثابتة.

export default function ReadingPage() {
  const params = useParams();
  const level = params?.level;
  const id = params?.id;
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [showExercises, setShowExercises] = useState(false);

  // تحديد النص المطلوب بناءً على المستوى والـ ID من الرابط بدقة صارمة
  const textData = useMemo(() => {
    if (!level || !id) return null;
    
    const currentLevel = level.toLowerCase();
    const allTexts = currentLevel === "5ap" ? texts5ap : texts4ap;
    
    // البحث عن النص بواسطة ID أو الترتيب الرقمي (Fallback)
    return allTexts.find(t => String(t.id) === String(id)) || 
           allTexts[parseInt(id) - 1] || 
           null;
  }, [level, id]);

  const {
    isReading,
    timeLeft,
    results,
    isAnalyzing,
    startReading,
    stopReading,
    updateTranscript,
  } = useReadingSession(textData);

  // =========================================
  // 💾 SAVE RESULTS (حفظ النتائج بدقة واقعية)
  // =========================================
  useEffect(() => {
    if (!results || isSaving || !textData) return;

    const saveResults = async () => {
      setIsSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // التأكد من إرسال البيانات الصارمة لقاعدة البيانات
        await supabase.from("reading_sessions").insert({
          user_id: user.id,
          level: level.toUpperCase(),
          text_id: textData.id,
          wpm: results.wpm,
          accuracy_score: results.accuracy,
          stars_earned: results.stars,
          ai_feedback: results.feedback,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("CRITICAL SAVE ERROR:", e);
      } finally {
        setIsSaving(false);
      }
    };

    saveResults();
  }, [results, level, textData, isSaving]);

  if (!textData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <p className="text-xl font-bold text-slate-800 mb-4">عذراً، هذا النص غير موجود حالياً</p>
          <button onClick={() => router.push('/reading')} className="text-indigo-600 font-bold flex items-center gap-2 mx-auto">
            <ArrowLeft size={18} /> العودة لقائمة النصوص
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFDFF] pb-20" dir="rtl">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft />
          </button>

          <div className="flex flex-col items-center">
            <h1 className="font-black text-slate-800 text-lg">{textData.title}</h1>
            <span className="text-[10px] bg-indigo-50 px-3 py-1 rounded-full font-bold text-indigo-600 uppercase tracking-widest border border-indigo-100">
              {level.toUpperCase()}
            </span>
          </div>

          <div className={`font-mono font-bold px-4 py-1 rounded-full border-2 transition-colors ${timeLeft < 10 ? 'border-red-100 text-red-500 animate-pulse' : 'border-slate-100 text-slate-600'}`}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* الجانب الأيمن: عرض النص */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[4rem] -z-0 opacity-50"></div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6 text-indigo-500">
                    <BookOpen size={20} />
                    <span className="font-bold text-sm uppercase tracking-wider italic">نص القراءة المقترح</span>
                  </div>

                  {textData.type === "chrono" ? (
                    <Chrono phrases={textData.phrases} />
                  ) : (
                    <div className="relative">
                      {/* عرض النص مع تحسين المسافات والوضوح */}
                      <p className="text-2xl md:text-3xl leading-[2.2] text-slate-700 font-medium text-justify select-none" style={{ wordSpacing: '4px' }}>
                        {textData.content}
                      </p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* الجانب الأيسر: التحكم والنتائج */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {!results && (
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <Recorder
                  isReading={isReading}
                  onStart={startReading}
                  onStop={stopReading}
                  onTranscriptUpdate={updateTranscript}
                  originalText={textData.content}
                />
              </div>
            )}

            {isAnalyzing && (
              <div className="bg-indigo-600 text-white p-6 rounded-[2rem] flex flex-col items-center gap-4 shadow-xl shadow-indigo-100 animate-pulse">
                <BrainCircuit className="animate-spin" size={40} />
                <div className="text-center">
                   <p className="font-black text-xl">الذكاء الاصطناعي يحلل نطقك...</p>
                   <p className="text-indigo-100 text-sm">يتم الآن فرز الكلمات الصحيحة والخاطئة بصرامة</p>
                </div>
              </div>
            )}

            {/* عرض لوحة النتائج المحدثة */}
            {results && (
              <ScoreBoard
                results={results}
                onRetry={() => {
                  setShowExercises(false);
                  window.location.reload();
                }}
                onNext={() => setShowExercises(true)}
              />
            )}
          </div>
        </div>

        {/* التمارين: تظهر فقط عند الضغط على "بدء تمارين الفهم" */}
        {showExercises && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-[2px] flex-1 bg-slate-100"></div>
               <h2 className="text-2xl font-black text-slate-800 px-4">اختبر فهمك للقصة</h2>
               <div className="h-[2px] flex-1 bg-slate-100"></div>
            </div>
            
            <Exercises
              initialLevel={level.toUpperCase()}
              initialTitle={textData.title}
            />
          </div>
        )}
      </main>
    </div>
  );
}