import { media } from "./media";
import type { Service, Treatment } from "./types";

export const services: Service[] = [
  {
    slug: "joint-replacement",
    icon: "bone",
    image: media.xray,
    title: { ar: "تغيير المفاصل", en: "Joint Replacement" },
    summary: {
      ar: "استبدال مفصل الركبة والفخذ بأحدث المفاصل الصناعية لحركة طبيعية بلا ألم.",
      en: "Knee and hip replacement with the latest implants for natural, pain-free movement.",
    },
    description: {
      ar: "نعتمد تقنيات تغيير المفاصل الحديثة بشق جراحي صغير وتخطيط دقيق قبل العملية، ما يقلل فقد الدم ويسرّع العودة للمشي في اليوم التالي للجراحة.",
      en: "We use modern, minimally invasive joint replacement techniques with precise pre-operative planning — reducing blood loss and getting you walking the day after surgery.",
    },
    benefits: {
      ar: ["مفاصل صناعية عالمية بعمر افتراضي طويل", "المشي بمساعدة في اليوم التالي", "برنامج تأهيل مخصص بعد العملية"],
      en: ["World-class implants built to last", "Assisted walking the next day", "A tailored post-operative rehab programme"],
    },
  },
  {
    slug: "arthroscopy",
    icon: "scan",
    image: media.arthroscopy,
    title: { ar: "جراحات المناظير", en: "Arthroscopic Surgery" },
    summary: {
      ar: "علاج إصابات الركبة والكتف بالمنظار عبر فتحات دقيقة وتعافٍ سريع.",
      en: "Keyhole treatment of knee and shoulder injuries through tiny incisions for a fast recovery.",
    },
    description: {
      ar: "يتيح المنظار إصلاح الغضاريف والأربطة وأوتار الكتف بدقة عالية ومن خلال فتحات لا تتجاوز سنتيمترات قليلة، مع ألم أقل وندبات شبه معدومة.",
      en: "Arthroscopy allows precise repair of cartilage, ligaments and shoulder tendons through incisions of just a few millimetres — with less pain and virtually no scarring.",
    },
    benefits: {
      ar: ["خروج في نفس اليوم غالبًا", "ألم أقل وندبات شبه معدومة", "إصلاح دقيق للأربطة والغضاريف"],
      en: ["Usually same-day discharge", "Less pain, minimal scarring", "Precise ligament and cartilage repair"],
    },
  },
  {
    slug: "sports-injuries",
    icon: "activity",
    image: media.running,
    title: { ar: "الإصابات الرياضية", en: "Sports Injuries" },
    summary: {
      ar: "تشخيص وعلاج إصابات الرياضيين بخطط تعيدك للملعب بأمان.",
      en: "Diagnosis and treatment of athletic injuries with plans that return you to play safely.",
    },
    description: {
      ar: "من قطع الرباط الصليبي إلى التواءات الكاحل وإصابات العضلات، نضع خطة علاج وتأهيل مبنية على طبيعة رياضتك وأهدافك.",
      en: "From ACL tears to ankle sprains and muscle injuries, we build a treatment and rehab plan around your sport and your goals.",
    },
    benefits: {
      ar: ["خطط عودة للملعب مبنية على الأدلة", "تنسيق مع المدرب وأخصائي التأهيل", "برامج للوقاية من تكرار الإصابة"],
      en: ["Evidence-based return-to-play plans", "Coordination with coaches and physios", "Injury-prevention programmes"],
    },
  },
  {
    slug: "spine-care",
    icon: "spine",
    image: media.spineScan,
    title: { ar: "آلام العمود الفقري", en: "Spine & Back Pain" },
    summary: {
      ar: "تقييم شامل لآلام الظهر والرقبة وعلاجها بأقل تدخل ممكن.",
      en: "Comprehensive assessment of back and neck pain, treated with the least intervention possible.",
    },
    description: {
      ar: "نبدأ بتحديد السبب الدقيق للألم عبر الفحص والأشعة المتقدمة، ثم نختار بين العلاج الطبيعي أو الحقن الموجهة أو الجراحة عند الضرورة فقط.",
      en: "We pinpoint the exact cause of pain through examination and advanced imaging, then choose between physiotherapy, guided injections, or surgery only when necessary.",
    },
    benefits: {
      ar: ["تشخيص دقيق للانزلاق الغضروفي", "حقن موجهة تحت الأشعة", "برامج تقوية وتصحيح القوام"],
      en: ["Accurate disc-herniation diagnosis", "Image-guided injections", "Strengthening and posture programmes"],
    },
  },
];

