"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  RefreshCcw,
  Maximize2,
  Minimize2,
  Trophy,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { getRandomExerciseByLevel, shuffleArray } from "@/lib/utils/getRandomExercise";
import { supabase } from "@/lib/supabaseClient";

export default function Exercises({ initialLevel = "4AP", lessonId = null, initialTitle = "" }) {
  const [exercise, setExercise] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. جلب التمرين (سواء كان خاص بدرس معين أو عشوائي)
  const loadExercise = useCallback(async () => {
    setLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    setScore(0);
    
    try {
      let selectedExercise = null;

      // إذا كان هناك ID لدرس، نحاول جلب التمرين المرتبط به من Supabase أولاً
      if (lessonId) {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('lesson_id', lessonId)
          .single();
        
        if (data && !error) {
          selectedExercise = data;
        }
      }

      // إذا لم نجد تمرين للدرس أو لم يكن هناك lessonId، نستخدم المولد العشوائي المحلي
      if (!selectedExercise) {
        selectedExercise = getRandomExerciseByLevel(initialLevel);
      }

      if (selectedExercise) {
        // خلط الخيارات لزيادة التحدي في أسئلة QCM
        const processedQuestions = selectedExercise.questions.map(q => {
          if (q.options) {
            return { ...q, shuffledOptions: shuffleArray([...q.options]) };
          }
          return q;
        });
        setExercise({ ...selectedExercise, questions: processedQuestions });
      }
    } catch (err) {
      console.error("Error loading exercise:", err);
    } finally {
      setLoading(false);
    }
  }, [initialLevel, lessonId]);

  useEffect(() => {
    loadExercise();
  }, [loadExercise]);

  // 2. معالجة الإدخال
  const handleAnswerChange = (questionId, value) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // 3. منطق التصحيح الصارم
  const checkAnswers = () => {
    if (!exercise) return;
    
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < exercise.questions.length) {
      alert("يرجى الإجابة على جميع الأسئلة قبل التصحيح.");
      return;
    }

    let correctCount = 0;
    exercise.questions.forEach((q) => {
      const user = userAnswers[q.id]?.toString().trim().toLowerCase();
      const correct = q.answer?.toString().trim().toLowerCase();
      
      if (user === correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);
    
    // التمرير إلى النتيجة بسلاسة
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="font-black text-slate-400 text-xs uppercase tracking-widest">جاري تجهيز الاختبار...</p>
    </div>
  );

  if (!exercise) return (
    <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
      <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
      <p className="font-black text-slate-500 text-lg uppercase">لا توجد تمارين متاحة لهذا المستوى حالياً.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 mb-10 transition-all duration-500">
      
      {/* HEADER SECTION - التصميم الأصلي المحسن */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <HelpCircle size={28} className="text-indigo-100" />
            </div>
            <div>
              <h2 className="text-2xl font-black leading-tight italic tracking-tighter uppercase">تمارين الاستيعاب الذكية</h2>
              <p className="text-indigo-100/80 text-xs font-bold uppercase tracking-widest mt-1">{exercise.title || "اختبار الفهم القرائي"}</p>
            </div>
          </div>
          <div className="bg-black/20 px-5 py-2 rounded-2xl text-[10px] font-black border border-white/10 uppercase tracking-[0.2em] backdrop-blur-sm">
            LEVEL: {exercise.level}
          </div>
        </div>
      </div>

      {/* TEXT & IMAGE CONTEXT */}
      <div className="p-8 bg-slate-50/40 border-b border-slate-100">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {exercise.image && (
            <div className={`relative flex-shrink-0 rounded-[2rem] overflow-hidden shadow-2xl bg-white border-4 border-white transition-all duration-500 ${fullscreen ? 'fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6' : 'w-full md:w-56 h-56 group'}`}>
              <img 
                src={exercise.image} 
                className={`${fullscreen ? 'max-h-full max-w-full object-contain' : 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'}`} 
                alt="Exercise Context" 
              />
              <button 
                onClick={() => setFullscreen(!fullscreen)}
                className="absolute top-3 right-3 p-2.5 bg-white/90 rounded-xl text-slate-800 hover:bg-white transition-all shadow-lg active:scale-90"
              >
                {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          )}
          <div className="flex-1 w-full">
             <div className="bg-white p-7 rounded-[2rem] border border-slate-200/60 shadow-sm relative group hover:border-indigo-200 transition-colors">
                <span className="absolute -top-3 right-8 bg-indigo-600 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg italic">Text Context</span>
                <p className="text-slate-700 leading-[1.8] text-right font-bold text-lg italic pr-2">
                  "{exercise.content}"
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="p-8 md:p-12 space-y-10 bg-white">
        {exercise.questions.map((q, index) => {
          const isCorrect = userAnswers[q.id]?.toString().toLowerCase() === q.answer?.toString().toLowerCase();
          
          return (
            <div key={q.id} className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${submitted ? (isCorrect ? 'border-emerald-100 bg-emerald-50/20' : 'border-rose-100 bg-rose-50/20') : 'border-slate-50 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5'}`}>
              <div className="flex items-start gap-5 text-right mb-8">
                <span className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm italic shadow-lg shadow-slate-200">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
                <h3 className="text-xl font-black text-slate-800 pt-1 leading-snug">{q.question}</h3>
              </div>

              <div className="mr-0 md:mr-14">
                {/* 1. Choice / QCM */}
                {(q.type === "choice" || q.type === "qcm") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(q.shuffledOptions || q.options).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`p-5 rounded-2xl border-2 font-black text-right transition-all flex justify-between items-center text-sm ${
                          userAnswers[q.id] === opt 
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-inner" 
                            : "border-slate-100 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                        } ${submitted && opt === q.answer ? "border-emerald-500 bg-emerald-100 text-emerald-700 shadow-lg" : ""} 
                          ${submitted && userAnswers[q.id] === opt && opt !== q.answer ? "border-rose-500 bg-rose-100 text-rose-700" : ""}
                          active:scale-95`}
                      >
                        {opt}
                        {submitted && opt === q.answer && <CheckCircle2 size={20} className="text-emerald-600" />}
                        {submitted && userAnswers[q.id] === opt && opt !== q.answer && <XCircle size={20} className="text-rose-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. True/False */}
                {q.type === "true_false" && (
                  <div className="flex gap-5">
                    {[
                      { label: "Vrai (صحيح)", val: true },
                      { label: "Faux (خطأ)", val: false }
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleAnswerChange(q.id, btn.val)}
                        className={`flex-1 p-5 rounded-2xl border-2 font-black transition-all text-sm italic ${
                          userAnswers[q.id] === btn.val 
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                            : "border-slate-100 text-slate-400 bg-slate-50/50"
                        } ${submitted && btn.val === q.answer ? "border-emerald-500 bg-emerald-100 text-emerald-700" : ""}
                        active:scale-95`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Text / Fill */}
                {(q.type === "text" || q.type === "fill") && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={submitted}
                      placeholder="اكتب إجابتك بدقة هنا..."
                      value={userAnswers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className={`w-full p-5 rounded-2xl border-2 outline-none font-black transition-all text-slate-900 placeholder:text-slate-300 text-lg ${
                        submitted 
                          ? (isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-rose-500 bg-rose-50 text-rose-800") 
                          : "border-slate-100 focus:border-indigo-600 bg-slate-50/50 focus:bg-white focus:shadow-2xl focus:shadow-indigo-500/10"
                      }`}
                    />
                    {submitted && !isCorrect && (
                      <div className="bg-rose-100/50 p-4 rounded-xl border border-rose-200 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-rose-700 text-xs font-black flex items-center gap-2 uppercase tracking-widest">
                          <AlertCircle size={14} /> الإجابة الصحيحة: {q.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-10 bg-slate-50/80 border-t border-slate-100 text-center">
        {!submitted ? (
          <button
            onClick={checkAnswers}
            className="group relative inline-flex items-center gap-4 bg-slate-900 hover:bg-black text-white px-16 py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-2xl shadow-slate-400/40 italic uppercase tracking-tighter"
          >
            <Send size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            تصحيح التمرين الآن
          </button>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="inline-flex flex-col items-center">
               <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 mb-4 relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-indigo-600 rounded-[2.5rem] blur opacity-20 animate-pulse"></div>
                  <Trophy size={60} className={`relative ${score === exercise.questions.length ? "text-amber-500" : "text-slate-400"}`} />
               </div>
               <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter mb-2">
                 النتيجة: {score} / {exercise.questions.length}
               </h3>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Professional Performance Award</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <button
                onClick={loadExercise}
                className="inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs italic"
              >
                <RefreshCcw size={20} className="animate-spin-slow" />
                تمرين جديد
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}