"use client";
import { useState, useEffect, useCallback } from 'react';

export function useGoogleTranslate() {
  const [isReady, setIsReady] = useState(false);

  const applyLanguage = useCallback((langCode) => {
    if (typeof window === 'undefined') return;

    // القيمة التي يحتاجها جوجل تكون بالتنسيق: /auto/en أو /ar/en
    const cookieValue = `/ar/${langCode}`;
    
    // 1. تعيين الـ Cookie مباشرة لمحرك جوجل
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    
    // 2. حفظ اللغة في التخزين المحلي لضمان بقائها عند التنقل بين الصفحات
    localStorage.setItem('user-language', langCode);

    // 3. تحديث القائمة المنسدلة إذا كانت موجودة (للتأكيد فقط)
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 4. إعادة تحميل الصفحة (ضروري جداً لتفعيل التغيير)
    window.location.reload();
  }, []);

  useEffect(() => {
    // التأكد من تحميل السكريبت الخاص بجوجل
    const checkInterval = setInterval(() => {
      if (window.google && window.google.translate) {
        setIsReady(true);
        
        // التحقق مما إذا كانت هناك لغة محفوظة مسبقاً وتطبيقها بصمت
        const savedLang = localStorage.getItem('user-language');
        const currentCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
        
        if (savedLang && (!currentCookie || !currentCookie.includes(savedLang))) {
          // نطبق اللغة المحفوظة فقط إذا كانت الـ Cookie مفقودة أو مختلفة
          const cookieValue = `/ar/${savedLang}`;
          document.cookie = `googtrans=${cookieValue}; path=/`;
          // ملاحظة: لا نقوم بعمل reload هنا لتجنب حلقة لا نهائية، 
          // جوجل سيتكفل بالترجمة بمجرد قراءة الـ Cookie الجديدة.
        }

        clearInterval(checkInterval);
      }
    }, 500);
    return () => clearInterval(checkInterval);
  }, []);

  const changeLanguage = (langCode) => {
    applyLanguage(langCode);
  };

  return { changeLanguage, isReady };
}