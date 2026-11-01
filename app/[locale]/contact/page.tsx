import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { clinicsOf, mapsSearchUrl } from "@/lib/cms/clinics";
import { getHero, getSection, getServices, getSiteData, getTreatments } from "@/lib/cms/data";
import { whatsappLink } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { CmsHero } from "@/components/sections/CmsHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hero = await getHero("contact");
  return pageMetadata(locale, "contact", hero.image);
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.contactPage;
  const [site, hero, services, treatments, form] = await Promise.all([
    getSiteData(),
    getHero("contact"),
    getServices(),
    getTreatments(),
    getSection("contact.form"),
  ]);
  const { contact } = site;
  // One card per clinic (address line + its hours line), see lib/cms/clinics.ts.
  const { areas, clinics, hoursText } = clinicsOf(tr(contact.address, locale), tr(contact.hours, locale));
  const directions =
    contact.latitude != null && contact.longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${contact.latitude},${contact.longitude}`
      : clinics[0]
        ? mapsSearchUrl(clinics[0])
        : "";
  // An Egyptian local number (01xxxxxxxxx) is dialled from abroad as 0020 1xxxxxxxxx.
  const phoneDigits = contact.phone.replace(/\D/g, "");
  const abroadNumber = /^0\d{10}$/.test(phoneDigits) ? `0020${phoneDigits.slice(1)}` : "";

  const channels: Array<{ icon: IconName; label: string; value: string; note?: string; href?: string; external?: boolean; ltr?: boolean }> = [
    {
      icon: "phone" as const,
      label: t.phone,
      value: contact.phone,
      note: abroadNumber && `${t.fromAbroad} ${abroadNumber}`,
      href: contact.phoneHref,
      ltr: true,
    },
    {
      icon: "whatsapp" as const,
      label: t.whatsapp,
      value: contact.whatsappNumber ? `+${contact.whatsappNumber}` : "",
      href: whatsappLink(contact.whatsappNumber, tr(contact.whatsappMessage, locale)),
      external: true,
      ltr: true,
    },
    { icon: "mail" as const, label: t.email, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    { icon: "calendar" as const, label: t.booking, value: contact.bookingUrl.replace(/^https?:\/\//, ""), href: contact.bookingUrl, external: true, ltr: true },
    { icon: "clock" as const, label: t.hours, value: hoursText },
  ].filter((channel) => channel.value);

  const serviceOptions = [...services, ...treatments].map((s) => tr(s.title, locale));

  return (
    <>
      <CmsHero locale={locale} page="contact" size="page" breadcrumb />

      <section aria-labelledby="booking-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-0" />
        <Aurora className="-end-60 bottom-0" variant="deep" />

        <div className="container-lux grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-10">
          {/* Contact details */}
          <div className="flex flex-col gap-4">
            <h2 className="sr-only">{t.infoTitle}</h2>
            <ul className="grid grid-cols-1 gap-4">
              {channels.map((channel, i) => {
                const body = (
                  <>
                    <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl">
                      <Icon name={channel.icon} size={21} />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs text-mist/55">{channel.label}</span>
                      <span dir={channel.ltr ? "ltr" : undefined} className={`font-semibold text-white rtl:text-right ${channel.icon === "clock" ? "whitespace-pre-line" : "truncate"}`}>
                        {channel.value}
                      </span>
                      {channel.note && <span className="mt-0.5 text-xs leading-relaxed text-mist/60">{channel.note}</span>}
                    </span>
                    {channel.href && (
                      <Icon name="arrow" size={18} className="ms-auto shrink-0 text-brand-light opacity-50 transition-all group-hover:opacity-100 rtl:-scale-x-100" />
                    )}
                  </>
                );
                return (
                  <li key={channel.icon} data-reveal="start" style={delay(i * 80)}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group glass glass-interactive flex items-center gap-4 rounded-2xl p-4"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="glass flex items-center gap-4 rounded-2xl p-4">{body}</div>
                    )}
                  </li>
                );
              })}
              {areas.length > 0 && (
                <li data-reveal="start" style={delay(channels.length * 80)}>
                  <div className="glass flex items-start gap-4 rounded-2xl p-4">
                    <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl">
                      <Icon name="pin" size={21} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-xs text-mist/55">{t.branches}</span>
                      {areas.map((area) => (
                        <span key={area} className="font-semibold leading-relaxed text-white">
                          {area}
                        </span>
                      ))}
                    </span>
                  </div>
                </li>
              )}
              {clinics.map((clinic, i) => (
                <li key={`clinic-${i}`} data-reveal="start" style={delay((channels.length + 1 + i) * 80)}>
                  <a
                    href={mapsSearchUrl(clinic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass glass-interactive flex items-start gap-4 rounded-2xl p-4"
                  >
                    <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl">
                      <Icon name="pin" size={21} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-xs text-mist/55">{clinic.name || t.address}</span>
                      <span className="font-semibold leading-relaxed text-white">{clinic.address}</span>
                      {clinic.hours && (
                        <span className="flex items-center gap-1.5 text-sm text-mist/75">
                          <Icon name="clock" size={14} className="shrink-0 text-brand-light" />
                          {clinic.hours}
                        </span>
                      )}
                    </span>
                    <Icon name="arrow" size={18} className="ms-auto mt-1 shrink-0 text-brand-light opacity-50 transition-all group-hover:opacity-100 rtl:-scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
            <GlassCard reveal="start" delay={420} className="flex flex-col gap-4 rounded-2xl p-5">
              <p className="text-xs text-mist/55">{t.social}</p>
              <SocialLinks socials={site.socials} />
            </GlassCard>
          </div>

          {/* Booking form */}
          <GlassCard reveal="end" tone="strong" className="relative overflow-hidden rounded-[2.2rem] p-6 sm:p-10">
            <div aria-hidden="true" className="absolute -end-20 -top-20 -z-10 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
            <header className="mb-8 flex flex-col gap-3">
              <span className="glass-chip h-12 w-12 rounded-2xl">
                <Icon name="calendar" size={22} />
              </span>
              <h2 id="booking-title" className="text-gradient text-3xl sm:text-4xl">
                {tr(form.title, locale)}
              </h2>
              <p className="text-mist/70">{tr(form.subtitle, locale)}</p>
            </header>
            <ContactForm labels={t} services={serviceOptions} whatsappNumber={contact.whatsappNumber} />
          </GlassCard>
        </div>

        {/* Map */}
        {contact.mapEmbedUrl && (
        <div className="container-lux mt-10 lg:mt-14" data-reveal="scale">
          <div className="glass rounded-[2.4rem] p-2.5 sm:p-3">
            <div className="frame-inner relative aspect-[4/3] sm:aspect-[21/9]">
              <iframe
                src={contact.mapEmbedUrl}
                title={t.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[60%] invert-[92%] hue-rotate-[160deg] saturate-[1.4]"
              />
              {directions && (
              <div className="absolute bottom-4 end-4">
                <GlassButton
                  href={directions}
                  external
                  size="sm"
                  icon="pin"
                >
                  {t.directions}
                </GlassButton>
              </div>
              )}
            </div>
          </div>
        </div>
        )}
      </section>

      <JsonLd
        data={breadcrumbSchema(site.settings.url, [
          { name: dict.common.home, path: localePath(locale) },
          { name: tr(hero.title, locale), path: localePath(locale, "/contact") },
        ])}
      />
    </>
  );
}
