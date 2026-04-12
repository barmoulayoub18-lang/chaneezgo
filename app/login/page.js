"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) throw signUpError;

        // 🔥 إنشاء profile مباشرة
        if (signUpData.user) {
          await supabase.from('profiles').upsert({
            id: signUpData.user.id,
            email: signUpData.user.email,
            full_name: fullName,
            role: 'student'
          });
        }

        // 🔥 تسجيل الدخول مباشرة بعد إنشاء الحساب
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;

        // 🔥 أهم سطر (يثبت session)
        await supabase.auth.getSession();

        window.location.href = "/dashboard";
        return;
      }

      // ================= LOGIN =================
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // 🔥 تثبيت session
      await supabase.auth.getSession();

      // 🔥 التوجيه النهائي
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("Auth System Error:", err);

      let friendlyMessage = "حدث خطأ غير متوقع";

      if (err.message.includes("Invalid login credentials")) {
        friendlyMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      }

      if (err.message.includes("Email not confirmed")) {
        friendlyMessage = "يرجى تفعيل حسابك أولاً";
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <div className="max-w-md w-full z-10 animate-in fade-in duration-700">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/20 backdrop-blur-md border border-white/10 shadow-lg">
  <img 
    src="/images/logo.png" 
    alt="Logo" 
    className="h-12 w-auto object-contain scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
  />
</div>
<span className="text-3xl font-black text-white tracking-tighter italic">DIDACTILECT</span>
        </Link>

        <div className="bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">
              {isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </h2>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-3">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-4 text-white"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}

            <input
              type="email"
              required
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-4 text-white"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              required
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-4 text-white"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-bold">
              {loading ? <Loader2 className="animate-spin" /> : "دخول"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-500"
            >
              {isSignUp ? 'لديك حساب؟ دخول' : 'مستخدم جديد؟ إنشاء حساب'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

