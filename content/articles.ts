import { media } from "./media";
import type { Article } from "./types";

export const articles: Article[] = [
  {
    slug: "knee-osteoarthritis-guide",
    date: "2026-08-28",
    readMinutes: 6,
    image: media.checkup,
    category: { ar: "المفاصل", en: "Joints" },
    title: { ar: "خشونة الركبة: الدليل الشامل للتشخيص والعلاج", en: "Knee Osteoarthritis: A Complete Guide to Diagnosis and Treatment" },
    excerpt: {
      ar: "كيف تعرف أنك مصاب بخشونة الركبة؟ وما الخيارات المتاحة قبل التفكير في الجراحة؟",
      en: "How do you know you have knee osteoarthritis — and what are your options before considering surgery?",
    },
    body: [
      {
        type: "p",
        text: {
          ar: "خشونة الركبة من أكثر أمراض المفاصل شيوعًا، وتحدث نتيجة تآكل الغضروف الذي يغطي أطراف العظام تدريجيًا. الخبر الجيد أن التشخيص المبكر يفتح الباب أمام خيارات علاجية فعالة بدون جراحة.",
          en: "Knee osteoarthritis is one of the most common joint conditions, caused by the gradual wear of the cartilage covering the ends of the bones. The good news: early diagnosis opens the door to effective non-surgical treatment.",
        },
      },
      { type: "h2", text: { ar: "الأعراض التي لا يجب تجاهلها", en: "Symptoms you shouldn't ignore" } },
      {
        type: "list",
        items: {
          ar: ["ألم يزداد مع صعود السلم أو الوقوف الطويل", "تيبس صباحي يتحسن مع الحركة", "صوت احتكاك أو طقطقة في المفصل", "تورم متكرر حول الركبة"],
          en: ["Pain that worsens on stairs or prolonged standing", "Morning stiffness that eases with movement", "A grinding or clicking sensation", "Recurrent swelling around the knee"],
        },
      },
      { type: "h2", text: { ar: "خيارات العلاج", en: "Treatment options" } },
      {
        type: "p",
        text: {
          ar: "يبدأ العلاج عادة بتعديل النشاط وإنقاص الوزن وتمارين التقوية، ثم الحقن الموضعية مثل البلازما أو حمض الهيالورونيك. تبقى جراحة تغيير المفصل خيارًا ممتازًا للحالات المتقدمة.",
          en: "Treatment usually begins with activity changes, weight management and strengthening, followed by targeted injections such as PRP or hyaluronic acid. Joint replacement remains an excellent option for advanced cases.",
        },
      },
      {
        type: "quote",
        text: {
          ar: "كل ركبة لها قصة، والخطة الصحيحة تبدأ من فهم هذه القصة.",
          en: "Every knee has a story — the right plan starts by understanding it.",
        },
      },
    ],
  },
  {
    slug: "acl-return-to-sport",
    date: "2026-08-10",
    readMinutes: 5,
    image: media.running,
    category: { ar: "الطب الرياضي", en: "Sports medicine" },
    title: { ar: "العودة للملعب بعد إصابة الرباط الصليبي", en: "Returning to Sport After an ACL Injury" },
    excerpt: {
      ar: "المراحل الأساسية للتأهيل بعد جراحة الرباط الصليبي ومتى تكون العودة آمنة.",
      en: "The key rehab stages after ACL reconstruction — and when it's truly safe to return.",
    },
    body: [
      {
        type: "p",
        text: {
          ar: "العودة للرياضة بعد جراحة الرباط الصليبي ليست موعدًا في التقويم، بل مجموعة من المعايير التي يجب تحقيقها لضمان عدم تكرار الإصابة.",
          en: "Returning to sport after ACL surgery isn't a date on the calendar — it's a set of criteria you must meet to avoid re-injury.",
        },
      },
      { type: "h2", text: { ar: "مراحل التأهيل", en: "Rehab stages" } },
      {
        type: "list",
        items: {
          ar: ["استعادة المدى الحركي والتحكم في التورم", "تقوية العضلة الأمامية والخلفية للفخذ", "تمارين التوازن والرشاقة", "اختبارات العودة للملعب"],
          en: ["Restoring range of motion and controlling swelling", "Strengthening quadriceps and hamstrings", "Balance and agility training", "Return-to-play testing"],
        },
      },
      {
        type: "p",
        text: {
          ar: "تشير الدراسات إلى أن الانتظار ٩ أشهر على الأقل مع اجتياز الاختبارات الوظيفية يقلل خطر تكرار الإصابة بشكل كبير.",
          en: "Research shows that waiting at least nine months and passing functional tests significantly lowers the risk of re-injury.",
        },
      },
    ],
  },
  {
    slug: "prp-myths",
    date: "2026-07-22",
    readMinutes: 4,
    image: media.prp,
    category: { ar: "العلاجات", en: "Treatments" },
    title: { ar: "حقن البلازما: حقائق وخرافات", en: "PRP Injections: Facts and Myths" },
    excerpt: {
      ar: "هل حقن البلازما تعالج كل شيء؟ نفصل بين الحقائق العلمية والتوقعات غير الواقعية.",
      en: "Does PRP cure everything? Separating scientific facts from unrealistic expectations.",
    },
    body: [
      {
        type: "p",
        text: {
          ar: "انتشرت حقن البلازما بشكل كبير في السنوات الأخيرة، ومعها انتشرت توقعات غير دقيقة. إليك ما تقوله الأدلة العلمية.",
          en: "PRP has become hugely popular in recent years — and so have inaccurate expectations. Here's what the evidence says.",
        },
      },
      { type: "h2", text: { ar: "متى تكون البلازما فعالة؟", en: "When is PRP effective?" } },
      {
        type: "p",
        text: {
          ar: "تُظهر البلازما أفضل نتائجها في خشونة الركبة المبكرة إلى المتوسطة، والتهابات الأوتار المزمنة مثل كوع التنس.",
          en: "PRP shows its best results in early-to-moderate knee osteoarthritis and chronic tendinopathies such as tennis elbow.",
        },
      },
    ],
  },
  {
    slug: "desk-back-pain",
    date: "2026-07-05",
    readMinutes: 4,
    image: media.phone,
    category: { ar: "العمود الفقري", en: "Spine" },
    title: { ar: "آلام الظهر لدى موظفي المكاتب", en: "Back Pain for Desk Workers" },
    excerpt: {
      ar: "عادات يومية بسيطة تحمي عمودك الفقري من ساعات الجلوس الطويلة.",
      en: "Simple daily habits that protect your spine from long hours of sitting.",
    },
    body: [
      {
        type: "p",
        text: {
          ar: "الجلوس لساعات طويلة يضع ضغطًا متواصلًا على فقرات أسفل الظهر. التغييرات الصغيرة في بيئة العمل تصنع فرقًا كبيرًا.",
          en: "Sitting for long hours puts constant pressure on the lower spine. Small changes to your workspace make a big difference.",
        },
      },
      {
        type: "list",
        items: {
          ar: ["اجعل الشاشة في مستوى النظر", "قف وتحرك كل ٣٠ دقيقة", "ادعم أسفل الظهر بوسادة صغيرة", "مارس تمارين تقوية عضلات البطن"],
          en: ["Keep your screen at eye level", "Stand and move every 30 minutes", "Support your lower back with a small cushion", "Strengthen your core muscles"],
        },
      },
    ],
  },
  {
    slug: "hip-replacement-recovery",
    date: "2026-06-18",
    readMinutes: 7,
    image: media.doctorWithPatient,
    category: { ar: "الجراحة", en: "Surgery" },
    title: { ar: "التعافي بعد تغيير مفصل الفخذ", en: "Recovering After Hip Replacement" },
    excerpt: {
      ar: "ماذا تتوقع في الأسابيع الأولى بعد العملية، وكيف تسرّع عودتك للحياة الطبيعية.",
      en: "What to expect in the first weeks after surgery — and how to speed up your return to normal life.",
    },
    body: [
      {
        type: "p",
        text: {
          ar: "بفضل التقنيات الحديثة، أصبح المريض يمشي بمساعدة في اليوم التالي للعملية. الالتزام ببرنامج التأهيل هو مفتاح النجاح.",
          en: "Thanks to modern techniques, patients now walk with assistance the day after surgery. Commitment to rehab is the key to success.",
        },
      },
    ],
  },
  {
    slug: "bone-health-nutrition",
    date: "2026-06-01",
    readMinutes: 3,
    image: media.care,
    category: { ar: "الوقاية", en: "Prevention" },
    title: { ar: "التغذية وصحة العظام", en: "Nutrition and Bone Health" },
    excerpt: {
      ar: "الكالسيوم وفيتامين د وأكثر: ما تحتاجه عظامك في كل مرحلة عمرية.",
      en: "Calcium, vitamin D and more: what your bones need at every age.",
    },
    body: [
      {
        type: "p",
        text: {
          ar: "تبني العظام كثافتها القصوى حتى سن الثلاثين تقريبًا، ثم يبدأ الحفاظ عليها. التغذية المتوازنة والنشاط البدني هما خط الدفاع الأول.",
          en: "Bones reach peak density around age thirty, after which the goal is preservation. Balanced nutrition and physical activity are the first line of defence.",
        },
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
