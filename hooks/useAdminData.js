"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAdminData() {
  // --- حالات النظام ---
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // --- حالات البيانات ---
  const [courses, setCourses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  // حالات البيانات للمتابعة والواجبات
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [submittedHomework, setSubmittedHomework] = useState([]);

  // --- حالات النماذج (تم الحفاظ على الحقول ومطابقتها لقاعدة البيانات) ---
  const [courseFormData, setCourseFormData] = useState({ 
    title: '', 
    description: '', 
    image_url: '', 
    level: '4ap', 
    category: 'general' 
  });
  
  const [lessonFormData, setLessonFormData] = useState({
    courseId: '', 
    title: '', 
    description: '', 
    orderIndex: '', 
    type: 'video',
    level: '' // إضافة حقل المستوى للدرس لضمان الربط الصحيح
  });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmimanv2z';
  const uploadPreset = 'my_portfolio';

  // --- التأكد من صلاحيات المسؤول ---
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          window.location.href = '/login';
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          console.error("Access Denied: Not an admin");
          window.location.href = '/dashboard';
          return;
        }

        await fetchAllData();
      } catch (err) {
        console.error("Auth Exception:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // --- دوال جلب البيانات ---
  const fetchAllData = async () => {
    await Promise.all([
      fetchCourses(), 
      fetchUsers(), 
      fetchTickets(), 
      fetchProgressData(), 
      fetchHomeworkData()  
    ]);
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) console.error("Courses Fetch Error:", error.message);
    if (data) {
      setCourses(data);
      // ضبط الدورة الأولى افتراضياً إذا لم تكن مختارة
      if (data.length > 0 && !lessonFormData.courseId) {
        setLessonFormData(prev => ({ 
          ...prev, 
          courseId: data[0].id,
          level: data[0].level // جلب المستوى افتراضياً أيضاً
        }));
      }
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Users Fetch Error:", error.message);
      return;
    }
    if (data) setAllUsers(data);
  };

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error("Tickets Fetch Error:", error.message);
    if (data) setTickets(data);
  };

  const fetchProgressData = async () => {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        profiles:user_id (full_name),
        courses:course_id (title)
      `)
      .order('completed_at', { ascending: false });
    
    if (!error && data) setStudentsProgress(data);
  };

  const fetchHomeworkData = async () => {
    const { data, error } = await supabase
      .from('assignments_submissions') 
      .select(`
        *,
        profiles:user_id (full_name, email),
        lessons:lesson_id (title)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) setSubmittedHomework(data);
  };

  // --- عمليات الإدارة (المستخدمين) ---
  const handleToggleUserActivation = async (userId, currentState) => {
    const { error } = await supabase.from('profiles').update({ is_active: !currentState }).eq('id', userId);
    if (error) {
      setStatus({ type: 'error', msg: 'فشل تحديث الحالة' });
    } else {
      setStatus({ type: 'success', msg: 'تم تحديث حالة المستخدم بنجاح' });
      fetchUsers();
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) {
      setStatus({ type: 'error', msg: 'فشل تغيير الرتبة' });
    } else {
      setStatus({ type: 'success', msg: `تم تحويل الحساب إلى ${newRole}` });
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("تحذير: سيتم حذف هذا الحساب نهائياً، هل أنت متأكد؟")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      setStatus({ type: 'error', msg: 'لا يمكن حذف المستخدم المرتبط ببيانات أخرى' });
    } else {
      setStatus({ type: 'success', msg: 'تم حذف الحساب بنجاح' });
      fetchUsers();
    }
  };

  // --- عمليات الإدارة (الدورات) ---
  const handleCreateCourse = async () => {
    if (!courseFormData.title || !courseFormData.level) {
      setStatus({ type: 'error', msg: 'يرجى ملء الحقول المطلوبة' });
      return;
    }
    setUploading(true);

    const cleanData = {
      title: courseFormData.title.trim(),
      description: courseFormData.description.trim(),
      image_url: courseFormData.image_url,
      level: courseFormData.level.toLowerCase(),
      category: courseFormData.category || 'general'
    };

    const { error } = await supabase.from('courses').insert([cleanData]);
    
    if (error) {
      console.error("Create Course Error:", error);
      setStatus({ type: 'error', msg: `فشل الإنشاء: ${error.message}` });
    } else {
      setStatus({ type: 'success', msg: 'تم إنشاء المسار التعليمي بنجاح' });
      setCourseFormData({ title: '', description: '', image_url: '', level: '4ap', category: 'general' });
      fetchCourses();
    }
    setUploading(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("حذف الدورة سيؤدي لحذف دروسها، هل تود الاستمرار؟")) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      setStatus({ type: 'error', msg: 'فشل الحذف: تأكد من خلو الدورة من الدروس أولاً' });
    } else {
      setStatus({ type: 'success', msg: 'تم حذف الدورة بنجاح' });
      fetchCourses();
    }
  };

  const handleResolveTicket = async (ticketId) => {
    const { error } = await supabase.from('support_tickets').update({ status: 'resolved' }).eq('id', ticketId);
    if (!error) {
      setStatus({ type: 'success', msg: 'تم إغلاق التذكرة بنجاح' });
      fetchTickets();
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm("حذف التذكرة نهائياً؟")) return;
    const { error } = await supabase.from('support_tickets').delete().eq('id', ticketId);
    if (!error) {
      setStatus({ type: 'success', msg: 'تم الحذف' });
      fetchTickets();
    }
  };

  // --- حفظ الدرس ---
  const saveLessonToDB = async (fileUrl, duration = "00:00") => {
    // التحقق من وجود المستوى، إذا لم يوجد يتم جلبه من مصفوفة الكورسات
    let finalLevel = lessonFormData.level;
    if (!finalLevel && lessonFormData.courseId) {
      const course = courses.find(c => c.id === lessonFormData.courseId);
      finalLevel = course?.level || '4ap';
    }

    const { error } = await supabase.from('lessons').insert([{
      course_id: lessonFormData.courseId,
      title: lessonFormData.title.trim(),
      description: lessonFormData.description.trim(),
      cloudinary_public_id: String(fileUrl),
      order_index: parseInt(lessonFormData.orderIndex) || 0,
      duration: String(duration),
      type: lessonFormData.type,
      level: finalLevel // حفظ المستوى في جدول الدروس لضمان استرجاعه بشكل صحيح
    }]);

    if (!error) {
      setStatus({ type: 'success', msg: 'تم رفع الدرس بنجاح' });
      // تصفير النموذج مع الحفاظ على الكورس المختار
      setLessonFormData(prev => ({ 
        ...prev, 
        title: '', 
        description: '', 
        orderIndex: '', 
        type: 'video',
        fileUrl: '' // تصفير رابط الملف إذا كان موجوداً
      }));
      fetchCourses();
    } else {
      console.error("Lesson Save Error:", error);
      setStatus({ type: 'error', msg: 'خطأ في قاعدة البيانات: ' + error.message });
    }
    setUploading(false);
  };

  const openCourseImageUploader = () => {
    if (!window.cloudinary) {
      setStatus({ type: 'error', msg: 'فشل تحميل مكتبة الرفع، يرجى تحديث الصفحة' });
      return;
    }
    setUploading(true);
    window.cloudinary.openUploadWidget(
      { 
        cloudName: cloudName, 
        uploadPreset: uploadPreset,
        resourceType: 'image',
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        secure: true 
      },
      (err, res) => {
        if (res.event === "success") {
          const secureUrl = res.info.secure_url;
          setCourseFormData(prev => ({ ...prev, image_url: secureUrl }));
          setStatus({ type: 'success', msg: 'تم رفع صورة الغلاف بنجاح' });
          setUploading(false);
        } else if (err || res.event === "close") {
          setUploading(false);
        }
      }
    );
  };

  const openCloudinary = () => {
    if (!window.cloudinary || !lessonFormData.title) {
      setStatus({ type: 'error', msg: 'أدخل عنوان الدرس أولاً' });
      return;
    }
    setUploading(true);
    window.cloudinary.openUploadWidget(
      { 
        cloudName: cloudName, 
        uploadPreset: uploadPreset,
        resourceType: 'auto',
        secure: true 
      },
      (err, res) => {
        if (res.event === "success") {
          const publicId = res.info.secure_url || res.info.public_id;
          const duration = res.info.duration ? (res.info.duration / 60).toFixed(2) + " min" : "00:00";
          saveLessonToDB(publicId, duration);
        } else if (err || res.event === "close") {
          setUploading(false);
        }
      }
    );
  };

  return {
    loading, uploading, status, setStatus,
    courses, allUsers, tickets, 
    studentsProgress, submittedHomework, 
    courseFormData, setCourseFormData,
    lessonFormData, setLessonFormData,
    handleToggleUserActivation, handleChangeRole, handleDeleteUser,
    handleCreateCourse, handleDeleteCourse, openCloudinary,
    openCourseImageUploader,
    handleResolveTicket, handleDeleteTicket,
    fetchProgressData, fetchHomeworkData 
  };
}