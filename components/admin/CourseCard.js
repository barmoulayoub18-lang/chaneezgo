"use client";
import { FileText, Trash2, ChevronLeft, Image as ImageIcon, Sparkles, GraduationCap } from 'lucide-react';

export default function CourseCard({ course, onDelete }) {
  return (
    <div className="bg-[#0f172a] p-5 rounded-[2.5rem] border border-slate-800 flex items-center justify-between group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      
      {/* معلومات الدورة - نظام مجاني مع تحديد المستوى */}
      <div className="flex items-center gap-4">
        {/* صورة الغلاف - الحفاظ على التصميم بدقة */}
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:border-indigo-500/30 transition-all duration-300 shadow-inner overflow-hidden">
          {course.image_url ? (
            <img 
              src={course.image_url} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="text-slate-600 group-hover:text-indigo-400 transition-colors">
              <FileText size={20} />
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-sm tracking-tight group-hover:text-indigo-100 transition-colors uppercase italic">
              {course.title}
            </h4>
            {/* ميزة جديدة: عرض المستوى الدراسي على البطاقة */}
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
              course.level === '5AP' 
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}>
              {course.level || '4AP'}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest bg-slate-800/50 px-2 py-0.5 rounded-md">
                ID: {course.id.slice(0, 8)}
              </span>
              
              {/* نظام الوصول المجاني الثابت */}
              <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/20">
                <Sparkles size={8} /> FREE ACCESS
              </span>

              {course.image_url && (
                <span className="hidden md:flex text-[8px] text-indigo-400/50 font-black uppercase tracking-widest items-center gap-1">
                  <ImageIcon size={10} /> THUMBNAIL
                </span>
              )}
          </div>
        </div>
      </div>

      {/* أزرار التحكم - الحفاظ على الوظائف الأصلية بصرامة */}
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={() => onDelete(course.id)} 
          className="p-3 bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-500/20 active:scale-95"
          title="حذف الدورة نهائياً"
        >
          <Trash2 size={18} />
        </button>
        
        <div className="p-2 text-slate-700 group-hover:text-indigo-500/50 transition-colors">
          <ChevronLeft size={16} />
        </div>
      </div>
    </div>
  );
}