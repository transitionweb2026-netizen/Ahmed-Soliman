import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { JourneyStep } from "@/content/types";
import type { SectionContent } from "@/lib/cms/types";
import { Aurora } from "@/components/ui/Aurora";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PatientJourneyProps = {
  locale: Locale;
  steps: JourneyStep[];
  /** CMS block "home.journey" (eyebrow + title). */
  content: SectionContent;
  stepLabel: string;
};

/**
 * Horizontal timeline of glass points joined by a glowing line. Below `lg`
 * it becomes a vertical timeline running along the start edge.
 */
export function PatientJourney({ locale, steps, content, stepLabel }: PatientJourneyProps) {
  if (!steps.length) return null;
  const format = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", { minimumIntegerDigits: 2 });

  return (
    <section aria-labelledby="journey-title" className="section-y relative isolate overflow-hidden">
      <Aurora className="-start-40 top-1/4" variant="deep" />
      <div className="container-lux">
        <SectionHeader id="journey-title" eyebrow={tr(content.eyebrow, locale)} title={tr(content.title, locale)} />

        <div className="glass glass-soft relative mt-16 rounded-[2.5rem] px-5 py-10 sm:px-10 lg:px-8 lg:py-14">
          <div className="relative">
            {/* Horizontal connector (desktop): track + drawn glowing line */}
            <span aria-hidden="true" className="absolute inset-x-[8.33%] top-9 hidden h-px bg-white/10 lg:block" />
            <span
              aria-hidden="true"
              data-reveal="line"
              style={delay(200)}
              className="flow-light absolute inset-x-[8.33%] top-[2.2rem] hidden h-[3px] rounded-full shadow-[0_0_18px_rgb(72_164_164/0.8)] lg:block"
            />
            {/* Vertical connector (mobile/tablet) */}
            <span aria-hidden="true" className="absolute bottom-9 start-9 top-9 w-px bg-white/10 lg:hidden" />
            <span
              aria-hidden="true"
              data-reveal="line-y"
              className="flow-light-y absolute bottom-9 start-[2.2rem] top-9 w-[3px] rounded-full shadow-[0_0_18px_rgb(72_164_164/0.8)] lg:hidden"
            />

            <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-4">
            {steps.map((step, i) => (
              <li
                key={step.id}
                data-reveal=""
                style={delay(250 + i * 140)}
                className="group relative grid grid-cols-[4.5rem_1fr] items-start gap-5 lg:flex lg:flex-col lg:items-center lg:gap-6 lg:text-center"
              >
                <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center">
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-brand/30 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="glass glass-strong relative grid h-full w-full place-items-center rounded-full text-brand-light transition-transform duration-700 ease-(--ease-lux) group-hover:scale-110">
                    <CmsIcon icon={step.icon} url={step.iconUrl} size={26} />
                  </span>
                  <span className="absolute -end-1 -top-1 grid h-7 min-w-7 place-items-center rounded-full bg-linear-to-br from-brand to-brand-deep px-1 text-[0.7rem] font-bold text-white shadow-[0_0_0_3px_#041414,0_4px_12px_rgb(72_164_164/0.6)]">
                    {format.format(i + 1)}
                  </span>
                </span>
                <div className="flex flex-col gap-2 pt-2 lg:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand rtl:tracking-normal">
                    {stepLabel} {format.format(i + 1)}
                  </p>
                  <h3 className="text-lg text-white xl:text-xl">{tr(step.title, locale)}</h3>
                  <p className="text-sm leading-relaxed text-mist/65">{tr(step.text, locale)}</p>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
