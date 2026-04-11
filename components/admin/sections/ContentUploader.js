"use client";
import { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Loader2, 
  FileVideo, 
  ImageIcon, 
  FileText, 
  Link2, 
  CloudUpload, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  Mic2,
  Zap
} from 'lucide-react';

export default function ContentUploader({ 
  courses, 
  formData, 
  setFormData, 
  onUpload, 
  uploading 
}) {
  // تم الاستغناء عن حالة filterLevel لعدم الحاجة للأزرار اليدوية بعد الآن
  
  // =========================================
  // بروتوكول الربط التلقائي للمستوى
  // =========================================
  useEffect(() => {
    if (formData.courseId && courses.length > 0) {
      const selectedCourse = courses.find(c => c.id === formData.courseId);
      if (selectedCourse) {
        // تحديث المستوى تلقائياً في formData بناءً على مستوى الدورة المختارة
        setFormData(prev => ({
          ...prev,
          level: selectedCourse.level // ربط الدرس بمستوى الدورة الأب مباشرة
        }));
      }
    }
  }, [formData.courseId, courses, setFormData]);

  // عرض جميع المسارات مباشرة لتسهيل الاختيار من القائمة الموحدة
  const filteredCourses = courses;

  return (
    <div className="bg-[#0f172a] p-8 rounded-[3rem] border border-slate-800 shadow-2xl max-w-3xl mx-auto w-full animate-in zoom-in-95 duration-500">
      
      {/* العنوان - الحفاظ على التصميم بدقة صرامة */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <PlayCircle className="text-indigo-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">إضافة محتوى تعليمي</h2>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">بروتوكول رفع الدروس والموارد التلقائي</p>
        </div>
      </div>
      
      {/* تم استبدال نظام تصفية العرض اليدوي بمؤشر حالة ذكي لمنع التضارب */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-800">
           <Zap size={14} className="text-indigo-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نظام المزامنة الذكي مفعّل</span>
        </div>
        
        {/* عرض المستوى المكتشف تلقائياً - الحفاظ على التصميم الأصلي */}
        {formData.level && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-right-2">
             <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">
               تم كشف المستوى: {formData.level}
             </span>
          </div>
        )}
      </div>

      {/* اختيار المسار والترتيب */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2 text-right">
          <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">
            المسار المستهدف
          </label>
          <div className="relative group">
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all appearance-none cursor-pointer text-white"
              value={formData.courseId || ""} 
              onChange={e => setFormData({...formData, courseId: e.target.value})}
            >
              <option value="" disabled>اختر المسار التعليمي...</option>
              {filteredCourses.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.level?.toUpperCase()}] {c.title}
                </option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <AlertCircle size={14} />
            </div>
          </div>
        </div>

        <div className="space-y-2 text-right">
          <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">
            ترتيب الدرس
          </label>
          <input 
            type="number" 
            placeholder="مثلاً: 1" 
            value={formData.orderIndex || ""} 
            onChange={e => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-white" 
          />
        </div>
      </div>

      {/* تفاصيل الدرس ونوع المحتوى */}
      <div className="space-y-4 mb-8 text-right">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">عنوان الدرس</label>
            <input 
              placeholder="اكتب عنواناً جذاباً للدرس..." 
              value={formData.title || ""} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-white" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">نوع المورد</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all appearance-none cursor-pointer text-white"
              value={formData.type || "video"} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="video">فيديو تعليمي (MP4)</option>
              <option value="reading">تدريب قرائي تفاعلي (Mic)</option>
              <option value="image">صورة توضيحية (PNG/JPG)</option>
              <option value="pdf">ملف PDF / مستند</option>
              <option value="link">رابط خارجي (YouTube/Drive)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">وصف موجز</label>
          <textarea 
            placeholder="ماذا سيتعلم الطالب في هذا الدرس؟" 
            value={formData.description || ""} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 h-24 resize-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white custom-scrollbar"
          ></textarea>
        </div>
      </div>

      {/* منطقة الرفع / حالة الملف الحالي */}
      <div className="border-t border-slate-800 pt-8">
        {formData.fileUrl ? (
          <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-6 flex items-center justify-between animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-500">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-right">
                <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">تم تجهيز الملف للمستوى {formData.level}</p>
                <p className="text-slate-400 text-[11px] font-bold truncate max-w-[200px]">{formData.fileUrl}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setFormData({...formData, fileUrl: ""})}
              className="p-3 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={onUpload}
            disabled={uploading || !formData.title || !formData.courseId}
            className={`w-full py-12 border-2 border-dashed rounded-[2.5rem] transition-all group flex flex-col items-center gap-4 bg-slate-900/30 relative overflow-hidden
              ${uploading ? 'border-indigo-500 cursor-wait bg-indigo-500/5' : 'border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5'}
              ${(!formData.title || !formData.courseId) && !uploading ? 'opacity-40 cursor-not-allowed border-slate-800' : ''}`}
          >
            {uploading ? (
              <>
                <div className="relative">
                  <Loader2 className="animate-spin text-indigo-500" size={40} />
                  <CloudUpload className="absolute inset-0 m-auto text-indigo-300 opacity-50" size={16} />
                </div>
                <div className="text-center z-10">
                  <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">جاري معالجة ورفع الملف...</p>
                  <p className="text-slate-500 text-[8px] font-bold uppercase mt-1">تزامن المستوى الآمن: {formData.level || 'تحقق...'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/0 group-hover:shadow-indigo-500/20 text-slate-400">
                  {formData.type === 'video' && <FileVideo size={32} />}
                  {formData.type === 'reading' && <Mic2 size={32} />}
                  {formData.type === 'image' && <ImageIcon size={32} />}
                  {formData.type === 'pdf' && <FileText size={32} />}
                  {formData.type === 'link' && <Link2 size={32} />}
                </div>
                <div className="text-center">
                  <span className="block font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 group-hover:text-white transition-colors">
                    {formData.type === 'link' ? 'Add External Resource' : `Upload ${formData.type?.toUpperCase()} Lesson`}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 block group-hover:text-slate-400 font-black tracking-tighter">
                    {formData.courseId ? `سيتم الرفع للمستوى ${formData.level}` : "انقر لفتح نافذة الرفع الآمن"}
                  </span>
                </div>
              </>
            )}
          </button>
        )}
        
        {/* نظام التنبيهات التحذيرية */}
        {(!formData.title || !formData.courseId) && !uploading && !formData.fileUrl && (
          <div className="flex items-center justify-center gap-2 mt-4 animate-pulse">
            <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
            <p className="text-amber-500/70 text-[9px] font-black uppercase tracking-tighter">
              {!formData.courseId ? "يرجى اختيار المسار" : "يرجى كتابة عنوان الدرس"} لتفعيل بروتوكول الرفع
            </p>
            <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}