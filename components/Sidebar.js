"use client";

import { PlayCircle, Video, Lock, ChevronLeft, Sparkles, Mic2, FileText } from 'lucide-react';

export default function Sidebar({ lessons = [], currentLesson, setCurrentLesson }) {
  return (
    <aside className="w-full md:w-80 bg-[#020617] border-l border-white/5 h-full flex flex-col shadow-2xl relative z-40">
      
      {/* Logo Section - متناسق مع الهوية الجديدة */}
      <div className="p-8 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600/30 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
  <img 
    src="/images/logo.png" 
    alt="Logo" 
    className="h-8 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
  />
</div>
<h1 className="text-lg font-black text-white italic tracking-tighter uppercase">
  DIDACTI<span className="text-indigo-500">LECT</span>
</h1>
        </div>
      </div>

      {/* المحتوى القابل للتمرير */}
      <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar bg-[#020617]">
        <div className="flex items-center justify-between px-2 mb-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">محتوى المسار</h3>
          <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-indigo-500/20">
            {lessons?.length || 0} دروس
          </span>
        </div>
        
        {lessons && lessons.map((lesson, index) => {
          const isActive = currentLesson?.id === lesson.id;
          const isLocked = lesson.is_locked || false; 
          // تحديد نوع الدرس: فيديو أو قراءة تفاعلية
          const isReadingLesson = lesson.type === 'reading' || lesson.category === 'reading';
          
          return (
            <button
              key={lesson.id}
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) {
                  setCurrentLesson(lesson);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden border ${
                isActive 
                ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20 text-white translate-x-1' 
                : isLocked 
                  ? 'opacity-40 cursor-not-allowed border-transparent text-slate-600'
                  : 'text-slate-400 border-transparent hover:bg-white/[0.03] hover:text-slate-200 hover:border-white/5'
              }`}
            >
              {/* الرقم الترتيبي كخلفية جمالية */}
              <span className={`absolute -left-1 text-5xl font-black opacity-[0.03] italic pointer-events-none ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {index + 1}
              </span>

              {/* الأيقونة الجانبية - تتغير ديناميكياً حسب نوع الدرس (فيديو/ميكروفون) */}
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isActive 
                ? 'bg-white/20' 
                : isLocked ? 'bg-slate-900' : 'bg-slate-900 group-hover:bg-slate-800 border border-white/5'
              }`}>
                {isLocked ? (
                  <Lock size={16} className="text-slate-600" />
                ) : isActive ? (
                  isReadingLesson ? <Mic2 size={18} className="text-white animate-pulse" /> : <PlayCircle size={18} className="text-white animate-pulse" />
                ) : (
                  isReadingLesson ? <Mic2 size={18} className="text-indigo-400 group-hover:text-indigo-300" /> : <PlayCircle size={18} className="text-indigo-500 group-hover:text-indigo-400" />
                )}
              </div>

              {/* نصوص الدرس */}
              <div className="text-right flex-1 min-w-0 z-10">
                <span className={`block text-xs font-bold truncate transition-colors ${
                  isActive ? 'text-white' : isLocked ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  {lesson.title}
                </span>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 ${
                    isActive ? 'text-indigo-100/70' : 'text-slate-500'
                  }`}>
                    {isReadingLesson ? (
                      <><Sparkles size={10} className="text-orange-400" /> تدريب تفاعلي</>
                    ) : (
                      lesson.duration || 'فيديو'
                    )}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[9px] text-white/70 font-bold bg-white/10 px-1.5 py-0.5 rounded-md">
                      <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                      يتم العرض الآن
                    </span>
                  )}
                </div>
              </div>

              {/* سهم المؤشر للدرس النشط */}
              {!isLocked && isActive && (
                <div className="bg-white/20 p-1 rounded-full">
                  <ChevronLeft size={14} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer - مخصص للذكاء الاصطناعي */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/10 group cursor-default">
           <div className="flex items-center gap-3 mb-2">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">تلميح الذكاء الاصطناعي</span>
           </div>
           <p className="text-[10px] text-slate-500 leading-relaxed font-medium transition-colors group-hover:text-slate-400">
             هل تجد صعوبة في فهم الدرس؟ جرب سؤال المساعد الذكي في أسفل الشاشة للحصول على شرح فوري.
           </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #312e81;
        }
      `}</style>
    </aside>
  );
}


