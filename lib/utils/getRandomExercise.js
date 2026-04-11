import { texts4ap } from "@/data/texts/4ap";
import { texts5ap } from "@/data/texts/5ap";

/**
 * دالة لاختيار تمرين عشوائي بناءً على مستوى الدورة
 * @param {string} level - مستوى الدورة (4AP أو 5AP)
 * @returns {Object|null} - كائن التمرين المختار
 */
export function getRandomExerciseByLevel(level) {
  // 1. تحديد مصفوفة البيانات بناءً على المستوى
  let dataSource = [];
  
  if (level === "4AP") {
    dataSource = texts4ap;
  } else if (level === "5AP") {
    dataSource = texts5ap;
  } else {
    console.error("المستوى غير مدعوم:", level);
    return null;
  }

  // 2. تصفية التمارين التي تحتوي على أسئلة فقط (تجنب تمارين الكرونو أو المسجل إذا لم نكن في وضعها)
  const availableExercises = dataSource.filter(ex => 
    ex.questions && ex.questions.length > 0
  );

  if (availableExercises.length === 0) return null;

  // 3. اختيار تمرين عشوائي تماماً
  const randomIndex = Math.floor(Math.random() * availableExercises.length);
  const selectedExercise = availableExercises[randomIndex];

  // 4. خلط ترتيب الأسئلة داخل التمرين لضمان عدم التكرار الممل
  const shuffledQuestions = [...selectedExercise.questions].sort(() => Math.random() - 0.5);

  return {
    ...selectedExercise,
    questions: shuffledQuestions
  };
}

// دالة مساعدة لخلط المصفوفات (Fisher-Yates) لاستخدامها في خيارات الأسئلة
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}