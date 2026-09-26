import { media } from "./media";
import { services } from "./services";
import type { Achievement, Certificate, DetailItem, Milestone } from "./types";

/** "Latest Technologies" — four cards, each opening a detail modal. */
export const technologies: DetailItem[] = [
  {
    id: "arthroscopy-4k",
    icon: "scan",
    image: media.arthroscopy,
    title: { ar: "مناظير عالية الدقة 4K", en: "4K High-Definition Arthroscopy" },
    summary: {
      ar: "رؤية فائقة الوضوح داخل المفصل عبر فتحات لا تتجاوز بضعة ملليمترات.",
      en: "Ultra-clear vision inside the joint through incisions of just a few millimetres.",
    },
    details: {
      ar: [
        "تمنح كاميرات المناظير بدقة 4K صورة أوضح بأربع مرات من المناظير التقليدية، ما يسمح برؤية أدق تفاصيل الغضاريف والأربطة وإصلاحها بدقة عالية.",
        "تُجرى العملية عبر فتحات صغيرة جدًا، فيقل الألم والنزيف وتكاد الندبات تختفي، ويعود معظم المرضى إلى منازلهم في اليوم نفسه.",
      ],
      en: [
        "4K arthroscopy cameras deliver an image four times sharper than conventional scopes, revealing the finest detail of cartilage and ligaments so they can be repaired with great precision.",
        "Surgery is performed through tiny incisions, so there is less pain and bleeding, scars are barely visible, and most patients go home the same day.",
      ],
    },
    highlights: {
      ar: ["دقة تشخيص وإصلاح أعلى", "خروج في نفس اليوم غالبًا", "ندبات شبه معدومة"],
      en: ["Sharper diagnosis and repair", "Usually same-day discharge", "Virtually scar-free"],
    },
  },
  {
    id: "navigation",
    icon: "target",
    image: media.operatingRoom,
    title: { ar: "تغيير المفاصل بالملاحة الحاسوبية", en: "Computer-Navigated Joint Replacement" },
    summary: {
      ar: "توجيه حاسوبي لحظي يضمن وضع المفصل الصناعي بدقة ملليمترية.",
      en: "Real-time computer guidance that positions the implant with millimetre accuracy.",
    },
    details: {
      ar: [
        "يرسم نظام الملاحة الحاسوبية خريطة ثلاثية الأبعاد لمفصل المريض أثناء العملية، ويوجّه الجراح لحظة بلحظة لضبط زوايا المفصل الصناعي ومحاذاته.",
        "المحاذاة الدقيقة تعني حركة أكثر طبيعية، وتوازنًا أفضل للأربطة، وعمرًا افتراضيًا أطول للمفصل الصناعي.",
      ],
      en: [
        "The navigation system builds a 3D map of the patient's joint during surgery and guides the surgeon in real time to set the implant's angles and alignment.",
        "Precise alignment means more natural movement, better ligament balance and a longer life for the implant.",
      ],
    },
    highlights: {
      ar: ["محاذاة بدقة ملليمترية", "حركة أكثر طبيعية", "عمر أطول للمفصل الصناعي"],
      en: ["Millimetre-accurate alignment", "More natural movement", "Longer implant life"],
    },
  },
  {
    id: "3d-planning",
    icon: "scan",
    image: media.spineScan,
    title: { ar: "التخطيط الجراحي ثلاثي الأبعاد", en: "3D Surgical Planning" },
    summary: {
      ar: "نماذج ثلاثية الأبعاد من الأشعة تتيح تخطيط كل خطوة قبل دخول غرفة العمليات.",
      en: "3D models built from scans let every step be planned before entering theatre.",
    },
    details: {
      ar: [
        "تُحوَّل صور الأشعة المقطعية والرنين المغناطيسي إلى نموذج ثلاثي الأبعاد لعظام المريض، فيُحدَّد حجم المفصل الصناعي وموضعه وخطوات الإصلاح مسبقًا.",
        "يقلل التخطيط المسبق مدة الجراحة ويرفع دقتها، ويساعد المريض على فهم حالته وخطة علاجه بوضوح.",
      ],
      en: [
        "CT and MRI images are turned into a 3D model of the patient's bones, so implant size, position and each step of the repair are decided in advance.",
        "Planning ahead shortens surgery, raises precision and helps patients clearly understand their condition and treatment plan.",
      ],
    },
    highlights: {
      ar: ["خطة مخصصة لكل مريض", "مدة جراحة أقصر", "شرح واضح للحالة"],
      en: ["A plan unique to each patient", "Shorter operating time", "A clear explanation of your case"],
    },
  },
  {
    id: "ultrasound-guided",
    icon: "drop",
    image: media.prp,
    title: { ar: "الحقن الموجّه بالموجات الصوتية", en: "Ultrasound-Guided Injections" },
    summary: {
      ar: "حقن البلازما والعلاجات التجديدية في الموضع الدقيق تحت التوجيه المباشر.",
      en: "PRP and regenerative therapies delivered to the exact spot under live guidance.",
    },
    details: {
      ar: [
        "باستخدام الموجات فوق الصوتية، يرى الطبيب الوتر أو المفصل أثناء الحقن مباشرة، فيصل العلاج إلى موضع الإصابة بالضبط بدلًا من الحقن التقديري.",
        "يرفع ذلك فعالية حقن البلازما والعلاجات التجديدية بشكل ملحوظ، ويقلل عدد الجلسات المطلوبة وأي انزعاج أثناء الحقن.",
      ],
      en: [
        "With ultrasound, the doctor sees the tendon or joint live during the injection, so treatment reaches the exact site of injury instead of relying on estimation.",
        "This markedly improves the effectiveness of PRP and regenerative therapies, and reduces both the number of sessions and discomfort.",
      ],
    },
    highlights: {
      ar: ["دقة وصول للموضع المصاب", "فعالية علاجية أعلى", "جلسات أقل"],
      en: ["Pinpoint delivery", "Higher effectiveness", "Fewer sessions"],
    },
  },
];

