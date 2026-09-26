"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { Certificate } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

type Labels = { heading: string; view: string; close: string; name: string };

/** A certificate drawn as a framed document; replaced by the real scan when `image` is set. */
function CertificateFace({ cert, locale, labels, large = false }: { cert: Certificate; locale: Locale; labels: Labels; large?: boolean }) {
  const title = tr(cert.title, locale);
  if (cert.image) {
    return (
      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-white">
        <Image src={cert.image} alt={title} fill sizes={large ? "800px" : "320px"} className="object-contain" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl text-center",
        "bg-[radial-gradient(120%_80%_at_50%_0%,#f4fbfa,#dcefed_60%,#c6e3e0)] text-ink-900",
        large ? "gap-4 p-10 sm:p-14" : "gap-2 p-6",
      )}
    >
      {/* Double engraved border */}
      <span aria-hidden="true" className="absolute inset-2.5 rounded-lg border-2 border-brand-deep/70" />
      <span aria-hidden="true" className="absolute inset-4 rounded-md border border-brand/60" />
      {/* Guilloche corners */}
      <span aria-hidden="true" className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_0_0,transparent_0_10px,rgb(72_164_164/0.08)_10px_11px),repeating-radial-gradient(circle_at_100%_100%,transparent_0_10px,rgb(72_164_164/0.08)_10px_11px)]" />

      <span className={cn("relative font-display uppercase tracking-[0.3em] text-brand-deep rtl:tracking-normal", large ? "text-sm" : "text-[0.6rem]")}>
        {labels.heading}
      </span>
      <span className={cn("relative font-display leading-snug text-ink-900", large ? "text-3xl sm:text-4xl" : "text-base")}>{title}</span>
      <span className={cn("relative h-px bg-brand-deep/50", large ? "w-40" : "w-16")} />
      <span className={cn("relative text-ink-700", large ? "text-base" : "text-[0.7rem]")}>{labels.name}</span>
      <span className={cn("relative text-brand-deep/90", large ? "text-sm" : "text-[0.65rem]")}>
        {tr(cert.issuer, locale)} · <span dir="ltr">{cert.year}</span>
      </span>

      {/* Seal */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute grid place-items-center rounded-full bg-[conic-gradient(from_0deg,#48A4A4,#104848,#48A4A4,#104848,#48A4A4)] text-white shadow-[0_4px_12px_rgb(16_72_72/0.5)]",
          large ? "bottom-8 end-8 h-20 w-20" : "bottom-5 end-5 h-9 w-9",
        )}
      >
        <span className={cn("grid place-items-center rounded-full bg-brand-deep", large ? "h-14 w-14" : "h-6 w-6")}>
          <Icon name="award" size={large ? 26 : 12} />
        </span>
      </span>
    </span>
  );
}

type CertificatesProps = {
  certificates: Certificate[];
  locale: Locale;
  labels: Labels;
};

/** Horizontal, swipeable strip of certificates; each opens a larger view in the modal. */
export function Certificates({ certificates, locale, labels }: CertificatesProps) {
  const [active, setActive] = useState<Certificate | null>(null);

  return (
    <>
      <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 pt-4 lg:mx-0 lg:px-1">
        {certificates.map((cert, i) => (
          <li key={cert.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)]" data-reveal="" style={delay(i * 90)}>
            <button
              type="button"
              onClick={() => setActive(cert)}
              aria-haspopup="dialog"
              aria-label={`${labels.view}: ${tr(cert.title, locale)}`}
              data-tilt
              className="group glass glass-interactive block w-full rounded-[1.6rem] p-2.5 text-start"
            >
              <CertificateFace cert={cert} locale={locale} labels={labels} />
              <span className="flex items-center justify-between gap-3 px-2 pb-1 pt-3.5">
                <span className="truncate text-sm font-semibold text-white">{tr(cert.title, locale)}</span>
                <span className="glass-chip h-8 w-8 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-110">
                  <Icon name="scan" size={14} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? tr(active.title, locale) : ""}
        closeLabel={labels.close}
        size="lg"
        media={active && <CertificateFace cert={active} locale={locale} labels={labels} large />}
      >
        {active && (
          <p className="flex items-center gap-3 text-mist/75">
            <Icon name="award" size={18} className="text-brand-light" />
            {tr(active.issuer, locale)} · <span dir="ltr">{active.year}</span>
          </p>
        )}
      </Modal>
    </>
  );
}
