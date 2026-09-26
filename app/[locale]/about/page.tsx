import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import Image from "next/image";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import {
  getAchievements,
  getCertificates,
  getHero,
  getSection,
  getSiteData,
  getSpecialties,
  getTechnologies,
  getTimeline,
} from "@/lib/cms/data";
import { paragraphs, sectionVideo } from "@/lib/cms/types";
import type { DetailItem } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { DetailCard } from "@/components/cards/DetailCard";
import { CareerTimeline } from "@/components/sections/CareerTimeline";
import { Certificates } from "@/components/sections/Certificates";
import { DoctorCard } from "@/components/sections/DoctorCard";
import { CmsHero } from "@/components/sections/CmsHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { GlassCard } from "@/components/ui/GlassCard";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoPlayer } from "@/components/video/VideoPlayer";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hero = await getHero("about");
  return pageMetadata(locale, "about", hero.image);
}

type CardSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: DetailItem[];
  locale: Locale;
  labels: { learnMore: string; close: string; highlights: string };
  auroraSide: "start" | "end";
};

/** Header + cards that open detail modals (technologies, key areas). */
function DetailCardSection({ id, eyebrow, title, subtitle, items, locale, labels, auroraSide }: CardSectionProps) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={id} className="section-y relative isolate">
      <Aurora className={auroraSide === "end" ? "-end-60 top-1/4" : "-start-60 top-1/4"} />
      <div className="container-lux">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-7">
          {items.map((item, i) => (
            <DetailCard key={item.id} item={item} locale={locale} index={i % 4} labels={labels} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.about;
  const modalLabels = { learnMore: dict.common.learnMore, close: dict.common.close, highlights: dict.services.benefits };

  const [site, hero, technologies, specialties, milestones, achievements, certificates] = await Promise.all([
    getSiteData(),
    getHero("about"),
    getTechnologies(),
    getSpecialties(),
    getTimeline(),
    getAchievements(),
    getCertificates(),
  ]);
  const [videoSection, intro1, intro2, techSection, areasSection, journeySection, achievementsSection, certificatesSection, philosophy] =
    await Promise.all(
      [
        "about.video",
        "about.intro1",
        "about.intro2",
        "about.technologies",
        "about.specialties",
        "about.journey",
        "about.achievements",
        "about.certificates",
        "about.philosophy",
      ].map(getSection),
    );
  const name = tr(site.settings.name, locale);
  const aboutVideo = sectionVideo("about-video", videoSection);
  const introBlocks = [intro1, intro2].filter((block) => tr(block.title, locale) || tr(block.body, locale));

  return (
    <>
      {/* 1 — Hero: the same hero as Home, with About-specific text */}
      <CmsHero locale={locale} page="about" />

      {/* 2 — Introduction: video (start side) + two text blocks (end side) */}
      <section aria-labelledby="about-intro-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-0" variant="deep" />
        <div className="container-lux grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div data-reveal="start" className="relative">
            <div aria-hidden="true" className="absolute -inset-5 -z-10 rounded-[3rem] bg-linear-to-br from-brand/30 via-transparent to-brand-deep/60 blur-2xl" />
            <div className="glass glass-interactive rounded-[2.4rem] p-2 sm:p-3">
              <div>
                <VideoPlayer
                  video={aboutVideo}
                  title={tr(aboutVideo.title, locale)}
                  playLabel={dict.video.play}
                  unavailableLabel={dict.video.unavailable}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {introBlocks.map((block, i) => (
              <GlassCard key={i} reveal="end" delay={i * 120} className="flex flex-col justify-center gap-4 overflow-hidden rounded-[2rem] p-7 sm:p-9">
                <div aria-hidden="true" className="absolute -end-12 -top-12 -z-10 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />
                <div className="flex items-center gap-4">
                  <span className="glass-chip h-11 w-11 shrink-0 rounded-xl font-display text-lg text-white">{i + 1}</span>
                  <h2 id={i === 0 ? "about-intro-title" : undefined} className="text-gradient text-2xl leading-tight sm:text-3xl">
                    {tr(block.title, locale)}
                  </h2>
                </div>
                {paragraphs(tr(block.body, locale)).map((paragraph, j) => (
                  <p key={j} className="text-base leading-loose text-mist/75">
                    {paragraph}
                  </p>
                ))}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Latest technologies */}
      <DetailCardSection
        id="tech-title"
        eyebrow={tr(techSection.eyebrow, locale)}
        title={tr(techSection.title, locale)}
        subtitle={tr(techSection.subtitle, locale)}
        items={technologies}
        locale={locale}
        labels={modalLabels}
        auroraSide="end"
      />

      {/* 4 — Key areas / main specialties */}
      <DetailCardSection
        id="areas-title"
        eyebrow={tr(areasSection.eyebrow, locale)}
        title={tr(areasSection.title, locale)}
        subtitle={tr(areasSection.subtitle, locale)}
        items={specialties}
        locale={locale}
        labels={modalLabels}
        auroraSide="start"
      />

      {/* 5 — Career journey */}
      {milestones.length > 0 && (
      <section aria-labelledby="journey-about-title" className="section-y relative isolate">
        <Aurora className="-end-60 top-1/3" variant="deep" />
        <div className="container-lux">
          <SectionHeader
            id="journey-about-title"
            eyebrow={tr(journeySection.eyebrow, locale)}
            title={tr(journeySection.title, locale)}
            subtitle={tr(journeySection.subtitle, locale)}
          />
          <div className="mx-auto mt-16 max-w-6xl">
            <CareerTimeline milestones={milestones} locale={locale} />
          </div>
        </div>
      </section>
      )}

      {/* 6 — Achievements */}
      {achievements.length > 0 && (
      <section aria-labelledby="achievements-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-1/4" />
        <div className="container-lux">
          <SectionHeader id="achievements-title" eyebrow={tr(achievementsSection.eyebrow, locale)} title={tr(achievementsSection.title, locale)} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, i) => (
              <li key={achievement.id}>
                <GlassCard tilt reveal="up" delay={(i % 3) * 100} className="flex h-full flex-col gap-5 overflow-hidden p-6 sm:p-7">
                  <div aria-hidden="true" className="absolute -bottom-10 -end-10 -z-10 h-28 w-28 rounded-full bg-brand/20 blur-2xl" />
                  {achievement.image && (
                    <div className="frame-inner relative aspect-[16/9]">
                      <Image src={achievement.image} alt="" fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />
                    </div>
                  )}
                  <div className="flex gap-5">
                    <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl">
                      <CmsIcon icon={achievement.icon} url={achievement.iconUrl} size={22} />
                    </span>
                    <div className="flex flex-col gap-2">
                      {achievement.year && (
                        <span dir="ltr" className="font-display text-sm text-brand-light rtl:text-right">
                          {achievement.year}
                        </span>
                      )}
                      <h3 className="font-sans text-lg font-semibold text-white">{tr(achievement.title, locale)}</h3>
                      <p className="text-sm leading-relaxed text-mist/65">{tr(achievement.text, locale)}</p>
                    </div>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* 7 — Certificates */}
      {certificates.length > 0 && (
      <section aria-labelledby="certificates-title" className="section-y relative isolate">
        <Aurora className="-end-60 top-1/4" variant="deep" />
        <div className="container-lux">
          <SectionHeader
            id="certificates-title"
            eyebrow={tr(certificatesSection.eyebrow, locale)}
            title={tr(certificatesSection.title, locale)}
            subtitle={tr(certificatesSection.subtitle, locale)}
          />
          <div className="mt-12">
            <Certificates
              certificates={certificates}
              locale={locale}
              labels={{ heading: t.certificateHeading, view: t.viewCertificate, close: dict.common.close, name, pdf: t.openPdf }}
            />
          </div>
        </div>
      </section>
      )}

      {/* 8 — Philosophy: portrait card (start side) + personal statement (end side) */}
      <section aria-labelledby="philosophy-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-10" />
        <div className="container-lux grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div data-reveal="start" className="px-6 sm:px-10">
            <DoctorCard image={philosophy.image?.url} name={name} role={tr(philosophy.caption, locale)} alt={name} />
          </div>

          <div className="flex flex-col items-start gap-6">
            <span className="eyebrow" data-reveal="">
              {tr(philosophy.eyebrow, locale)}
            </span>
            <h2 id="philosophy-title" data-reveal="" style={delay(80)} className="text-gradient text-4xl leading-tight sm:text-5xl">
              {tr(philosophy.title, locale)}
            </h2>
            <GlassCard reveal="up" delay={160} className="overflow-hidden rounded-[2rem] p-7 sm:p-9">
              <div aria-hidden="true" className="absolute -bottom-16 -end-16 -z-10 h-48 w-48 rounded-full bg-brand/25 blur-3xl" />
              <Icon name="quote" size={40} className="text-brand/60 rtl:-scale-x-100" />
              <blockquote className="mt-4 font-display text-2xl leading-relaxed text-white sm:text-[1.75rem]">{tr(philosophy.subtitle, locale)}</blockquote>
            </GlassCard>
            {paragraphs(tr(philosophy.body, locale)).map((paragraph, i) => (
              <p key={i} data-reveal="" style={delay(240 + i * 80)} className="text-base leading-loose text-mist/75 sm:text-lg">
                {paragraph}
              </p>
            ))}
            <p data-reveal="" style={delay(400)} className="flex items-center gap-3 font-display text-xl text-brand-light">
              <span aria-hidden="true" className="h-px w-12 bg-linear-to-r from-transparent to-brand-light rtl:bg-linear-to-l" />
              {name}
            </p>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema(site.settings.url, [
          { name: dict.common.home, path: localePath(locale) },
          { name: tr(hero.title, locale), path: localePath(locale, "/about") },
        ])}
      />
    </>
  );
}
