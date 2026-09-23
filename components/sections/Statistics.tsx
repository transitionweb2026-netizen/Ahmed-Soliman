import { cn } from "@/lib/cn";
import { tr, type Locale } from "@/lib/i18n";
import type { Stat } from "@/content/types";
import { CountUp } from "@/components/motion/CountUp";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

type StatisticsProps = {
  locale: Locale;
  stats: Stat[];
  label: string;
  /** Float the cards over the bottom edge of the hero above. */
  overlap?: boolean;
};

export function Statistics({ locale, stats, label, overlap = false }: StatisticsProps) {
  return (
    <section aria-label={label} className={cn("relative z-10", overlap ? "-mt-28 lg:-mt-32" : "section-y")}>
      <div className="container-lux">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => (
            <li key={stat.id}>
              <GlassCard
                tilt
                reveal="up"
                delay={i * 110}
                className="flex h-full flex-col gap-4 overflow-hidden p-5 sm:p-7 lg:gap-6 lg:p-8"
              >
                <div aria-hidden="true" className="absolute -end-10 -top-10 -z-10 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />
                <span className="glass-chip h-11 w-11 sm:h-12 sm:w-12">
                  <Icon name={stat.icon} size={20} />
                </span>
                <p className="text-gradient font-display text-4xl leading-none sm:text-5xl lg:text-6xl">
                  <CountUp value={stat.value} suffix={stat.suffix} locale={locale} />
                </p>
                <p className="text-sm text-mist/70 sm:text-base">{tr(stat.label, locale)}</p>
                <span aria-hidden="true" className="mt-auto h-px w-full bg-linear-to-r from-brand/70 via-brand/20 to-transparent rtl:bg-linear-to-l" />
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
