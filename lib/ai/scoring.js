/**
 * 🎯 نظام تقييم احترافي مطور للقراءة
 * ✔ معالجة ذكية لاختلاف ترتيب الكلمات (Flexible Matching)
 * ✔ تجاهل حالة الأحرف والرموز بدقة
 * ✔ حساب دقيق للكلمات الصحيحة والأخطاء
 */

// =========================================
// 🧹 تنظيف النص (محسن ليدعم اللغات المختلفة)
// =========================================
export const cleanText = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // إزالة الـ accents (مثل é, à)
    .replace(/[.,!?;:()"']/g, " ")    // تحويل علامات الترقيم لمسافات
    .replace(/\s+/g, " ")             // توحيد المسافات
    .trim();
};

// =========================================
// 🔍 تحليل ذكي (Flexible Word-by-Word Analysis)
// =========================================
export const analyzeWords = (original, transcript) => {
  const originalWords = original.split(/\s+/); // النص الأصلي كما هو للعرض
  const cleanOriginal = cleanText(original).split(" ");
  const cleanSpoken = cleanText(transcript).split(" ");

  let results = [];
  let spokenIdx = 0;

  // نظام البحث المرن: يسمح للطالب بتخطي كلمات دون إفساد النتيجة الإجمالية
  for (let i = 0; i < cleanOriginal.length; i++) {
    const expected = cleanOriginal[i];
    const originalDisplay = originalWords[i];

    // ابحث عن الكلمة المتوقعة في الكلمات التي نطقها الطالب (في نطاق ضيق لضمان الدقة)
    let found = false;
    let searchRange = Math.min(spokenIdx + 2, cleanSpoken.length); 

    for (let j = spokenIdx; j < searchRange; j++) {
      if (cleanSpoken[j] === expected) {
        found = true;
        spokenIdx = j + 1; // حرك المؤشر لما بعد الكلمة الموجودة
        break;
      }
    }

    if (found) {
      results.push({
        word: originalDisplay,
        status: "correct",
      });
    } else {
      // إذا لم نجدها، نتحقق إذا كان الطالب نطق كلمة خاطئة في هذا المكان
      if (spokenIdx < cleanSpoken.length && i === results.length) {
        results.push({
          word: originalDisplay,
          spoken: cleanSpoken[spokenIdx],
          status: "wrong",
        });
        spokenIdx++;
      } else {
        results.push({
          word: originalDisplay,
          status: "missing",
        });
      }
    }
  }

  return results;
};

// =========================================
// 🧠 حساب الإحصائيات (Statistically Balanced)
// =========================================
export const calculateStats = (analysis) => {
  let correct = 0;
  let wrong = 0;
  let missing = 0;

  analysis.forEach((item) => {
    if (item.status === "correct") correct++;
    else if (item.status === "wrong") wrong++;
    else if (item.status === "missing") missing++;
  });

  return {
    correct,
    wrong,
    missing,
    total: analysis.length,
  };
};

// =========================================
// ⭐ تقييم المستوى
// =========================================
export const evaluatePerformance = (accuracy) => {
  if (accuracy >= 90) return { label: "ممتاز", stars: 5, color: "text-green-600" };
  if (accuracy >= 75) return { label: "جيد جدًا", stars: 4, color: "text-blue-600" };
  if (accuracy >= 60) return { label: "جيد", stars: 3, color: "text-orange-500" };
  if (accuracy >= 40) return { label: "متوسط", stars: 2, color: "text-yellow-500" };
  return { label: "ضعيف", stars: 1, color: "text-red-500" };
};

// =========================================
// 🧠 ملاحظات تربوية
// =========================================
export const generateFeedback = (stats, accuracy) => {
  if (accuracy >= 90) return "🔥 ممتاز! قراءتك دقيقة وسريعة جدًا";
  if (accuracy >= 75) return "👍 جيد جدًا! حاول تحسين النطق قليلاً";
  if (accuracy >= 60) return "🙂 جيد، لكن تحتاج إلى تركيز أكثر";
  if (accuracy >= 40) return "⚠️ حاول القراءة ببطء ووضوح";
  return "❌ تحتاج تدريب كبير على القراءة";
};

// =========================================
// 🚀 المحرك الرئيسي (Core Processor)
// =========================================
export const processScoring = (originalText, userTranscript, timeUsed) => {
  const analysis = analyzeWords(originalText, userTranscript);
  const stats = calculateStats(analysis);

  // حساب WPM بناءً على الكلمات الصحيحة فقط
  const minutes = Math.max(timeUsed, 1) / 60;
  const wpm = Math.round(stats.correct / minutes) || 0;

  // نسبة الدقة: (الكلمات الصحيحة / إجمالي كلمات النص)
  const accuracy = Math.round((stats.correct / stats.total) * 100);

  const performance = evaluatePerformance(accuracy);
  const feedback = generateFeedback(stats, accuracy);

  return {
    wordsAnalysis: analysis,
    wordsRead: stats.correct,
    correctWordsCount: stats.correct, // القيمة المضافة لضمان التوافق
    errorsCount: stats.wrong,        // نحسب الكلمات الخاطئة فقط كأخطاء
    missingCount: stats.missing,     // الكلمات التي لم تُقرأ
    wpm,
    accuracy,
    stars: performance.stars,
    rating: performance.label,
    feedback,
    totalWords: stats.total,
  };
};