/**
 * @typedef {Object} Question
 * @property {number|string} id - معرف الفريد للسؤال
 * @property {'choice'|'true_false'|'fill'} type - نوع السؤال (اختيار، صح/خطأ، إكمال فراغ)
 * @property {string} question - نص السؤال بالفرنسية
 * @property {string[]} [options] - الخيارات المتاحة (في حال كان النوع choice)
 * @property {string|boolean} answer - الإجابة الصحيحة
 */

/**
 * @typedef {Object} ReadingText
 * @property {number} id - معرف النص
 * @property {string} title - عنوان النص (مثلاً: Le quartier de Amani)
 * @property {string} content - المحتوى الكامل للنص المراد قراءته
 * @property {string} level - المستوى الدراسي (4AP أو 5AP)
 * @property {string} image - رابط الصورة التوضيحية للنص
 * @property {string} [audioUrl] - رابط تسجيل صوتي نموذجي (اختياري)
 * @property {Question[]} questions - قائمة أسئلة الفهم الخاصة بالنص
 */

/**
 * @typedef {Object} UserStats
 * @property {number} points - إجمالي نقاط الخبرة XP
 * @property {number[]} completedTexts - مصفوفة تحتوي على معرفات النصوص المكتملة
 * @property {number} bestWpm - أفضل سرعة قراءة حققها التلميذ
 * @property {number} avgAccuracy - متوسط دقة النطق
 */

// تصدير كائنات فارغة لتجنب أخطاء الاستيراد في بعض البيئات
export const Types = {};