export const treatments: Treatment[] = [
  {
    slug: "prp",
    icon: "drop",
    image: media.prp,
    title: { ar: "حقن البلازما الغنية بالصفائح", en: "PRP Therapy" },
    summary: {
      ar: "تحفيز الشفاء الطبيعي للأوتار والمفاصل من دم المريض نفسه.",
      en: "Stimulating natural healing of tendons and joints using the patient's own blood.",
    },
    description: {
      ar: "تُستخلص البلازما الغنية بالصفائح من دم المريض وتُحقن في موضع الإصابة لتحفيز إصلاح الأنسجة وتقليل الالتهاب، وهي فعالة في خشونة الركبة المبكرة والتهاب الأوتار.",
      en: "Platelet-rich plasma is prepared from your own blood and injected into the injured area to stimulate tissue repair and reduce inflammation — effective for early knee osteoarthritis and tendinopathy.",
    },
    benefits: {
      ar: ["علاج طبيعي آمن من دم المريض", "يقلل الألم ويحسن الحركة", "قد يؤخر أو يُغني عن الجراحة"],
      en: ["Safe, natural therapy from your own blood", "Reduces pain and improves mobility", "May delay or avoid surgery"],
    },
    duration: { ar: "٣٠ دقيقة", en: "30 minutes" },
    sessions: { ar: "٢–٣ جلسات", en: "2–3 sessions" },
    recovery: { ar: "خلال ٤٨ ساعة", en: "Within 48 hours" },
  },
  {
    slug: "rehabilitation",
    icon: "activity",
    image: media.rehab,
    title: { ar: "التأهيل الحركي", en: "Rehabilitation" },
    summary: {
      ar: "برامج تأهيل مخصصة لاستعادة القوة والمرونة بعد الإصابة أو الجراحة.",
      en: "Personalised rehab programmes to restore strength and flexibility after injury or surgery.",
    },
    description: {
      ar: "بالتعاون مع أخصائيي العلاج الطبيعي، نصمم برنامجًا تدريجيًا يعيد للمفصل قوته ومداه الحركي، مع متابعة دورية لقياس التقدم.",
      en: "Working with specialist physiotherapists, we design a progressive programme that restores the joint's strength and range of motion, with regular progress reviews.",
    },
    benefits: {
      ar: ["استعادة المدى الحركي الكامل", "تقوية العضلات الداعمة", "تقليل خطر تكرار الإصابة"],
      en: ["Restores full range of motion", "Strengthens supporting muscles", "Lowers risk of re-injury"],
    },
    duration: { ar: "٤٥ دقيقة", en: "45 minutes" },
    sessions: { ar: "٨–١٢ جلسة", en: "8–12 sessions" },
    recovery: { ar: "تدريجي حسب الحالة", en: "Gradual, case-dependent" },
  },
  {
    slug: "shockwave",
    icon: "wave",
    image: media.treatmentRoom,
    title: { ar: "العلاج بالموجات التصادمية", en: "Shockwave Therapy" },
    summary: {
      ar: "موجات صوتية مركزة لعلاج التهابات الأوتار وشوكة الكعب بدون جراحة.",
      en: "Focused acoustic waves to treat tendinitis and heel spurs without surgery.",
    },
    description: {
      ar: "تعمل الموجات التصادمية على تنشيط الدورة الدموية وتحفيز تجدد الأنسجة في الأوتار المزمنة الالتهاب، مثل كوع التنس وشوكة الكعب والتهاب وتر أكيليس.",
      en: "Shockwave therapy boosts blood flow and stimulates tissue regeneration in chronically inflamed tendons such as tennis elbow, heel spurs and Achilles tendinitis.",
    },
    benefits: {
      ar: ["بدون جراحة أو تخدير", "نتائج ملحوظة خلال أسابيع", "مناسب للحالات المزمنة"],
      en: ["No surgery or anaesthesia", "Noticeable results within weeks", "Ideal for chronic conditions"],
    },
    duration: { ar: "٢٠ دقيقة", en: "20 minutes" },
    sessions: { ar: "٣–٥ جلسات", en: "3–5 sessions" },
    recovery: { ar: "فوري", en: "Immediate" },
  },
  {
    slug: "fracture-care",
    icon: "bone",
    image: media.brace,
    title: { ar: "علاج الكسور والتجبير", en: "Fracture Care" },
    summary: {
      ar: "تثبيت الكسور بأحدث الجبائر والدعامات لالتئام سليم وسريع.",
      en: "Fracture stabilisation with modern casts and braces for fast, correct healing.",
    },
    description: {
      ar: "نقيّم كل كسر بدقة لتحديد الحاجة إلى تثبيت خارجي أو داخلي، ونستخدم جبائر خفيفة وحديثة تسمح بحركة أكبر وراحة أفضل خلال فترة الالتئام.",
      en: "Each fracture is carefully assessed to decide between external or internal fixation, using lightweight modern braces that allow more movement and comfort while healing.",
    },
    benefits: {
      ar: ["جبائر حديثة خفيفة الوزن", "متابعة إشعاعية دقيقة للالتئام", "عودة آمنة للنشاط"],
      en: ["Lightweight modern braces", "Precise imaging follow-up of healing", "A safe return to activity"],
    },
    duration: { ar: "حسب نوع الكسر", en: "Depends on fracture" },
    sessions: { ar: "متابعة أسبوعية", en: "Weekly follow-up" },
    recovery: { ar: "٤–٨ أسابيع", en: "4–8 weeks" },
  },
];
