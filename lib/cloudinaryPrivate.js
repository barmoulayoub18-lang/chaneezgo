import { v2 as cloudinary } from 'cloudinary';

// إعداد الإعدادات باستخدام متغيرات البيئة لضمان الأمان التام
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmimanv2z',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * دالة لرفع الملفات بشكل خاص (Authenticated)
 * @param {string} fileUri - مسار الملف أو Base64
 * @param {string} folder - المجلد الوجهة (مثل 'payments' أو 'lessons')
 */
export const uploadPrivateFile = async (fileUri, folder = 'private_uploads') => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: folder,
      access_mode: 'authenticated', // تجعل الملف غير متاح للعامة بدون توقيع
      type: 'private',              // نوع الرفع خاص
      resource_type: 'auto',        // التعرف التلقائي على (image, video, raw/pdf)
    });

    return {
      success: true,
      public_id: uploadResponse.public_id,
      secure_url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary Private Upload Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ميزة جديدة: دالة لحذف الملفات من Cloudinary
 * ضرورية لتنظيف السيرفر عند حذف درس أو استبدال ملف قديم
 */
export const deletePrivateFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: 'private'
    });
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * دالة لتوليد رابط موقع (Signed URL) للملفات الخاصة
 * تستخدم لعرض ملفات PDF أو الفيديوهات المحمية لفترة زمنية محددة
 */
export const getPrivateUrl = (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  
  try {
    // تصحيح: إذا كان الملف PDF أو مستند، يجب أن يكون resourceType هو 'raw' في بعض إعدادات Cloudinary
    // لكن 'image' تعمل مع الروابط الموقعة للصور والفيديوهات بشكل افتراضي
    return cloudinary.url(publicId, {
      sign_url: true,
      type: 'private',
      resource_type: resourceType === 'pdf' ? 'image' : resourceType, 
      secure: true,
    });
  } catch (error) {
    console.error('Cloudinary Signature Error:', error);
    return null;
  }
};

/**
 * ميزة جديدة: توليد رابط تحميل مباشر للملفات (مثل PDF)
 */
export const getDownloadUrl = (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'private',
    resource_type: resourceType,
    flags: "attachment", // يجبر المتصفح على تحميل الملف بدل فتحه
    secure: true,
  });
};

export default cloudinary;

