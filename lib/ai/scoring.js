/**
 * 🎯 نظام تقييم احترافي مطور للقراءة (نسخة التصحيح الصارم)
 * ✔ معالجة ذكية لاختلاف ترتيب الكلمات (Flexible Matching)
 * ✔ تجاهل حالة الأحرف والرموز بدقة
 * ✔ حساب دقيق للكلمات الصحيحة والأخطاء
 * ✔ نظام نجوم ديناميكي مرتبط بدقة 100%
 */

// =========================================
// 🧹 تنظيف النص (محسن ليدعم اللغات المختلفة بصرامة)
// =========================================
export const cleanText = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // إزالة الـ accents
    .replace(/[.,!?;:()"']/g, " ")     // تحويل علامات الترقيم لمسافات
    .replace(/\s+/g, " ")             // توحيد المسافات (حل مشكلة الالتصاق)
    .trim();
};

// =========================================
// 🔍 تحليل ذكي (Global Sequence Analysis)
// =========================================
export const analyzeWords = (original, transcript) => {
  const originalWords = original.split(/\s+/).filter(w => w.length > 0);
  const cleanOriginal = cleanText(original).split(" ").filter(w => w.length > 0);
  const cleanSpoken = cleanText(transcript).split(" ").filter(w => w.length > 0);

  let results = [];
  let lastFoundIdx = -1;

  // نظام البحث الشامل: يمنع انهيار التقييم عند الخطأ في كلمة واحدة
  for (let i = 0; i < cleanOriginal.length; i++) {
    const expected = cleanOriginal[i];
    const originalDisplay = originalWords[i];

    // ابحث عن الكلمة في النص المنطوق بالكامل مع إعطاء الأولوية للترتيب المنطقي
    let foundIdx = -1;
    
    // نبحث في نطاق مرن حول الكلمة الحالية (للسماح بالتخطي أو إعادة الكلمات)
    const searchStart = Math.max(0, lastFoundIdx - 2);
    const searchEnd = Math.min(cleanSpoken.length, lastFoundIdx + 10);

    for (let j = searchStart; j < searchEnd; j++) {
      if (cleanSpoken[j] === expected) {
        foundIdx = j;
        break;
      }
    }

    if (foundIdx !== -1) {
      results.push({
        word: originalDisplay,
        status: "correct",
      });
      lastFoundIdx = foundIdx;
    } else {
      // إذا لم تنطق الكلمة أو نُطقت بشكل خاطئ تماماً
      // نتحقق إذا كان هناك "ضجيج" صوتي في مكانها
      if (cleanSpoken[i] && cleanSpoken[i] !== expected && i > lastFoundIdx) {
        results.push({
          word: originalDisplay,
          spoken: cleanSpoken[i],
          status: "wrong",
        });
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
// ⭐ تقييم المستوى (نظام النجوم الصارم)
// =========================================
export const evaluatePerformance = (accuracy) => {
  if (accuracy >= 95) return { label: "ممتاز جداً", stars: 5, color: "text-green-600" };
  if (accuracy >= 85) return { label: "ممتاز", stars: 4, color: "text-emerald-500" };
  if (accuracy >= 70) return { label: "جيد جداً", stars: 3, color: "text-blue-500" };
  if (accuracy >= 50) return { label: "جيد", stars: 2, color: "text-orange-500" };
  if (accuracy >= 25) return { label: "متوسط", stars: 1, color: "text-yellow-500" };
  return { label: "ضعيف", stars: 0, color: "text-red-500" };
};

// =========================================
// 🧠 ملاحظات تربوية (واقعية صريحة)
// =========================================
export const generateFeedback = (stats, accuracy) => {
  if (accuracy >= 90) return "🔥 أداء مذهل! قراءتك متقنة جداً كالمحترفين.";
  if (accuracy >= 75) return "👍 قراءة جيدة جداً، استمر في الممارسة لتصل للكمال.";
  if (accuracy >= 50) return "🙂 جهد طيب، لكن حاول التركيز على مخارج الحروف أكثر.";
  if (accuracy >= 30) return "⚠️ انتبه للكلمات المفقودة، حاول القراءة ببطء ووضوح.";
  return "❌ تحتاج إلى تدريب مكثف على هذا النص وإعادة المحاولة.";
};

// =========================================
// 🚀 المحرك الرئيسي (Core Processor)
// =========================================
export const processScoring = (originalText, userTranscript, timeUsed) => {
  const analysis = analyzeWords(originalText, userTranscript);
  const stats = calculateStats(analysis);

  // حساب WPM بناءً على إجمالي الكلمات التي تمت قراءتها (صحيحة وخاطئة)
  const minutes = Math.max(timeUsed, 1) / 60;
  const wpm = Math.round((stats.correct + stats.wrong) / minutes) || 0;

  // نسبة الدقة الحقيقية (بصرامة): الكلمات الصحيحة فقط من إجمالي النص
  const accuracy = Math.round((stats.correct / stats.total) * 100);

  const performance = evaluatePerformance(accuracy);
  const feedback = generateFeedback(stats, accuracy);

  return {
    wordsAnalysis: analysis,
    wordsRead: stats.correct + stats.wrong, // إجمالي الكلمات المنطوقة
    correctWordsCount: stats.correct, 
    errorsCount: stats.wrong + stats.missing, // دمج المفقود مع الخاطئ كأخطاء اجمالية للتقييم
    missingCount: stats.missing,
    wpm,
    accuracy,
    stars: performance.stars,
    rating: performance.label,
    feedback,
    totalWords: stats.total,
  };
};