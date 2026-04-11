import { jsPDF } from "jspdf";

/**
 * دالة توليد شهادة إتمام الدورة
 * @param {Object} data - بيانات الطالب والدورة (studentName, courseTitle, date)
 */
export const generateCertificatePDF = async (data) => {
  const { studentName, courseTitle, completionDate } = data;

  // 1. إنشاء مستند PDF بالعرض (Landscape)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // 2. تصميم الخلفية (إطار احترافي بلون الأنديجو الخاص بمنصتك)
  doc.setFillColor(2, 6, 23); // #020617 اللون الداكن للمنصة
  doc.rect(0, 0, width, height, "F");

  // إطار ذهبي خارجي
  doc.setDrawColor(79, 70, 229); // Indigo-500
  doc.setLineWidth(2);
  doc.rect(10, 10, width - 20, height - 20);

  // 3. إضافة الشعارات والنصوص
  // ملاحظة: للغة العربية، نحتاج لاستخدام خط يدعم الـ Unicode
  // سنقوم هنا بضبط الإعدادات الافتراضية، ويفضل رفع خط Arabic (.ttf) وتحويله لـ Base64
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.text("CERTIFICATE OF COMPLETION", width / 2, 50, { align: "center" });

  doc.setFontSize(20);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text("هذه الشهادة مقدمة تقديراً لجهود الطالب:", width / 2, 80, { align: "center" });

  // اسم الطالب (باللون الأبيض وحجم كبير)
  doc.setFontSize(35);
  doc.setTextColor(255, 255, 255);
  doc.text(studentName, width / 2, 105, { align: "center" });

  // تفاصيل الدورة
  doc.setFontSize(18);
  doc.setTextColor(148, 163, 184);
  doc.text("لإتمامه بنجاح الدورة التدريبية بعنوان:", width / 2, 130, { align: "center" });

  doc.setFontSize(25);
  doc.setTextColor(79, 70, 229); // Indigo Color
  doc.text(courseTitle, width / 2, 150, { align: "center" });

  // التاريخ والتوقيع
  doc.setDrawColor(255, 255, 255, 0.2);
  doc.line(40, 175, 100, 175); // خط التوقيع
  doc.line(width - 100, 175, width - 40, 175);

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text("تاريخ الإصدار", 70, 185, { align: "center" });
  doc.text(completionDate, 70, 195, { align: "center" });

  doc.text("ختم المنصة التعليمية", width - 70, 185, { align: "center" });

  // 4. إضافة علامة مائية أو شعار في الزاوية
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229, 0.3);
  doc.text("EDUSTREAM ACADEMY - VERIFIED", width - 30, height - 15, { angle: 90 });

  // 5. حفظ الملف وتحميله تلقائياً
  const fileName = `Certificate-${studentName.replace(/\s+/g, '-')}.pdf`;
  doc.save(fileName);
};