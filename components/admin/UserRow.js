"use client";
import { useState } from 'react';
import { Trash2, UserCog, Shield, User, Mail, Calendar, Loader2 } from 'lucide-react';

export default function UserRow({ user, onToggleActivation, onChangeRole, onDelete }) {
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // تنسيق التاريخ بشكل احترافي
  const joinDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'تاريخ غير متاح';

  // معالجة تغيير الرتبة مع حالة تحميل
  const handleRoleChange = async (newRole) => {
    setIsChangingRole(true);
    await onChangeRole(user.id, newRole);
    setIsChangingRole(false);
  };

  // معالجة تغيير الحالة مع حالة تحميل
  const handleStatusChange = async () => {
    setIsChangingStatus(true);
    await onToggleActivation(user.id, user.is_active);
    setIsChangingStatus(false);
  };

  return (
    <tr className="group border-b border-slate-800/40 last:border-0 hover:bg-slate-800/20 transition-all duration-300">
      
      {/* 1. هوية المستخدم (User Identity) */}
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-[1.25rem] bg-gradient-to-br ${user.role === 'admin' ? 'from-indigo-600/20 to-violet-600/20 border-indigo-500/30' : 'from-slate-800 to-slate-900 border-slate-700'} flex items-center justify-center font-black text-indigo-500 border transition-all shadow-xl group-hover:scale-105 group-hover:shadow-indigo-500/10`}>
              {user.full_name?.charAt(0).toUpperCase() || <User size={20} />}
            </div>
            {user.role === 'admin' && (
              <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-lg p-1.5 border-2 border-[#020617] shadow-lg animate-bounce-subtle">
                <Shield size={10} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">
              {user.full_name || 'مستخدم مجهول'}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <Mail size={12} className="text-slate-600 shrink-0" />
              <span className="font-mono truncate max-w-[150px]">{user.email || 'لا يوجد بريد'}</span>
            </div>
            <div className="flex items-center gap-1 md:hidden text-[9px] text-slate-600 mt-1">
              <Calendar size={10} />
              <span>{joinDate}</span>
            </div>
          </div>
        </div>
      </td>

      {/* 2. تاريخ الانضمام (مخفي في الجوال) */}
      <td className="p-6 text-center hidden md:table-cell">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-400">{joinDate}</span>
          <span className="text-[8px] text-slate-600 uppercase tracking-widest mt-1 font-black italic">Creation Date</span>
        </div>
      </td>

      {/* 3. إدارة الرتبة (Role Management) */}
      <td className="p-6 text-center">
        <div className="relative inline-block">
          {isChangingRole && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl z-10">
              <Loader2 size={14} className="animate-spin text-indigo-500" />
            </div>
          )}
          <div className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 border transition-all ${user.role === 'admin' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
            <UserCog size={14} className="shrink-0" />
            <select 
              value={user.role} 
              disabled={isChangingRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent border-none text-[11px] font-black outline-none cursor-pointer appearance-none uppercase tracking-wider"
            >
              <option value="student" className="bg-slate-900 text-white">Student</option>
              <option value="admin" className="bg-slate-900 text-white font-bold">Admin ★</option>
            </select>
          </div>
        </div>
      </td>

      {/* 4. حالة الحساب (Active Switch) */}
      <td className="p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={handleStatusChange}
            disabled={isChangingStatus}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${
              user.is_active 
                ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' 
                : 'bg-rose-500/10 ring-1 ring-rose-500/30'
            } ${isChangingStatus ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-[5px] transition-all duration-300 shadow-lg ${
                user.is_active 
                  ? 'translate-x-7 bg-emerald-500' 
                  : 'translate-x-1 bg-rose-500'
              }`}
            />
          </button>
          <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${user.is_active ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isChangingStatus ? 'Processing...' : (user.is_active ? 'Active' : 'Locked')}
          </span>
        </div>
      </td>

      {/* 5. حذف المستخدم (Delete Action) */}
      <td className="p-6 text-right">
        <button 
          onClick={() => {
            if(window.confirm('🚨 تحذير: سيتم حذف هذا المستخدم وجميع بياناته بشكل نهائي. هل أنت متأكد؟')) {
              onDelete(user.id);
            }
          }} 
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:bg-rose-600/10 hover:border-rose-500/30 hover:text-rose-500 transition-all group/del shadow-inner"
        >
          <Trash2 size={16} className="group-hover/del:scale-110 group-hover/del:rotate-6 transition-transform" />
        </button>
      </td>
    </tr>
  );
}