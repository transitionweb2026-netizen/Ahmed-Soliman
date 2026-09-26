import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, resolveHref, tr } from "@/lib/i18n";
import {
  getFaqs,
  getFeaturedVideos,
  getJourney,
  getReasons,
  getReviews,
  getSection,
  getServices,
  getSiteData,
  getStats,
  getTreatments,
} from "@/lib/cms/data";
import { pageMetadata } from "@/lib/seo";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { TreatmentCard } from "@/components/cards/TreatmentCard";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { CardShowcase } from "@/components/sections/CardShowcase";
import { CmsHero } from "@/components/sections/CmsHero";
import { FeaturedVideos } from "@/components/sections/FeaturedVideos";
import { PatientJourney } from "@/components/sections/PatientJourney";
import { ReviewsFaq } from "@/components/sections/ReviewsFaq";
import { Statistics } from "@/components/sections/Statistics";
import { VideoSection } from "@/components/sections/VideoSection";
import { WhyDoctor } from "@/components/sections/WhyDoctor";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "home");
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [site, stats, services, treatments, journey, reasons, featured, reviews, faqs] = await Promise.all([
    getSiteData(),
    getStats(),
    getServices(),
    getTreatments(),
    getJourney(),
    getReasons(),
    getFeaturedVideos(),
    getReviews(),
    getFaqs(),
  ]);
  const [statsSection, intro, video, servicesSection, treatmentsSection, journeySection, why, featuredSection, reviewsSection, faqSection] =
    await Promise.all(
      ["home.stats", "home.intro", "home.video", "home.services", "home.treatments", "home.journey", "home.why", "home.featured", "home.reviews", "home.faq"].map(
        getSection,
      ),
    );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: tr(faq.question, locale),
      acceptedAnswer: { "@type": "Answer", text: tr(faq.answer, locale) },
    })),
  };

  return (
    <>
      {/* 1 — Hero */}
      <CmsHero locale={locale} page="home" />

      {/* 2 — Statistics (its own section, below the hero) */}
      {stats.length > 0 && <Statistics locale={locale} stats={stats} label={tr(statsSection.title, locale)} />}

      {/* 3 — About the doctor */}
      <AboutIntro locale={locale} content={intro} doctorName={tr(site.settings.name, locale)} />

      {/* 4 — Large video */}
      <VideoSection locale={locale} content={video} labels={dict.video} />

      {/* 5 — Services preview */}
      {services.length > 0 && (
        <CardShowcase
          id="services-title"
          eyebrow={tr(servicesSection.eyebrow, locale)}
          title={tr(servicesSection.title, locale)}
          subtitle={tr(servicesSection.subtitle, locale)}
          cta={{ label: tr(servicesSection.button.label, locale), href: resolveHref(locale, servicesSection.button.href) }}
        >
          {services.slice(0, 4).map((service, i) => (
            <ServiceCard key={service.slug} service={service} locale={locale} index={i} />
          ))}
        </CardShowcase>
      )}

      {/* 6 — Treatments preview */}
      {treatments.length > 0 && (
        <CardShowcase
          id="treatments-title"
          eyebrow={tr(treatmentsSection.eyebrow, locale)}
          title={tr(treatmentsSection.title, locale)}
          subtitle={tr(treatmentsSection.subtitle, locale)}
          cta={{ label: tr(treatmentsSection.button.label, locale), href: resolveHref(locale, treatmentsSection.button.href) }}
          auroraSide="start"
        >
          {treatments.slice(0, 4).map((treatment, i) => (
            <TreatmentCard key={treatment.slug} treatment={treatment} locale={locale} index={i} sessionsLabel={dict.treatments.sessions} />
          ))}
        </CardShowcase>
      )}

      {/* 7 — Patient journey */}
      <PatientJourney locale={locale} steps={journey} content={journeySection} stepLabel={dict.journey.step} />

      {/* 8 — Why Dr. Ahmed Soliman */}
      <WhyDoctor locale={locale} reasons={reasons} badge={stats[0]} content={why} />

      {/* 9 — Featured videos (the "Featured on Home" videos, in display order) */}
      <FeaturedVideos locale={locale} videos={featured} content={featuredSection} videoLabels={dict.video} />

      {/* 10 — Reviews + FAQ */}
      <ReviewsFaq
        locale={locale}
        reviews={reviews}
        faqs={faqs}
        reviewsContent={reviewsSection}
        faqContent={faqSection}
        ratingLabel={dict.reviews.rating}
      />

      {/* 11 — Global CTA is rendered by the layout so it is identical on every page. */}
      {faqs.length > 0 && <JsonLd data={faqSchema} />}
    </>
  );
}
