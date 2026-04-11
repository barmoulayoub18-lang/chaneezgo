'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  BookOpen, Play, Clock, Sparkles, Search,
  LayoutGrid, GraduationCap, 
  ArrowLeft, Loader2, CheckCircle2, TrendingUp
} from 'lucide-react';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllCoursesAsMyCourses = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }
      setUser(session.user);

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
        setFilteredCourses(data || []);
      }
      setLoading(false);
    };

    fetchAllCoursesAsMyCourses();
  }, []);

  // وظيفة البحث
  useEffect(() => {
    const results = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(results);
  }, [searchTerm, courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">جاري تحضير مكتبتك الذكية</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 relative overflow-hidden" dir="rtl">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* 🚀 Header & Dashboard Stats */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-3 text-right">
            <div className="flex items-center justify-end gap-2 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
               منصة التعليم المفتوح <GraduationCap size={16} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
              لوحة <span className="text-indigo-500 tracking-normal">المسارات</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">مرحباً <span className="text-white">{user?.user_metadata?.full_name || 'طالبنا المتميز'}</span>، استكشف مكتبتك الآن.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
              <StatCard label="المسارات المتاحة" value={courses.length} icon={<LayoutGrid size={16} />} />
              <StatCard label="وقت التعلم" value="∞" icon={<Clock size={16} />} />
          </div>
        </header>

        {/* 🔍 Search Bar */}
        <div className="mb-12 relative max-w-2xl ml-auto">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="ابحث عن كورس معين..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 pr-14 pl-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 📚 Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-md border-2 border-dashed border-white/5 p-20 rounded-[3rem] text-center flex flex-col items-center group">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="text-indigo-400/50" size={48} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 italic uppercase">لا توجد نتائج</h2>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm">
              لم نجد أي مسار تعليمي يطابق بحثك. حاول كتابة كلمات أخرى.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <footer className="mt-32 text-center pb-10 border-t border-white/5 pt-10">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">EduStream Intelligence • 2026</p>
        </footer>
      </div>
    </div>
  );
}

// 🗂️ Component: Course Card
function CourseCard({ course }) {
  return (
    <div className="group bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-indigo-500/40 transition-all duration-500 flex flex-col hover:-translate-y-2 shadow-2xl">
      <div className="h-56 relative overflow-hidden bg-slate-900">
        {course.image_url ? (
          <img 
            src={course.image_url} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center">
            <LayoutGrid className="text-indigo-500/20" size={40} />
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-20">
          <span className="backdrop-blur-md text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            وصول دائم
          </span>
        </div>

        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
            <Play size={24} fill="#4f46e5" className="text-indigo-600 mr-[-4px]" />
          </div>
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col text-right">
        <div className="flex items-center justify-end gap-2 mb-4">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">المسار المفتوح</span>
          <TrendingUp size={14} className="text-indigo-500" />
        </div>
        
        <h3 className="text-xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight italic uppercase tracking-tighter">
          {course.title}
        </h3>
        
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-8 font-medium">
          {course.description || 'ابدأ رحلة احتراف هذا المسار التعليمي الآن بجميع أدواته وموارده المجانية.'}
        </p>
        
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between flex-row-reverse">
          <Link 
            href={`/course/${course.id}`}
            className="flex items-center gap-2 bg-white text-black hover:bg-indigo-500 hover:text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all shadow-xl group/btn"
          >
            استمرار التعلم
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-2 text-slate-600 font-bold text-[9px] uppercase tracking-widest">
            <Clock size={12} />
            <span>متاح للأبد</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 📊 Component: Stat Card
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl px-8 py-4 flex items-center gap-4 group hover:bg-white/5 transition-colors">
      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-right">
        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
    </div>
  );
}