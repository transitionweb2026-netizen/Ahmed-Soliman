import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { formatDate, isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { articles, getArticle } from "@/content/articles";
import { site } from "@/content/site";
import type { ArticleBlock } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { Icon } from "@/components/ui/Icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!isLocale(locale) || !article) return {};
  return buildMetadata({
    locale,
    path: `/articles/${slug}`,
    title: tr(article.title, locale),
    description: tr(article.excerpt, locale),
    image: article.image,
    type: "article",
    publishedTime: article.date,
  });
}

function Block({ block, locale }: { block: ArticleBlock; locale: Locale }) {
  switch (block.type) {
    case "h2":
      return <h2>{tr(block.text, locale)}</h2>;
    case "list":
      return (
        <ul>
          {tr(block.items, locale).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote>{tr(block.text, locale)}</blockquote>;
    default:
      return <p>{tr(block.text, locale)}</p>;
  }
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/articles/[slug]">) {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!isLocale(locale) || !article) notFound();

  const dict = getDictionary(locale);
  const title = tr(article.title, locale);
  const author = tr(site.name, locale);
  const minutes = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(article.readMinutes);
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: title,
    description: tr(article.excerpt, locale),
    image: article.image,
    datePublished: article.date,
    inLanguage: locale,
    author: { "@id": `${site.url}/#physician`, "@type": "Physician", name: author },
    reviewedBy: { "@id": `${site.url}/#physician` },
    mainEntityOfPage: `${site.url}${localePath(locale, `/articles/${slug}`)}`,
  };

  return (
    <>
      {/* Reading progress — CSS scroll-driven, no JS */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div className="reading-progress h-full bg-linear-to-r from-brand-deep via-brand to-brand-light shadow-[0_0_12px_#48A4A4]" />
      </div>

      <article className="relative isolate pb-20 pt-32 lg:pt-40">
        <Aurora className="-end-60 top-0" />
        <Aurora className="-start-60 top-[60%]" variant="deep" />

        <header className="rise container-lux flex max-w-4xl flex-col items-center gap-6 text-center">
          <Link
            href={localePath(locale, "/articles")}
            className="inline-flex items-center gap-2 text-sm text-mist/60 transition-colors hover:text-white"
          >
            <Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />
            {dict.articlesPage.back}
          </Link>
          <span className="eyebrow">{tr(article.category, locale)}</span>
          <h1 className="text-gradient text-4xl leading-[1.15] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-2xl text-lg text-mist/70">{tr(article.excerpt, locale)}</p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-mist/60">
            <span className="inline-flex items-center gap-2">
              <Icon name="user" size={16} className="text-brand-light" />
              {dict.articlesPage.by} {author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="calendar" size={16} className="text-brand-light" />
              <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="clock" size={16} className="text-brand-light" />
              {minutes} {dict.articlesPage.minRead}
            </span>
          </p>
        </header>

        <div className="rise container-lux mt-12 max-w-5xl" style={delay(150)}>
          <div className="glass rounded-[2.4rem] p-2.5 sm:p-3">
            <div className="frame-inner relative aspect-[16/9]">
              <Image src={article.image} alt={title} fill preload sizes="(min-width: 1024px) 1000px, 94vw" quality={85} className="object-cover" />
            </div>
          </div>
        </div>

        <div className="container-lux mt-12 max-w-3xl">
          <div className="glass glass-soft rounded-[2rem] p-6 sm:p-10 lg:p-12">
            <div className="prose-lux">
              {article.body.map((block, i) => (
                <Block key={i} block={block} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-title" className="relative isolate pb-12">
        <div className="container-lux">
          <h2 id="related-title" className="text-gradient mb-10 text-3xl sm:text-4xl" data-reveal="">
            {dict.articlesPage.related}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {related.map((item, i) => (
              <ArticleCard key={item.slug} article={item} locale={locale} labels={dict.articlesPage} index={i} />
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          articleSchema,
          breadcrumbSchema([
            { name: dict.common.home, path: localePath(locale) },
            { name: dict.articlesPage.title, path: localePath(locale, "/articles") },
            { name: title, path: localePath(locale, `/articles/${slug}`) },
          ]),
        ]}
      />
    </>
  );
}
