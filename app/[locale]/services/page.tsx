import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getHero, getSection, getServices, getSiteData, getTreatments } from "@/lib/cms/data";
import { CmsHero } from "@/components/sections/CmsHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { GlassCard } from "@/components/ui/GlassCard";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hero = await getHero("services");
  return pageMetadata(locale, "services", hero.image);
}

function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-mist/80">
          <span className="glass-chip mt-0.5 h-6 w-6 shrink-0 rounded-md">
            <Icon name="check" size={13} />
          </span>
          <span className="text-sm sm:text-base">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [site, hero, services, treatments, servicesSection, treatmentsSection] = await Promise.all([
    getSiteData(),
    getHero("services"),
    getServices(),
    getTreatments(),
    getSection("services.services"),
    getSection("services.treatments"),
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [...services, ...treatments].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: tr(item.title, locale),
        description: tr(item.description, locale),
        performer: { "@id": `${site.settings.url}/#physician` },
      },
    })),
  };

  return (
    <>
      <CmsHero locale={locale} page="services" size="page" breadcrumb />

      {/* Services */}
      <section id="services" aria-labelledby="services-heading" className="section-y relative isolate">
        <Aurora className="-end-60 top-20" />
        <div className="container-lux">
          <SectionHeader
            id="services-heading"
            eyebrow={tr(servicesSection.eyebrow, locale)}
            title={tr(servicesSection.title, locale)}
            subtitle={tr(servicesSection.subtitle, locale)}
          />

          <div className="mt-20 grid gap-20 lg:gap-28">
            {services.map((service, i) => {
              const title = tr(service.title, locale);
              const flipped = i % 2 === 1;
              return (
                <article id={service.slug} key={service.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                  <div data-reveal={flipped ? "end" : "start"} className={cn("relative", flipped && "lg:order-2")}>
                    <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[3rem] bg-linear-to-br from-brand/25 via-transparent to-brand-deep/60 blur-2xl" />
                    <div data-tilt className="group glass glass-interactive frame-3d">
                      <div className="frame-inner relative aspect-[4/3]">
                        {service.image && (
                          <Image
                            src={service.image}
                            alt={title}
                            fill
                            sizes="(min-width: 1024px) 560px, 92vw"
                            className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.05]"
                          />
                        )}
                        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/70 to-transparent" />
                        <span className="glass absolute bottom-4 start-4 rounded-full px-4 py-1.5 font-display text-sm text-brand-pale">
                          {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    {/* Optional extra photos uploaded for this service */}
                    {service.gallery && service.gallery.length > 0 && (
                      <ul className="mt-4 grid grid-cols-4 gap-3">
                        {service.gallery.slice(0, 4).map((photo) => (
                          <li key={photo} className="glass relative aspect-square overflow-hidden rounded-2xl p-1">
                            <span className="frame-inner relative block h-full rounded-xl">
                              <Image src={photo} alt="" fill sizes="140px" className="object-cover" />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-6" data-reveal="" style={delay(120)}>
                    <span className="glass-chip h-14 w-14 rounded-2xl">
                      <CmsIcon icon={service.icon} url={service.iconUrl} size={26} />
                    </span>
                    <h3 className="text-gradient text-3xl leading-tight sm:text-4xl">{title}</h3>
                    <p className="text-base leading-loose text-mist/75 sm:text-lg">{tr(service.description, locale)}</p>
                    <GlassCard tone="soft" className="w-full rounded-2xl p-6">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-light rtl:tracking-normal">
                        {dict.services.benefits}
                      </p>
                      <BenefitList items={tr(service.benefits, locale)} />
                    </GlassCard>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section id="treatments" aria-labelledby="treatments-heading" className="section-y relative isolate">
        <Aurora className="-start-60 top-1/3" variant="deep" />
        <div className="container-lux">
          <SectionHeader
            id="treatments-heading"
            eyebrow={tr(treatmentsSection.eyebrow, locale)}
            title={tr(treatmentsSection.title, locale)}
            subtitle={tr(treatmentsSection.subtitle, locale)}
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-8">
            {treatments.map((treatment, i) => {
              const title = tr(treatment.title, locale);
              return (
                <article id={treatment.slug} key={treatment.slug} data-reveal="" style={delay((i % 2) * 120)} className="h-full">
                  <div data-tilt className="group glass glass-interactive frame-3d h-full">
                    <div className="frame-inner flex h-full flex-col">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {treatment.image && (
                          <Image
                            src={treatment.image}
                            alt={title}
                            fill
                            sizes="(min-width: 768px) 600px, 92vw"
                            className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.05]"
                          />
                        )}
                        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/20 to-transparent" />
                        <div className="absolute inset-x-6 bottom-5 flex items-center gap-4">
                          <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl">
                            <CmsIcon icon={treatment.icon} url={treatment.iconUrl} size={22} />
                          </span>
                          <h3 className="text-2xl leading-tight text-white sm:text-[1.7rem]">{title}</h3>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
                        <p className="leading-relaxed text-mist/75">{tr(treatment.description, locale)}</p>

                        <div className="mt-auto">
                          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-light rtl:tracking-normal">
                            {dict.treatments.benefits}
                          </p>
                          <BenefitList items={tr(treatment.benefits, locale)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          serviceSchema,
          breadcrumbSchema(site.settings.url, [
            { name: dict.common.home, path: localePath(locale) },
            { name: tr(hero.title, locale), path: localePath(locale, "/services") },
          ]),
        ]}
      />
    </>
  );
}
