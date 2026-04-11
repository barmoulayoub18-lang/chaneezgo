"use client";

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAssignments() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  // بيانات الواجبات (للطالب وللمسؤول)
  const [mySubmissions, setMySubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);

  // جلب اسم السحابة من البيئة
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ddvbg1qyh";
  const uploadPreset = "my_portfolio"; // تأكد من مطابقة الـ Preset في Cloudinary

  /**
   * 1. وظيفة رفع الواجب (Student Side)
   */
  const uploadAssignment = async (courseId, lessonId, userId) => {
    if (!window.cloudinary) {
      setStatus({ type: 'error', msg: 'مكتبة الرفع غير جاهزة، يرجى المحاولة بعد ثوانٍ' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', msg: '' });

    window.cloudinary.openUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        resourceType: 'auto', 
        clientAllowedFormats: ['pdf', 'docx', 'doc', 'zip', 'rar'], // أضفت دعم الملفات المضغوطة للمشاريع الكبيرة
        maxFiles: 1,
        maxFileSize: 10000000, // حد أقصى 10 ميجابايت تقريباً
        styles: {
          palette: {
            window: "#020617",
            sourceBg: "#020617",
            windowBorder: "#4F46E5",
            tabIcon: "#4F46E5",
            inactiveTabIcon: "#94A3B8",
            menuIcons: "#FFFFFF",
            link: "#4F46E5",
            action: "#4F46E5",
            inProgress: "#4F46E5",
            complete: "#22C55E",
            error: "#EF4444",
            textDark: "#000000",
            textLight: "#FFFFFF"
          },
          fonts: {
            "default": null,
            "'Fira Sans', sans-serif": "https://fonts.googleapis.com/css?family=Fira+Sans"
          }
        }
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          const { secure_url, original_filename } = result.info;

          const { error: dbError } = await supabase
            .from('assignments_submissions')
            .insert([{
              user_id: userId,
              course_id: courseId,
              lesson_id: lessonId,
              file_url: secure_url,
              file_name: original_filename,
              status: 'pending'
            }]);

          if (dbError) {
            setStatus({ type: 'error', msg: 'فشل مزامنة الملف مع قاعدة البيانات' });
          } else {
            setStatus({ type: 'success', msg: 'تم تسليم الواجب بنجاح! سيراجعه المعلم قريباً' });
            fetchMySubmissions(userId); 
          }
          setUploading(false);
        } else if (error) {
          setStatus({ type: 'error', msg: 'فشلت عملية الرفع، تحقق من حجم الملف أو نوعه' });
          setUploading(false);
        } else if (result?.event === "close") {
          setUploading(false);
        }
      }
    );
  };

  /**
   * 2. جلب واجبات الطالب الحالي
   */
  const fetchMySubmissions = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assignments_submissions')
        .select(`
          *,
          courses (title),
          lessons (title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMySubmissions(data);
    } catch (err) {
      console.error("Fetch Submissions Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 3. جلب جميع الواجبات (Admin Side)
   */
  const fetchAllSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assignments_submissions')
        .select(`
          *,
          profiles (full_name, email),
          courses (title),
          lessons (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllSubmissions(data);
    } catch (err) {
      console.error("Fetch All Submissions Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 4. تقييم الواجب (Admin Side)
   */
  const gradeAssignment = async (submissionId, grade, feedback) => {
    setStatus({ type: 'loading', msg: 'جاري إرسال التقييم...' });
    
    const { error } = await supabase
      .from('assignments_submissions')
      .update({ 
        grade: grade, 
        feedback: feedback, 
        status: 'graded',
        graded_at: new Date().toISOString() // إضافة توثيق وقت التقييم
      })
      .eq('id', submissionId);

    if (error) {
      setStatus({ type: 'error', msg: 'فشل تحديث التقييم' });
    } else {
      setStatus({ type: 'success', msg: 'تم إرسال التقييم للطالب بنجاح' });
      fetchAllSubmissions(); 
    }
  };

  return {
    uploading,
    loading,
    status,
    setStatus,
    mySubmissions,
    allSubmissions,
    uploadAssignment,
    fetchMySubmissions,
    fetchAllSubmissions,
    gradeAssignment
  };
}