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

/**
 * Turn a link stored in the CMS into a real href. Internal paths are stored
 * without the language ("/services#treatments") and get the current locale;
 * external, tel:, mailto: and #anchor links pass through unchanged.
 */
export function resolveHref(locale: Locale, href: string): string {
  if (!href) return localePath(locale);
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (href.startsWith("/")) return localePath(locale, href === "/" ? "" : href);
  return href;
}

export function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href);
}

export const ogLocale: Localized = { ar: "ar_EG", en: "en_US" };

/*
 * Numbers use Western digits (0–9) in both languages — the Arabic site shows
 * them in the English typefaces (see the digit fonts in globals.css).
 */

/** Arabic month names, Western digits: "28 أغسطس 2026" / "28 August 2026". */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** "12,000" in either language. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

const EASTERN_DIGITS = /[٠-٩۰-۹٪-٬]/g;

/**
 * Replace Arabic-Indic digits (٠–٩, ۰–۹) and their percent / decimal /
 * thousands signs with Western ones. Only numbers change; all other text is
 * left exactly as written.
 */
export function latinDigits(text: string): string {
  return text.replace(EASTERN_DIGITS, (ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
    if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
    return code === 0x066a ? "%" : code === 0x066b ? "." : ",";
  });
}

/** latinDigits() applied to every string inside a value (objects, arrays). */
export function latinDigitsDeep<T>(value: T): T {
  if (typeof value === "string") return latinDigits(value) as T;
  if (Array.isArray(value)) return value.map(latinDigitsDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, latinDigitsDeep(v)])) as T;
  }
  return value;
}
