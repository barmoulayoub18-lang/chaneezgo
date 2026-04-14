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

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    setIsReading(false);
    setTimeLeft(60);
    setTranscript("");
    setResults(null);
    setIsAnalyzing(false);
    hasAnalyzedRef.current = false;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [textData?.id]);

  const analyzeResults = useCallback(
    async (finalTranscript, remainingTime) => {
      if (isAnalyzing || hasAnalyzedRef.current || isSpecialExercise) return;

      const content = finalTranscript?.trim();
      if (!content || content.length < 2) {
        return;
      }

      setIsAnalyzing(true);
      hasAnalyzedRef.current = true;

      const initialTime = 60;
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
        console.error(error);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [textData, isAnalyzing, isSpecialExercise]
  );

  const startReading = useCallback(() => {
    setResults(null);
    setTranscript("");
    setTimeLeft(60);
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

  const stopReading = useCallback(() => {
    setIsReading(false);
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      if (transcript.trim().length > 0 && !hasAnalyzedRef.current) {
        analyzeResults(transcript, timeLeftRef.current);
      }
    }, 500);
  }, [transcript, analyzeResults]);

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

