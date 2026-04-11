"use client";
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. جلب حالة التقدم للطالب في دورة معينة
  const fetchProgress = useCallback(async (userId, courseId, totalLessonsCount) => {
    if (!userId || !courseId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('user_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (!error && data) {
      const completedIds = data.map(p => p.lesson_id);
      setCompletedLessons(completedIds);
      
      // حساب النسبة المئوية
      if (totalLessonsCount > 0) {
        const percent = Math.round((completedIds.length / totalLessonsCount) * 100);
        setProgressPercent(percent);
      }
    }
    setLoading(false);
  }, []);

  // 2. تحديث الدرس كمكتمل (تُستدعى عند نهاية الفيديو)
  const markAsComplete = async (userId, courseId, lessonId, totalLessonsCount) => {
    if (!userId || completedLessons.includes(lessonId)) return;

    // إضافة الدرس إلى قاعدة البيانات (بسياسة الـ Upsert لتجنب التكرار)
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        is_completed: true
      }, { onConflict: 'user_id, lesson_id' });

    if (!error) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      
      // تحديث النسبة المئوية فوراً في الواجهة
      if (totalLessonsCount > 0) {
        const percent = Math.round((newCompleted.length / totalLessonsCount) * 100);
        setProgressPercent(percent);
        
        // إذا وصلت النسبة لـ 100%، يمكننا تفعيل سجل أولي للشهادة
        if (percent === 100) {
          await createCertificateRecord(userId, courseId);
        }
      }
    }
  };

  // 3. إنشاء سجل شهادة (داخلي)
  const createCertificateRecord = async (userId, courseId) => {
    await supabase
      .from('certificates')
      .upsert({
        user_id: userId,
        course_id: courseId,
        status: 'pending' // تنتظر مراجعة الإدارة أو التحميل التلقائي
      }, { onConflict: 'user_id, course_id' });
  };

  return {
    completedLessons,
    progressPercent,
    loading,
    fetchProgress,
    markAsComplete
  };
}