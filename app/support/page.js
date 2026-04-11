"use client";
import { Mail, MessageCircle, LifeBuoy, Send, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // حالة تخزين بيانات النموذج
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: 'مشكلة في تفعيل الحساب',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([
          { 
            full_name: formData.full_name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      // إعادة تعيين النموذج
      setFormData({ full_name: '', email: '', subject: 'مشكلة في تفعيل الحساب', message: '' });
    } catch (error) {
      console.error('Error sending ticket:', error);
      alert("حدث خطأ أثناء إرسال التذكرة، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // تم إضافة pt-24 لضمان التوافق مع القائمة المنسدلة الجديدة
    <div className="min-h-screen bg-[#020617] text-white pt-24 pb-12 px-6 md:px-20 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 mb-4">
            <LifeBuoy className="text-indigo-500" size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">مركز الدعم والمساعدة</h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            فريقنا الفني جاهز للرد على استفساراتك بخصوص الدروس أو تفعيل الحساب في أي وقت.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Contact Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 space-y-4">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-indigo-500">تواصل سريع</h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-slate-800 rounded-lg"><Mail size={16}/></div>
                <span className="text-xs font-bold">support@edulink.dz</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-slate-800 rounded-lg"><MessageCircle size={16}/></div>
                <span className="text-xs font-bold font-mono">0555-xx-xx-xx</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-500">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><Clock size={16}/></div>
                <span className="font-black text-[10px] uppercase">متاحون 24/7</span>
              </div>
            </div>
          </div>

          {/* Support Ticket Form */}
          <div className="md:col-span-2">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
                <h2 className="text-xl font-black italic tracking-tighter text-white">فتح تذكرة دعم جديدة</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="الاسم الكامل" 
                    className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all text-white placeholder:text-slate-600" 
                    required 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                  <input 
                    placeholder="البريد الإلكتروني" 
                    type="email" 
                    className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all text-white placeholder:text-slate-600" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all text-white appearance-none cursor-pointer"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option className="bg-[#0f172a]">مشكلة في تفعيل الحساب</option>
                  <option className="bg-[#0f172a]">استفسار حول محتوى الدروس</option>
                  <option className="bg-[#0f172a]">مشكلة تقنية في المنصة</option>
                  <option className="bg-[#0f172a]">أخرى</option>
                </select>

                <textarea 
                  placeholder="اشرح لنا المشكلة بالتفصيل..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 h-32 resize-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all text-white placeholder:text-slate-600" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>إرسال التذكرة <Send size={14} /></>}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-12 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in-95 duration-500">
                <div className="inline-block p-4 bg-emerald-500/20 rounded-full mb-2">
                  <ShieldCheck className="text-emerald-500" size={40} />
                </div>
                <h2 className="text-2xl font-black text-emerald-400 italic">تم إرسال طلبك بنجاح!</h2>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">
                  سيقوم فريقنا بمراجعة تذكرتك والرد عليك عبر البريد الإلكتروني في أقرب وقت ممكن.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="text-indigo-500 font-black text-[10px] uppercase underline tracking-widest mt-4 block mx-auto hover:text-indigo-400 transition-colors"
                >
                  إرسال تذكرة أخرى
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}