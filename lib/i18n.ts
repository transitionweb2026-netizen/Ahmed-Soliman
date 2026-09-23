export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** A value that exists once per supported language. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** Pick the current language from a localized value. */
export function tr<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/** Build an internal link, e.g. localePath("ar", "/services#treatments"). */
export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

export const ogLocale: Localized = { ar: "ar_EG", en: "en_US" };

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
