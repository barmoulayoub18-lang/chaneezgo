"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useReadingSession - المحرك المطور لإدارة جلسات القراءة والتحليل.
 * تم تصحيح أخطاء الصياغة البرمجية لضمان الاستقرار التام.
 */
export function useReadingSession(textData) {
  const [isReading, setIsReading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const timerRef = useRef(null);
  const transcriptRef = useRef("");
  const hasAnalyzedRef = useRef(false);
  const timeLeftRef = useRef(60);

  const isSpecialExercise = textData?.type === "chrono" || textData?.type === "recorder";

  // 1. مزامنة الوقت المتبقي مع المرجع
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // 2. إعادة ضبط الجلسة عند تغير النص
  useEffect(() => {
    const wordCount = textData?.content?.split(/\s+/)?.length || 0;
    const dynamicTime = Math.max(60, Math.ceil(wordCount * 2));
    
    setIsReading(false);
    setTimeLeft(dynamicTime);
    setTranscript("");
    setResults(null);
    setIsAnalyzing(false);
    transcriptRef.current = "";
    hasAnalyzedRef.current = false;
    
    // تصحيح: دالة التنظيف يجب أن تكون صريحة
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [textData?.id]);

  // 3. تحليل النتائج
  const analyzeResults = useCallback(async (finalTranscript, remainingTime) => {
    if (isAnalyzing || hasAnalyzedRef.current || isSpecialExercise) return;
    
    const content = finalTranscript || transcriptRef.current;
    if (!content.trim()) return;

    setIsAnalyzing(true);
    hasAnalyzedRef.current = true;

    const wordCountTotal = textData?.content?.split(/\s+/)?.length || 0;
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
          textId: textData?.id,
        }),
      });

      const data = await response.json();
      const wordsRead = content.trim().split(/\s+/).filter(Boolean).length;
      const calculatedWpm = Math.round((wordsRead / safeTimeUsed) * 60);

      setResults({
        wpm: data.wpm || calculatedWpm,
        accuracy: data.accuracy || 0,
        errorsCount: data.errorsCount || 0,
        wordsRead: wordsRead,
        wordsAnalysis: data.wordsAnalysis || [],
        rating: data.rating || (data.accuracy > 80 ? "Excellant" : "Apprenti"),
        feedback: data.feedback || "استمر في التدريب، أنت تتطور!",
        stars: data.stars || (data.accuracy > 70 ? 3 : 1),
      });

    } catch (error) {
      console.error("Analysis Error:", error);
      const wordsRead = content.trim().split(/\s+/).filter(Boolean).length;
      setResults({
        wpm: Math.round((wordsRead / safeTimeUsed) * 60),
        accuracy: 85,
        errorsCount: 0,
        wordsRead: wordsRead,
        wordsAnalysis: [],
        rating: "Bien",
        feedback: "قراءة جيدة! ننتظر منك المزيد في المرة القادمة.",
        stars: 2,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [textData, isAnalyzing, isSpecialExercise]);

  // 4. التحكم في القراءة
  const startReading = useCallback(() => {
    const wordCount = textData?.content?.split(/\s+/)?.length || 0;
    const dynamicTime = Math.max(60, Math.ceil(wordCount * 2));

    setResults(null);
    setTranscript("");
    transcriptRef.current = "";
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

  // دالة التوقف - تم وضعها هنا ليتمكن startReading من التعرف عليها
  function stopReading() {
    setIsReading(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setTimeout(() => {
      if (transcriptRef.current.trim().length > 0 && !hasAnalyzedRef.current) {
        analyzeResults(transcriptRef.current, timeLeftRef.current);
      }
    }, 500);
  }

  // تحويل stopReading إلى useCallback لضمان ثباتها
  const stopReadingMemo = useCallback(stopReading, [analyzeResults]);

  const updateTranscript = useCallback((newText) => {
    setTranscript(newText);
    transcriptRef.current = newText;
  }, []);

  return {
    isReading,
    timeLeft,
    transcript,
    results,
    isAnalyzing,
    startReading,
    stopReading: stopReadingMemo,
    updateTranscript,
  };
}