/**
 * SpeechToText Service
 * هذا الملف يعمل كجسر (Adapter) لتحويل الكلام إلى نص.
 */

export const speechToTextService = {
  /**
   * 1. التحقق من دعم المتصفح (Client-side)
   */
  isBrowserSupported: () => {
    return typeof window !== "undefined" && 
      (window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  /**
   * 2. دالة تهيئة محرك المتصفح (تستخدم في الـ Hooks)
   */
  getBrowserRecognition: (lang = "fr-FR") => {
    if (typeof window === "undefined") return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    return recognition;
  },

  /**
   * 3. دالة التحويل عبر API (مثل Groq Whisper) 
   * تستخدم إذا كنت ترسل ملفاً صوتياً مسجلاً بصيغة mp3/wav
   */
  transcribeAudioFile: async (audioBlob, lang = "fr") => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("model", "whisper-large-v3");
      formData.append("language", lang);

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Whisper Transcription Error:", error);
      return null;
    }
  }
};