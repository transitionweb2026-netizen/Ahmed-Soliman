import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { achievements, certificates, keyAreas, milestones, technologies } from "@/content/about";
import { media } from "@/content/media";
import { site } from "@/content/site";
import { aboutVideo } from "@/content/videos";
import type { DetailItem } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { DetailCard } from "@/components/cards/DetailCard";
import { CareerTimeline } from "@/components/sections/CareerTimeline";
import { Certificates } from "@/components/sections/Certificates";
import { DoctorCard } from "@/components/sections/DoctorCard";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoPlayer } from "@/components/video/VideoPlayer";

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

/** Header + four cards that open detail modals (technologies, key areas). */
function DetailCardSection({ id, eyebrow, title, subtitle, items, locale, labels, auroraSide }: CardSectionProps) {
  return (
    <section aria-labelledby={id} className="section-y relative isolate">
      <Aurora className={auroraSide === "end" ? "-end-60 top-1/4" : "-start-60 top-1/4"} />
      <div className="container-lux">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-7">
          {items.slice(0, 4).map((item, i) => (
            <DetailCard key={item.id} item={item} locale={locale} index={i} labels={labels} />
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
  const name = tr(site.name, locale);
  const modalLabels = { learnMore: dict.common.learnMore, close: dict.common.close, highlights: dict.services.benefits };

  return (
    <>
      {/* 1 — Hero: the same hero as Home, with About-specific text */}
      <Hero locale={locale} labels={dict.hero} eyebrow={t.heroEyebrow} line1={t.heroLine1} line2={t.heroLine2} />

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
            {t.introBlocks.map((block, i) => (
              <GlassCard key={block.title} reveal="end" delay={i * 120} className="flex flex-col justify-center gap-4 overflow-hidden rounded-[2rem] p-7 sm:p-9">
                <div aria-hidden="true" className="absolute -end-12 -top-12 -z-10 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />
                <div className="flex items-center gap-4">
                  <span className="glass-chip h-11 w-11 shrink-0 rounded-xl font-display text-lg text-white">{i + 1}</span>
                  <h2 id={i === 0 ? "about-intro-title" : undefined} className="text-gradient text-2xl leading-tight sm:text-3xl">
                    {block.title}
                  </h2>
                </div>
                <p className="text-base leading-loose text-mist/75">{block.text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Latest technologies */}
      <DetailCardSection
        id="tech-title"
        eyebrow={t.techEyebrow}
        title={t.techTitle}
        subtitle={t.techSubtitle}
        items={technologies}
        locale={locale}
        labels={modalLabels}
        auroraSide="end"
      />

      {/* 4 — Key areas / main specialties */}
      <DetailCardSection
        id="areas-title"
        eyebrow={t.areasEyebrow}
        title={t.areasTitle}
        subtitle={t.areasSubtitle}
        items={keyAreas}
        locale={locale}
        labels={modalLabels}
        auroraSide="start"
      />

      {/* 5 — Career journey */}
      <section aria-labelledby="journey-about-title" className="section-y relative isolate">
        <Aurora className="-end-60 top-1/3" variant="deep" />
        <div className="container-lux">
          <SectionHeader id="journey-about-title" eyebrow={t.journeyEyebrow} title={t.journeyTitle} subtitle={t.journeySubtitle} />
          <div className="mx-auto mt-16 max-w-6xl">
            <CareerTimeline milestones={milestones} locale={locale} />
          </div>
        </div>
      </section>

      {/* 6 — Achievements */}
      <section aria-labelledby="achievements-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-1/4" />
        <div className="container-lux">
          <SectionHeader id="achievements-title" eyebrow={t.achievementsEyebrow} title={t.achievementsTitle} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, i) => (
              <li key={achievement.id}>
                <GlassCard tilt reveal="up" delay={(i % 3) * 100} className="flex h-full gap-5 overflow-hidden p-6 sm:p-7">
                  <div aria-hidden="true" className="absolute -bottom-10 -end-10 -z-10 h-28 w-28 rounded-full bg-brand/20 blur-2xl" />
                  <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl">
                    <Icon name={achievement.icon} size={22} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-sans text-lg font-semibold text-white">{tr(achievement.title, locale)}</h3>
                    <p className="text-sm leading-relaxed text-mist/65">{tr(achievement.text, locale)}</p>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 — Certificates */}
      <section aria-labelledby="certificates-title" className="section-y relative isolate">
        <Aurora className="-end-60 top-1/4" variant="deep" />
        <div className="container-lux">
          <SectionHeader id="certificates-title" eyebrow={t.certificatesEyebrow} title={t.certificatesTitle} subtitle={t.certificatesSubtitle} />
          <div className="mt-12">
            <Certificates
              certificates={certificates}
              locale={locale}
              labels={{ heading: t.certificateHeading, view: t.viewCertificate, close: dict.common.close, name }}
            />
          </div>
        </div>
      </section>

      {/* 8 — Philosophy: portrait card (start side) + personal statement (end side) */}
      <section aria-labelledby="philosophy-title" className="section-y relative isolate">
        <Aurora className="-start-60 top-10" />
        <div className="container-lux grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div data-reveal="start" className="px-6 sm:px-10">
            <DoctorCard image={media.doctorPortraitAlt} name={name} role={dict.intro.cardRole} alt={name} />
          </div>

          <div className="flex flex-col items-start gap-6">
            <span className="eyebrow" data-reveal="">
              {t.philosophyEyebrow}
            </span>
            <h2 id="philosophy-title" data-reveal="" style={delay(80)} className="text-gradient text-4xl leading-tight sm:text-5xl">
              {t.philosophyTitle}
            </h2>
            <GlassCard reveal="up" delay={160} className="overflow-hidden rounded-[2rem] p-7 sm:p-9">
              <div aria-hidden="true" className="absolute -bottom-16 -end-16 -z-10 h-48 w-48 rounded-full bg-brand/25 blur-3xl" />
              <Icon name="quote" size={40} className="text-brand/60 rtl:-scale-x-100" />
              <blockquote className="mt-4 font-display text-2xl leading-relaxed text-white sm:text-[1.75rem]">{t.philosophyQuote}</blockquote>
            </GlassCard>
            {t.philosophyBody.map((paragraph, i) => (
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
        data={breadcrumbSchema([
          { name: dict.common.home, path: localePath(locale) },
          { name: t.title, path: localePath(locale, "/about") },
        ])}
      />
    </>
  );
}
