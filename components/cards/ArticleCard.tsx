import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatDate, localePath, tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Article } from "@/content/types";
import { Icon } from "@/components/ui/Icon";

type ArticleCardProps = {
  article: Article;
  locale: Locale;
  labels: { readMore: string; minRead: string; featured?: string };
  index?: number;
  /** Wide horizontal layout for the lead story. */
  featured?: boolean;
};

export function ArticleCard({ article, locale, labels, index = 0, featured = false }: ArticleCardProps) {
  const href = localePath(locale, `/articles/${article.slug}`);
  const title = tr(article.title, locale);
  const minutes = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(article.readMinutes);

  return (
    <article data-reveal="" style={delay(index * 110)} className="h-full">
      <div data-tilt className="group glass glass-interactive frame-3d h-full">
        <div className={cn("frame-inner flex h-full flex-col", featured && "lg:grid lg:grid-cols-[1.15fr_1fr]")}>
          <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]")}>
            <Image
              src={article.image}
              alt={title}
              fill
              sizes={featured ? "(min-width: 1024px) 680px, 92vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 92vw"}
              className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.06]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900/80 via-transparent to-transparent" />
            <span className="glass absolute start-4 top-4 rounded-full px-3.5 py-1 text-xs text-brand-pale">
              {featured && labels.featured ? `${labels.featured} · ` : ""}
              {tr(article.category, locale)}
            </span>
          </div>

          <div className={cn("flex flex-1 flex-col gap-4 p-6 sm:p-7", featured && "lg:justify-center lg:p-10")}>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mist/55">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={14} className="text-brand-light" />
                <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={14} className="text-brand-light" />
                {minutes} {labels.minRead}
              </span>
            </p>
            <h3 className={cn("leading-snug text-white", featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl")}>
              {/* Stretched link makes the whole card clickable. */}
              <Link href={href} className="after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none">
                {title}
              </Link>
            </h3>
            <p className={cn("leading-relaxed text-mist/65", featured ? "text-base sm:text-lg" : "text-sm")}>
              {tr(article.excerpt, locale)}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-light transition-colors group-hover:text-white">
              {labels.readMore}
              <Icon name="arrow" size={16} className="transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
