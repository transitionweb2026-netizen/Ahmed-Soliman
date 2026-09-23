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
  phone: "+20 100 000 0000",
  phoneHref: "tel:+201000000000",
  whatsappNumber: "201000000000",
  email: "info@drahmedsoliman.com",
  address: {
    ar: "القاهرة، مصر — شارع التسعين، التجمع الخامس",
    en: "90th Street, Fifth Settlement, Cairo, Egypt",
  } satisfies Localized,
  hours: {
    ar: "السبت – الخميس · ٤ م – ١٠ م",
    en: "Sat – Thu · 4 PM – 10 PM",
  } satisfies Localized,
  mapEmbedUrl:
    "https://www.google.com/maps?q=90th+Street+Fifth+Settlement+Cairo&output=embed",
  geo: { lat: 30.0205, lng: 31.4913 },
  socials: [
    { name: "Facebook", icon: "facebook", href: "https://facebook.com/" },
    { name: "Instagram", icon: "instagram", href: "https://instagram.com/" },
    { name: "YouTube", icon: "youtube", href: "https://youtube.com/" },
    { name: "TikTok", icon: "tiktok", href: "https://tiktok.com/" },
  ] satisfies Array<{ name: string; icon: IconName; href: string }>,
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
