import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

type PageHeroProps = {
  locale: Locale;
  common: Dictionary["common"];
  title: string;
  subtitle: string;
  image: string;
  /** Extra breadcrumb levels between Home and the current page. */
  trail?: Array<{ label: string; href: string }>;
};

/** Shared header for inner pages — same cinematic language as the home hero. */
export function PageHero({ locale, common, title, subtitle, image, trail = [] }: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[26rem] items-end overflow-hidden pb-14 pt-36 sm:min-h-[30rem] lg:min-h-[34rem] lg:pb-20">
      <Image src={image} alt="" fill preload sizes="100vw" quality={70} className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-ink-950/80 via-ink-900/75 to-ink-900" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_120%,rgb(72_164_164/0.35),transparent)]" />

      <div className="container-lux">
        <div className="rise flex max-w-3xl flex-col gap-5">
          <nav aria-label={common.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-2 text-sm text-mist/60">
              <li>
                <Link href={localePath(locale)} className="transition-colors hover:text-white">
                  {common.home}
                </Link>
              </li>
              {trail.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Icon name="chevron" size={14} className="text-brand rtl:-scale-x-100" />
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Icon name="chevron" size={14} className="text-brand rtl:-scale-x-100" />
                <span aria-current="page" className="text-brand-light">
                  {title}
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-gradient text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-2xl text-base text-mist/75 sm:text-lg">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
