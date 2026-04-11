"use client";
import React from 'react';
import { CheckCircle2, Trophy, Target } from 'lucide-react';

export default function ProgressBar({ progress }) {
  // التأكد من أن النسبة بين 0 و 100
  const percentage = Math.min(Math.max(progress || 0, 0), 100);
  const isCompleted = percentage === 100;

  return (
    <div className="w-full bg-[#0f172a]/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* تأثير ضوئي خلفي يزداد مع التقدم */}
      <div 
        className="absolute top-0 right-0 h-full bg-indigo-600/5 transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors duration-500 ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
              {isCompleted ? <Trophy size={20} /> : <Target size={20} />}
            </div>
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider">مستوى الإنجاز</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                {isCompleted ? "تهانينا! لقد أتممت الدورة" : "واصل العمل للوصول للقمة"}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`text-2xl font-black italic ${isCompleted ? 'text-green-400' : 'text-white'}`}>
              %{percentage}
            </span>
          </div>
        </div>

        {/* شريط التقدم الرئيسي */}
        <div className="relative h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div 
            className={`absolute top-0 right-0 h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] ${
              isCompleted 
              ? 'bg-gradient-to-l from-green-500 to-emerald-400' 
              : 'bg-gradient-to-l from-indigo-600 via-indigo-500 to-purple-500'
            }`}
            style={{ width: `${percentage}%` }}
          >
            {/* تأثير اللمعان المتحرك على الشريط */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        {/* مؤشرات تحت الشريط */}
        <div className="flex justify-between mt-3 px-1">
          <div className="flex items-center gap-1">
             <div className={`w-1.5 h-1.5 rounded-full ${percentage > 0 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
             <span className="text-[9px] text-slate-500 font-bold uppercase">البداية</span>
          </div>
          <div className="flex items-center gap-1">
             <span className="text-[9px] text-slate-500 font-bold uppercase">نقطة النهاية</span>
             <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}