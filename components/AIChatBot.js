"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, MinusCircle } from 'lucide-react';

export default function AIChatBot({ lessonTitle, lessonDescription }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `مرحباً بك! أنا مساعدك الذكي في منصة EduStream. هل لديك أي سؤال بخصوص درس "${lessonTitle || 'اليوم'}"؟ أنا هنا لأشرح لك محتوى الفيديو وأي نقطة غير واضحة.` 
    }
  ]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // تم التعديل هنا لضمان المرور عبر السيرفر وحل مشكلة 401
      const response = await fetch("/api/analyze-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            { 
              "role": "system", 
              "content": `أنت مساعد تعليمي خبير في منصة EduStream. 
              سياق الدرس الحالي: "${lessonTitle || 'عام'}".
              محتوى الفيديو/الدرس الحالي (استخدمه لشرح الفيديو للطالب): "${lessonDescription || 'هذا الفيديو هو مقدمة تعليمية للمسار'}"
              
              تعليمات التشغيل: 
              1. إذا سألك الطالب "اشرح لي الفيديو" أو ما شابه، قم بتحليل النص الموجود في (محتوى الفيديو) أعلاه وقدم شرحاً وافياً ومبسطاً.
              2. أجب باللغة العربية الفصحى والمبسطة. 
              3. كن دقيقاً جداً في المعلومات العلمية والبرمجية. 
              4. إذا سأل الطالب سؤالاً لا علاقة له بالدرس، أجب بلطف ثم ذكّره بالعودة لموضوع الدرس: ${lessonTitle}.
              5. شجع الطالب بكلمات محفزة دائماً.` 
            },
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            userMessage
          ],
          "temperature": 0.6,
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const aiContent = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
      } else {
        throw new Error("Invalid response from API");
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، واجهت مشكلة في الاتصال. يرجى المحاولة مرة أخرى." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[9999] font-sans" dir="rtl">
      {/* نافذة الدردشة */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[85vw] md:w-[420px] h-[550px] max-h-[70vh] bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-l from-indigo-600 to-purple-600 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">المساعد التعليمي</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-white/70 font-medium tracking-wider">متصل الآن</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
            >
              <MinusCircle size={22} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#020617] custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-slate-800 border border-white/5'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-indigo-400" />}
                </div>
                <div className={`notranslate max-w-[80%] p-4 rounded-[1.5rem] text-[13px] md:text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tl-none' 
                  : 'bg-white/5 text-slate-200 border border-white/5 rounded-tr-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center">
                  <Loader2 size={16} className="text-indigo-400 animate-spin" />
                </div>
                <div className="bg-white/5 p-4 rounded-[1.5rem] rounded-tr-none border border-white/5">
                   <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/50 border-t border-white/5 backdrop-blur-xl">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اسأل عن محتوى الفيديو..."
                className="notranslate w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-14 pl-5 text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500 text-right"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl transition-all shadow-lg active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 p-4 md:px-7 rounded-full shadow-[0_20px_40px_-10px_rgba(79,70,229,0.6)] hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-500 ${
          isOpen ? 'bg-slate-800 border border-white/10' : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600'
        }`}
      >
        <div className="relative">
          {isOpen ? <X size={24} className="text-white" /> : <Sparkles size={24} className="text-white animate-pulse" />}
          {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#020617]"></span>}
        </div>
        {!isOpen && (
          <span className="hidden md:block font-bold text-white text-sm tracking-wide">
            مساعد الفيديو الذكي
          </span>
        )}
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}