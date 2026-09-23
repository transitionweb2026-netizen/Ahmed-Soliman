import type { Faq, JourneyStep, Reason, Review, Stat } from "./types";

export const stats: Stat[] = [
  { id: "years", value: 18, suffix: "+", icon: "award", label: { ar: "عامًا من الخبرة", en: "Years of experience" } },
  { id: "surgeries", value: 5000, suffix: "+", icon: "activity", label: { ar: "عملية ناجحة", en: "Successful procedures" } },
  { id: "patients", value: 12000, suffix: "+", icon: "heart", label: { ar: "مريض سعيد", en: "Happy patients" } },
  { id: "satisfaction", value: 98, suffix: "%", icon: "star", label: { ar: "نسبة رضا المرضى", en: "Patient satisfaction" } },
];

export const journey: JourneyStep[] = [
  {
    id: "contact",
    icon: "calendar",
    title: { ar: "الحجز والتواصل", en: "Booking" },
    text: { ar: "احجز موعدك بسهولة عبر الهاتف أو واتساب.", en: "Book easily by phone or WhatsApp." },
  },
  {
    id: "consult",
    icon: "stethoscope",
    title: { ar: "الاستشارة والفحص", en: "Consultation" },
    text: { ar: "فحص سريري دقيق واستماع كامل لتاريخك المرضي.", en: "A thorough exam and a full review of your history." },
  },
  {
    id: "diagnosis",
    icon: "scan",
    title: { ar: "التشخيص الدقيق", en: "Diagnosis" },
    text: { ar: "أشعة وتحاليل متقدمة لتحديد السبب الحقيقي.", en: "Advanced imaging to find the real cause." },
  },
  {
    id: "plan",
    icon: "clipboard",
    title: { ar: "الخطة العلاجية", en: "Treatment plan" },
    text: { ar: "خطة مخصصة تشرح كل الخيارات بوضوح.", en: "A personal plan that explains every option." },
  },
  {
    id: "treatment",
    icon: "shield",
    title: { ar: "العلاج أو الجراحة", en: "Treatment" },
    text: { ar: "تنفيذ دقيق بأحدث التقنيات وأعلى معايير الأمان.", en: "Precise care with the latest, safest techniques." },
  },
  {
    id: "recovery",
    icon: "sparkle",
    title: { ar: "التأهيل والمتابعة", en: "Recovery" },
    text: { ar: "برنامج تأهيل ومتابعة حتى عودتك الكاملة.", en: "Rehab and follow-up until you're fully back." },
  },
];