/** "Key Areas" — the four main specialties, derived from the services data. */
export const keyAreas: DetailItem[] = services.map((service) => ({
  id: service.slug,
  icon: service.icon,
  image: service.image,
  title: service.title,
  summary: service.summary,
  details: { ar: [service.description.ar], en: [service.description.en] },
  highlights: service.benefits,
}));

export const milestones: Milestone[] = [
  {
    id: "graduation",
    period: "2004",
    icon: "book",
    role: { ar: "التخرج في كلية الطب", en: "Graduated in Medicine" },
    place: { ar: "جامعة القاهرة", en: "Cairo University" },
    text: {
      ar: "تخرج بتقدير امتياز مع مرتبة الشرف، وبدأ شغفه بجراحة العظام خلال سنة الامتياز.",
      en: "Graduated with honours; his passion for orthopaedics began during his internship year.",
    },
  },
  {
    id: "residency",
    period: "2006 — 2011",
    icon: "stethoscope",
    role: { ar: "نائب ثم مدرس جراحة العظام", en: "Resident, then Lecturer in Orthopaedics" },
    place: { ar: "مستشفيات جامعة القاهرة", en: "Cairo University Hospitals" },
    text: {
      ar: "تدريب مكثف على جراحات الكسور والمفاصل، وحصل خلالها على الماجستير ثم الدكتوراه.",
      en: "Intensive training in trauma and joint surgery, earning his Master's and then his Doctorate.",
    },
  },
  {
    id: "frcs",
    period: "2014",
    icon: "award",
    role: { ar: "الزمالة البريطانية", en: "UK Fellowship (FRCS)" },
    place: { ar: "الكلية الملكية للجراحين — لندن", en: "Royal College of Surgeons — London" },
    text: {
      ar: "اجتاز امتحانات الزمالة البريطانية لجراحة العظام والإصابات، إحدى أرفع الشهادات المهنية عالميًا.",
      en: "Passed the UK Fellowship in Trauma & Orthopaedics, one of the most respected qualifications worldwide.",
    },
  },
  {
    id: "lyon",
    period: "2015 — 2017",
    icon: "globe",
    role: { ar: "زمالة المناظير والطب الرياضي", en: "Arthroscopy & Sports Medicine Fellowship" },
    place: { ar: "مركز الطب الرياضي — ليون، فرنسا", en: "Sports Medicine Centre — Lyon, France" },
    text: {
      ar: "عمل ضمن فريق يعالج رياضيين محترفين، وأتقن أحدث تقنيات مناظير الركبة والكتف.",
      en: "Worked in a team treating professional athletes and mastered advanced knee and shoulder arthroscopy.",
    },
  },
  {
    id: "consultant",
    period: "2017 — 2020",
    icon: "shield",
    role: { ar: "استشاري جراحة العظام", en: "Consultant Orthopaedic Surgeon" },
    place: { ar: "مستشفى دار الفؤاد", en: "Dar Al Fouad Hospital" },
    text: {
      ar: "قاد برنامج تغيير المفاصل والمناظير، وأدخل تقنيات الملاحة الحاسوبية إلى القسم.",
      en: "Led the joint replacement and arthroscopy programme and introduced computer navigation to the department.",
    },
  },
  {
    id: "today",
    period: "2020 —",
    icon: "sparkle",
    role: { ar: "مؤسس ومدير العيادة", en: "Founder & Medical Director" },
    place: { ar: "عيادة د. أحمد سليمان — القاهرة", en: "Dr. Ahmed Soliman Clinic — Cairo" },
    text: {
      ar: "يقدم اليوم رعاية متكاملة بمعايير عالمية، ويواصل التدريس والبحث العلمي وتدريب الجراحين الشباب.",
      en: "Today he provides complete care to international standards while continuing to teach, research and train young surgeons.",
    },
  },
];

