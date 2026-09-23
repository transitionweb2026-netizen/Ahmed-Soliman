import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { whatsappLink } from "@/content/site";
import { GlassButton } from "@/components/ui/GlassButton";

type CTAProps = {
  locale: Locale;
  labels: Dictionary["cta"];
};

/**
 * The single call-to-action card used at the end of every page.
 * Rendered once from the locale layout so it is identical everywhere.
 */
export function CTA({ locale, labels }: CTAProps) {
  return (
    <section aria-labelledby="cta-title" className="container-lux relative isolate pb-24 pt-8 lg:pb-32">
      <div data-reveal="scale" className="glass glass-interactive relative overflow-hidden rounded-[2.5rem] px-6 py-14 sm:px-12 lg:px-20 lg:py-20" data-tilt>
        {/* Brand light pooled inside the glass */}
        <div aria-hidden="true" className="absolute -top-32 start-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl rtl:translate-x-1/2" />
        <div aria-hidden="true" className="absolute -bottom-40 -start-20 -z-10 h-96 w-96 rounded-full bg-brand-deep/80 blur-3xl" />
        <div aria-hidden="true" className="absolute -end-24 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
        {/* Concentric rings — a quiet nod to precision */}
        <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute -end-28 -top-28 -z-10 h-[26rem] w-[26rem] text-brand/25 animate-[spin_90s_linear_infinite]">
          <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeDasharray="2 10" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeDasharray="1 6" />
        </svg>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="glass-chip h-14 w-14 rounded-2xl" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <h2 id="cta-title" className="text-gradient text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {labels.line1}
          </h2>
          <p className="max-w-xl text-base text-mist/75 sm:text-lg">{labels.line2}</p>
          <div className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <GlassButton href={whatsappLink(labels.whatsappMessage)} external size="lg" icon="whatsapp">
              {labels.whatsapp}
            </GlassButton>
            <GlassButton href={localePath(locale, "/contact")} variant="glass" size="lg" arrow>
              {labels.contact}
            </GlassButton>
          </div>
        </div>
      </div>
    </section>
  );
}
