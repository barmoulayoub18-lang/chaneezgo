"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function TextCard({ text, index }) {
  // 🔥 مهم جدًا: نحول index إلى رقم يبدأ من 1
  const textIndex = index + 1;

  const isLevel5 = text.level?.toLowerCase() === "5ap";

  const levelTheme = isLevel5
    ? {
        color: "bg-[#ff7675]",
        text: "5ème AP",
        border: "group-hover:border-[#ff7675]/30",
        shadow: "hover:shadow-[#ff7675]/20",
        btn: "bg-[#ff7675]/10 text-[#ff7675] hover:bg-[#ff7675] hover:text-white",
      }
    : {
        color: "bg-[#6c5ce7]",
        text: "4ème AP",
        border: "group-hover:border-[#6c5ce7]/30",
        shadow: "hover:shadow-[#6c5ce7]/20",
        btn: "bg-[#6c5ce7]/10 text-[#6c5ce7] hover:bg-[#6c5ce7] hover:text-white",
      };

  return (
    <div
      className={`group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col h-full relative transition-all duration-500 hover:-translate-y-2 shadow-sm ${levelTheme.shadow} hover:shadow-2xl`}
    >
      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={text.image || "/images/placeholder-text.jpg"}
          alt={text.title}
          fill
          className="object-cover transition-transform duration-[1000ms] group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div
          className={`absolute top-4 right-4 px-4 py-1.5 rounded-2xl text-[10px] font-black text-white ${levelTheme.color}`}
        >
          {levelTheme.text}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-7 flex flex-col flex-grow relative">
        <Sparkles className="absolute top-7 left-7 text-yellow-400 opacity-0 group-hover:opacity-100" />

        <h3 className="text-2xl font-black text-slate-800 mb-2">
          {text.title}
        </h3>

        <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic">
          "{text.content}"
        </p>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
            <Zap size={14} />
            <span className="text-xs font-bold">150 XP</span>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
            <BookOpen size={14} />
            <span className="text-xs font-bold">
              {text.questions?.length || 0} أسئلة
            </span>
          </div>
        </div>

        {/* 🔥 أهم تعديل هنا */}
        <Link
          href={`/reading/${text.level?.toLowerCase()}/${textIndex}`}
          className={`w-full py-4 rounded-xl text-center font-bold ${levelTheme.btn}`}
        >
          ابدأ القراءة →
        </Link>
      </div>
    </div>
  );
}