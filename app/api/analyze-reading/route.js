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

    // تنظيف النصوص من الفراغات الزائدة لضمان دقة المقارنة
    const cleanedOriginal = originalText.trim();
    const cleanedTranscript = userTranscript.trim();

    // =========================================
    // 🧠 SCORING (المعالجة المركزية)
    // =========================================
    // نقوم باستدعاء الدالة البرمجية المسؤولة عن خوارزمية المقارنة
    const results = processScoring(
      cleanedOriginal,
      cleanedTranscript,
      timeUsed
    );

    // =========================================
    // 🤖 AI FEEDBACK (توليد الملاحظات الذكية)
    // =========================================
    let aiFeedback = results.feedback;

    // محاولة الاتصال بـ Groq AI إذا كان المفتاح متوفراً لتخصيص الرد
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
                    أنت مدرب قراءة للأطفال باللغة الفرنسية والعربية.
                    قدم ملاحظة تربوية مشجعة وقصيرة جداً (أقل من 10 كلمات).
                    ركز على تحسين النطق وسرعة القراءة.
                    اللغة المستخدمة في الرد: العربية.
                  `
                },
                {
                  role: "user",
                  content: `
                    نص القراءة الأصلي: ${cleanedOriginal}
                    ما قرأه الطالب: ${cleanedTranscript}
                    نسبة الدقة: ${results.accuracy}%
                    الكلمات في الدقيقة: ${results.wpm}
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
        console.error("AI Feedback Error (Non-Critical):", err);
      }
    }

    // =========================================
    // 🎯 RESPONSE (تنسيق النتائج النهائية بدقة)
    // =========================================
    // نرسل البيانات مع التأكد من أن الكلمات الصحيحة والأخطاء منطقية
    return NextResponse.json({
      wpm: results.wpm,
      accuracy: results.accuracy,
      errorsCount: results.errorsCount,
      wordsRead: results.wordsRead, // عدد الكلمات التي نطقها الطالب فعلياً
      correctWordsCount: results.correctWordsCount || results.wordsRead - results.errorsCount,
      wordsAnalysis: results.wordsAnalysis, // المصفوفة التي تلون الكلمات (أحمر/أخضر)
      feedback: aiFeedback,
      stars: results.stars,
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