export const achievements: Achievement[] = [
  {
    id: "research",
    icon: "book",
    title: { ar: "+٣٠ بحثًا علميًا منشورًا", en: "30+ published research papers" },
    text: { ar: "في دوريات دولية محكّمة في جراحة العظام والطب الرياضي.", en: "In international peer-reviewed orthopaedic and sports medicine journals." },
  },
  {
    id: "speaker",
    icon: "globe",
    title: { ar: "متحدث في مؤتمرات دولية", en: "International congress speaker" },
    text: { ar: "محاضر رئيسي في مؤتمرات جراحة العظام الإقليمية والأوروبية.", en: "Keynote lecturer at regional and European orthopaedic congresses." },
  },
  {
    id: "teams",
    icon: "activity",
    title: { ar: "طبيب أندية ومنتخبات", en: "Club & national team physician" },
    text: { ar: "طبيب معتمد لعدد من الأندية والمنتخبات الرياضية.", en: "Accredited physician to several sports clubs and national teams." },
  },
  {
    id: "faculty",
    icon: "award",
    title: { ar: "مدرب معتمد للمناظير", en: "Certified arthroscopy faculty" },
    text: { ar: "يدرّب الجراحين الشباب في ورش عمل المناظير المعتمدة.", en: "Trains young surgeons in accredited arthroscopy workshops." },
  },
  {
    id: "navigation",
    icon: "target",
    title: { ar: "رائد الملاحة الحاسوبية", en: "Navigation surgery pioneer" },
    text: { ar: "من أوائل من أدخلوا تغيير المفاصل بالملاحة الحاسوبية في مصر.", en: "Among the first to introduce computer-navigated joint replacement in Egypt." },
  },
  {
    id: "patients",
    icon: "heart",
    title: { ar: "+١٢٠٠٠ مريض", en: "12,000+ patients treated" },
    text: { ar: "بنسبة رضا تتجاوز ٩٨٪ وفق استبيانات المتابعة.", en: "With over 98% satisfaction in follow-up surveys." },
  },
];

export const certificates: Certificate[] = [
  {
    id: "frcs",
    year: "2014",
    title: { ar: "الزمالة البريطانية لجراحة العظام", en: "FRCS (Trauma & Orthopaedics)" },
    issuer: { ar: "الكلية الملكية للجراحين — المملكة المتحدة", en: "Royal College of Surgeons — United Kingdom" },
  },
  {
    id: "md",
    year: "2011",
    title: { ar: "دكتوراه جراحة العظام", en: "MD in Orthopaedic Surgery" },
    issuer: { ar: "جامعة القاهرة", en: "Cairo University" },
  },
  {
    id: "esska",
    year: "2016",
    title: { ar: "زمالة المناظير والطب الرياضي", en: "Arthroscopy & Sports Medicine Fellowship" },
    issuer: { ar: "الجمعية الأوروبية (ESSKA)", en: "European Society (ESSKA)" },
  },
  {
    id: "aaos",
    year: "2018",
    title: { ar: "العضوية الدولية", en: "International Membership" },
    issuer: { ar: "الأكاديمية الأمريكية لجراحي العظام (AAOS)", en: "American Academy of Orthopaedic Surgeons" },
  },
  {
    id: "msc",
    year: "2008",
    title: { ar: "ماجستير جراحة العظام", en: "MSc in Orthopaedic Surgery" },
    issuer: { ar: "جامعة القاهرة", en: "Cairo University" },
  },
  {
    id: "navigation",
    year: "2019",
    title: { ar: "شهادة جراحة المفاصل بالملاحة الحاسوبية", en: "Computer-Navigated Arthroplasty Certification" },
    issuer: { ar: "أكاديمية الجراحة الأوروبية", en: "European Surgical Academy" },
  },
];
