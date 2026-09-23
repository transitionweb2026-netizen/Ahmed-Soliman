import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { achievements, biography, credentials, expertise, milestones } from "@/content/about";
import { stats } from "@/content/home";
import { media } from "@/content/media";
import { site } from "@/content/site";
import { DoctorCard } from "@/components/sections/DoctorCard";
import { PageHero } from "@/components/sections/PageHero";
import { Statistics } from "@/components/sections/Statistics";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/about",
    title: dict.about.title,
    description: dict.about.subtitle,
    image: media.doctorPortraitAlt,
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <PageHero locale={locale} common={dict.common} title={t.title} subtitle={t.subtitle} image={media.coat} />

      {/* Biography */}
      <section aria-labelledby="bio-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-0" variant="deep" />
        <div className="container-lux grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div data-reveal="start" className="px-6 sm:px-10">
            <DoctorCard
              image={media.doctorPortraitAlt}
              name={tr(site.name, locale)}
              role={dict.intro.cardRole}
              alt={tr(site.name, locale)}
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            <span className="eyebrow" data-reveal="">
              {t.bioEyebrow}
            </span>
            <h2 id="bio-title" data-reveal="" className="text-gradient text-4xl leading-tight sm:text-5xl">
              {t.bioTitle}
            </h2>
            {tr(biography, locale).map((paragraph, i) => (
              <p key={i} data-reveal="" style={delay(100 + i * 80)} className="text-base leading-loose text-mist/75 sm:text-lg">
                {paragraph}
              </p>
            ))}
            <ul className="flex flex-wrap gap-2.5 pt-2" data-reveal="" style={delay(360)}>
              {tr(expertise, locale).map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-brand/10 px-4 py-2 text-sm text-brand-pale shadow-[inset_0_0_0_1px_rgb(72_164_164/0.35),inset_0_1px_0_rgb(255_255_255/0.1)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section aria-labelledby="credentials-title" className="section-y relative isolate">
        <Aurora className="-end-60 top-1/4" />
        <div className="container-lux">
          <SectionHeader id="credentials-title" eyebrow={t.credentialsEyebrow} title={t.credentialsTitle} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {credentials.map((credential, i) => (
              <li key={credential.id}>
                <GlassCard tilt reveal="up" delay={i * 100} className="flex h-full flex-col gap-5 p-7">
                  <div className="flex items-center justify-between">
                    <span className="glass-chip h-12 w-12 rounded-xl">
                      <Icon name={credential.icon} size={22} />
                    </span>
                    <span className="font-display text-2xl text-brand/80">{credential.year}</span>
                  </div>
                  <h3 className="text-xl leading-snug text-white">{tr(credential.title, locale)}</h3>
                  <p className="mt-auto text-sm text-mist/60">{tr(credential.issuer, locale)}</p>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Experience + Philosophy */}
      <section aria-labelledby="experience-title" className="section-y relative isolate">
        <div className="container-lux grid gap-10 lg:grid-cols-2 lg:gap-12">
          <GlassCard reveal="start" className="p-7 sm:p-10">
            <header className="mb-10 flex flex-col items-start gap-4">
              <span className="eyebrow">{t.experienceEyebrow}</span>
              <h2 id="experience-title" className="text-gradient text-3xl sm:text-4xl">
                {t.experienceTitle}
              </h2>
            </header>
            <div className="relative">
            <span aria-hidden="true" className="flow-light-y absolute bottom-2 start-[0.45rem] top-2 w-[2px] rounded-full" />
            <ol className="grid gap-8 ps-8">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -start-8 top-1.5 h-4 w-4 rounded-full bg-brand shadow-[0_0_0_4px_rgb(72_164_164/0.2),0_0_14px_#48A4A4]"
                  />
                  <p dir="ltr" className="text-xs font-semibold tracking-[0.15em] text-brand-light rtl:text-right">
                    {milestone.period}
                  </p>
                  <h3 className="mt-1 font-sans text-lg font-semibold text-white">{tr(milestone.role, locale)}</h3>
                  <p className="text-sm text-mist/60">{tr(milestone.place, locale)}</p>
                </li>
              ))}
            </ol>
            </div>
          </GlassCard>

          <GlassCard reveal="end" className="relative flex flex-col justify-center overflow-hidden p-7 sm:p-12">
            <div aria-hidden="true" className="absolute -bottom-24 -end-24 -z-10 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
            <span className="eyebrow self-start">{t.philosophyEyebrow}</span>
            <Icon name="quote" size={56} className="mt-8 text-brand/60 rtl:-scale-x-100" />
            <blockquote className="mt-6 font-display text-2xl leading-relaxed text-white sm:text-3xl lg:text-[2.1rem]">
              {t.philosophyQuote}
            </blockquote>
            <p className="mt-8 flex items-center gap-3 text-brand-light">
              <span aria-hidden="true" className="h-px w-10 bg-brand-light" />
              {tr(site.name, locale)}
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Achievements */}
      <section aria-labelledby="achievements-title" className="section-y relative isolate pb-0 lg:pb-0">
        <div className="container-lux">
          <SectionHeader id="achievements-title" eyebrow={t.achievementsEyebrow} title={t.achievementsTitle} />
        </div>
        <Statistics locale={locale} stats={stats} label={t.achievementsTitle} />
        <div className="container-lux -mt-10 lg:-mt-16">
          <ul className="grid gap-4 md:grid-cols-2">
            {tr(achievements, locale).map((item, i) => (
              <li
                key={item}
                data-reveal=""
                style={delay(i * 90)}
                className="glass glass-soft glass-interactive flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="glass-chip h-10 w-10 shrink-0 rounded-xl">
                  <Icon name="sparkle" size={18} />
                </span>
                <span className="text-mist/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="h-20 lg:h-28" />
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.common.home, path: localePath(locale) },
          { name: t.title, path: localePath(locale, "/about") },
        ])}
      />
    </>
  );
}
