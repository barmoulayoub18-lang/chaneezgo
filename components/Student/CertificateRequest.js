"use client";
import { useState } from 'react';
import jsPDF from 'jspdf';
import { Trophy, Loader2 } from 'lucide-react';

export default function CertificateRequest({ studentName, courseTitle }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // 1. إنشاء عنصر Canvas برمجياً (بعيداً عن DOM والمشاكل)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // إعدادات القياس (A4 Landscape بدقة عالية)
      canvas.width = 2000; 
      canvas.height = 1414;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = '/images/cert-template.jpg'; // تأكد من المسار

      img.onload = () => {
        // 2. رسم الخلفية
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 3. إعدادات الخط (اسم الطالب)
        ctx.fillStyle = '#1a1a1a'; // لون أسود صريح
        ctx.textAlign = 'center';
        ctx.font = 'bold 80px Arial'; // استخدم Arial لضمان التوافق
        
        // رسم الاسم في المنتصف (الإحداثيات بناءً على صورتك)
        ctx.fillText(studentName, canvas.width / 2, canvas.height * 0.54);

        // 4. إعدادات التاريخ (أرقام 123)
        const date = new Date().toLocaleDateString('en-GB');
        ctx.font = 'bold 35px Arial';
        ctx.fillStyle = '#333333';
        
        // رسم التاريخ (تم ضبط الإحداثيات لتكون فوق "التاريخ")
        ctx.fillText(date, canvas.width * 0.38, canvas.height * 0.84);

        // 5. تحويل إلى PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`شهادة-${studentName}.pdf`);
        setIsGenerating(false);
      };

      img.onerror = () => {
        console.error("فشل تحميل صورة القالب");
        setIsGenerating(false);
      };

    } catch (error) {
      console.error("خطأ في التوليد:", error);
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '14px 28px',
        borderRadius: '12px',
        fontWeight: '900',
        fontSize: '18px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.4)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {isGenerating ? <Loader2 size={22} className="animate-spin" /> : <Trophy size={22} />}
      {isGenerating ? "جاري تجهيز الملف..." : "تحميل الشهادة بنجاح"}
    </button>
  );
}