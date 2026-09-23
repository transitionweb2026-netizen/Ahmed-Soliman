import Image from "next/image";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, tr, type Locale } from "@/lib/i18n";
import { media } from "@/content/media";
import { site } from "@/content/site";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { delay } from "@/lib/motion";

type HeroProps = {
  locale: Locale;
  labels: Dictionary["hero"];
};

export function Hero({ locale, labels }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* Full-bleed cover, edge to edge */}
      <div aria-hidden="true" className="absolute inset-0 -z-30 overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <Image
          src={media.heroCover}
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

      <div className="container-lux grid items-center gap-12 pb-40 pt-36 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pb-44">
        <div className="flex max-w-3xl flex-col items-start gap-7">
          <span className="eyebrow rise" style={delay(100)}>
            {labels.eyebrow}
          </span>

          <h1 id="hero-title" className="flex flex-col gap-4">
            <span
              style={delay(220)}
              className="rise text-gradient text-5xl leading-[1.05] sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              {labels.line1}
            </span>
            <span
              style={delay(360)}
              className="rise max-w-2xl text-2xl leading-snug text-mist/85 sm:text-3xl lg:text-[2.35rem]"
            >
              {labels.line2}
            </span>
          </h1>

          <div
            style={delay(500)}
            className="rise mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <GlassButton href={localePath(locale, "/contact")} size="lg" icon="calendar">
              {labels.book}
            </GlassButton>
            <GlassButton href={localePath(locale, "/services")} variant="glass" size="lg" arrow>
              {labels.services}
            </GlassButton>
          </div>
        </div>

        {/* Floating contact panel on the opposite side */}
        <aside
          aria-label={labels.panelTitle}
          className="w-full motion-safe:lg:animate-float lg:w-72"
        >
          <div className="rise glass glass-interactive rounded-[2rem] p-5 sm:p-6" style={delay(650)} data-tilt>
            <div aria-hidden="true" className="absolute -top-10 end-6 -z-10 h-28 w-28 rounded-full bg-brand/40 blur-2xl" />
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-light rtl:tracking-normal">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-brand-light motion-safe:animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-brand-light" />
              </span>
              {labels.panelTitle}
            </p>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
              <a
                href={site.phoneHref}
                className="group flex items-center gap-4 rounded-2xl p-1 transition-colors"
                aria-label={`${labels.callUs}: ${site.phone}`}
              >
                <span className="glass-chip h-12 w-12 shrink-0 rounded-2xl transition-transform duration-500 group-hover:scale-105">
                  <Icon name="phone" size={20} />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-mist/60">{labels.callUs}</span>
                  <span dir="ltr" className="text-lg font-semibold tracking-wide text-white">
                    {site.phone}
                  </span>
                </span>
              </a>

              <div aria-hidden="true" className="hidden h-px bg-linear-to-r from-transparent via-brand/40 to-transparent lg:block" />

              <div className="flex flex-col gap-3">
                <span className="text-xs text-mist/60">
                  {labels.followUs} · {tr(site.name, locale)}
                </span>
                <SocialLinks />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Scroll cue */}
      <div aria-hidden="true" className="absolute bottom-32 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-mist/50 lg:flex rtl:translate-x-1/2">
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/25 pt-1.5">
          <span className="h-1.5 w-1 rounded-full bg-brand-light motion-safe:animate-[scroll-cue_2s_ease-in-out_infinite]" />
        </span>
        {labels.scroll}
      </div>
    </section>
  );
}
