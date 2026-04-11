"use client";
import { useState } from 'react';
import { Users, ShieldCheck, CheckCircle2, UserCircle, Trash2, Search, Filter, ShieldAlert } from 'lucide-react';
import UserRow from '../UserRow';

export default function UsersManagement({ 
  allUsers, 
  pendingUsers, 
  onToggleActivation, 
  onChangeRole, 
  onDelete 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // تصفية المستخدمين بناءً على البحث والرتبة
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. قسم الإحصائيات (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest opacity-80">إجمالي الطلاب</p>
              <h3 className="text-4xl font-black mt-1 text-white">{allUsers.filter(u => u.role === 'student').length}</h3>
            </div>
            <UserCircle className="text-indigo-300 opacity-50" size={32} />
          </div>
        </div>
        
        <div className="bg-emerald-600 p-6 rounded-[2rem] shadow-xl shadow-emerald-600/20 transition-all hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest opacity-80">طلبات التفعيل</p>
              <h3 className="text-4xl font-black mt-1 text-white">{pendingUsers.length}</h3>
            </div>
            <CheckCircle2 className="text-emerald-300 opacity-50" size={32} />
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-xl transition-all hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-80">طاقم الإدارة</p>
              <h3 className="text-4xl font-black mt-1 text-white">
                {allUsers.filter(u => u.role === 'admin').length}
              </h3>
            </div>
            <ShieldCheck className="text-indigo-500 opacity-80" size={32} />
          </div>
        </div>
      </div>

      {/* 2. أدوات البحث والفلترة الاحترافية */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 p-5 rounded-[2rem] border border-slate-800/50 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="ابحث عن مسؤول أو طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pr-12 pl-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-2">تصفية حسب:</span>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-2xl py-3 px-6 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-200 cursor-pointer hover:bg-slate-900 transition-colors"
          >
            <option value="all">الجميع</option>
            <option value="student">الطلاب فقط</option>
            <option value="admin">المسؤولين فقط</option>
          </select>
        </div>
      </div>

      {/* 3. تنبيه أمني بخصوص تغيير الأدوار */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex items-center gap-4">
        <ShieldAlert className="text-indigo-500 shrink-0" size={20} />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-indigo-400">تنبيه الإدارة:</strong> تغيير رتبة المستخدم إلى <span className="text-white font-bold">"مسؤول"</span> يمنحه صلاحية كاملة للوصول إلى لوحة التحكم وحذف المحتوى. تأكد من هوية الشخص قبل التغيير.
        </p>
      </div>

      {/* 4. جدول إدارة المستخدمين */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">معلومات الحساب</th>
                <th className="p-6 text-center">الرتبة الحالية</th>
                <th className="p-6 text-center">حالة الدخول</th>
                <th className="p-6 text-center">إدارة الصلاحيات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={40} className="text-slate-800" />
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">
                        {searchTerm ? "لا توجد نتائج مطابقة" : "قائمة المستخدمين فارغة"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    onToggleActivation={onToggleActivation}
                    onChangeRole={onChangeRole}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}