'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, CheckCircle, XCircle, Eye, 
  Search, ShieldCheck, Clock, Image as ImageIcon,
  Loader2, ExternalLink, Filter
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      // عرض الطلاب فقط واستثناء المسؤولين
      const studentsOnly = data.filter(user => user.role !== 'admin');
      setUsers(studentsOnly);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserActivation = async (userId, currentStatus) => {
    setMessage('جاري تحديث حالة الحساب...');
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', userId);

    if (error) {
      setMessage('❌ فشل التحديث: تأكد من صلاحيات الـ RLS');
    } else {
      setMessage(`✅ تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} الطالب بنجاح`);
      fetchUsers(); 
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // تصفية البحث
  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-indigo-500 animate-spin" size={40} />
      <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">جاري جلب قائمة الطلاب...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-10 relative overflow-hidden" dir="rtl">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
              <ShieldCheck size={14} /> بوابة الإدارة المركزية
            </div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">إدارة <span className="text-indigo-500">الطلاب</span></h1>
            <p className="text-slate-500 text-xs font-medium">تحقق من الدفع وقم بمنح صلاحيات الدخول للمنصة</p>
          </div>
          
          <div className="flex items-center gap-3 bg-[#020617] p-2 rounded-2xl border border-white/5">
             <div className="px-6 py-2">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">إجمالي المنتسبين</span>
                <span className="text-2xl font-black text-white italic">{users.length}</span>
             </div>
             <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <Users size={24} />
             </div>
          </div>
        </div>

        {/* Search and Feedback Area */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو البريد الإلكتروني..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pr-12 pl-6 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          {message && (
            <div className="bg-indigo-500 text-white px-6 py-4 rounded-2xl text-xs font-bold animate-bounce shadow-lg shadow-indigo-600/20 whitespace-nowrap">
              {message}
            </div>
          )}
        </div>

        {/* Users Table Card */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">الطالب</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">وصل الدفع</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">تاريخ الانضمام</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">حالة الحساب</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-indigo-400 font-bold border border-white/5">
                          {user.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white italic">{user.full_name || 'طالب مجهول'}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-6 text-center">
                      {user.payment_proof_url ? (
                        <button 
                          onClick={() => setSelectedImageUrl(user.payment_proof_url)}
                          className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-indigo-600/5"
                        >
                          <Eye size={14} /> فحص الوصل
                        </button>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-slate-700 text-[10px] font-bold italic uppercase tracking-tighter">
                          <Clock size={12} /> لم يتم الرفع
                        </span>
                      )}
                    </td>

                    <td className="p-6">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {new Date(user.created_at).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </td>

                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        user.is_active 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                      }`}>
                        {user.is_active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {user.is_active ? 'مفعل نشط' : 'بانتظار التأكيد'}
                      </span>
                    </td>

                    <td className="p-6 text-center">
                      <button
                        onClick={() => toggleUserActivation(user.id, user.is_active)}
                        className={`min-w-[120px] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-xl ${
                          user.is_active 
                          ? 'border border-rose-500/30 text-rose-400 hover:bg-rose-500/10' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
                        }`}
                      >
                        {user.is_active ? 'تعطيل الدخول' : 'تفعيل الحساب الآن'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4 bg-white/[0.01]">
              <Users className="text-slate-800" size={60} />
              <div className="space-y-1">
                 <p className="text-slate-500 font-black text-sm uppercase italic">قائمة الطلاب فارغة</p>
                 <p className="text-slate-700 text-[10px] uppercase tracking-[0.3em]">لا توجد نتائج تطابق بحثك حالياً</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Lightbox Modal */}
      {selectedImageUrl && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6 transition-all duration-500" onClick={() => setSelectedImageUrl(null)}>
          <div className="relative bg-white/[0.03] border border-white/10 p-2 rounded-[2rem] max-w-4xl w-full shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImageUrl(null)}
              className="absolute -top-12 left-0 text-white hover:text-indigo-400 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              إغلاق المعاينة <XCircle size={20} />
            </button>
            <div className="overflow-hidden rounded-2xl max-h-[80vh]">
              <img 
                src={selectedImageUrl} 
                alt="Payment Receipt" 
                className="w-full h-auto object-contain shadow-2xl"
              />
            </div>
            <div className="p-6 flex justify-between items-center">
               <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase italic tracking-widest">
                  <ImageIcon size={14} /> معاينة أصل الوصل
               </div>
               <a href={selectedImageUrl} target="_blank" className="text-indigo-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                  فتح في نافذة جديدة <ExternalLink size={14} />
               </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}