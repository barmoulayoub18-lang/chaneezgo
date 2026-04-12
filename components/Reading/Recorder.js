"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, MicOff, Sparkles } from "lucide-react";

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

  // 🆕 حفظ النص النهائي الحقيقي
  const finalTranscriptRef = useRef("");

  // =========================================
  // 🧠 تنظيف النص (🔥 أقوى)
  // =========================================
  const clean = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?;:()"']/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // =========================================
  // 🧠 similarity (محسن)
  // =========================================
  const similarity = (a, b) => {
    if (!a || !b) return 0;
    if (a === b) return 1;

    let matches = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] === b[i]) matches++;
    }

    return matches / Math.max(a.length, b.length);
  };

  // =========================================
  // 🔥 تحليل مباشر (محسن ومتوافق مع scoring)
  // =========================================
  const analyzeLive = (spokenText) => {
    if (!originalText) return;

    const originalWords = clean(originalText).split(" ");
    const spokenWords = clean(spokenText).split(" ");

    let result = [];
    let j = 0;

    for (let i = 0; i < originalWords.length; i++) {
      const expected = originalWords[i];
      const spoken = spokenWords[j];

      if (!spoken) {
        result.push({ word: expected, status: "pending" });
        continue;
      }

      const score = similarity(expected, spoken);

      if (score >= 0.8) {
        result.push({ word: expected, status: "correct" });
        j++;
      } else if (score >= 0.5) {
        result.push({ word: expected, status: "wrong" });
        j++;
      } else {
        result.push({ word: expected, status: "pending" });
      }
    }

    setWordsStatus(result);
  };

  // =========================================
  // 🎤 INIT SPEECH
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
      let interim = "";
      let finalText = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += " " + transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }

      finalText = finalText.trim();
      interim = interim.trim();

      finalTranscriptRef.current = finalText;

      const combinedText = (finalText + " " + interim).trim();

      setInterimText(combinedText);

      // 🔥 إرسال النص الحقيقي فقط
      onTranscriptUpdate(finalText);

      // 🔥 تحليل حي
      analyzeLive(combinedText);

      // 🧠 Debug
      console.log("🎤 FINAL:", finalText);
      console.log("📝 INTERIM:", interim);
    };

    rec.onerror = (event) => {
      setError("خطأ في الميكروفون");
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
      finalTranscriptRef.current = "";

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

      <h3 className="text-xl font-black text-indigo-500 flex items-center gap-2">
  <Sparkles className="text-indigo-400" />
  تحليل القراءة
</h3>

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

      {/* النص المباشر */}
      <div className="w-full p-4 border rounded-xl text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="font-bold text-gray-800">
            {interimText || "ابدأ القراءة..."}
          </p>
        )}
      </div>

      {/* الكلمات */}
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



