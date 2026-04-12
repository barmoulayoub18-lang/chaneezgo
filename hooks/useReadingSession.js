"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useReadingSession(textData) {
  const [isReading, setIsReading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const timerRef = useRef(null);
  const hasAnalyzedRef = useRef(false);
  const timeLeftRef = useRef(60);

  const isSpecialExercise =
    textData?.type === "chrono" || textData?.type === "recorder";

  // =============================
  // مزامنة الوقت
  // =============================
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // =============================
  // إعادة ضبط
  // =============================
  useEffect(() => {
    const wordCount = textData?.content?.split(/\s+/)?.length || 0;
    const dynamicTime = Math.max(60, Math.ceil(wordCount * 2));

    setIsReading(false);
    setTimeLeft(dynamicTime);
    setTranscript("");
    setResults(null);
    setIsAnalyzing(false);
    hasAnalyzedRef.current = false;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [textData?.id]);

  // =============================
  // تحليل النتائج (🔥 مصحح)
  // =============================
  const analyzeResults = useCallback(
    async (finalTranscript, remainingTime) => {
      if (isAnalyzing || hasAnalyzedRef.current || isSpecialExercise) return;

      const content = finalTranscript?.trim();
      if (!content || content.length < 2) {
        console.warn("⚠️ No transcript detected");
        return;
      }

      console.log("🔥 TRANSCRIPT SENT:", content);

      setIsAnalyzing(true);
      hasAnalyzedRef.current = true;

      const wordCountTotal =
        textData?.content?.split(/\s+/)?.length || 0;
      const initialTime = Math.max(60, Math.ceil(wordCountTotal * 2));
      const timeUsed = initialTime - remainingTime;
      const safeTimeUsed = timeUsed <= 0 ? 1 : timeUsed;

      try {
        const response = await fetch("/api/analyze-reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalText: textData?.content || "",
            userTranscript: content,
            timeUsed: safeTimeUsed,
            level: textData?.level || "4ap",
          }),
        });

        const data = await response.json();

        const wordsRead = content.split(/\s+/).filter(Boolean).length;

        setResults({
          wpm: data.wpm || Math.round((wordsRead / safeTimeUsed) * 60),
          accuracy: data.accuracy || 0,
          errorsCount: data.errorsCount || 0,
          wordsRead: wordsRead,
          wordsAnalysis: data.wordsAnalysis || [],
          rating: data.rating || "متوسط",
          feedback: data.feedback || "استمر في التدريب",
          stars: data.stars || 1,
        });

      } catch (error) {
        console.error("❌ Analysis Error:", error);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [textData, isAnalyzing, isSpecialExercise]
  );

  // =============================
  // بدء القراءة
  // =============================
  const startReading = useCallback(() => {
    const wordCount = textData?.content?.split(/\s+/)?.length || 0;
    const dynamicTime = Math.max(60, Math.ceil(wordCount * 2));

    setResults(null);
    setTranscript("");
    setTimeLeft(dynamicTime);
    setIsReading(true);
    hasAnalyzedRef.current = false;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopReading();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [textData?.content]);

  // =============================
  // إيقاف القراءة (🔥 مصحح)
  // =============================
  const stopReading = useCallback(() => {
    setIsReading(false);
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      if (transcript.trim().length > 0 && !hasAnalyzedRef.current) {
        analyzeResults(transcript, timeLeftRef.current);
      }
    }, 500);
  }, [transcript, analyzeResults]);

  // =============================
  // تحديث النص
  // =============================
  const updateTranscript = useCallback((newText) => {
    if (!newText) return;
    setTranscript(newText);
  }, []);

  return {
    isReading,
    timeLeft,
    transcript,
    results,
    isAnalyzing,
    startReading,
    stopReading,
    updateTranscript,
  };
}



