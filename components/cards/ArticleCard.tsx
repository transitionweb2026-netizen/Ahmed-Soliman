"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatDate, tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Article } from "@/content/types";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

type ArticleCardProps = {
  article: Article;
  locale: Locale;
  labels: { readMore: string; minRead: string; featured?: string; by: string; close: string };
  /** Used when the article has no author of its own. */
  author: string;
  index?: number;
  /** Wide horizontal layout for the lead story. */
  featured?: boolean;
};

function Meta({ article, locale, minRead }: { article: Article; locale: Locale; minRead: string }) {
  const minutes = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(article.readMinutes);
  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        <Icon name="calendar" size={14} className="text-brand-light" />
        <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Icon name="clock" size={14} className="text-brand-light" />
        {minutes} {minRead}
      </span>
    </>
  );
}

/** Article preview card; the full article opens in a scrollable modal. */
export function ArticleCard({ article, locale, labels, author, index = 0, featured = false }: ArticleCardProps) {
  const [open, setOpen] = useState(false);
  const title = tr(article.title, locale);

  return (
    <article data-reveal="" style={delay(index * 110)} className="h-full">
      <div data-tilt className="group glass glass-interactive frame-3d h-full">
        <div className={cn("frame-inner flex h-full flex-col", featured && "lg:grid lg:grid-cols-[1.15fr_1fr]")}>
          <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]")}>
            {article.image && <Image
              src={article.image}
              alt={title}
              fill
              sizes={featured ? "(min-width: 1024px) 680px, 92vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 92vw"}
              className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.06]"
            />}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900/80 via-transparent to-transparent" />
            <span className="glass absolute start-4 top-4 rounded-full px-3.5 py-1 text-xs text-brand-pale">
              {featured && labels.featured ? `${labels.featured} · ` : ""}
              {tr(article.category, locale)}
            </span>
          </div>

          <div className={cn("flex flex-1 flex-col gap-4 p-6 sm:p-7", featured && "lg:justify-center lg:p-10")}>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mist/55">
              <Meta article={article} locale={locale} minRead={labels.minRead} />
            </p>
            <h3 className={cn("leading-snug text-white", featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl")}>
              {/* Stretched button makes the whole card open the article. */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="text-start after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none"
              >
                {title}
              </button>
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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        closeLabel={labels.close}
        size="lg"
        media={
          <div className="frame-inner relative aspect-[16/8]">
            {article.image && <Image src={article.image} alt={title} fill sizes="(min-width: 768px) 880px, 95vw" className="object-cover" />}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-transparent" />
            <span className="glass absolute bottom-4 start-4 rounded-full px-3.5 py-1 text-xs text-brand-pale">
              {tr(article.category, locale)}
            </span>
          </div>
        }
      >
        <p className="-mt-2 mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/[0.08] pb-6 text-sm text-mist/60">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="user" size={14} className="text-brand-light" />
            {labels.by} {(article.author && tr(article.author, locale)) || author}
          </span>
          <Meta article={article} locale={locale} minRead={labels.minRead} />
        </p>
        <p className="mb-6 text-lg leading-relaxed text-mist/85">{tr(article.excerpt, locale)}</p>
        <ArticleBody blocks={article.body[locale]} />
      </Modal>
    </article>
  );
}
