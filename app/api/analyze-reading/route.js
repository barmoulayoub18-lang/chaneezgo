import { NextResponse } from "next/server";
import { processScoring } from "@/lib/ai/scoring";

export async function POST(req) {
  try {
    // ✅ اقرأ body مرة واحدة فقط
    const body = await req.json();

    const {
      originalText,
      userTranscript,
      timeUsed,
      level = "4ap",
      messages
    } = body;

    // ===============================
    // 🤖 CHATBOT MODE
    // ===============================
    if (!originalText && !userTranscript && !timeUsed && messages) {
      if (!process.env.GROQ_API_KEY) {
        return NextResponse.json({ error: "No API key" }, { status: 500 });
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
        }),
      });

      const data = await res.json();
      return NextResponse.json(data);
    }

    // ===============================
    // 📖 READING MODE
    // ===============================
    if (!originalText || !userTranscript || timeUsed === undefined) {
      return NextResponse.json(
        { error: "بيانات ناقصة لإتمام عملية التحليل" },
        { status: 400 }
      );
    }

    const cleanedOriginal = originalText.trim();
    const cleanedTranscript = userTranscript.trim();

    const results = processScoring(
      cleanedOriginal,
      cleanedTranscript,
      timeUsed
    );

    let aiFeedback = results.feedback;

    // 🤖 تحسين feedback عبر Groq
    if (process.env.GROQ_API_KEY) {
      try {
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama3-8b-8192",
              messages: [
                {
                  role: "system",
                  content: `
                    أنت مدرب قراءة للأطفال.
                    قدم ملاحظة قصيرة جداً ومشجعة.
                  `,
                },
                {
                  role: "user",
                  content: `
                    نسبة الدقة: ${results.accuracy}%
                    السرعة: ${results.wpm}
                  `,
                },
              ],
              temperature: 0.3,
              max_tokens: 50,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const msg = data.choices?.[0]?.message?.content?.trim();
          if (msg) aiFeedback = msg;
        }
      } catch (err) {
        console.error("AI Feedback Error:", err);
      }
    }

    return NextResponse.json({
      wpm: results.wpm,
      accuracy: results.accuracy,
      errorsCount: results.errorsCount,
      wordsRead: results.wordsRead,
      correctWordsCount:
        results.correctWordsCount ||
        results.wordsRead - results.errorsCount,
      wordsAnalysis: results.wordsAnalysis,
      feedback: aiFeedback,
      stars: results.stars,
      rating: results.rating,
      totalWords: results.totalWords,
      status: "success",
    });

  } catch (error) {
    console.error("CRITICAL API ERROR:", error);

    return NextResponse.json(
      {
        error: "فشل نظام التحليل الذكي",
        details: error.message,
      },
      { status: 500 }
    );
  }
}


