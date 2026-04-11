"use client";

import {
  Star,
  RotateCcw,
  ArrowRight,
  Award,
  CheckCircle2,
  XCircle,
  Hash,
  Timer,
  AlertCircle
} from "lucide-react";

export default function ScoreBoard({ results, onRetry, onNext }) {

  // ✅ استلام القيم بصرامة من المحرك الجديد لضمان الدقة المطلقة
  const accuracy = Number(results?.accuracy || 0);
  const stars = results?.stars !== undefined ? Number(results.stars) : 0;
  const wpm = Number(results?.wpm || 0);
  
  // استخدام الكلمات الصحيحة الحقيقية المحسوبة في Scoring.js
  const wordsCorrect = Number(results?.correctWordsCount || 0);
  const errors = Number(results?.errorsCount || 0);
  const totalWords = Number(results?.totalWords || 0);

  // التقييم النصي بناءً على النتائج المباشرة من الـ API
  const rating = results?.rating || (accuracy < 25 ? "ضعيف جداً" : "يحتاج تحسين");

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden max-w-xl mx-auto animate-in fade-in zoom-in duration-500 mb-10">

      {/* HEADER SECTION - التصميم الأصلي المطور */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-8 text-white text-center relative overflow-hidden">
        {/* عنصر زخرفي خلفي */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Hash className="absolute -top-4 -left-4 rotate-12" size={100} />
        </div>

        <Award className="mx-auto mb-4 text-yellow-300 animate-bounce relative z-10" size={56} />

        <h2 className="text-2xl font-black mb-2 relative z-10">
          نتيجة القراءة النهائية
        </h2>

        <p className="text-sm opacity-90 mb-4 font-medium relative z-10">
          تم تحليل أدائك الصوتي بدقة وصرامة
        </p>

        {/* STARS RATING - نظام النجوم الصارم (0 إلى 5) */}
        <div className="flex justify-center gap-2 relative z-10">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={32}
              fill={s <= stars ? "#fde047" : "transparent"}
              className={`${
                s <= stars ? "text-yellow-300 scale-110 drop-shadow-xl" : "text-white/20"
              } transition-all duration-700 ease-out`}
            />
          ))}
        </div>
      </div>

      <div className="p-8 space-y-8">

        {/* PROGRESS BARS SECTION */}
        <div className="space-y-5">
            {/* ACCURACY BAR */}
            <div>
              <div className="flex justify-between items-end text-sm mb-2">
                <span className="text-slate-500 font-bold">دقة النطق والكلمات</span>
                <span className={`font-black text-xl ${accuracy >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                  {accuracy}%
                </span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    accuracy >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                    accuracy >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>

            {/* WPM BAR (Speed) */}
            <div>
              <div className="flex justify-between items-end text-sm mb-2">
                <span className="text-slate-500 font-bold flex items-center gap-1">
                   <Timer size={14} /> سرعة القراءة (كلمة/دقيقة)
                </span>
                <span className="text-indigo-600 font-black text-lg">{wpm} WPM</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((wpm / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
        </div>

        {/* STATS GRID - إصلاح عرض الأرقام بدقة صريحة */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50/50 p-5 rounded-3xl text-center border border-green-100 transition-transform hover:scale-[1.02]">
            <p className="text-[10px] text-green-600 font-black uppercase tracking-wider mb-1">الكلمات الصحيحة</p>
            <p className="text-3xl font-black text-green-700">
              {wordsCorrect} <span className="text-sm opacity-50 font-medium">/ {totalWords}</span>
            </p>
          </div>

          <div className="bg-red-50/50 p-5 rounded-3xl text-center border border-red-100 transition-transform hover:scale-[1.02]">
            <p className="text-[10px] text-red-600 font-black uppercase tracking-wider mb-1">إجمالي الأخطاء</p>
            <p className="text-3xl font-black text-red-700">
              {errors}
            </p>
          </div>
        </div>

        {/* FINAL RATING CARD */}
        <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100 relative shadow-inner overflow-hidden">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
            التقييم الواقعي النهائي
          </p>
          <p className={`text-4xl font-black drop-shadow-sm ${accuracy < 30 ? 'text-red-600' : 'text-indigo-700'}`}>
            {rating}
          </p>
        </div>

        {/* AI FEEDBACK SECTION */}
        {results?.feedback && (
          <div className="bg-amber-50/40 p-5 rounded-2xl text-sm text-amber-900 border border-amber-100 italic font-medium leading-relaxed text-center relative">
            <AlertCircle className="absolute -top-2 -right-2 text-amber-400 bg-white rounded-full" size={20} />
            " {results.feedback} "
          </div>
        )}

        {/* WORD ANALYSIS (VISUALIZATION) - تحسين عرض الكلمات المنفصلة */}
        {results?.wordsAnalysis?.length > 0 && (
          <div className="bg-slate-50/80 p-5 rounded-[2rem] border border-slate-100">
            <p className="text-xs font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <CheckCircle2 size={14} className="text-green-500" /> مراجعة نطق الكلمات:
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {results.wordsAnalysis.map((w, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                    w.status === "correct"
                      ? "bg-white border-green-200 text-green-700"
                      : w.status === "wrong"
                      ? "bg-red-50 border-red-200 text-red-700 animate-pulse"
                      : "bg-white border-slate-200 text-slate-400 opacity-60"
                  }`}
                >
                  {w.status === "correct" && <CheckCircle2 size={12} className="text-green-500" />}
                  {w.status === "wrong" && <XCircle size={12} className="text-red-500" />}
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          <button
            onClick={onNext}
            disabled={accuracy < 10} // منع الانتقال إذا كان الأداء ضعيفاً جداً لفرض الجدية
            className={`group relative w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl flex justify-center items-center gap-3 ${
              accuracy < 10 ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black text-white'
            }`}
          >
            بدء تمارين الفهم
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onRetry}
            className="w-full bg-white hover:bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-colors border-2 border-slate-200"
          >
            إعادة محاولة القراءة
            <RotateCcw size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}