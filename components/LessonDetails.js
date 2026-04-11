"use client";

import { BookOpen, CheckCircle, Clock, Play, FileText, Star } from "lucide-react";
import Link from "next/link";

export default function LessonDetails({ lesson }) {

  if (!lesson)
    return (
      <div className="mt-12 p-12 border-2 border-dashed border-slate-800 rounded-[3rem] text-center text-slate-500 bg-slate-900/20 animate-pulse">
        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={30} className="opacity-20" />
        </div>
        اختر درساً أو نصاً من القائمة لعرض تفاصيله وبدء التدريب
      </div>
    );

  // 🔥 الحل الحقيقي هنا
  const level = lesson.level?.toLowerCase() || "4ap";
  const index = lesson.order_index || 1;

  const readingPath = `/reading/${level}/${index}`;
  const exercisesPath = `/exercises/${level}/${index}`;

  return (
    <div
      key={lesson.id}
      className="mt-12 space-y-8 text-right animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10"
    >
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-row-reverse justify-end">

          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-5 py-2 rounded-2xl text-xs font-black uppercase">
            الدرس {index < 10 ? `0${index}` : index}
          </span>

          {lesson.level && (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-2xl text-xs font-black uppercase">
              مستوى {lesson.level}
            </span>
          )}

          <span className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800/80 px-4 py-2 rounded-2xl">
            <Clock size={14} /> 1 دقيقة قراءة
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl font-black text-white">
          {lesson.title}
        </h2>
      </div>

      {/* Description */}
      <div className="relative p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50">
        <div className="absolute -right-2 top-6 bottom-6 w-1.5 bg-indigo-600 rounded-full"></div>
        <p className="text-slate-300 text-xl pr-6">
          {lesson.description || "استعد لقراءة هذا النص بطلاقة."}
        </p>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400 text-sm">
        <div className="flex items-center gap-2 bg-slate-800/30 p-3 rounded-xl">
          <Star size={16} className="text-yellow-500" />
          تحسين مخارج الحروف
        </div>

        <div className="flex items-center gap-2 bg-slate-800/30 p-3 rounded-xl">
          <Star size={16} className="text-blue-500" />
          زيادة السرعة القرائية
        </div>

        <div className="flex items-center gap-2 bg-slate-800/30 p-3 rounded-xl">
          <Star size={16} className="text-green-500" />
          فهم النص
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

        {/* 🔥 القراءة */}
        <Link href={readingPath} className="contents">
          <button className="flex items-center justify-between p-8 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-500 transition-all group shadow-xl">
            <div className="p-4 bg-white/10 rounded-2xl">
              <Play size={28} className="text-white" />
            </div>

            <div className="text-right">
              <h4 className="text-white text-xl font-black">
                ابدأ التدريب الآن
              </h4>
              <p className="text-indigo-100 text-sm">
                فتح الميكروفون والبدء
              </p>
            </div>
          </button>
        </Link>

        {/* 🔥 التمارين */}
       

      </div>

      {/* Complete */}
      <button className="w-full py-5 rounded-2xl border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-3 font-bold">
        <CheckCircle size={20} />
        تحديد هذا النص كـ "تمت قراءته"
      </button>
    </div>
  );
}