import { NextResponse } from "next/server";
import { processScoring } from "@/lib/ai/scoring";

export async function POST(req) {
  try {
    const {
      originalText,
      userTranscript,
      timeUsed,
      level = "4ap"
    } = await req.json();

    // =========================================
    // ✅ VALIDATION (التحقق الصارم من البيانات)
    // =========================================
    if (!originalText || !userTranscript || timeUsed === undefined) {
      return NextResponse.json(
        { error: "بيانات ناقصة لإتمام عملية التحليل" },
        { status: 400 }
      );
    }

    // =========================================
    // 🧹 TEXT SANITIZATION (تنظيف وتفكيك النصوص الملتصقة)
    // =========================================
    // إضافة مسافات بعد علامات الترقيم لمنع التصاق الكلمات (حل مشكلة Amani,j'habite)
    const prepareText = (txt) => {
      return txt
        .replace(/([,.!?;:])([^\s])/g, '$1 $2') // إضافة مسافة إذا نسق الـ STT الكلمات ملتصقة بالعلامات
        .replace(/\s+/g, ' ')                  // توحيد المسافات
        .trim();
    };

    const cleanedOriginal = prepareText(originalText);
    const cleanedTranscript = prepareText(userTranscript);

    // =========================================
    // 🧠 SCORING (المعالجة المركزية بصرامة)
    // =========================================
    // استدعاء الدالة المسؤولة مع التأكد من جودة النص المدخل
    const results = processScoring(
      cleanedOriginal,
      cleanedTranscript,
      timeUsed
    );

    // =========================================
    // 🤖 AI FEEDBACK (توليد الملاحظات الذكية)
    // =========================================
    let aiFeedback = results.feedback;

    if (process.env.GROQ_API_KEY) {
      try {
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "llama3-8b-8192",
              messages: [
                {
                  role: "system",
                  content: `
                    أنت مدرب قراءة محترف للأطفال.
                    قدم ملاحظة تربوية مشجعة وقصيرة جداً بناءً على النتائج.
                    إذا كانت الدقة منخفضة، شجع على إعادة المحاولة ببطء.
                    اللغة: العربية.
                  `
                },
                {
                  role: "user",
                  content: `
                    الدقة: ${results.accuracy}%
                    الكلمات الصحيحة: ${results.correctWordsCount} من أصل ${results.totalWords}
                    السرعة: ${results.wpm} WPM
                  `
                }
              ],
              temperature: 0.3,
              max_tokens: 50
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const msg = data.choices?.[0]?.message?.content?.trim();
          if (msg && msg.length > 3) {
            aiFeedback = msg;
          }
        }
      } catch (err) {
        console.error("AI Feedback Error:", err);
      }
    }

    // =========================================
    // 🎯 RESPONSE (تنسيق النتائج النهائية بدقة واقعية)
    // =========================================
    return NextResponse.json({
      wpm: results.wpm,
      accuracy: results.accuracy,
      errorsCount: results.errorsCount,
      wordsRead: results.wordsRead, 
      correctWordsCount: results.correctWordsCount,
      wordsAnalysis: results.wordsAnalysis, // سيحتوي الآن على تحليل دقيق للكلمات المنفصلة
      feedback: aiFeedback,
      stars: results.stars, // تم ربطها بالدقة (0-100% تعطي 1-5 نجوم)
      rating: results.rating,
      totalWords: results.totalWords,
      status: "success"
    });

  } catch (error) {
    console.error("CRITICAL API ERROR:", error);
    return NextResponse.json(
      {
        error: "فشل نظام التحليل الذكي",
        details: error.message
      },
      { status: 500 }
    );
  }
}