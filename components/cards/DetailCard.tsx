"use client";

import Image from "next/image";
import { useState } from "react";
import { tr, type Locale } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import type { DetailItem } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

type DetailCardProps = {
  item: DetailItem;
  locale: Locale;
  index: number;
  labels: { learnMore: string; close: string; highlights: string };
};

/**
 * Framed 3D glass card that opens its full details in a modal instead of
 * navigating away. Used for technologies and key specialties.
 */
export function DetailCard({ item, locale, index, labels }: DetailCardProps) {
  const [open, setOpen] = useState(false);
  const title = tr(item.title, locale);

  return (
    <div data-reveal="" style={delay(index * 110)} className="h-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-tilt
        className="group glass glass-interactive frame-3d block h-full w-full text-start"
      >
        <span className="frame-inner flex h-full flex-col">
          <span className="relative block aspect-[4/3] overflow-hidden">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.07]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/10 to-transparent" />
          </span>
          <span className="relative flex flex-1 flex-col gap-3 p-6 pt-8">
            <span className="glass-chip absolute -top-6 end-5 h-12 w-12 rounded-2xl transition-transform duration-700 ease-(--ease-lux) group-hover:-translate-y-1 group-hover:rotate-6">
              <Icon name={item.icon} size={22} />
            </span>
            <span className="font-display text-xl text-white sm:text-[1.3rem]">{title}</span>
            <span className="text-sm leading-relaxed text-mist/65">{tr(item.summary, locale)}</span>
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-light transition-colors group-hover:text-white">
              {labels.learnMore}
              <Icon name="plus" size={15} className="transition-transform duration-500 group-hover:rotate-90" />
            </span>
          </span>
        </span>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        closeLabel={labels.close}
        media={
          <div className="frame-inner relative aspect-[16/8]">
            <Image src={item.image} alt={title} fill sizes="(min-width: 768px) 760px, 95vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-transparent to-transparent" />
            <span className="glass-chip absolute bottom-4 start-4 h-14 w-14 rounded-2xl">
              <Icon name={item.icon} size={26} />
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-4 text-base leading-loose text-mist/80">
          {tr(item.details, locale).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-white/[0.03] p-5 shadow-[inset_0_0_0_1px_rgb(72_164_164/0.25)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-light rtl:tracking-normal">
            {labels.highlights}
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {tr(item.highlights, locale).map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm text-mist/85">
                <span className="glass-chip mt-0.5 h-6 w-6 shrink-0 rounded-md">
                  <Icon name="check" size={13} />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
