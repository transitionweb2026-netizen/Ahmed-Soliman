import Image from "next/image";
import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Reason, Stat } from "@/content/types";
import type { SectionContent } from "@/lib/cms/types";
import { Aurora } from "@/components/ui/Aurora";
import { CmsIcon } from "@/components/ui/CmsIcon";

type WhyDoctorProps = {
  locale: Locale;
  reasons: Reason[];
  /** Optional stat shown as the floating badge (the first statistic). */
  badge?: Stat;
  /** CMS block "home.why" (eyebrow, title, subtitle, image). */
  content: SectionContent;
};

/** Home section 8 — reasons on the start side, framed image on the end side. */
export function WhyDoctor({ locale, reasons, badge, content }: WhyDoctorProps) {
  const image = content.image;
  const number = badge ? new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(badge.value) : "";

  return (
    <section aria-labelledby="why-title" className="section-y relative isolate">
      <Aurora className="-end-52 top-10" />
      <div className="container-lux grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col items-start gap-5" data-reveal="">
            <span className="eyebrow">{tr(content.eyebrow, locale)}</span>
            <h2 id="why-title" className="text-gradient text-4xl leading-tight sm:text-5xl">
              {tr(content.title, locale)}
            </h2>
            <p className="text-base text-mist/70 sm:text-lg">{tr(content.subtitle, locale)}</p>
          </header>

          <ul className="grid gap-4">
            {reasons.map((reason, i) => (
              <li
                key={reason.id}
                data-reveal=""
                style={delay(i * 90)}
                className="group glass glass-soft glass-interactive relative flex gap-5 overflow-hidden rounded-2xl p-5"
              >
                {/* Accent line on the start edge */}
                <span aria-hidden="true" className="absolute inset-y-4 start-0 w-[3px] rounded-full bg-linear-to-b from-brand-light via-brand to-brand-deep opacity-60 transition-opacity group-hover:opacity-100" />
                <span className="glass-chip h-12 w-12 shrink-0 rounded-xl">
                  <CmsIcon icon={reason.icon} url={reason.iconUrl} size={22} />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-sans text-base font-semibold text-white sm:text-lg">{tr(reason.title, locale)}</h3>
                  <p className="text-sm leading-relaxed text-mist/65">{tr(reason.text, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="end" className="relative mx-auto w-full max-w-[34rem]">
          <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[3rem] bg-linear-to-tr from-brand-deep/70 via-transparent to-brand/30 blur-2xl" />
          <div data-tilt className="glass glass-interactive rounded-[2.5rem] p-3">
            <div className="frame-inner relative aspect-[4/5]">
              {image && <Image src={image.url} alt={tr(image.alt, locale) || tr(content.title, locale)} fill sizes="(min-width: 1024px) 540px, 92vw" className="object-cover" />}
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-transparent" />
              <div aria-hidden="true" className="absolute inset-3 rounded-[1.1rem] border border-white/15" />
            </div>
          </div>

          {/* Floating badge */}
          {badge && (
          <div className="absolute -bottom-6 start-4 motion-safe:animate-float sm:-start-8">
            <div className="glass glass-strong flex items-center gap-4 rounded-2xl px-5 py-4">
              <span className="glass-chip h-12 w-12 rounded-xl">
                <CmsIcon icon={badge.icon} url={badge.iconUrl} size={22} />
              </span>
              <span className="flex flex-col">
                <span className="text-gradient font-display text-3xl leading-none">
                  {badge.prefix}
                  {number}
                  {badge.suffix}
                </span>
                <span className="mt-1 text-xs text-mist/70">{tr(badge.label, locale)}</span>
              </span>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
