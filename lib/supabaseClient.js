import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ خطأ: متغيرات Supabase غير موجودة في ملف .env.local');
}

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'edustream-auth-token',
      // إضافة هذا الخيار لضمان تحديث البيانات عند العودة للمنصة
      flowType: 'pkce', 
    },
    global: {
      headers: { 'x-application-name': 'edustream-platform-v2' },
    }
  }
);

export default supabase;