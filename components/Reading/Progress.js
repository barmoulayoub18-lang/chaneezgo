"use client";
import { Trophy, BookOpen, Star, Target, CheckCircle, TrendingUp, Award, Zap } from "lucide-react";

export default function Progress({ userStats, currentLevel }) {
  // حساب نسبة الإنجاز (إجمالي 20 نصاً لكل مستوى)
  const totalTexts = 20; 
  const completedCount = userStats?.completedTexts?.length || 0;
  const completionPercentage = Math.min(Math.round((completedCount / totalTexts) * 100), 100) || 0;

  // نظام الرتب (Gamification)
  const getRank = (wpm) => {
    if (wpm >= 70) return { label: "Expert", color: "text-purple-600", bg: "bg-purple-100", icon: <Zap size={12} /> };
    if (wpm >= 50) return { label: "Bon", color: "text-blue-600", bg: "bg-blue-100", icon: <Star size={12} /> };
    if (wpm >= 30) return { label: "Moyen", color: "text-green-600", bg: "bg-green-100", icon: <TrendingUp size={12} /> };
    return { label: "Débutant", color: "text-gray-500", bg: "bg-gray-100", icon: <BookOpen size={12} /> };
  };

  const rank = getRank(userStats?.bestWpm || 0);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-100/50">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] p-6 text-white relative overflow-hidden">
        <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/30 shadow-inner">
              <Trophy size={24} className="text-yellow-300 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">Score Total</p>
              <p className="font-black text-2xl tabular-nums leading-none">{userStats?.points || 0} <span className="text-xs font-normal">XP</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">Niveau</p>
            <div className="flex items-center gap-1.5 justify-end bg-black/10 px-2 py-1 rounded-lg border border-white/20 mt-1">
               <span className="font-black text-sm">{currentLevel?.toUpperCase()}</span>
               <Award size={14} className="text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <BookOpen size={16} className="text-blue-500" />
              </div>
              <span className="text-sm font-black text-gray-700">Progression</span>
            </div>
            <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{completionPercentage}%</span>
          </div>
          
          <div className="relative w-full bg-gray-100 h-4 rounded-full overflow-hidden shadow-inner p-1">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-[1500ms] ease-out shadow-sm relative"
              style={{ width: `${completionPercentage}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold text-center">
             {completedCount} / {totalTexts} textes terminés
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center group transition-all hover:bg-orange-50">
            <div className="bg-orange-100 p-2 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <Star size={18} className="text-orange-500 fill-orange-200" />
            </div>
            <span className="text-[10px] text-orange-700 font-bold uppercase tracking-tighter">Vitesse Max</span>
            <span className="text-xl font-black text-orange-800 tabular-nums">{userStats?.bestWpm || 0}</span>
            <span className="text-[9px] text-orange-400 font-bold mb-2">WPM</span>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-sm ${rank.bg} ${rank.color}`}>
              {rank.icon}
              {rank.label}
            </div>
          </div>

          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex flex-col items-center group transition-all hover:bg-green-50">
            <div className="bg-green-100 p-2 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <Target size={18} className="text-green-500" />
            </div>
            <span className="text-[10px] text-green-700 font-bold uppercase tracking-tighter">Précision</span>
            <span className="text-xl font-black text-green-800 tabular-nums">{userStats?.avgAccuracy || 0}%</span>
            <span className="text-[9px] text-green-400 font-bold mb-2">Moyenne</span>
            <div className="flex items-center gap-1 text-[9px] text-green-600 font-black uppercase bg-white px-2.5 py-1 rounded-full shadow-sm border border-green-50">
              <TrendingUp size={10} />
              <span>Stable</span>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Succès Récents</h4>
          <div className="space-y-2">
            {userStats?.achievements && userStats.achievements.length > 0 ? (
              userStats.achievements.slice(-2).map((achievement, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors animate-in fade-in slide-in-from-right duration-500">
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  <span className="text-[11px] text-gray-700 font-bold">{achievement}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 italic">Explore les textes pour gagner des badges !</p>
              </div>
            )}
            
            {/* Level Up Hint */}
            {completionPercentage >= 80 && completionPercentage < 100 && (
              <div className="mt-4 flex items-center gap-3 bg-purple-50 p-3 rounded-xl border border-purple-100 animate-bounce-subtle">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                    <Zap size={14} className="text-purple-600 fill-purple-300" />
                </div>
                <span className="text-[10px] text-purple-700 font-black leading-tight">Nouveau niveau presque débloqué !</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}