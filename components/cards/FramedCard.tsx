import Image from "next/image";
import type { ReactNode } from "react";
import { delay } from "@/lib/motion";
import { CmsIcon } from "@/components/ui/CmsIcon";
import type { IconName } from "@/components/ui/Icon";

type FramedCardProps = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  icon: IconName;
  iconUrl?: string;
  index: number;
  footer?: ReactNode;
};

/**
 * A glass outer frame holding a raised inner panel — the shared 3D object
 * behind ServiceCard and TreatmentCard.
 */
export function FramedCard({ image, imageAlt, title, description, icon, iconUrl, index, footer }: FramedCardProps) {
  return (
    <article data-reveal="" style={delay(index * 110)} className="h-full">
      <div data-tilt className="group glass glass-interactive frame-3d h-full">
        <div className="frame-inner flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden">
            {image && (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.07]"
            />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/10 to-transparent" />
            <span
              aria-hidden="true"
              className="glass absolute start-3 top-3 rounded-full px-3 py-1 font-display text-sm tabular-nums text-brand-pale"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="relative flex flex-1 flex-col gap-3 p-6 pt-8">
            <span className="glass-chip absolute -top-6 end-5 h-12 w-12 rounded-2xl transition-transform duration-700 ease-(--ease-lux) group-hover:-translate-y-1 group-hover:rotate-6">
              <CmsIcon icon={icon} url={iconUrl} size={22} />
            </span>
            <h3 className="text-xl text-white sm:text-[1.35rem]">{title}</h3>
            <p className="text-sm leading-relaxed text-mist/65">{description}</p>
            {footer && <div className="mt-auto pt-3">{footer}</div>}
          </div>

          <span
            aria-hidden="true"
            className="absolute inset-x-6 bottom-0 h-px scale-x-0 bg-linear-to-r from-transparent via-brand-light to-transparent transition-transform duration-700 ease-(--ease-lux) group-hover:scale-x-100"
          />
        </div>
      </div>
    </article>
  );
}
