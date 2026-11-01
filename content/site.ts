import type { Localized } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";

/**
 * Practice-wide details. Replace the placeholder phone numbers, address,
 * links and domain with the real ones before launch.
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://drahmedsoliman.com",
  name: { ar: "د. أحمد سليمان", en: "Dr. Ahmed Soliman" } satisfies Localized,
  specialty: {
    ar: "استشاري جراحة العظام والمفاصل والطب الرياضي",
    en: "Consultant Orthopaedic, Joint & Sports Medicine Surgeon",
  } satisfies Localized,
  phone: "01557802000",
  phoneHref: "tel:+201557802000",
  whatsappNumber: "201557802000",
  email: "info@drahmedsoliman.com",
  /** One clinic per line, "Clinic name: address"; the hours below follow the same order. */
  address: {
    ar: "العيادة الرئيسية – الدقي، القاهرة: ٢٤ شارع عمر بن الخطاب، الدور العاشر، متفرع من محيي الدين أبو العز، خلف محمود الفار\nعيادة الإسكندرية: عيادات مستشفى أندلسية الشلالات، شارع السلطان حسين، أمام كلية الطب",
    en: "Main clinic – Dokki, Cairo: 24 Omar Ibn El-Khattab St., 10th floor, off Mohy El-Din Abu El-Ezz St., behind Mahmoud El-Far\nAlexandria clinic: Andalusia Shallalat Hospital clinics, Sultan Hussein St., opposite the Faculty of Medicine",
  } satisfies Localized,
  hours: {
    ar: "الأحد والأربعاء من ٢ إلى ٤ م\nالجمعة من كل أسبوع من ٥:٣٠ إلى ٧:٣٠ م",
    en: "Sunday & Wednesday, 2–4 PM\nEvery Friday, 5:30–7:30 PM",
  } satisfies Localized,
  /** Map of the main clinic, found by its address (no exact pin yet). */
  mapEmbedUrl: "https://www.google.com/maps?q=24+Omar+Ibn+El-Khattab+St,+Dokki,+Giza,+Egypt&output=embed",
  socials: [
    { name: "Facebook", icon: "facebook", href: "https://facebook.com/" },
    { name: "Instagram", icon: "instagram", href: "https://instagram.com/" },
    { name: "YouTube", icon: "youtube", href: "https://youtube.com/" },
    { name: "TikTok", icon: "tiktok", href: "https://tiktok.com/" },
  ] satisfies Array<{ name: string; icon: IconName; href: string }>,
};

export function whatsappLink(number: string, message?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
