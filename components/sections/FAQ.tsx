import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Faq } from "@/content/types";

/**
 * Accordion built on native <details name="…"> — exclusive, keyboard
 * accessible and animated in CSS, with zero JavaScript.
 */
export function FAQ({ faqs, locale }: { faqs: Faq[]; locale: Locale }) {
  return (
    <div className="grid gap-3">
      {faqs.map((faq, i) => (
        <details
          key={faq.id}
          name="faq"
          open={i === 0}
          data-reveal=""
          style={delay(i * 80)}
          className="faq-item glass glass-soft glass-interactive group rounded-2xl"
        >
          <summary className="flex items-center justify-between gap-4 p-5 text-start">
            <span className="font-semibold text-white">{tr(faq.question, locale)}</span>
            <span className="faq-plus glass-chip h-9 w-9 shrink-0 rounded-full" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-5">
            <div aria-hidden="true" className="mb-4 h-px bg-linear-to-r from-brand/50 to-transparent rtl:bg-linear-to-l" />
            <p className="text-sm leading-relaxed text-mist/70">{tr(faq.answer, locale)}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
