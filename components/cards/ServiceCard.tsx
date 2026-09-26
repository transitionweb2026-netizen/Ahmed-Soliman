import { tr, type Locale } from "@/lib/i18n";
import type { Service } from "@/content/types";
import { FramedCard } from "./FramedCard";

export function ServiceCard({ service, locale, index }: { service: Service; locale: Locale; index: number }) {
  const title = tr(service.title, locale);
  return (
    <FramedCard
      image={service.image}
      imageAlt={title}
      title={title}
      description={tr(service.summary, locale)}
      icon={service.icon}
      iconUrl={service.iconUrl}
      index={index}
    />
  );
}
