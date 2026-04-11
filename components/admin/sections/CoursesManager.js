"use client";
import { PlusCircle, FileText, Trash2, ImageIcon, UploadCloud, X, CheckCircle2, Loader2, Sparkles, LayoutGrid, Layers } from 'lucide-react';

export default function CoursesManager({ 
  courses, 
  formData, 
  setFormData, 
  onCreate, 
  onDelete,
  onUploadImage, 
  uploading 
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. نموذج إنشاء دورة جديدة - بروتوكول الإدارة الصارم */}
      <div className="bg-[#0f172a] p-8 rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 self-start sticky top-24">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <PlusCircle className="text-indigo-500" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">إضافة مسار تعليمي</h2>
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mt-0.5">بروتوكول إدارة المسارات الدراسية</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* قسم رفع الصورة - التصميم الأصلي */}
          <div className="space-y-2 text-right">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">غلاف الدورة (Thumbnail)</label>
            {!formData.image_url ? (
              <button
                type="button"
                onClick={onUploadImage}
                disabled={uploading}
                className="w-full aspect-video bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group disabled:opacity-50 disabled:cursor-wait"
              >
                {uploading ? (
                  <Loader2 className="text-indigo-500 animate-spin" size={24} />
                ) : (
                  <div className="p-3 bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-slate-500 group-hover:text-indigo-400" size={24} />
                  </div>
                )}
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  {uploading ? 'جاري الاتصال بالمكتبة...' : 'رفع صورة الغلاف'}
                </span>
              </button>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 group">
                <img 
                  src={formData.image_url} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt="Course Preview" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button 
                    type="button"
                    onClick={onUploadImage}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-indigo-500 transition-all transform hover:scale-110"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, image_url: ''})}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all transform hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* تحديد المستوى الدراسي - صارم جداً وموروث آلياً للدروس */}
          <div className="space-y-2 text-right">
            <div className="flex justify-between items-center mr-2">
               <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md font-black uppercase">نظام الوراثة الآلي مفعّل</span>
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">تحديد المستوى الدراسي للمسار</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['4ap', '5ap'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({...formData, level: lvl})}
                  className={`py-3 rounded-2xl border-2 font-black text-xs transition-all flex items-center justify-center gap-2 uppercase ${
                    formData.level === lvl 
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/10' 
                    : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <LayoutGrid size={14} />
                  {lvl === '4ap' ? 'السنة الرابعة' : 'السنة الخامسة'}
                </button>
              ))}
            </div>
            <p className="text-[7px] text-slate-600 font-bold mt-1 mr-2 tracking-tighter">* ملاحظة: سيتم ضبط جميع دروس هذا المسار على نفس المستوى تلقائياً.</p>
          </div>

          <div className="space-y-2 text-right">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">عنوان المسار</label>
            <input 
              placeholder="مثلاً: دروس القراءة والتمارين..." 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm transition-all text-white" 
            />
          </div>

          {/* التصنيف */}
          <div className="space-y-2 text-right">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">التصنيف الموضوعي</label>
            <div className="relative">
                <select
                value={formData.category || 'general'}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-white appearance-none cursor-pointer"
                >
                <option value="general">عام (General)</option>
                <option value="reading">قراءة (Reading)</option>
                <option value="grammar">قواعد (Grammar)</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                    <Layers size={14} />
                </div>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">وصف الدورة</label>
            <textarea 
              placeholder="اكتب وصفاً مختصراً عما سيحتويه هذا المسار..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 h-24 resize-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all text-white custom-scrollbar"
            ></textarea>
          </div>
        </div>

        <button 
          type="button"
          onClick={onCreate}
          disabled={!formData.title || !formData.level || uploading}
          className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span>جاري الحفظ الآمن...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
                <Sparkles size={14} className="group-hover:animate-pulse" />
                <span>نشر المسار التعليمي</span>
            </div>
          )}
        </button>
      </div>

      {/* 2. قائمة المسارات الحالية - مع عرض ذكي للمستوى الموروث */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="text-right">
            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
                مكتبة الدروس والمسارات
            </h2>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">إجمالي الموارد المتاحة: {courses.length}</p>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
             <FileText size={20} />
          </div>
        </div>

        <div className="space-y-3 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar text-right">
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-[#0f172a] rounded-[2.5rem] border border-dashed border-slate-800">
              <p className="text-slate-600 font-bold text-xs uppercase tracking-widest italic">لا توجد دورات منشورة بعد</p>
            </div>
          ) : (
            courses.map(course => (
              <div 
                key={course.id} 
                className="bg-[#0f172a] p-4 rounded-[2.5rem] border border-slate-800 flex items-center justify-between group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/30 transition-all shrink-0">
                    {course.image_url ? (
                      <img src={course.image_url} className="w-full h-full object-cover" alt={course.title} />
                    ) : (
                      <FileText className="text-slate-600" size={20} />
                    )}
                  </div>
                  <div className="text-right overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[8px] px-2 py-0.5 rounded-full border font-black uppercase ${
                        course.level === '5ap' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>
                         {course.level || 'N/A'}
                      </span>
                      <h4 className="font-bold text-white text-sm tracking-tight truncate max-w-[150px]">{course.title}</h4>
                    </div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                       {course.category || 'General'} • {course.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                    <button 
                    type="button"
                    onClick={() => onDelete(course.id)} 
                    className="p-3 bg-red-500/5 text-red-500/30 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-500/20 transform hover:rotate-6 shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}