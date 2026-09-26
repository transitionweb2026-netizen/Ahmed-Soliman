import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { media } from "@/content/media";
import { services, treatments } from "@/content/services";
import { site, whatsappLink } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/contact",
    title: dict.contactPage.title,
    description: dict.contactPage.subtitle,
    image: media.reception,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.contactPage;

  const channels: Array<{ icon: IconName; label: string; value: string; href?: string; external?: boolean; ltr?: boolean }> = [
    { icon: "phone", label: t.phone, value: site.phone, href: site.phoneHref, ltr: true },
    { icon: "whatsapp", label: t.whatsapp, value: site.phone, href: whatsappLink(dict.cta.whatsappMessage), external: true, ltr: true },
    { icon: "mail", label: t.email, value: site.email, href: `mailto:${site.email}`, ltr: true },
    { icon: "pin", label: t.address, value: tr(site.address, locale) },
    { icon: "clock", label: t.hours, value: tr(site.hours, locale) },
  ];

  const serviceOptions = [...services, ...treatments].map((s) => tr(s.title, locale));

  return (
    <>
      <Hero
        locale={locale}
        labels={dict.hero}
        size="page"
        eyebrow={dict.contactPage.eyebrow}
        line1={dict.contactPage.title}
        line2={dict.contactPage.subtitle}
        image={media.reception}
        breadcrumb={{ label: dict.common.breadcrumb, homeLabel: dict.common.home, current: dict.contactPage.title }}
      />

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
                      <span dir={channel.ltr ? "ltr" : undefined} className="truncate font-semibold text-white rtl:text-right">
                        {channel.value}
                      </span>
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
            </ul>
            <GlassCard reveal="start" delay={420} className="flex flex-col gap-4 rounded-2xl p-5">
              <p className="text-xs text-mist/55">{t.social}</p>
              <SocialLinks />
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
                {t.formTitle}
              </h2>
              <p className="text-mist/70">{t.formSubtitle}</p>
            </header>
            <ContactForm labels={t} services={serviceOptions} whatsappNumber={site.whatsappNumber} />
          </GlassCard>
        </div>

        {/* Map */}
        <div className="container-lux mt-10 lg:mt-14" data-reveal="scale">
          <div className="glass rounded-[2.4rem] p-2.5 sm:p-3">
            <div className="frame-inner relative aspect-[4/3] sm:aspect-[21/9]">
              <iframe
                src={site.mapEmbedUrl}
                title={t.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[60%] invert-[92%] hue-rotate-[160deg] saturate-[1.4]"
              />
              <div className="absolute bottom-4 end-4">
                <GlassButton
                  href={`https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`}
                  external
                  size="sm"
                  icon="pin"
                >
                  {t.directions}
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: dict.common.home, path: localePath(locale) },
          { name: t.title, path: localePath(locale, "/contact") },
        ])}
      />
    </>
  );
}
