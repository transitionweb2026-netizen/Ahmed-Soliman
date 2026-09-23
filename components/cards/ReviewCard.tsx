import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Review } from "@/content/types";
import { Icon } from "@/components/ui/Icon";

type ReviewCardProps = {
  review: Review;
  locale: Locale;
  ratingLabel: string;
  index: number;
};

export function ReviewCard({ review, locale, ratingLabel, index }: ReviewCardProps) {
  const name = tr(review.name, locale);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <figure
      data-reveal=""
      style={delay(index * 100)}
      className="glass glass-interactive flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] p-6"
      data-tilt
    >
      <div aria-hidden="true" className="absolute -end-8 -top-8 -z-10 h-24 w-24 rounded-full bg-brand/20 blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex gap-1 text-brand-light" role="img" aria-label={ratingLabel}>
          {Array.from({ length: review.rating }, (_, i) => (
            <Icon key={i} name="star" size={15} fill="currentColor" />
          ))}
        </div>
        <Icon name="quote" size={28} className="text-brand/50 rtl:-scale-x-100" />
      </div>
      <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-mist/80">{tr(review.text, locale)}</blockquote>
      <figcaption className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <span aria-hidden="true" className="glass-chip h-10 w-10 rounded-full text-sm font-semibold text-white">
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-white">{name}</span>
          <span className="text-xs text-brand-light">{tr(review.treatment, locale)}</span>
        </span>
      </figcaption>
    </figure>
  );
}
