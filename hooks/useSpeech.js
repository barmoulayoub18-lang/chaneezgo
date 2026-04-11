"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeech(options = {}) {
  const { lang = "fr-FR", onResult } = options;

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  // =========================================
  // 🎙️ INIT
  // =========================================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("المتصفح لا يدعم التعرف على الصوت");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      if (onResult) onResult(text);
    };

    rec.onerror = (event) => {
      console.error("Speech error:", event.error);

      if (event.error === "not-allowed") {
        setError("يجب السماح باستخدام الميكروفون");
      } else {
        setError("خطأ في التعرف على الصوت");
      }

      setIsListening(false);
    };

    rec.onend = () => {
      // 🔥 إعادة التشغيل الذكي
      if (isListening) {
        try {
          rec.start();
        } catch {}
      }
    };

    recognitionRef.current = rec;

  }, [lang, onResult]);

  // =========================================
  // ▶️ START
  // =========================================
  const startListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    try {
      setError(null);
      rec.start();
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // =========================================
  // ⏹️ STOP
  // =========================================
  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    try {
      rec.stop();
    } catch {}

    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    error
  };
}