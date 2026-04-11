"use client";
import { Mail, Clock, CheckCircle, Trash2, MessageSquare, User, AlertCircle, ExternalLink } from 'lucide-react';

export default function SupportManager({ tickets, onResolve, onDelete }) {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      
      {/* رأس القسم (Header) - الحفاظ على التصميم الصارم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <MessageSquare className="text-indigo-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">تذاكر الدعم الفني</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              إدارة استفسارات ومشاكل الطلاب الواردة عبر المنصة
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               {tickets.filter(t => t.status === 'pending').length} تذكرة معلقة
            </span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800" />
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
            إجمالي: {tickets.length}
          </span>
        </div>
      </div>

      {/* قائمة التذاكر */}
      <div className="grid gap-6">
        {tickets.length === 0 ? (
          <div className="py-24 text-center bg-[#0f172a]/50 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-800/50 rounded-full text-slate-600">
              <AlertCircle size={40} />
            </div>
            <p className="text-slate-500 font-black text-xs uppercase tracking-[0.2em] italic">
              لا توجد تذاكر دعم مسجلة حالياً في النظام
            </p>
          </div>
        ) : (
          tickets.map(ticket => (
            <div 
              key={ticket.id} 
              className={`bg-[#0f172a] p-8 rounded-[2.5rem] border transition-all duration-500 group shadow-lg overflow-hidden relative ${
                ticket.status === 'pending' 
                  ? 'border-slate-800 hover:border-indigo-500/40' 
                  : 'border-emerald-500/20 opacity-70 grayscale-[0.3]'
              }`}
            >
              {/* زخرفة خلفية بسيطة للحالة */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-10 ${
                ticket.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />

              <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                
                {/* محتوى التذكرة */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                      ticket.status === 'pending' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {ticket.status === 'pending' ? 'Waiting' : 'Resolved'}
                    </span>
                    <h3 className="font-black text-base text-slate-200 tracking-tight group-hover:text-indigo-400 transition-colors italic">
                      {ticket.subject}
                    </h3>
                  </div>

                  <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50 group-hover:border-slate-700/50 transition-all">
                    <p className="text-sm text-slate-400 leading-relaxed font-medium text-right">
                      {ticket.message}
                    </p>
                  </div>

                  {/* بيانات المرسل - الحفاظ على دقة الأيقونات والخطوط */}
                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight hover:text-indigo-400 transition-colors cursor-default">
                      <div className="p-1.5 bg-slate-900 rounded-lg">
                        <User size={12} className="text-indigo-500" />
                      </div>
                      {ticket.full_name}
                    </div>
                    
                    <a 
                      href={`mailto:${ticket.email}`}
                      className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-tight hover:text-indigo-400 transition-colors group/link"
                    >
                      <div className="p-1.5 bg-slate-900 rounded-lg group-hover/link:bg-indigo-500/20">
                        <Mail size={12} className="text-indigo-500" />
                      </div>
                      {ticket.email}
                      <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      <div className="p-1.5 bg-slate-900 rounded-lg">
                        <Clock size={12} className="text-indigo-500" />
                      </div>
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('ar-DZ') : 'تاريخ غير معروف'}
                    </div>
                  </div>
                </div>

                {/* أزرار التحكم - التصميم الجانبي الصارم */}
                <div className="flex md:flex-col justify-end gap-3 self-end md:self-start">
                  {ticket.status === 'pending' && (
                    <button 
                      onClick={() => onResolve(ticket.id)}
                      className="p-4 bg-emerald-500/5 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5 group/btn"
                      title="تحديد كمحلولة"
                    >
                      <CheckCircle size={20} className="group-hover/btn:scale-110 transition-transform duration-300" />
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(ticket.id)}
                    className="p-4 bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-500/20 shadow-lg shadow-red-500/5 group/btn transform active:scale-90"
                    title="حذف التذكرة نهائياً"
                  >
                    <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}