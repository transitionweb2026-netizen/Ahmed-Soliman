import { isExternalHref, resolveHref, tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { paragraphs, type SectionContent } from "@/lib/cms/types";
import { Aurora } from "@/components/ui/Aurora";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { DoctorCard } from "./DoctorCard";

type AboutIntroProps = {
  locale: Locale;
  /** CMS block "home.intro": image = portrait, caption = card role, items = highlights. */
  content: SectionContent;
  doctorName: string;
};

/** Home section 3 — portrait card on the start side, introduction on the end side. */
export function AboutIntro({ locale, content, doctorName }: AboutIntroProps) {
  const highlights = content.items[locale];
  const buttonLabel = tr(content.button.label, locale);

  return (
    <section aria-labelledby="intro-title" className="section-y relative isolate">
      <Aurora className="-start-60 top-10" variant="deep" />
      <div className="container-lux grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div data-reveal="start" className="px-6 sm:px-10">
          <DoctorCard
            image={content.image?.url}
            name={doctorName}
            role={tr(content.caption, locale)}
            alt={tr(content.image?.alt ?? { ar: "", en: "" }, locale) || doctorName}
          />
        </div>

        <div className="flex flex-col items-start gap-6">
          <span className="eyebrow" data-reveal="">
            {tr(content.eyebrow, locale)}
          </span>
          <h2 id="intro-title" data-reveal="" style={delay(80)} className="text-gradient text-4xl leading-tight sm:text-5xl">
            {tr(content.title, locale)}
          </h2>
          {paragraphs(tr(content.body, locale)).map((paragraph, i) => (
            <p key={i} data-reveal="" style={delay(160 + i * 80)} className="text-base leading-loose text-mist/75 sm:text-lg">
              {paragraph}
            </p>
          ))}
          {highlights.length > 0 && (
            <ul className="grid w-full gap-3" data-reveal="" style={delay(320)}>
              {highlights.map((item) => (
                <li key={item} className="glass glass-soft flex items-center gap-4 rounded-2xl px-4 py-3">
                  <span className="glass-chip h-8 w-8 shrink-0 rounded-lg">
                    <Icon name="check" size={16} />
                  </span>
                  <span className="text-sm text-mist/90 sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          )}
          {buttonLabel && (
            <div data-reveal="" style={delay(400)} className="pt-2">
              <GlassButton href={resolveHref(locale, content.button.href)} external={isExternalHref(content.button.href)} variant="glass" arrow>
                {buttonLabel}
              </GlassButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
