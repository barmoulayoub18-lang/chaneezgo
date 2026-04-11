import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. دالة جلب الدورات
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedCourses = data?.map(course => ({
        ...course,
        enrollmentStatus: 'active', // النظام مجاني حالياً
        level: course.level || '4ap'
      })) || [];

      setCourses(processedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. دالة إضافة دورة جديدة (متوافقة بدقة مع Schema قاعدة البيانات)
  const addCourse = async (courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: courseData.title,
          description: courseData.description,
          image_url: courseData.image_url,
          level: courseData.level.toLowerCase(), // تحويلها لـ lowercase (4ap/5ap) لتطابق بياناتك
          category: courseData.category || 'general'
        }])
        .select();

      if (error) throw error;
      
      // تحديث الحالة المحلية فوراً لكي تظهر الدورة في القائمة
      if (data) {
        setCourses(prev => [{ ...data[0], enrollmentStatus: 'active' }, ...prev]);
      }
      return { success: true, data };
    } catch (err) {
      console.error("Error adding course:", err.message);
      return { success: false, error: err.message };
    }
  };

  // 3. دالة حذف دورة
  const deleteCourse = async (courseId) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      // تحديث الحالة المحلية بحذف الدورة
      setCourses(prev => prev.filter(c => c.id !== courseId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting course:", err.message);
      return { success: false, error: err.message };
    }
  };

  // تصنيفات مساعدة للواجهة
  const courses4AP = courses.filter(c => c.level?.toLowerCase() === '4ap');
  const courses5AP = courses.filter(c => c.level?.toLowerCase() === '5ap');

  return { 
    courses, 
    courses4AP, 
    courses5AP, 
    loading,
    addCourse,      // تأكد من استدعاء هذه الدالة في Admin page
    deleteCourse,   // تأكد من استدعاء هذه الدالة في Admin page
    refreshCourses: fetchCourses 
  };
}