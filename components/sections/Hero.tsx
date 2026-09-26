import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { media } from "@/content/media";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { SocialContactBar } from "@/components/ui/SocialContactBar";

type HeroProps = {
  locale: Locale;
  /** Shared hero chrome: button labels, contact bar and scroll cue. */
  labels: Dictionary["hero"];
  eyebrow: string;
  line1: string;
  line2: string;
  image?: string;
  /** "full" = full-screen (Home, About); "page" = shorter, for inner pages. */
  size?: "full" | "page";
  /** Inner pages show a breadcrumb above the eyebrow. */
  breadcrumb?: { label: string; homeLabel: string; current: string };
};

/**
 * The single hero used by every page. Only the text (and optionally the cover
 * image and height) changes from page to page.
 */
export function Hero({ locale, labels, eyebrow, line1, line2, image = media.heroCover, size = "full", breadcrumb }: HeroProps) {
  const full = size === "full";

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate flex items-center overflow-hidden",
        full ? "min-h-[100svh]" : "min-h-[80svh] lg:min-h-[86svh]",
      )}
    >
      {/* Full-bleed cover, edge to edge */}
      <div aria-hidden="true" className="absolute inset-0 -z-30 overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <Image
          src={image}
          alt=""
          fill
          preload
          quality={85}
          sizes="100vw"
          className="object-cover object-[70%_center] motion-safe:animate-[hero-zoom_18s_var(--ease-lux)_both] rtl:object-[30%_center]"
        />
      </div>

      {/* Readability + brand light */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-ink-950/40 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,black_60%,transparent)] bg-linear-to-r from-ink-950/95 via-ink-900/75 to-brand-deep/10 rtl:bg-linear-to-l" />
      <div aria-hidden="true" className="absolute -bottom-40 -start-40 -z-20 h-[36rem] w-[36rem] rounded-full bg-brand/25 blur-3xl" />
      {/* Hairline light beams */}
      <div aria-hidden="true" className="absolute inset-y-0 start-[8%] -z-10 hidden w-px bg-linear-to-b from-transparent via-brand/40 to-transparent lg:block" />
      <div aria-hidden="true" className="absolute inset-y-0 end-[34%] -z-10 hidden w-px bg-linear-to-b from-transparent via-white/10 to-transparent lg:block" />

      <div
        className={cn(
          "container-lux grid grid-cols-1 gap-10 pt-36 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end xl:gap-12",
          full ? "pb-28 lg:pb-32" : "pb-20 lg:pb-24",
        )}
      >
        <div className="flex max-w-3xl flex-col items-start gap-7">
          {breadcrumb && (
            <nav aria-label={breadcrumb.label} className="rise" style={delay(40)}>
              <ol className="flex flex-wrap items-center gap-2 text-sm text-mist/60">
                <li>
                  <Link href={localePath(locale)} className="transition-colors hover:text-white">
                    {breadcrumb.homeLabel}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="chevron" size={14} className="text-brand rtl:-scale-x-100" />
                  <span aria-current="page" className="text-brand-light">
                    {breadcrumb.current}
                  </span>
                </li>
              </ol>
            </nav>
          )}

          <span className="eyebrow rise" style={delay(100)}>
            {eyebrow}
          </span>

          <h1 id="hero-title" className="flex flex-col gap-4">
            <span style={delay(220)} className="rise text-gradient text-5xl leading-[1.05] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              {line1}
            </span>
            <span style={delay(360)} className="rise max-w-2xl text-2xl leading-snug text-mist/85 sm:text-3xl lg:text-[2.35rem]">
              {line2}
            </span>
          </h1>

          <div style={delay(500)} className="rise mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <GlassButton href={localePath(locale, "/contact")} size="lg" icon="calendar">
              {labels.book}
            </GlassButton>
            <GlassButton href={localePath(locale, "/services")} variant="glass" size="lg" arrow>
              {labels.services}
            </GlassButton>
          </div>
        </div>

        {/* Social + contact bar on the opposite side */}
        <div className="rise xl:pb-1.5" style={delay(650)}>
          <SocialContactBar label={labels.panelTitle} callLabel={labels.callUs} />
        </div>
      </div>

      {full && (
        <div aria-hidden="true" className="absolute bottom-8 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-mist/50 lg:flex rtl:translate-x-1/2">
          <span className="flex h-9 w-5 justify-center rounded-full border border-white/25 pt-1.5">
            <span className="h-1.5 w-1 rounded-full bg-brand-light motion-safe:animate-[scroll-cue_2s_ease-in-out_infinite]" />
          </span>
          {labels.scroll}
        </div>
      )}
    </section>
  );
}
