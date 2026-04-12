'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, Clock, 
  ChevronLeft, Sparkles, Trophy, 
  PlayCircle, ArrowUpRight, Loader2,
  UserCircle, LogOut, CheckCircle2, Medal,
  Zap, Star, Target
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  router.replace("/login");
  return;
}

const authUser = session.user;


        // جلب البروفايل مع النقاط والبيانات الإضافية
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        if (profileData?.role === 'admin') {
          router.replace('/Admin');
          return;
        }

        // جلب الكورسات
        const { data: allCourses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (coursesError) throw coursesError;

        // جلب تقدم المستخدم
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('course_id, progress_percent')
          .eq('user_id', authUser.id);

        const coursesWithProgress = allCourses.map(course => {
          const progressEntry = progressData?.find(p => p.course_id === course.id);
          return {
            ...course,
            progress: progressEntry ? progressEntry.progress_percent : 0
          };
        });

        if (coursesWithProgress.length > 0) {
          const total = coursesWithProgress.reduce((acc, curr) => acc + curr.progress, 0);
          setOverallProgress(Math.round(total / coursesWithProgress.length));
        }

        setUser({ ...authUser, ...profileData });
        setCourses(coursesWithProgress);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
          <Loader2 className="text-indigo-500 animate-pulse" size={40} />
        </div>
        <p className="text-slate-500 font-black text-[10px] tracking-[0.4em] uppercase animate-pulse">مزامنة العقل الرقمي...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 relative overflow-hidden" dir="rtl">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] bg-indigo-500/5 w-fit px-3 py-1 rounded-full border border-indigo-500/10">
              <Zap size={12} className="fill-indigo-400" /> المركز التعليمي النشط
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-tight uppercase">
              مرحباً، <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.full_name?.split(' ')[0] || 'أيها البطل'}</span> ✨
            </h1>
            <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">أنت الآن في المنطقة الحرة. استمر في تطوير مهاراتك والوصول إلى أهدافك المهنية.</p>
          </div>
          
          <div className="flex items-center gap-5 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] hover:bg-white/[0.05] transition-all group">
             <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-[#020617] rounded-full"></div>
             </div>
             <div className="text-right">
                <p className="text-sm font-black text-white mb-1 uppercase tracking-tighter">{user?.full_name}</p>
                <button 
                  onClick={handleLogout}
                  className="text-[9px] text-slate-500 hover:text-red-400 uppercase font-black tracking-widest flex items-center gap-1.5 transition-colors"
                >
                  <LogOut size={12} /> إنهاء الجلسة
                </button>
             </div>
          </div>
        </header>

        {/* --- Quick Insight Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <StatBox label="الدورات المفعلة" value={courses.length} icon={<BookOpen size={20} />} color="indigo" />
          <StatBox label="معدل الإنجاز" value={`${overallProgress}%`} icon={<Target size={20} />} color="amber" />
          <StatBox label="رصيد النقاط" value={user?.points || '0'} icon={<Star size={20} />} color="emerald" />
          <StatBox label="المستوى الحالي" value={overallProgress > 50 ? "متقدم" : "مبتدئ"} icon={<Trophy size={20} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- Main Area: Active Paths --- */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                <PlayCircle className="text-indigo-500" /> مساراتك الحالية
              </h2>
              <Link href="/courses" className="text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all">تصفح الكل</Link>
            </div>

            <div className="space-y-4">
              {courses.length > 0 ? courses.map((course) => (
                <Link 
                  key={course.id}
                  href={`/course/${course.id}`}
                  className="group flex flex-col md:flex-row md:items-center gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all relative overflow-hidden"
                >
                  {/* Course Image */}
                  <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden shrink-0 border border-white/5 relative bg-slate-900 group-hover:scale-95 transition-transform duration-500">
                    {course.image_url ? (
                      <img src={course.image_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={course.title} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-700">
                        <BookOpen size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                       <PlayCircle size={40} className="text-white drop-shadow-2xl" />
                    </div>
                  </div>

                  {/* Info & Progress */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded uppercase tracking-widest">المسار النشط</span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{course.progress}% مكتمل</span>
                    </div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-indigo-400 transition-colors leading-none">{course.title}</h4>
                    
                    {/* Professional Progress Bar */}
                    <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
                       <div 
                         className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                         style={{ width: `${course.progress}%` }}
                       />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {course.progress >= 100 ? (
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center animate-bounce">
                        <Medal size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all group-hover:rotate-12">
                        <ChevronLeft size={20} />
                      </div>
                    )}
                  </div>
                </Link>
              )) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* --- Sidebar: Insights & Rewards --- */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-400">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter px-2">رؤية التقدم</h2>
            
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
               <Sparkles className="absolute -right-8 -top-8 text-white/10 rotate-12 group-hover:scale-150 transition-transform duration-1000" size={180} />
               <div className="relative z-10">
                 <h3 className="text-white font-black text-2xl mb-3 leading-tight italic uppercase tracking-tighter">التعلم هو القوة ⚡</h3>
                 <p className="text-indigo-100/80 text-xs leading-relaxed font-bold mb-6 italic">
                   بصفتك مستخدماً لـ DIDACTILECT، لديك وصول كامل وغير محدود لكل التقنيات. استمر في إنهاء الدروس لرفع نقاطك وتصدر قائمة المتفوقين.
                 </p>
                 <Link href="/my-courses" className="flex items-center justify-center gap-2 w-full bg-white text-indigo-600 py-4 rounded-2xl text-[11px] font-black uppercase shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                   <LayoutDashboard size={16} /> العودة لمتابعة الدروس
                 </Link>
               </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl space-y-5">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500" /> إنجازاتك
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold">4 من 12</span>
               </div>
               <div className="flex gap-3 flex-wrap">
                  <AchievementBadge active={true} icon={<Zap size={14}/>} />
                  <AchievementBadge active={true} icon={<Target size={14}/>} />
                  <AchievementBadge active={overallProgress > 50} icon={<Medal size={14}/>} />
                  <AchievementBadge active={false} icon={<Star size={14}/>} />
               </div>
               <p className="text-[10px] text-slate-500 font-medium text-center italic mt-4 opacity-60 italic">
                 "أنت تتعلم بشكل أسرع من 70% من الطلاب هذا الشهر!"
               </p>
            </div>
          </div>

        </div>

        {/* --- Minimal Footer --- */}
        <footer className="mt-24 pt-10 border-t border-white/5 text-center pb-12 opacity-30">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
              DIDACTILECT Algeria • Intelligence Powered Education • 2026
            </p>
        </footer>
      </div>
    </div>
  );
}

// --- Sub-Components for Clean Code ---

function StatBox({ label, value, icon, color }) {
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-400/10',
    amber: 'text-amber-400 bg-amber-400/10',
    emerald: 'text-emerald-400 bg-emerald-400/10',
    purple: 'text-purple-400 bg-purple-400/10'
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 p-7 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-4 rounded-2xl ${colors[color]} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
          {icon}
        </div>
        <ArrowUpRight className="text-slate-800 group-hover:text-white transition-colors" size={20} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter italic">{value}</h3>
      </div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-1000 ${colors[color].split(' ')[1]}`}></div>
    </div>
  );
}

function AchievementBadge({ active, icon }) {
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
      active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-700 grayscale'
    }`}>
      {icon}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-800">
        <BookOpen size={40} />
      </div>
      <p className="text-slate-500 font-black uppercase text-xs tracking-widest mb-4">لا توجد مسارات دراسية حالياً</p>
      <Link href="/courses" className="text-indigo-400 font-bold text-xs hover:underline decoration-2">استكشف المكتبة المجانية</Link>
    </div>
  );
}



