import { tr, type Locale } from "@/lib/i18n";
import type { Stat } from "@/content/types";
import { CountUp } from "@/components/motion/CountUp";
import { GlassCard } from "@/components/ui/GlassCard";
import { CmsIcon } from "@/components/ui/CmsIcon";

type StatisticsProps = {
  locale: Locale;
  stats: Stat[];
  label: string;
};

/** A standalone band of compact glass stat cards. */
export function Statistics({ locale, stats, label }: StatisticsProps) {
  return (
    <section aria-label={label} className="relative py-16 lg:py-20">
      <div className="container-lux">
        <div aria-hidden="true" className="mx-auto mb-12 h-px max-w-4xl bg-linear-to-r from-transparent via-brand/50 to-transparent lg:mb-14" />
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat, i) => (
            <li key={stat.id}>
              <GlassCard
                tilt
                reveal="up"
                delay={i * 110}
                className="flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-4 sm:p-5 lg:gap-4 lg:p-6"
              >
                <div aria-hidden="true" className="absolute -end-8 -top-8 -z-10 h-24 w-24 rounded-full bg-brand/20 blur-2xl" />
                <span className="glass-chip h-9 w-9 rounded-xl sm:h-10 sm:w-10">
                  <CmsIcon icon={stat.icon} url={stat.iconUrl} size={17} />
                </span>
                <p className="text-gradient font-display text-3xl leading-none sm:text-4xl lg:text-[2.75rem]">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} locale={locale} />
                </p>
                <p className="text-xs text-mist/70 sm:text-sm">{tr(stat.label, locale)}</p>
                <span aria-hidden="true" className="mt-auto h-px w-full bg-linear-to-r from-brand/70 via-brand/20 to-transparent rtl:bg-linear-to-l" />
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