export const reasons: Reason[] = [
  {
    id: "expertise",
    icon: "award",
    title: { ar: "خبرة دولية معتمدة", en: "Certified international expertise" },
    text: { ar: "زمالة بريطانية وتدريب متقدم في أبرز المراكز الأوروبية.", en: "UK Fellowship and advanced training at leading European centres." },
  },
  {
    id: "minimal",
    icon: "target",
    title: { ar: "أقل تدخل جراحي", en: "Minimally invasive first" },
    text: { ar: "نبدأ دائمًا بالحلول غير الجراحية، وعند الحاجة نعتمد المناظير الدقيقة.", en: "We start with non-surgical options and use precise arthroscopy when needed." },
  },
  {
    id: "tech",
    icon: "scan",
    title: { ar: "تقنيات حديثة", en: "Modern technology" },
    text: { ar: "أجهزة تشخيص وعلاج متطورة لنتائج أدق وتعافٍ أسرع.", en: "Advanced diagnostic and treatment equipment for precise results and faster recovery." },
  },
  {
    id: "care",
    icon: "heart",
    title: { ar: "رعاية شخصية كاملة", en: "Truly personal care" },
    text: { ar: "متابعة مباشرة مع الطبيب في كل مرحلة، من الاستشارة حتى التعافي.", en: "Direct follow-up with the doctor at every stage, from consultation to recovery." },
  },
  {
    id: "safety",
    icon: "shield",
    title: { ar: "أعلى معايير الأمان", en: "The highest safety standards" },
    text: { ar: "بروتوكولات تعقيم وجودة وفق المعايير العالمية.", en: "Sterilisation and quality protocols aligned with international standards." },
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    rating: 5,
    name: { ar: "محمد عبد الرحمن", en: "Mohamed Abdelrahman" },
    treatment: { ar: "منظار الركبة", en: "Knee arthroscopy" },
    text: {
      ar: "عدت للجري بعد ثلاثة أشهر فقط من العملية. شرح الدكتور كل خطوة بوضوح وطمأنني طوال الرحلة.",
      en: "I was running again just three months after surgery. The doctor explained every step clearly and reassured me throughout.",
    },
  },
  {
    id: "r2",
    rating: 5,
    name: { ar: "سارة المصري", en: "Sara El-Masry" },
    treatment: { ar: "حقن البلازما", en: "PRP therapy" },
    text: {
      ar: "تجنبت الجراحة تمامًا بفضل خطة العلاج بالبلازما. اهتمام حقيقي ومتابعة مستمرة.",
      en: "I avoided surgery completely thanks to the PRP plan. Genuine care and continuous follow-up.",
    },
  },
  {
    id: "r3",
    rating: 5,
    name: { ar: "أحمد فؤاد", en: "Ahmed Fouad" },
    treatment: { ar: "تغيير مفصل الفخذ", en: "Hip replacement" },
    text: {
      ar: "والدي يمشي الآن بدون ألم لأول مرة منذ سنوات. فريق محترف وعيادة على أعلى مستوى.",
      en: "My father walks without pain for the first time in years. A professional team and a first-class clinic.",
    },
  },
  {
    id: "r4",
    rating: 5,
    name: { ar: "ندى حسن", en: "Nada Hassan" },
    treatment: { ar: "إصابة رياضية بالكتف", en: "Shoulder sports injury" },
    text: {
      ar: "تشخيص دقيق من أول زيارة وبرنامج تأهيل ممتاز. عدت للتدريب أقوى من قبل.",
      en: "An accurate diagnosis from the first visit and an excellent rehab programme. I'm back to training stronger.",
    },
  },
];

export const faqs: Faq[] = [
  {
    id: "f1",
    question: { ar: "هل أحتاج إلى تحويل من طبيب آخر لحجز موعد؟", en: "Do I need a referral to book an appointment?" },
    answer: {
      ar: "لا، يمكنك الحجز مباشرة عبر الهاتف أو واتساب. يُفضّل إحضار أي أشعة أو تقارير سابقة.",
      en: "No — you can book directly by phone or WhatsApp. Please bring any previous scans or reports.",
    },
  },
  {
    id: "f2",
    question: { ar: "هل كل آلام المفاصل تحتاج إلى جراحة؟", en: "Does all joint pain require surgery?" },
    answer: {
      ar: "إطلاقًا. معظم الحالات تتحسن بالعلاج التحفظي مثل العلاج الطبيعي والحقن الموضعية. الجراحة خيار أخير عند الحاجة الفعلية.",
      en: "Not at all. Most cases improve with conservative care such as physiotherapy and targeted injections. Surgery is a last resort when truly needed.",
    },
  },
  {
    id: "f3",
    question: { ar: "كم تستغرق فترة التعافي بعد منظار الركبة؟", en: "How long is recovery after knee arthroscopy?" },
    answer: {
      ar: "يعود أغلب المرضى للمشي في نفس اليوم، وللأنشطة اليومية خلال أسبوعين، وللرياضة خلال ٣–٤ أشهر حسب الحالة.",
      en: "Most patients walk the same day, return to daily activities within two weeks, and to sport within 3–4 months depending on the case.",
    },
  },
  {
    id: "f4",
    question: { ar: "هل يمكن متابعة الحالة عن بُعد؟", en: "Can follow-ups be done remotely?" },
    answer: {
      ar: "نعم، نوفر متابعة أونلاين لمراجعة الأشعة وتقدم برنامج التأهيل للمرضى من خارج القاهرة.",
      en: "Yes — we offer online follow-ups to review scans and rehab progress for patients outside Cairo.",
    },
  },
  {
    id: "f5",
    question: { ar: "ما هي مواعيد العيادة؟", en: "What are the clinic hours?" },
    answer: {
      ar: "من السبت إلى الخميس من الساعة ٤ مساءً حتى ١٠ مساءً، مع إمكانية حجز مواعيد خاصة للحالات الطارئة.",
      en: "Saturday to Thursday, 4 PM to 10 PM, with priority appointments available for urgent cases.",
    },
  },
];
