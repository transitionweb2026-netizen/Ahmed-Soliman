import type { Dictionary } from "@/lib/dictionary";
import { tr, type Locale } from "@/lib/i18n";
import type { SectionContent } from "@/lib/cms/types";
import type { Faq, Review } from "@/content/types";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { Aurora } from "@/components/ui/Aurora";
import { FAQ } from "./FAQ";

type ReviewsFaqProps = {
  locale: Locale;
  reviews: Review[];
  faqs: Faq[];
  /** CMS blocks "home.reviews" and "home.faq" (eyebrow + title each). */
  reviewsContent: SectionContent;
  faqContent: SectionContent;
  ratingLabel: Dictionary["reviews"]["rating"];
};

function ColumnHeader({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <header className="mb-8 flex flex-col items-start gap-4" data-reveal="">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id} className="text-gradient text-3xl leading-tight sm:text-4xl">
        {title}
      </h2>
    </header>
  );
}

/** Home section 10 — reviews (2×2) on the start side, FAQ on the end side. */
export function ReviewsFaq({ locale, reviews, faqs, reviewsContent, faqContent, ratingLabel }: ReviewsFaqProps) {
  if (!reviews.length && !faqs.length) return null;
  const reviewsTitle = tr(reviewsContent.title, locale);
  const faqTitle = tr(faqContent.title, locale);
  return (
    <section aria-label={`${reviewsTitle} · ${faqTitle}`} className="section-y relative isolate">
      <Aurora className="-start-60 bottom-0" />
      <Aurora className="-end-60 top-0" variant="deep" />
      <div className="container-lux grid gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {reviews.length > 0 && (
          <div aria-labelledby="reviews-title" role="region">
            <ColumnHeader id="reviews-title" eyebrow={tr(reviewsContent.eyebrow, locale)} title={reviewsTitle} />
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.slice(0, 4).map((review, i) => (
                <ReviewCard key={review.id} review={review} locale={locale} ratingLabel={ratingLabel} index={i} />
              ))}
            </div>
          </div>
        )}

        {faqs.length > 0 && (
          <div aria-labelledby="faq-title" role="region">
            <ColumnHeader id="faq-title" eyebrow={tr(faqContent.eyebrow, locale)} title={faqTitle} />
            <FAQ faqs={faqs} locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}
