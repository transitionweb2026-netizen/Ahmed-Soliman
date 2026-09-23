import type { Localized } from "@/lib/i18n";
import type { Credential, Milestone } from "./types";

export const biography: Localized<string[]> = {
  ar: [
    "تخرج د. أحمد سليمان في كلية الطب بجامعة القاهرة بتقدير امتياز، ثم حصل على الماجستير والدكتوراه في جراحة العظام قبل أن ينال الزمالة البريطانية للكلية الملكية للجراحين.",
    "أمضى عدة سنوات في التدريب المتقدم بمراكز أوروبية رائدة في جراحات المناظير وتغيير المفاصل والطب الرياضي، وشارك في علاج رياضيين محترفين على المستويين المحلي والدولي.",
    "يجمع اليوم بين الممارسة السريرية والتدريس الجامعي والبحث العلمي، ويحرص على نقل أحدث ما توصل إليه الطب العالمي إلى مرضاه بأعلى معايير الجودة والأمان.",
  ],
  en: [
    "Dr. Ahmed Soliman graduated with honours from Cairo University's Faculty of Medicine, then earned his Master's and Doctorate in Orthopaedic Surgery before being awarded the UK Fellowship of the Royal College of Surgeons.",
    "He spent several years in advanced training at leading European centres in arthroscopy, joint replacement and sports medicine, and has treated professional athletes at national and international level.",
    "Today he combines clinical practice with university teaching and research, bringing the latest advances in global medicine to his patients with the highest standards of quality and safety.",
  ],
};

export const expertise: Localized<string[]> = {
  ar: ["جراحات مناظير الركبة والكتف", "تغيير مفاصل الركبة والفخذ", "إصابات الرباط الصليبي والغضاريف", "الطب الرياضي والتأهيل", "العلاج بالبلازما والحقن الموجهة"],
  en: ["Knee & shoulder arthroscopy", "Knee & hip replacement", "ACL & meniscus injuries", "Sports medicine & rehabilitation", "PRP & image-guided injections"],
};

export const credentials: Credential[] = [
  {
    id: "frcs",
    icon: "award",
    year: "2014",
    title: { ar: "الزمالة البريطانية لجراحة العظام", en: "FRCS (Trauma & Orthopaedics)" },
    issuer: { ar: "الكلية الملكية للجراحين — المملكة المتحدة", en: "Royal College of Surgeons — UK" },
  },
  {
    id: "md",
    icon: "book",
    year: "2011",
    title: { ar: "دكتوراه جراحة العظام", en: "MD in Orthopaedic Surgery" },
    issuer: { ar: "جامعة القاهرة", en: "Cairo University" },
  },
  {
    id: "esska",
    icon: "globe",
    year: "2016",
    title: { ar: "زمالة المناظير والطب الرياضي", en: "Arthroscopy & Sports Medicine Fellowship" },
    issuer: { ar: "الجمعية الأوروبية للطب الرياضي (ESSKA)", en: "European Society of Sports Traumatology (ESSKA)" },
  },
  {
    id: "aaos",
    icon: "shield",
    year: "2018",
    title: { ar: "عضو دولي", en: "International Member" },
    issuer: { ar: "الأكاديمية الأمريكية لجراحي العظام (AAOS)", en: "American Academy of Orthopaedic Surgeons (AAOS)" },
  },
];

export const milestones: Milestone[] = [
  {
    id: "m1",
    period: "2020 —",
    role: { ar: "مؤسس ومدير العيادة", en: "Founder & Medical Director" },
    place: { ar: "عيادة د. أحمد سليمان — القاهرة", en: "Dr. Ahmed Soliman Clinic — Cairo" },
  },
  {
    id: "m2",
    period: "2017 — 2020",
    role: { ar: "استشاري جراحة العظام", en: "Consultant Orthopaedic Surgeon" },
    place: { ar: "مستشفى دار الفؤاد", en: "Dar Al Fouad Hospital" },
  },
  {
    id: "m3",
    period: "2015 — 2017",
    role: { ar: "زميل جراحات المناظير", en: "Arthroscopy Fellow" },
    place: { ar: "مركز الطب الرياضي — ليون، فرنسا", en: "Sports Medicine Centre — Lyon, France" },
  },
  {
    id: "m4",
    period: "2011 — 2015",
    role: { ar: "مدرس جراحة العظام", en: "Lecturer in Orthopaedic Surgery" },
    place: { ar: "كلية الطب — جامعة القاهرة", en: "Faculty of Medicine — Cairo University" },
  },
];

export const achievements: Localized<string[]> = {
  ar: [
    "أكثر من ٣٠ بحثًا منشورًا في دوريات علمية دولية محكّمة",
    "متحدث رئيسي في مؤتمرات جراحة العظام الإقليمية والدولية",
    "طبيب معتمد لعدد من الأندية والمنتخبات الرياضية",
    "مدرب معتمد لورش عمل المناظير للجراحين الشباب",
  ],
  en: [
    "30+ papers published in international peer-reviewed journals",
    "Keynote speaker at regional and international orthopaedic congresses",
    "Accredited physician to several sports clubs and national teams",
    "Certified faculty for arthroscopy workshops for young surgeons",
  ],
};
