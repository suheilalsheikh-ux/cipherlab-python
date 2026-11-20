PYTHON ACADEMY × CIPHER LAB — GitHub Pages ready
تصميم المهندس سهيل الشيخ

لماذا لا يعمل كود Python عند فتح HTML من التنزيلات؟
أغلب ملفات content:// أو file:// لا توفر أصل ويب موثوقًا لتحميل Web Workers وموارد WebAssembly.
هذه النسخة تفصل العامل البرمجي إلى python-worker.js لتحميله من نفس أصل الموقع عند نشره على HTTPS.

خطوات النشر من github.com:
1- أنشئ مستودعًا Public باسم cipherlab-python-academy.
2- اختر Add file > Upload files.
3- ارفع index.html و python-worker.js و .nojekyll (الثلاثة في جذر المستودع).
4- اضغط Commit changes.
5- Settings > Pages > Build and deployment > Source: Deploy from a branch.
6- Branch: main ; Folder: /(root) ; Save.
7- استخدم عنوان GitHub Pages الذي سيظهر في الإعدادات بعد النشر.
8- افتح قسم أساسيات Python حتى تتحول الحالة إلى Python جاهز، ثم شغّل print(2+3).

ملاحظات:
- لا ترفع ملف ZIP نفسه إلى المستودع وتنتظر تشغيله؛ فك ضغطه وارفع الملفات الثلاثة.
- يحتوي الموقع على 22 درسًا ومختبر تشفير ومسار اختبارات، ويحفظ التقدم محليًا.
- التفسير المرئي للدروس يعمل دون إنترنت، وتشغيل Python الحقيقي يتطلب اتصالًا لتنزيل Pyodide عند التحميل الأول.
- اختبار Python الحقيقي على GitHub Pages لا يزال بحاجة إلى التحقق على جهاز المستخدم بعد نشره.
