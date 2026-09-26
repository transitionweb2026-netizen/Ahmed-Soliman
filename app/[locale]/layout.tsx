import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Manrope, Noto_Kufi_Arabic } from "next/font/google";
import { getDictionary } from "@/lib/dictionary";
import { dirOf, isLocale, locales, tr } from "@/lib/i18n";
import { buildMetadata, physicianSchema } from "@/lib/seo";
import { site, whatsappLink } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { Interactions } from "@/components/motion/Interactions";
import { JsonLd } from "@/components/seo/JsonLd";
import "../globals.css";

// Arabic is the default language, so its faces are preloaded; the English
// faces are fetched only when an English page actually uses them.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});
const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kufi",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#041414",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const name = tr(site.name, locale);
  const defaultTitle = `${name} | ${tr(site.specialty, locale)}`;
  return {
    ...buildMetadata({ locale, path: "", title: defaultTitle, description: getDictionary(locale).footer.about }),
    metadataBase: new URL(site.url),
    // Pages set a plain title; the template appends the doctor's name.
    title: { default: defaultTitle, template: `%s | ${name}` },
    applicationName: name,
    authors: [{ name }],
    category: "health",
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plexArabic.variable} ${kufi.variable} ${manrope.variable} ${cormorant.variable}`}
    >
      <head>
        {/* Enables reveal-on-scroll styles only when JS runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body>
        <a
          href="#main"
          className="btn btn-primary fixed start-4 top-4 z-[60] -translate-y-24 focus:translate-y-0"
        >
          {dict.nav.skip}
        </a>
        <Navbar
          locale={locale}
          labels={dict.nav}
          name={tr(site.name, locale)}
          tagline={dict.hero.eyebrow}
          phone={{ display: site.phone, href: site.phoneHref }}
          whatsappHref={whatsappLink(dict.cta.whatsappMessage)}
        />
        <main id="main">{children}</main>
        <CTA locale={locale} labels={dict.cta} doctor={{ name: tr(site.name, locale), role: dict.intro.cardRole }} />
        <Footer locale={locale} dict={dict} />
        <Interactions />
        <JsonLd data={physicianSchema(locale)} />
      </body>
    </html>
  );
}
