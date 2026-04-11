import { supabase } from "./supabaseClient";

// 🔥 حذف نظام التفعيل نهائياً

export const updateRole = async (userId, newRole) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) throw error;
  return data;
};

export const deleteUserAccount = async (userId) => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) throw error;
  return true;
};

// =========================
// Courses
// =========================
export const createNewCourse = async (courseData) => {
  const { data, error } = await supabase
    .from("courses")
    .insert([courseData])
    .select();

  if (error) throw error;
  return data;
};

export const removeCourse = async (courseId) => {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) throw error;
  return true;
};

// =========================
// Lessons
// =========================
export const insertLesson = async (lessonData) => {
  const { data, error } = await supabase
    .from("lessons")
    .insert([lessonData])
    .select();

  if (error) throw error;
  return data;
};

// =========================
// Stats (clean)
// =========================
export const getAdminStats = async () => {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("role");

  const { count: coursesCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  return {
    totalUsers: profiles?.length || 0,
    admins: profiles?.filter((u) => u.role === "admin").length || 0,
    totalCourses: coursesCount || 0,
  };
};