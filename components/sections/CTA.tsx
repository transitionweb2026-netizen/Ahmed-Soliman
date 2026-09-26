import Image from "next/image";
import { resolveHref, tr, type Locale } from "@/lib/i18n";
import type { SectionContent } from "@/lib/cms/types";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";

type CTAProps = {
  locale: Locale;
  /** CMS block "global.cta": title/subtitle = the two lines, caption = role, image = portrait. */
  content: SectionContent;
  doctorName: string;
  whatsappHref: string;
};

/** Arched glass window with the doctor's portrait, layered depth and a floating name badge. */
function Portrait({ name, role, image }: { name: string; role: string; image?: string }) {
  return (
    <div className="group relative mx-auto h-[19rem] w-60 shrink-0 sm:h-[22rem] sm:w-72 lg:mx-0">
      {/* Brand glow + precision rings */}
      <div aria-hidden="true" className="absolute inset-6 -z-10 rounded-full bg-brand/40 blur-3xl" />
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        className="absolute left-1/2 top-1/2 -z-10 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 text-brand/40 motion-safe:animate-[spin_60s_linear_infinite]"
      >
        <circle cx="150" cy="150" r="146" fill="none" stroke="currentColor" strokeDasharray="1 7" />
        <circle cx="150" cy="150" r="128" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="150" cy="4" r="3.5" fill="#8fd3d1" />
      </svg>

      {/* Offset ghost card behind the window */}
      <div
        aria-hidden="true"
        className="card-back absolute inset-0 rounded-b-[2.5rem] rounded-t-[7.5rem] sm:rounded-t-[9rem] -rotate-[7deg] opacity-80 group-hover:-rotate-[11deg] group-hover:-translate-x-3"
      />

      {/* Arched glass window */}
      <div data-tilt className="glass glass-interactive absolute inset-0 rounded-b-[2.5rem] rounded-t-[7.5rem] sm:rounded-t-[9rem] p-2">
        <div className="relative h-full overflow-hidden rounded-b-[2.1rem] rounded-t-[7rem] shadow sm:rounded-t-[8.5rem]-[inset_0_0_0_1px_rgb(72_164_164/0.35)]">
          {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 640px) 288px, 240px"
            className="object-cover object-top transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.05]"
          />
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-brand-deep/80 via-transparent to-transparent" />
          <div aria-hidden="true" className="absolute inset-2 rounded-b-[1.8rem] rounded-t-[6.5rem] border sm:rounded-t-[8rem] border-white/20" />
        </div>
      </div>

      {/* Floating name badge */}
      <div className="absolute -bottom-5 start-1/2 w-max -translate-x-1/2 motion-safe:animate-float rtl:translate-x-1/2">
        <div className="glass glass-strong flex items-center gap-3 rounded-2xl py-2.5 pe-4 ps-2.5">
          <span className="glass-chip h-9 w-9 rounded-xl">
            <Icon name="shield" size={17} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">{name}</span>
            <span className="text-[0.7rem] text-brand-light">{role}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The single call-to-action card used at the end of every page.
 * Rendered once from the locale layout so it is identical everywhere.
 */
export function CTA({ locale, content, doctorName, whatsappHref }: CTAProps) {
  const role = tr(content.caption, locale);
  return (
    <section aria-labelledby="cta-title" className="container-lux relative isolate pb-24 pt-8 lg:pb-32">
      <div data-reveal="scale" className="glass relative overflow-hidden rounded-[2.5rem] px-6 pb-14 pt-12 sm:px-12 lg:px-16 lg:py-16">
        {/* Brand light pooled inside the glass */}
        <div aria-hidden="true" className="absolute -top-32 start-10 -z-10 h-80 w-80 rounded-full bg-brand/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-40 end-0 -z-10 h-96 w-96 rounded-full bg-brand-deep/80 blur-3xl" />

        <div className="flex flex-col items-center gap-14 lg:flex-row lg:gap-16">
          <Portrait name={doctorName} role={role} image={content.image?.url} />

          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-start">
            {role && <span className="eyebrow">{role}</span>}
            <h2 id="cta-title" className="text-gradient text-3xl leading-tight sm:text-4xl lg:text-5xl">
              {tr(content.title, locale)}
            </h2>
            <p className="max-w-xl text-base text-mist/75 sm:text-lg">{tr(content.subtitle, locale)}</p>
            <div className="mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <GlassButton href={whatsappHref} external size="lg" icon="whatsapp">
                {tr(content.button.label, locale)}
              </GlassButton>
              <GlassButton href={resolveHref(locale, content.button2.href || "/contact")} variant="glass" size="lg" arrow>
                {tr(content.button2.label, locale)}
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
