"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  MicOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function Recorder({
  isReading,
  onStart,
  onStop,
  onTranscriptUpdate,
  originalText = "",
}) {
  const recognitionRef = useRef(null);

  const [interimText, setInterimText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);

  const [wordsStatus, setWordsStatus] = useState([]);

  // =========================================
  // 🧠 INIT SPEECH
  // =========================================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "fr-FR";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      setInterimText(text);
      onTranscriptUpdate(text);

      // 🔥 تحليل مباشر
      analyzeLive(text);
    };

    rec.onerror = (event) => {
      if (event.error === "not-allowed") {
        setError("يجب السماح باستخدام الميكروفون");
      } else {
        setError("خطأ في التعرف على الصوت");
      }

      onStop();
    };

    rec.onend = () => {
      if (isReading) {
        try {
          rec.start();
        } catch {}
      }
    };

    recognitionRef.current = rec;

    return () => rec.stop();
  }, []);

  // =========================================
  // ▶️ START / STOP
  // =========================================
  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isReading) {
      setError(null);
      setInterimText("");

      try {
        rec.start();
      } catch {}
    } else {
      try {
        rec.stop();
      } catch {}
    }
  }, [isReading]);

  // =========================================
  // 🔥 تحليل مباشر للكلمات
  // =========================================
  const analyzeLive = (spokenText) => {
    if (!originalText) return;

    const originalWords = originalText
      .toLowerCase()
      .split(" ");

    const spokenWords = spokenText
      .toLowerCase()
      .split(" ");

    let result = originalWords.map((word, index) => {
      const spoken = spokenWords[index];

      if (!spoken) {
        return { word, status: "pending" };
      }

      if (spoken === word) {
        return { word, status: "correct" };
      }

      return { word, status: "wrong" };
    });

    setWordsStatus(result);
  };

  // =========================================
  // ❌ NOT SUPPORTED
  // =========================================
  if (!isSupported) {
    return (
      <div className="p-6 bg-red-50 border rounded-3xl text-center">
        <MicOff className="mx-auto mb-3 text-red-400" size={32} />
        <p className="text-sm text-red-600 font-black">
          المتصفح لا يدعم الميكروفون
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border flex flex-col items-center space-y-6">

      {/* TITLE */}
      <h3 className="text-xl font-black flex items-center gap-2">
        <Sparkles className="text-yellow-400" />
        تحليل القراءة
      </h3>

      {/* BUTTON */}
      {!isReading ? (
        <button
          onClick={onStart}
          className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center"
        >
          <Mic size={36} />
        </button>
      ) : (
        <button
          onClick={onStop}
          className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center"
        >
          <Square size={28} />
        </button>
      )}

      {/* LIVE TEXT */}
      <div className="w-full p-4 border rounded-xl text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="font-bold text-gray-800">
            {interimText || "ابدأ القراءة..."}
          </p>
        )}
      </div>

      {/* 🔥 عرض الكلمات */}
      <div className="flex flex-wrap gap-2 justify-center">
        {wordsStatus.map((w, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded text-sm ${
              w.status === "correct"
                ? "bg-green-200 text-green-800"
                : w.status === "wrong"
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {w.word}
          </span>
        ))}
      </div>
    </div>
  );
}