"use client";

import {
  Star,
  RotateCcw,
  ArrowRight,
  Award,
  CheckCircle2,
  XCircle,
  Timer,
  AlertCircle
} from "lucide-react";

export default function ScoreBoard({ results, onRetry, onNext }) {

  // =============================
  // 🎯 استخراج القيم بدقة
  // =============================
  const accuracy = Number(results?.accuracy || 0);
  const stars = Number(results?.stars || 0);
  const wpm = Number(results?.wpm || 0);

  const wordsCorrect = Number(results?.correctWordsCount || 0);
  const wordsRead = Number(results?.wordsRead || 0); // 🔥 المهم
  const errors = Number(results?.errorsCount || 0);

  const rating = results?.rating || "غير محدد";

  // =============================
  // 🎨 ألوان ديناميكية
  // =============================
  const accuracyColor =
    accuracy >= 80 ? "text-green-600" :
    accuracy >= 50 ? "text-yellow-500" :
    "text-red-500";

  // =============================
  // 🚀 UI
  // =============================
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border max-w-xl mx-auto animate-in fade-in zoom-in duration-500 mb-10">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-8 text-white text-center">

        <Award className="mx-auto mb-4 text-yellow-300" size={56} />

        <h2 className="text-2xl font-black mb-2">
          نتيجة القراءة النهائية
        </h2>

        <p className="text-sm opacity-90 mb-4">
          تحليل دقيق مبني على الكلمات المنطوقة فقط
        </p>

        {/* ⭐ STARS */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={30}
              fill={s <= stars ? "#fde047" : "transparent"}
              className={s <= stars ? "text-yellow-300" : "text-white/20"}
            />
          ))}
        </div>
      </div>

      <div className="p-8 space-y-8">

        {/* =============================
            📊 ACCURACY
        ============================= */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-500">
              دقة القراءة
            </span>
            <span className={`text-xl font-black ${accuracyColor}`}>
              {accuracy}%
            </span>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                accuracy >= 80 ? "bg-green-500" :
                accuracy >= 50 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* =============================
            ⚡ WPM
        ============================= */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Timer size={14} /> السرعة
            </span>
            <span className="font-black text-indigo-600">
              {wpm} WPM
            </span>
          </div>
        </div>

        {/* =============================
            🔢 STATS (🔥 مصححة)
        ============================= */}
        <div className="grid grid-cols-2 gap-4">

          {/* الكلمات الصحيحة */}
          <div className="bg-green-50 p-5 rounded-2xl text-center">
            <p className="text-xs text-green-600 font-bold mb-1">
              الكلمات الصحيحة
            </p>
            <p className="text-3xl font-black text-green-700">
  {wordsRead}
</p>
          </div>

          {/* الأخطاء */}
          <div className="bg-red-50 p-5 rounded-2xl text-center">
            <p className="text-xs text-red-600 font-bold mb-1">
              الأخطاء
            </p>
            <p className="text-3xl font-black text-red-700">
              {errors}
            </p>
          </div>

        </div>

        {/* =============================
            🧠 RATING
        ============================= */}
        <div className="bg-slate-50 p-6 rounded-2xl text-center">
          <p className="text-xs text-slate-400 mb-1">
            التقييم النهائي
          </p>
          <p className="text-3xl font-black text-indigo-700">
            {rating}
          </p>
        </div>

        {/* =============================
            💬 FEEDBACK
        ============================= */}
        {results?.feedback && (
          <div className="bg-amber-50 p-5 rounded-xl text-center text-amber-800">
            <AlertCircle className="mx-auto mb-2" />
            {results.feedback}
          </div>
        )}

        {/* =============================
            🔍 WORDS ANALYSIS
        ============================= */}
        {results?.wordsAnalysis?.length > 0 && (
          <div className="bg-slate-50 p-5 rounded-2xl">
            <p className="text-sm font-bold mb-3 text-center">
              تحليل الكلمات
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {results.wordsAnalysis.map((w, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    w.status === "correct"
                      ? "bg-green-200 text-green-800"
                      : w.status === "wrong"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* =============================
            🔘 ACTIONS
        ============================= */}
        <div className="space-y-3">
          <button
            onClick={onNext}
            className="w-full bg-black text-white py-4 rounded-xl font-bold"
          >
            بدء التمارين
          </button>

          <button
            onClick={onRetry}
            className="w-full border py-4 rounded-xl font-bold"
          >
            إعادة المحاولة
          </button>
        </div>

      </div>
    </div>
  );
}