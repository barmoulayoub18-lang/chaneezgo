"use client";
import React, { useEffect } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ExternalLink, Sparkles } from 'lucide-react';

export default function AssignmentUploader({ courseId, lessonId, userId }) {
  const { 
    uploading, 
    status, 
    mySubmissions, 
    fetchMySubmissions, 
    uploadAssignment 
  } = useAssignments();

  // جلب سجل تسليمات الطالب لهذا الدرس عند تحميل المكون
  useEffect(() => {
    // بما أن النظام مجاني، نتحقق فقط من وجود معرف المستخدم لجلب بياناته
    if (userId) fetchMySubmissions(userId);
  }, [userId, fetchMySubmissions]);

  // تصفية التسليمات الخاصة بهذا الدرس فقط
  const currentSubmission = mySubmissions?.find(
    (s) => s.lesson_id === lessonId && s.course_id === courseId
  );

  return (
    <div className="bg-[#0f172a]/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload size={20} className="text-indigo-400" />
                تسليم الواجب الدراسي
              </h3>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-black uppercase flex items-center gap-1">
                 <Sparkles size={8} /> FREE ACCESS
              </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">يرجى رفع ملف PDF أو Word فقط لمراجعته من قبل المدرب</p>
        </div>
        
        {currentSubmission && (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            currentSubmission.status === 'graded' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
          }`}>
            {currentSubmission.status === 'graded' ? 'تم التقييم' : 'قيد المراجعة'}
          </span>
        )}
      </div>

      {!currentSubmission ? (
        <button
          onClick={() => uploadAssignment(courseId, lessonId, userId)}
          disabled={uploading}
          className={`
            w-full py-8 border-2 border-dashed rounded-2xl transition-all duration-300
            flex flex-col items-center justify-center gap-3
            ${uploading 
              ? 'border-indigo-500/50 bg-indigo-500/5 cursor-wait' 
              : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5 cursor-pointer'}
          `}
        >
          {uploading ? (
            <Loader2 className="text-indigo-400 animate-spin" size={32} />
          ) : (
            <div className="p-4 bg-slate-800/50 rounded-full group-hover:scale-110 transition-transform">
                <FileText className="text-slate-500" size={32} />
            </div>
          )}
          <span className="text-sm font-medium text-slate-300">
            {uploading ? 'جاري معالجة الملف...' : 'اضغط هنا لرفع الواجب مجاناً'}
          </span>
        </button>
      ) : (
        <div className="space-y-4">
          {/* عرض الملف المرفوع حالياً */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <FileText size={18} className="text-indigo-400" />
              </div>
              <div className="text-right overflow-hidden">
                <p className="text-xs font-bold text-white truncate max-w-[150px]">
                  {currentSubmission.file_name || 'ملف الواجب المرفوع'}
                </p>
                <p className="text-[10px] text-slate-500">تم التسليم بنجاح</p>
              </div>
            </div>
            <a 
              href={currentSubmission.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ExternalLink size={16} />
            </a>
          </div>

          {/* عرض التقييم إذا وجد */}
          {currentSubmission.status === 'graded' && (
            <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="text-xs font-black text-green-400 uppercase">:ملاحظات المدرب</span>
                <CheckCircle size={14} className="text-green-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentSubmission.feedback || 'لا توجد ملاحظات مكتوبة من قبل المدرب.'}
              </p>
              <div className="mt-3 pt-3 border-t border-green-500/10 flex justify-between items-center">
                <span className="text-sm font-black text-white">{currentSubmission.grade}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">:التقييم النهائي</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* تنبيهات الحالة */}
      {status.msg && (
        <div className={`mt-4 flex items-center gap-2 p-3 rounded-xl text-[11px] font-bold ${
          status.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
        }`}>
          {status.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          {status.msg}
        </div>
      )}
    </div>
  );
}