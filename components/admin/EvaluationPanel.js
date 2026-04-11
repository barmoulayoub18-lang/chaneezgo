"use client";
import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  User, 
  BookOpen, 
  ExternalLink, 
  Send,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function EvaluationPanel({ submissions, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // منطق الفلترة والبحث الصارم
  const filteredSubmissions = submissions?.filter(sub => {
    const matchesSearch = 
      sub.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* رأس اللوحة وأدوات التصفية - الحفاظ على التصميم الأصلي */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a]/40 p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">قسم المتابعة والتقييم</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">مراجعة أعمال الطلاب وتصحيح الواجبات</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="بحث باسم الطالب أو الدورة..."
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all w-64 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1e293b] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500/50 cursor-pointer font-bold"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد الانتظار (جديد)</option>
            <option value="graded">تم التقييم (مكتمل)</option>
          </select>
        </div>
      </div>

      {/* قائمة الواجبات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubmissions.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-[#0f172a]/30 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center gap-4">
             <div className="p-4 bg-slate-800/50 rounded-full text-slate-600">
              <AlertCircle size={40} />
            </div>
            <p className="text-slate-500 font-black text-xs uppercase tracking-[0.2em]">لا توجد واجبات مرفوعة مطابقة للبحث حالياً</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <SubmissionCard 
              key={submission.id} 
              submission={submission} 
              onRefresh={onRefresh} 
            />
          ))
        )}
      </div>
    </div>
  );
}

function SubmissionCard({ submission, onRefresh }) {
  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isEditing, setIsEditing] = useState(submission.status === 'pending');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('assignments_submissions')
        .update({ 
          grade, 
          feedback, 
          status: 'graded' 
        })
        .eq('id', submission.id);

      if (!error) {
        setIsEditing(false);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#0f172a] border rounded-[2.5rem] p-8 transition-all duration-500 group relative overflow-hidden ${
      submission.status === 'graded' ? 'border-emerald-500/20 opacity-80' : 'border-slate-800 hover:border-indigo-500/40'
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <User size={24} />
          </div>
          <div>
            <h4 className="text-slate-200 font-black text-base italic">{submission.profiles?.full_name}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{submission.profiles?.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
          submission.status === 'graded' 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          {submission.status === 'graded' ? 'Graded' : 'New'}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
          <BookOpen size={14} className="text-indigo-500" />
          <span>المسار:</span> <span className="text-slate-200 italic">{submission.courses?.title || 'عام'}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
          <FileText size={14} className="text-indigo-500" />
          <span>الدرس:</span> <span className="text-slate-200 italic">{submission.lessons?.title}</span>
        </div>
        
        {/* عرض الملف المرفوع */}
        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 flex items-center justify-between group/file hover:border-indigo-500/30 transition-all">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <FileText size={16} />
             </div>
             <span className="text-[11px] font-bold text-slate-400 truncate max-w-[120px]">
                {submission.file_name || 'homework_file.pdf'}
             </span>
          </div>
          <a 
  href={submission.file_url} 
  target="_blank" 
  rel="noopener noreferrer"
  // إضافة download تجبر المتصفح أحياناً على تجاوز قيود العرض إذا كان الرابط مباشراً
  download={submission.file_name || "assignment.pdf"} 
  className="bg-indigo-500 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2 group"
>
  <span className="text-[10px] font-black uppercase tracking-widest">فتح الملف بأمان</span>
  <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
</a>
        </div>
      </div>

      {/* نموذج التقييم الصارم */}
      <div className="pt-6 border-t border-slate-800/50 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block px-1">الدرجة النهائية</label>
            <input 
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              disabled={!isEditing}
              placeholder="مثال: 10/10"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-indigo-500 transition-all disabled:opacity-50 font-bold"
            />
          </div>
          <div className="flex items-end">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-400/20 rounded-xl hover:bg-indigo-400/5 transition-all italic"
              >
                Edit Grade
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block px-1">ملاحظات التصحيح</label>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={!isEditing}
            placeholder="اكتب ملاحظاتك التقنية للطالب هنا..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-500 h-24 resize-none disabled:opacity-50 font-medium leading-relaxed"
          ></textarea>
        </div>

        {isEditing && (
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            {loading ? 'Processing...' : <><Send size={14} /> Send Assessment</>}
          </button>
        )}
      </div>
    </div>
  );
}


assignments_submissions