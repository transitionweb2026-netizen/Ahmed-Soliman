import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import type { Faq, Review } from "@/content/types";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { Aurora } from "@/components/ui/Aurora";
import { FAQ } from "./FAQ";

type ReviewsFaqProps = {
  locale: Locale;
  reviews: Review[];
  faqs: Faq[];
  dict: Pick<Dictionary, "reviews" | "faq">;
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
export function ReviewsFaq({ locale, reviews, faqs, dict }: ReviewsFaqProps) {
  return (
    <section aria-label={`${dict.reviews.title} · ${dict.faq.title}`} className="section-y relative isolate">
      <Aurora className="-start-60 bottom-0" />
      <Aurora className="-end-60 top-0" variant="deep" />
      <div className="container-lux grid gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div aria-labelledby="reviews-title" role="region">
          <ColumnHeader id="reviews-title" eyebrow={dict.reviews.eyebrow} title={dict.reviews.title} />
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.slice(0, 4).map((review, i) => (
              <ReviewCard key={review.id} review={review} locale={locale} ratingLabel={dict.reviews.rating} index={i} />
            ))}
          </div>
        </div>

        <div aria-labelledby="faq-title" role="region">
          <ColumnHeader id="faq-title" eyebrow={dict.faq.eyebrow} title={dict.faq.title} />
          <FAQ faqs={faqs} locale={locale} />
        </div>
      </div>
    </section>
  );
}
