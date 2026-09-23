import { tr, type Locale } from "@/lib/i18n";
import type { Treatment } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { FramedCard } from "./FramedCard";

type TreatmentCardProps = {
  treatment: Treatment;
  locale: Locale;
  index: number;
  sessionsLabel: string;
};

export function TreatmentCard({ treatment, locale, index, sessionsLabel }: TreatmentCardProps) {
  const title = tr(treatment.title, locale);
  return (
    <FramedCard
      image={treatment.image}
      imageAlt={title}
      title={title}
      description={tr(treatment.summary, locale)}
      icon={treatment.icon}
      index={index}
      footer={
        <p className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs text-brand-pale shadow-[inset_0_0_0_1px_rgb(72_164_164/0.3)]">
          <Icon name="calendar" size={14} />
          <span className="sr-only">{sessionsLabel}: </span>
          {tr(treatment.sessions, locale)}
        </p>
      }
    />
  );
}
