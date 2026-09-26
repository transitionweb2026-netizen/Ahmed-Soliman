import { cn } from "@/lib/cn";
import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Milestone } from "@/content/types";
import { Icon } from "@/components/ui/Icon";

function MilestoneCard({ milestone, locale, showPeriod }: { milestone: Milestone; locale: Locale; showPeriod?: boolean }) {
  return (
    <div data-tilt className="glass glass-interactive flex flex-col gap-2 rounded-3xl p-6 sm:p-7">
      <div aria-hidden="true" className="absolute -end-10 -top-10 -z-10 h-28 w-28 rounded-full bg-brand/20 blur-2xl" />
      {showPeriod && (
        <p dir="ltr" className="font-display text-lg text-brand-light rtl:text-right">
          {milestone.period}
        </p>
      )}
      <h3 className="font-sans text-lg font-semibold text-white sm:text-xl">{tr(milestone.role, locale)}</h3>
      <p className="text-sm text-brand-pale/80">{tr(milestone.place, locale)}</p>
      <p className="mt-2 text-sm leading-relaxed text-mist/70">{tr(milestone.text, locale)}</p>
    </div>
  );
}

/**
 * Career journey: alternating cards around a glowing spine on desktop,
 * a single vertical line along the start edge on mobile.
 */
export function CareerTimeline({ milestones, locale }: { milestones: Milestone[]; locale: Locale }) {
  return (
    <div className="relative">
      {/* Spine: centred on desktop, along the start edge on mobile */}
      <span aria-hidden="true" className="absolute bottom-6 start-[1.35rem] top-6 w-px bg-white/10 lg:start-1/2" />
      <span
        aria-hidden="true"
        data-reveal="line-y"
        className="flow-light-y absolute bottom-6 start-[1.3rem] top-6 w-[3px] rounded-full shadow-[0_0_18px_rgb(72_164_164/0.8)] lg:start-[calc(50%-1px)]"
      />

      <ol className="relative grid gap-10 lg:gap-6">
        {milestones.map((milestone, i) => {
          const even = i % 2 === 0;
          const card = <MilestoneCard milestone={milestone} locale={locale} />;
          const period = (
            <p
              dir="ltr"
              className={cn(
                "font-display text-4xl text-gradient xl:text-5xl",
                even ? "text-left rtl:text-right" : "text-right rtl:text-left",
              )}
            >
              {milestone.period}
            </p>
          );
          return (
            <li
              key={milestone.id}
              data-reveal=""
              style={delay(i * 80)}
              className="grid grid-cols-[2.75rem_1fr] items-center gap-5 lg:grid-cols-[1fr_5rem_1fr] lg:gap-8"
            >
              <div className="hidden lg:block">{even ? card : period}</div>

              <span className="relative grid h-11 w-11 place-items-center justify-self-center lg:h-16 lg:w-16">
                <span aria-hidden="true" className="absolute inset-0 rounded-full bg-brand/30 blur-lg" />
                <span className="glass glass-strong relative grid h-full w-full place-items-center rounded-full text-brand-light">
                  <Icon name={milestone.icon} size={20} />
                </span>
              </span>

              <div className="lg:hidden">
                <MilestoneCard milestone={milestone} locale={locale} showPeriod />
              </div>
              <div className="hidden lg:block">{even ? period : card}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
