import { supabase } from "@/lib/supabaseClient";

export async function generateStaticParams() {
  // جلب كل المعرفات الخاصة بالكورسات من قاعدة البيانات
  const { data: courses } = await supabase
    .from('courses')
    .select('id');

  if (!courses) return [];

  return courses.map((course) => ({
    id: course.id.toString(),
  }));
}

export default function CourseLayout({ children }) {
  return <>{children}</>;
}