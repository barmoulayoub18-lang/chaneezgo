"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Sidebar";
import LessonDetails from "@/components/LessonDetails";
import AIChatBot from "@/components/AIChatBot";
import AssignmentUploader from "@/components/Student/AssignmentUploader";
import CertificateRequest from "@/components/Student/CertificateRequest";
import ProgressBar from "@/components/Course/ProgressBar";

import {
  Menu, X, FileText, ExternalLink,
  ImageIcon, PlayCircle,
  ChevronLeft, LayoutGrid, Info,
  Lock, Loader2, CheckCircle2, Mic2
} from "lucide-react";

import Link from "next/link";

export default function CourseView() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  // =========================================
  // FETCH
  // =========================================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        setUser(session.user);

        // جلب بيانات الدورة
        const { data: courseData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        if (courseData) setCourse(courseData);

        // جلب الدروس
        const { data: lessonsData } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("order_index", { ascending: true });

        if (lessonsData?.length) {
          setLessons(lessonsData);
          setCurrentLesson(lessonsData[0]);
        }

        // جلب تقدم الطالب
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("lesson_id")
          .eq("user_id", session.user.id)
          .eq("course_id", courseId);

        if (progressData && lessonsData) {
          const completed = progressData.map(p => p.lesson_id);
          setCompletedLessons(completed);

          const percent = Math.round((completed.length / lessonsData.length) * 100);
          setProgressPercent(percent);
        }

      } catch (e) {
        console.error("Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, router]);

  // تحديث الفيديو عند تغيير الدرس
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentLesson]);

  // =========================================
  // COMPLETE
  // =========================================
  const markLessonAsComplete = async (lessonId) => {
    if (!user || completedLessons.includes(lessonId)) return;

    const { error } = await supabase.from("user_progress").upsert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: new Date().toISOString()
    });

    if (!error) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);

      if (lessons.length > 0) {
        const percent = Math.round((updated.length / lessons.length) * 100);
        setProgressPercent(percent);
      }
    }
  };

  // =========================================
  // URL GENERATOR
  // =========================================
  const getUrl = () => {
    if (!currentLesson?.cloudinary_public_id) return "#";

    const id = currentLesson.cloudinary_public_id;
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // إذا كان الرابط كاملاً بالفعل (مثل YouTube أو Drive)
    if (id.startsWith("http")) return id;

    // التعامل مع روابط Cloudinary بناءً على النوع
    const type = currentLesson.type?.toLowerCase();
    if (type === "video") {
      return `https://res.cloudinary.com/${cloud}/video/upload/${id}`;
    }
    
    // للصور أو ملفات PDF
    return `https://res.cloudinary.com/${cloud}/image/upload/${id}`;
  };

  // =========================================
  // CONTENT RENDERER
  // =========================================
  const renderContent = () => {
    if (!currentLesson) return (
      <div className="p-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
        <Info className="mx-auto mb-4 text-slate-500" size={40} />
        <p className="text-slate-500 font-bold">لا يوجد محتوى متوفر لهذا الدرس حالياً</p>
      </div>
    );

    const type = currentLesson.type?.toLowerCase();
    const url = getUrl();

    // 🎤 نظام التدريب القرائي (Reading/Mic)
    if (type === "reading") {
      return (
        <div className="p-12 text-center bg-gradient-to-b from-indigo-900/40 to-indigo-950/60 rounded-[3rem] border border-indigo-500/20 shadow-2xl">
          <div className="p-6 bg-indigo-500/20 rounded-full w-fit mx-auto mb-6">
            <Mic2 size={48} className="text-indigo-400 animate-pulse" />
          </div>

          <h2 className="text-white text-3xl font-black mb-4 italic uppercase">
            مختبر الطلاقة الصوتية
          </h2>
          <p className="text-indigo-200/60 text-sm mb-8 max-w-md mx-auto font-medium">
            سيقوم النظام بتحليل نطقك ومخارج الحروف بدقة باستخدام الذكاء الاصطناعي
          </p>

          <Link
            href={`/reading/${course?.level?.toLowerCase() || '4ap'}/${currentLesson.order_index}`}
            className="bg-white text-indigo-950 hover:bg-indigo-50 px-10 py-5 rounded-2xl font-black flex items-center gap-3 mx-auto w-fit transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/10"
          >
             ابدأ اختبار القراءة الآن <PlayCircle size={22} />
          </Link>
        </div>
      );
    }

    // 📹 الفيديو التعليمي
    if (type === "video") {
      return (
        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5">
          <video
            ref={videoRef}
            controls
            controlsList="nodownload"
            className="w-full aspect-video bg-black"
            onEnded={() => markLessonAsComplete(currentLesson.id)}
          >
            <source src={url} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>
      );
    }

    // 📄 الملفات والروابط الخارجية
    return (
      <div className="group relative">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => markLessonAsComplete(currentLesson.id)}
          className="flex flex-col items-center justify-center gap-6 p-16 bg-slate-900 hover:bg-slate-800/80 rounded-[3rem] border border-slate-800 transition-all hover:border-indigo-500/50 group"
        >
          <div className="p-6 bg-slate-800 rounded-[2rem] group-hover:scale-110 transition-transform duration-500">
             {type === 'pdf' ? <FileText size={50} className="text-red-400" /> : <ExternalLink size={50} className="text-indigo-400" />}
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-white mb-2">فتح المورد التعليمي</span>
            <span className="text-slate-500 text-sm uppercase tracking-widest font-black">اضغط للمعاينة أو التحميل</span>
          </div>
        </a>
      </div>
    );
  };

  // =========================================
  // UI RENDER
  // =========================================
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden">

      {/* القائمة الجانبية (Sidebar) */}
      <aside className="hidden lg:block w-[22rem] bg-slate-950 border-r border-slate-900 h-full overflow-y-auto custom-scrollbar">
        <Sidebar
          lessons={lessons}
          currentLesson={currentLesson}
          completedLessons={completedLessons}
          setCurrentLesson={setCurrentLesson}
        />
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-10 scroll-smooth custom-scrollbar">
        
        {/* شريط التقدم العلوي */}
        <div className="max-w-5xl mx-auto">
          <ProgressBar progress={progressPercent} />
        </div>

        {/* عنوان الدرس الحالي */}
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">الدرس الحالي</span>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter italic">
              {currentLesson?.title || "حدد درساً للبدء"}
            </h1>
          </div>
          {completedLessons.includes(currentLesson?.id) && (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 animate-in fade-in zoom-in">
              <CheckCircle2 size={18} />
              <span className="text-[10px] font-black uppercase">مكتمل</span>
            </div>
          )}
        </div>

        {/* عرض المحتوى (فيديو/قراءة/ملف) */}
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>

        {/* تفاصيل الدرس والوصف */}
        <div className="max-w-5xl mx-auto">
          <LessonDetails lesson={currentLesson} />
        </div>

        {/* نظام رفع الواجبات */}
        <div className="max-w-5xl mx-auto border-t border-slate-900 pt-10">
          <AssignmentUploader
            courseId={courseId}
            lessonId={currentLesson?.id}
            userId={user?.id}
          />
        </div>

        {/* طلب الشهادة (يظهر عند اكتمال الدورة فقط) */}
        {progressPercent === 100 && (
          <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-10 duration-1000">
            <CertificateRequest
              courseTitle={course?.title}
              studentName={user?.user_metadata?.full_name || user?.email}
            />
          </div>
        )}

        {/* تذيل الصفحة البسيط */}
        <div className="max-w-5xl mx-auto text-center pb-10">
           <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">جميع الحقوق محفوظة منصة التعليم الذكية 2026</p>
        </div>
      </main>

      {/* المساعد الذكي */}
      <AIChatBot
        lessonTitle={currentLesson?.title}
        lessonDescription={currentLesson?.description}
      />
    </div>
  );
}


