import type { ReactNode } from "react";
import { Aurora } from "@/components/ui/Aurora";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

type CardShowcaseProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  children: ReactNode;
  auroraSide?: "start" | "end";
};

/** Header + four framed cards + button. Used by the home Services and Treatments previews. */
export function CardShowcase({ id, eyebrow, title, subtitle, cta, children, auroraSide = "end" }: CardShowcaseProps) {
  return (
    <section aria-labelledby={id} className="section-y relative isolate">
      <Aurora className={auroraSide === "end" ? "-end-60 top-1/3" : "-start-60 top-1/3"} />
      <div className="container-lux">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-7">{children}</div>
        {cta.label && (
          <div className="mt-14 flex justify-center" data-reveal="">
            <GlassButton href={cta.href} external={/^https?:/i.test(cta.href)} size="lg" arrow>
              {cta.label}
            </GlassButton>
          </div>
        )}
      </div>
    </section>
  );
}
