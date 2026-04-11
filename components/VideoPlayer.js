"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, VideoOff, PlayCircle, ShieldAlert } from "lucide-react";

export default function VideoPlayer({ publicId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  // جلب اسم السحابة من البيئة أو القيمة الافتراضية
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ddvbg1qyh";

  useEffect(() => {
    if (publicId) {
      setLoading(true);
      setError(false);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [publicId]);

  // التحقق من صحة المعرف
  if (!publicId || publicId === "undefined" || publicId === "null") {
    return (
      <div className="flex flex-col items-center justify-center aspect-video text-slate-500 bg-[#0f172a]/50 rounded-[3rem] border-2 border-dashed border-slate-800 transition-all duration-500 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <PlayCircle size={64} className="mb-4 opacity-10 text-indigo-500 group-hover:opacity-30 transition-all group-hover:scale-110" />
        <p className="text-sm font-black uppercase tracking-widest italic opacity-50">بانتظار اختيار الدرس...</p>
      </div>
    );
  }

  // الروابط المحسنة من Cloudinary
  // c_fill,w_1280,h_720: لضمان أبعاد ثابتة 16:9
  const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto,c_limit,w_1280/${publicId}.mp4`;
  const posterUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_auto,q_auto,f_auto,w_1280/${publicId}.jpg`;

  return (
    <div className="relative rounded-[3rem] overflow-hidden bg-black border border-white/5 aspect-video shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group transition-all duration-700 ring-1 ring-white/10">
      
      {/* 🟢 حالة التحميل (Loading State) */}
      {loading && !error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#020617]">
          <div className="relative">
            <Loader2 className="w-14 h-14 text-indigo-500 animate-spin mb-4 opacity-80" />
            <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-black animate-pulse">
            Secure Streaming
          </span>
        </div>
      )}

      {/* 🔴 حالة الخطأ (Error State) */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950 text-center px-6">
          <ShieldAlert size={48} className="text-red-500 mb-4 animate-bounce" />
          <h3 className="text-white font-black text-lg mb-2">عذراً، فشل تحميل الفيديو</h3>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
            قد يكون هناك مشكلة في اتصالك بالإنترنت أو أن الفيديو غير متاح حالياً.
          </p>
          <button 
            onClick={() => { setError(false); setLoading(true); videoRef.current?.load(); }}
            className="mt-6 px-6 py-2 bg-indigo-600 rounded-full text-xs font-black uppercase hover:bg-indigo-500 transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* 🎥 مشغل الفيديو المحسن */}
      <video
        ref={videoRef}
        key={publicId}
        controls
        autoPlay
        poster={posterUrl}
        onCanPlay={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onError={() => setError(true)}
        className={`w-full h-full object-contain transition-all duration-1000 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        controlsList="nodownload noremoteplayback" // منع التحميل والبث الخارجي
        disablePictureInPicture // منع وضع صورة داخل صورة لزيادة التركيز
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🛡️ Overlay حماية إضافي وتجميلي */}
      {!loading && !error && (
        <>
          {/* ظل داخلي للتركيز */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
          
          {/* علامة مائية ذكية (Watermark) ثابتة لتقليل احتمالية تسجيل الشاشة */}
          <div className="absolute bottom-16 right-8 pointer-events-none opacity-20 select-none">
            <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              EduStream Platform
            </span>
          </div>
        </>
      )}
    </div>
  );
}