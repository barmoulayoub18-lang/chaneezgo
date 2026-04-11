"use client";

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Loader2, ShieldCheck, LogOut, Users, Settings,
  PlusCircle, MessageSquare, LayoutDashboard,
  CheckCircle2, Languages, TrendingUp, FileText, Calendar, ExternalLink
} from 'lucide-react';

// استيراد الـ Hooks المخصصة
import { useAdminData } from '@/hooks/useAdminData';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

// استيراد المكونات الفرعية
import UsersManagement from '@/components/admin/sections/UsersManagement';
import CoursesManager from '@/components/admin/sections/CoursesManager';
import ContentUploader from '@/components/admin/sections/ContentUploader';
import SupportManager from '@/components/admin/sections/SupportManager';

// مكون عرض التنبيهات (Status Alert)
const StatusAlert = ({ status, setStatus }) => {
  if (!status.msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500 border ${
      status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
    }`}>
      <div className={`p-2 rounded-lg ${status.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
        {status.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
      </div>
      <p className="text-sm font-black italic">{status.msg}</p>
      <button onClick={() => setStatus({ msg: '', type: '' })} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users_management');
  const router = useRouter();
  const { changeLanguage } = useGoogleTranslate();
  
  const {
    loading, allUsers, courses, tickets,
    studentsProgress, submittedHomework,
    status, setStatus,
    handleToggleUserActivation, handleChangeRole, handleDeleteUser,
    handleCreateCourse, handleDeleteCourse, openCloudinary,
    openCourseImageUploader,
    handleResolveTicket, handleDeleteTicket,
    courseFormData, setCourseFormData, lessonFormData, setLessonFormData, uploading
  } = useAdminData();

  // إحصائيات سريعة
  const pendingTicketsCount = tickets?.filter(t => t.status === 'pending').length || 0;
  // تحسين حساب الواجبات المعلقة بناءً على حقل الحالة في قاعدة البيانات
  const pendingHomeworkCount = submittedHomework?.filter(h => h.status === 'pending' || !h.status).length || 0;

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest italic notranslate">ADMIN SECURITY CHECK...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 text-right font-sans selection:bg-indigo-500/30" dir="rtl">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="beforeInteractive" />

      <style jsx global>{`
        .fixed.top-4.right-4, .fixed.top-4.left-4 { display: none !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - التصميم الأصلي الفاخر */}
        <header className="flex flex-col xl:flex-row items-center justify-between bg-[#0f172a]/80 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-slate-800 shadow-2xl gap-6 sticky top-4 z-50">
          
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">EduStream Panel</h1>
              <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Management Suite v4.0</p>
            </div>
          </div>

          <nav className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: 'users_management', icon: Users, label: `الأعضاء (${allUsers.length})` },
              { id: 'student_progress', icon: LayoutDashboard, label: 'التقدم الدراسي' },
              { id: 'homework_management', icon: FileText, label: 'مركز الواجبات', badge: pendingHomeworkCount },
              { id: 'courses_management', icon: Settings, label: 'إدارة الدورات' },
              { id: 'add_content', icon: PlusCircle, label: 'رفع محتوى' },
              { id: 'support_tickets', icon: MessageSquare, label: 'تذاكر الدعم', badge: pendingTicketsCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <tab.icon size={15} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="bg-orange-500 text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse border border-slate-900">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
               {['ar', 'en', 'fr'].map((lang) => (
                 <button
                   key={lang}
                   onClick={() => changeLanguage(lang)}
                   className="px-3 py-1 rounded-lg text-[10px] font-black hover:bg-indigo-600 transition-all uppercase"
                 >
                   {lang}
                 </button>
               ))}
            </div>

            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        <StatusAlert status={status} setStatus={setStatus} />

        {/* Main Content Areas */}
        <main className="min-h-[60vh] pb-20">
          {activeTab === 'users_management' && (
            <UsersManagement
              allUsers={allUsers}
              pendingUsers={[]} 
              onToggleActivation={handleToggleUserActivation}
              onChangeRole={handleChangeRole}
              onDelete={handleDeleteUser}
            />
          )}

          {activeTab === 'student_progress' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter text-indigo-400">
                    <TrendingUp size={36} />
                    تحليل التقدم الدراسي
                  </h2>
                </div>
                {studentsProgress.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {studentsProgress.map((prog, idx) => (
                       <div key={idx} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all group overflow-hidden relative shadow-lg">
                         <div className="flex justify-between items-start mb-6">
                           <div className="p-4 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-inner">
                             <Users className="text-indigo-500 group-hover:text-white" size={24} />
                           </div>
                           <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10 uppercase tracking-widest italic">Live Progress</span>
                         </div>
                         <h3 className="text-xl text-white font-black mb-1">{prog.profiles?.full_name}</h3>
                         <p className="text-slate-500 text-[11px] font-bold mb-6 uppercase tracking-widest border-b border-slate-800 pb-4 italic">
                            {prog.courses?.title || 'دورة تعليمية'}
                         </p>
                        
                         <div className="space-y-4 pt-2">
                           <div className="flex justify-between text-[11px] font-black uppercase italic">
                              <span className="text-slate-400">Course Completion</span>
                              <span className="text-indigo-400 text-sm tracking-tighter">{prog.completion_percentage}%</span>
                           </div>
                           <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                             <div
                               className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 transition-all duration-[1.5s] ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                               style={{ width: `${prog.completion_percentage}%` }}
                             />
                           </div>
                         </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <EmptyState icon={<Loader2 className="animate-spin opacity-20" />} title="لا يوجد بيانات حالية" desc="تتم مزامنة التقدم الدراسي تلقائياً عند تفاعل الطلاب مع الدروس." />
                )}
            </div>
          )}

          {activeTab === 'homework_management' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <h2 className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter text-emerald-400 mb-10">
                 <FileText size={36} />
                 تصحيح الواجبات المرفوعة
               </h2>
               {submittedHomework.length > 0 ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {submittedHomework.map((hw, idx) => (
                      <div key={idx} className="bg-[#0f172a] border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:bg-slate-800/40 transition-all shadow-sm border-r-4 border-r-emerald-500">
                        <div className="flex items-center gap-5">
                          <div className="bg-emerald-500/10 p-4 rounded-2xl shadow-inner">
                            <Calendar className="text-emerald-500" size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-white">{hw.profiles?.full_name}</h4>
                            <p className="text-[11px] text-slate-400 font-bold mb-1">{hw.lessons?.title}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">
                               Date: {new Date(hw.created_at).toLocaleDateString('ar-DZ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                            onClick={() => window.open(hw.file_url, '_blank')}
                            className="px-6 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
                            >
                            عينة الحل <ExternalLink size={12} />
                            </button>
                            <span className={`text-[8px] font-black text-center uppercase py-1 rounded-md ${hw.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {hw.status === 'completed' ? 'تم التصحيح' : 'قيد الانتظار'}
                            </span>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <EmptyState icon={<CheckCircle2 className="opacity-10" />} title="الكل مُصحح!" desc="لا توجد واجبات جديدة بانتظار المراجعة حالياً." />
               )}
            </div>
          )}

          {activeTab === 'courses_management' && (
            <CoursesManager
              courses={courses}
              formData={courseFormData}
              setFormData={setCourseFormData}
              onCreate={handleCreateCourse}
              onDelete={handleDeleteCourse}
              onUploadImage={openCourseImageUploader}
            />
          )}

          {activeTab === 'add_content' && (
            <ContentUploader
              courses={courses}
              formData={lessonFormData}
              setFormData={setLessonFormData}
              onUpload={openCloudinary}
              uploading={uploading}
            />
          )}

          {activeTab === 'support_tickets' && (
            <SupportManager
              tickets={tickets}
              onResolve={handleResolveTicket}
              onDelete={handleDeleteTicket}
            />
          )}
        </main>

        <footer className="pt-20 pb-10 text-center border-t border-slate-900 mt-20">
            <div className="flex flex-wrap justify-center gap-12 mb-10 opacity-30">
                <FooterStat value={allUsers?.length} label="إجمالي الطلاب" color="text-indigo-500" />
                <FooterStat value={courses?.length} label="الدورات النشطة" color="text-emerald-500" />
                <FooterStat value={tickets?.length} label="طلبات الدعم" color="text-amber-500" />
            </div>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.8em] italic">
              EduStream • Administrative Control Layer • 2026
            </p>
         </footer>
      </div>
    </div>
  );
}

// مكونات فرعية لتحسين القراءة (تم الحفاظ عليها)
function EmptyState({ icon, title, desc }) {
  return (
    <div className="bg-[#0f172a] border border-slate-800 p-20 rounded-[3.5rem] text-center border-dashed">
      <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
         <div className="text-slate-600 text-4xl">{icon}</div>
      </div>
      <p className="text-slate-400 font-black text-2xl tracking-tighter mb-3 uppercase">{title}</p>
      <p className="text-slate-600 text-[11px] font-bold max-w-sm mx-auto leading-relaxed italic">{desc}</p>
    </div>
  );
}

function FooterStat({ value, label, color }) {
  return (
    <div className="flex flex-col items-center group">
      <span className={`${color} font-black text-4xl tracking-tighter transition-all group-hover:scale-110`}>{value || 0}</span>
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">{label}</span>
    </div>
  );
}