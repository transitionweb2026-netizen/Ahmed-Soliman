import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { faqs, journey, reasons, reviews, stats } from "@/content/home";
import { media } from "@/content/media";
import { services, treatments } from "@/content/services";
import { site } from "@/content/site";
import { featuredVideos, introVideo } from "@/content/videos";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { TreatmentCard } from "@/components/cards/TreatmentCard";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { CardShowcase } from "@/components/sections/CardShowcase";
import { FeaturedVideos } from "@/components/sections/FeaturedVideos";
import { Hero } from "@/components/sections/Hero";
import { PatientJourney } from "@/components/sections/PatientJourney";
import { ReviewsFaq } from "@/components/sections/ReviewsFaq";
import { Statistics } from "@/components/sections/Statistics";
import { VideoSection } from "@/components/sections/VideoSection";
import { WhyDoctor } from "@/components/sections/WhyDoctor";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const name = tr(site.name, locale);
  return {
    ...buildMetadata({ locale, path: "", title: name, description: dict.footer.about }),
    // Home keeps the full "Name | Specialty" title instead of the template.
    title: { absolute: `${name} | ${tr(site.specialty, locale)}` },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

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
      <Hero locale={locale} labels={dict.hero} />

      {/* 2 — Statistics */}
      <Statistics locale={locale} stats={stats} label={dict.stats.title} overlap />

      {/* 3 — About the doctor */}
      <AboutIntro locale={locale} labels={dict.intro} />

      {/* 4 — Large video */}
      <VideoSection locale={locale} video={introVideo} labels={dict.video} />

      {/* 5 — Services preview */}
      <CardShowcase
        id="services-title"
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        subtitle={dict.services.subtitle}
        cta={{ label: dict.services.cta, href: localePath(locale, "/services#services") }}
      >
        {services.slice(0, 4).map((service, i) => (
          <ServiceCard key={service.slug} service={service} locale={locale} index={i} />
        ))}
      </CardShowcase>

      {/* 6 — Treatments preview */}
      <CardShowcase
        id="treatments-title"
        eyebrow={dict.treatments.eyebrow}
        title={dict.treatments.title}
        subtitle={dict.treatments.subtitle}
        cta={{ label: dict.treatments.cta, href: localePath(locale, "/services#treatments") }}
        auroraSide="start"
      >
        {treatments.slice(0, 4).map((treatment, i) => (
          <TreatmentCard
            key={treatment.slug}
            treatment={treatment}
            locale={locale}
            index={i}
            sessionsLabel={dict.treatments.sessions}
          />
        ))}
      </CardShowcase>

      {/* 7 — Patient journey */}
      <PatientJourney locale={locale} steps={journey} labels={dict.journey} />

      {/* 8 — Why Dr. Ahmed Soliman */}
      <WhyDoctor
        locale={locale}
        reasons={reasons}
        image={media.doctorWithPatient}
        imageAlt={dict.why.title}
        badge={stats[0]}
        labels={dict.why}
      />

      {/* 9 — Featured videos */}
      <FeaturedVideos locale={locale} videos={featuredVideos} labels={dict.featured} videoLabels={dict.video} />

      {/* 10 — Reviews + FAQ */}
      <ReviewsFaq locale={locale} reviews={reviews} faqs={faqs} dict={dict} />

      {/* 11 — Global CTA is rendered by the layout so it is identical on every page. */}
      <JsonLd data={faqSchema} />
    </>
  );
}
