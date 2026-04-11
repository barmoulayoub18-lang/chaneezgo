'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  LayoutGrid, BookOpen, Search, 
  Sparkles, PlayCircle, 
  Loader2, GraduationCap, Clock, Layers
} from 'lucide-react';

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // جلب جميع الدورات مع عدد الدروس المرتبطة بكل دورة (اختياري لتحسين العرض)
        const { data: allCourses, error } = await supabase
          .from('courses')
          .select(`
            *,
            lessons (id)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(allCourses || []);
      } catch (err) {
        console.error("Error fetching courses:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // تصفية الدورات بناءً على البحث
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
        <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase italic notranslate">
          SYSTEM: FETCHING ACADEMY CORE...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans" dir="rtl">
      
      {/* Background Glows - التصميم الأصلي */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.3em] text-[11px] italic">
              <div className="w-8 h-[1px] bg-indigo-500/50"></div>
              <LayoutGrid size={16} className="text-indigo-500" /> مكتبة المحتوى الذكي
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
              استكشف <span className="text-indigo-500 text-glow">المسارات</span>
            </h1>
            <p className="text-slate-500 text-sm font-bold max-w-xl leading-relaxed italic border-r-2 border-indigo-500/20 pr-4">
              دخول غير محدود لجميع الدورات التدريبية. نظام تعلم مجاني ومفتوح المصدر لطلاب الجزائر.
            </p>
          </div>

          <div className="relative group w-full md:w-[400px]">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-all duration-300" size={20} />
            <input 
              type="text" 
              placeholder="عن ماذا تريد أن تتعلم اليوم؟"
              className="w-full bg-white/[0.02] border border-white/10 rounded-[1.5rem] py-5 pr-14 pl-6 text-sm font-bold focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group relative bg-[#0f172a]/40 border border-slate-800 rounded-[3rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-500 flex flex-col h-full shadow-2xl">
                
                {/* Course Image & Overlay */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#020617] flex items-center justify-center text-slate-700">
                      <GraduationCap size={64} strokeWidth={1} className="opacity-20" />
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-80"></div>
                  
                  {/* Badge: Free Access */}
                  <div className="absolute top-6 right-6 bg-slate-950/80 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    نظام مفتوح
                  </div>

                  {/* Course Stats Overlay */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                    <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md">
                        <Layers size={12} className="text-indigo-400" /> {course.lessons?.length || 0} دروس
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md">
                        <Clock size={12} className="text-indigo-400" /> {course.level || 'عام'}
                    </span>
                  </div>
                </div>

                {/* Course Content Area */}
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={14} className="text-amber-500 animate-bounce" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">Full Access Course</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 group-hover:text-indigo-400 transition-colors leading-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-500 text-[13px] font-bold leading-relaxed mb-10 line-clamp-3 italic">
                    {course.description || "استكشف محتوى هذه الدورة التدريبية المصممة بعناية لتناسب احتياجاتك الدراسية وتفوقك الأكاديمي..."}
                  </p>

                  <div className="mt-auto pt-8 border-t border-slate-800/50">
                    <Link 
                      href={`/course/${course.id}`} 
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/10 active:scale-95 group/btn"
                    >
                      <PlayCircle size={18} className="group-hover/btn:rotate-12 transition-transform" /> 
                      دخول الدورة الآن
                    </Link>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-1 -left-1 w-20 h-20 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - تصميم محسن */
          <div className="text-center py-40 bg-[#0f172a]/20 rounded-[4rem] border-2 border-dashed border-slate-800">
            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-800 shadow-inner">
              <BookOpen className="text-slate-700" size={40} />
            </div>
            <h3 className="text-white font-black text-2xl uppercase italic mb-3 tracking-tighter">لا توجد نتائج مطابقة</h3>
            <p className="text-slate-600 text-[11px] font-bold uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
              تأكد من دقة البحث أو جرب استكشاف المسارات المقترحة في الصفحة الرئيسية
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-32 py-16 border-t border-slate-900 text-center">
          <div className="flex justify-center items-center gap-6 mb-8 opacity-20">
             <div className="h-[1px] w-20 bg-slate-500"></div>
             <GraduationCap size={24} className="text-slate-500" />
             <div className="h-[1px] w-20 bg-slate-500"></div>
          </div>
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.8em] italic leading-loose">
            EduStream Algeria • Professional Learning Hub • 2026
          </p>
        </footer>
      </div>

      <style jsx>{`
        .text-glow { text-shadow: 0 0 30px rgba(79, 70, 229, 0.5); }
        .group:hover { transform: translateY(-8px); }
      `}</style>
    </div>
  );
}