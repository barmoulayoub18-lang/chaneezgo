"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  User, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft,
  GraduationCap,
  LayoutGrid,
  Languages,
  LayoutDashboard,
  Mic2, // أيقونة الميكروفون للنظام الجديد
  Sparkles // أيقونة إضافية للتمييز
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const { changeLanguage } = useGoogleTranslate();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(profile?.role);
      }
      setLoading(false);
    };
    checkUserRole();
  }, []);

  // روابط التنقل: تم إدراج "نظام الطلاقة اللغوية" كعنصر أساسي
  const navLinks = [
    { name: 'الرئيسية', icon: Home, path: '/' },
    { name: 'تصفح الدورات', icon: LayoutGrid, path: '/courses' }, 
    { name: 'لوحة التحكم', icon: LayoutDashboard, path: '/dashboard' },
    { 
      name: 'نظام الطلاقة اللغوية', 
      icon: Mic2, 
      path: '/reading/5ap', 
      isNew: true // وسم لتمييز الميزة الجديدة بصرياً
    },
    { name: 'دوراتي التعليمية', icon: BookOpen, path: '/my-courses' },
    { name: 'الدعم الفني', icon: MessageSquare, path: '/support' },
    { name: 'الملف الشخصي', icon: User, path: '/profile' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // واجهة المسؤول (Admin) - الحفاظ على التصميم الدقيق
  if (userRole === 'admin') {
    return (
      <div className="fixed top-4 right-4 z-[110] flex gap-2 notranslate" translate="no">
        {['ar', 'en', 'fr'].map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold hover:bg-indigo-600 transition-all uppercase backdrop-blur-md"
          >
            {lang === 'ar' ? 'AR' : lang.toUpperCase()}
          </button>
        ))}
        <button 
          onClick={handleLogout}
          className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* زر القائمة الرئيسي */}
      {!loading && (
        <div className={`fixed top-4 right-4 z-[110] transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}>
          <button 
            onClick={() => setIsOpen(true)}
            className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all border border-indigo-400/20 notranslate"
            translate="no"
          >
            <Menu size={22} />
          </button>
        </div>
      )}

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#020617]/60 backdrop-blur-md z-[90] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* القائمة الجانبية */}
      <aside className={`
        fixed top-0 right-0 h-full w-80 bg-[#020617]/95 backdrop-blur-2xl z-[120]
        border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `} dir="rtl">
        
        <div className="flex flex-col h-full p-8 relative">
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute left-6 top-8 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all notranslate"
            translate="no"
          >
            <X size={20} />
          </button>

          <div className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 notranslate" translate="no">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black italic text-white tracking-tighter uppercase notranslate" translate="no">EduStream</h2>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] notranslate" translate="no">Learning Ecosystem</p>
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-l from-indigo-500/50 to-transparent mt-6" />
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">التنقل السريع</p>
            {navLinks.map((link) => {
              // منطق الـ Active Link المطور ليشمل المسارات الفرعية للقراءة
              const active = pathname === link.path || (link.path.startsWith('/reading') && pathname.startsWith('/reading'));
              
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group relative
                    ${active 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="notranslate" translate="no">
                        <link.icon size={20} className={active ? 'text-white' : 'group-hover:text-indigo-400'} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      {link.name}
                      {link.isNew && !active && (
                        <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </span>
                  </div>
                  {active && (
                    <div className="notranslate" translate="no">
                      <ChevronLeft size={16} className="animate-pulse" />
                    </div>
                  )}
                </Link>
              );
            })}

            {/* قسم اختيار اللغة */}
            <div className="pt-6 mt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 flex items-center gap-2">
                <Languages size={12} /> لغة المنصة
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'ar', label: 'العربية (الافتراضية)', flag: '🇩🇿' },
                  { id: 'en', label: 'English', flag: '🇺🇸' },
                  { id: 'fr', label: 'Français', flag: '🇫🇷' }
                ].map((l) => (
                  <button 
                    key={l.id}
                    onClick={() => {
                      changeLanguage(l.id);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 text-[10px] font-bold text-slate-300 hover:bg-white/5 rounded-xl transition-all hover:text-white group text-right"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-lg group-hover:bg-indigo-600 transition-colors notranslate" translate="no">
                      {l.flag}
                    </span>
                    <span className="notranslate" translate="no">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* تذييل القائمة */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
            >
              <div className="notranslate" translate="no">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">تسجيل الخروج</span>
            </button>
            <div className="mt-8 flex flex-col items-center gap-2">
               <p className="text-center text-[8px] text-slate-600 font-bold uppercase tracking-[0.4em] notranslate" translate="no">
                EduStream v3.6.0 • 2026
              </p>
              <div className="flex gap-1">
                <Sparkles size={8} className="text-indigo-500/40" />
                <Sparkles size={8} className="text-indigo-500/40" />
              </div>
            </div>
          </div>

        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </>
  );
}