"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Trophy, 
  Search, 
  CheckCircle, 
  Clock, 
  User, 
  Book, 
  Download, 
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function CertificateManager() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // جلب طلبات الشهادات مع بيانات الطالب والدورة
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id,
          status,
          issued_at,
          user_id,
          course_id,
          profiles (full_name, email),
          courses (title)
        `)
        .order('issued_at', { ascending: false });

      if (!error) setCertificates(data);
    } catch (err) {
      console.error("Fetch Certs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // تحديث حالة الشهادة (مثلاً من pending إلى issued)
  const updateCertStatus = async (certId, newStatus) => {
    const { error } = await supabase
      .from('certificates')
      .update({ 
        status: newStatus,
        issued_at: newStatus === 'issued' ? new Date().toISOString() : null 
      })
      .eq('id', certId);

    if (!error) {
      fetchCertificates(); // إعادة جلب البيانات لتحديث الواجهة
    }
  };

  // منطق البحث والتصفية
  const filteredCerts = certificates.filter(cert => {
    const matchesSearch = 
      cert.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="bg-[#0f172a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase">إدارة الشهادات الاحترافية</h2>
            </div>
            <p className="text-slate-400 text-sm">مراجعة واعتماد شهادات الطلاب الذين أتموا الدورات بنسبة 100%.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="بحث باسم الطالب..."
                className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-indigo-500 outline-none w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-xs text-white outline-none focus:border-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="issued">تم الإصدار</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-500">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="font-bold text-xs uppercase tracking-widest">جاري جلب سجلات الشهادات...</p>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <AlertCircle className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400 font-bold">لا توجد طلبات شهادات مطابقة للبحث.</p>
          </div>
        ) : (
          filteredCerts.map((cert) => (
            <div key={cert.id} className="group bg-[#1e293b]/40 border border-white/5 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-1 h-full ${cert.status === 'issued' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5">
                    <User size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm leading-tight">{cert.profiles?.full_name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cert.profiles?.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                  cert.status === 'issued' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {cert.status === 'issued' ? 'معتمدة' : 'انتظار'}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <Book size={14} className="text-indigo-400" />
                  <span className="text-[11px] text-slate-300 font-medium">دورة: {cert.courses?.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-indigo-400" />
                  <span className="text-[11px] text-slate-300 font-medium">
                    {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('ar-DZ') : 'لم تصدر بعد'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {cert.status === 'pending' ? (
                  <button 
                    onClick={() => updateCertStatus(cert.id, 'issued')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <CheckCircle size={14} /> اعتماد الشهادة
                  </button>
                ) : (
                  <button 
                    onClick={() => updateCertStatus(cert.id, 'pending')}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all border border-white/5"
                  >
                    إلغاء الاعتماد
                  </button>
                )}
                
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-indigo-400 cursor-not-allowed opacity-50">
                   <Trophy size={16} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const Loader2 = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);