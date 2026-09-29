import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getDictionary } from "@/lib/dictionary";
import { dirOf, isLocale, locales, resolveHref, tr } from "@/lib/i18n";
import { getSection, getSiteData } from "@/lib/cms/data";
import { pageMetadata, physicianSchema } from "@/lib/seo";
import { whatsappLink } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { Interactions } from "@/components/motion/Interactions";
import { JsonLd } from "@/components/seo/JsonLd";
import "../globals.css";

// Arabic uses Thmanyah Sans (self-hosted in public/fonts, @font-face in
// globals.css). The English faces below are fetched only by English pages.
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

// Note: no `dynamicParams = false` here — with it, pages revalidated after a CMS
// save would 404 instead of re-rendering. Unknown locales still 404 via isLocale().
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
  const [site, home] = await Promise.all([getSiteData(), pageMetadata(locale, "home")]);
  const name = tr(site.settings.name, locale);
  const defaultTitle = tr(site.settings.seoTitle, locale) || name;
  return {
    ...home,
    metadataBase: new URL(site.settings.url),
    // Pages set a plain title; the template appends the doctor's name.
    title: { default: defaultTitle, template: `%s | ${name}` },
    applicationName: name,
    authors: [{ name }],
    category: "health",
    formatDetection: { telephone: false },
    icons: { icon: site.settings.favicon || "/icon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [site, cta, navSection, footer] = await Promise.all([
    getSiteData(),
    getSection("global.cta"),
    getSection("global.nav"),
    getSection("global.footer"),
  ]);
  const { contact, settings } = site;
  const whatsappHref = whatsappLink(contact.whatsappNumber, tr(contact.whatsappMessage, locale));
  const name = tr(settings.name, locale);

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable}`}
    >
      <head>
        {/* Arabic pages: fetch the two weights seen first (body text and the hero name) right away,
            and the English digits used by the phone number in the hero. */}
        {locale === "ar" &&
          ["thmanyah/thmanyahsans-Regular", "thmanyah/thmanyahsans-Black", "digits/manrope-numbers"].map((file) => (
            <link key={file} rel="preload" href={`/fonts/${file}.woff2`} as="font" type="font/woff2" crossOrigin="" />
          ))}
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
          links={site.nav.map((item) => ({ key: item.key, href: resolveHref(locale, item.path), label: tr(item.label, locale) }))}
          book={{ label: tr(navSection.button.label, locale) || dict.nav.book, href: resolveHref(locale, navSection.button.href || "/contact") }}
          name={name}
          tagline={tr(settings.tagline, locale)}
          phone={{ display: contact.phone, href: contact.phoneHref }}
          whatsappHref={whatsappHref}
        />
        <main id="main">{children}</main>
        <CTA locale={locale} content={cta} doctorName={name} whatsappHref={whatsappHref} />
        <Footer locale={locale} dict={dict} site={site} footer={footer} whatsappHref={whatsappHref} />
        <Interactions />
        <JsonLd data={physicianSchema(locale, site, cta.image?.url)} />
      </body>
    </html>
  );
}
