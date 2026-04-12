/**
 * 🎯 نظام تقييم احترافي جداً (نسخة نهائية)
 * ✔ محاذاة ذكية (Alignment)
 * ✔ تقييم فقط ما نُطق
 * ✔ دعم الحذف / الإضافة / التقديم
 * ✔ دقة عالية جداً
 */

// =========================================
// 🧹 تنظيف النص
// =========================================
export const cleanText = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:()"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// =========================================
// 🧠 similarity (Levenshtein)
// =========================================
const similarity = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j],
            dp[i][j - 1],
            dp[i - 1][j - 1]
          );
      }
    }
  }

  const distance = dp[a.length][b.length];
  return 1 - distance / Math.max(a.length, b.length);
};

// =========================================
// 🔥 ALIGNMENT ENGINE (الأهم)
// =========================================
export const analyzeWords = (original, transcript) => {
  const originalDisplay = original.split(/\s+/).filter(Boolean);
  const originalWords = cleanText(original).split(" ").filter(Boolean);
  const spokenWords = cleanText(transcript).split(" ").filter(Boolean);

  const m = originalWords.length;
  const n = spokenWords.length;

  // DP matrix
  const dp = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const sim = similarity(originalWords[i - 1], spokenWords[j - 1]);

      const cost = sim >= 0.8 ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // حذف
        dp[i][j - 1] + 1,      // إضافة
        dp[i - 1][j - 1] + cost // استبدال
      );
    }
  }

  // 🔥 backtrack
  let i = m;
  let j = n;
  let result = [];

  while (i > 0 && j > 0) {
    const sim = similarity(originalWords[i - 1], spokenWords[j - 1]);

    if (dp[i][j] === dp[i - 1][j - 1] && sim >= 0.8) {
      result.unshift({
        word: originalDisplay[i - 1],
        spoken: spokenWords[j - 1],
        status: "correct",
      });
      i--; j--;
    }
    else if (dp[i][j] === dp[i - 1][j - 1] + 1) {
      result.unshift({
        word: originalDisplay[i - 1],
        spoken: spokenWords[j - 1],
        status: "wrong",
      });
      i--; j--;
    }
    else if (dp[i][j] === dp[i - 1][j] + 1) {
      result.unshift({
        word: originalDisplay[i - 1],
        status: "missing",
      });
      i--;
    }
    else {
      j--; // كلمة زائدة (نتجاهلها)
    }
  }

  // باقي الكلمات
  while (i > 0) {
    result.unshift({
      word: originalDisplay[i - 1],
      status: "missing",
    });
    i--;
  }

  return {
    analysis: result,
    spokenWordsCount: spokenWords.length,
  };
};

// =========================================
// 🚀 المحرك الرئيسي
// =========================================
export const processScoring = (originalText, userTranscript, timeUsed) => {
  const { analysis, spokenWordsCount } = analyzeWords(
    originalText,
    userTranscript
  );

  let correct = 0;
  let wrong = 0;
  let missing = 0;

  analysis.forEach((w) => {
    if (w.status === "correct") correct++;
    else if (w.status === "wrong") wrong++;
    else missing++;
  });

  const minutes = Math.max(timeUsed, 1) / 60;
  const wpm = Math.round(spokenWordsCount / minutes);

  const accuracy =
    spokenWordsCount > 0
      ? Math.round((correct / spokenWordsCount) * 100)
      : 0;

  return {
    wordsAnalysis: analysis,
    wordsRead: spokenWordsCount,
    correctWordsCount: correct,
    errorsCount: wrong,
    missingCount: missing,
    totalWords: analysis.length,
    accuracy,
    wpm,
    stars:
      accuracy >= 90 ? 5 :
      accuracy >= 75 ? 4 :
      accuracy >= 60 ? 3 :
      accuracy >= 40 ? 2 :
      accuracy >= 20 ? 1 : 0,
    rating:
      accuracy >= 90 ? "ممتاز جداً" :
      accuracy >= 75 ? "ممتاز" :
      accuracy >= 60 ? "جيد جداً" :
      accuracy >= 40 ? "جيد" :
      accuracy >= 20 ? "متوسط" : "ضعيف",
    feedback:
      accuracy >= 90 ? "🔥 قراءة ممتازة!" :
      accuracy >= 70 ? "👍 أداء جيد جداً!" :
      accuracy >= 50 ? "🙂 حاول تحسين النطق." :
      "❌ تحتاج تدريب أكثر.",
  };
};