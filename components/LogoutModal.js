"use client";
import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="absolute inset-0 bg-[#020617]/80" onClick={onClose}></div>
      <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-inner">
            <LogOut className="text-red-500" size={32} />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">تسجيل الخروج؟</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            هل أنت متأكد؟ سنفتقد نشاطك في <b>EduStream</b>.
          </p>
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-500/20 text-xs">تأكيد</button>
            <button onClick={onClose} className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 rounded-2xl transition-all border border-white/5 text-xs">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}