import { cn } from "@/lib/cn";
import type { SocialLink } from "@/lib/cms/types";
import { CmsIcon } from "./CmsIcon";

type SocialLinksProps = {
  /** Active social platforms from the CMS, in display order. */
  socials: SocialLink[];
  /** Spacing classes for the list; replaces the default gap. */
  className?: string;
  /** Size classes for each icon button; replaces the default 44px size. */
  itemClassName?: string;
  size?: number;
};

// Defaults are replaced (not merged) so a caller's h-/w-/gap- never lose to ours in CSS order.
export function SocialLinks({ socials, className = "gap-2.5", itemClassName = "h-11 w-11", size = 18 }: SocialLinksProps) {
  if (!socials.length) return null;
  return (
    <ul className={cn("flex items-center", className)}>
      {socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={cn(
              "glass-chip rounded-full text-mist/85 transition-all duration-500 ease-(--ease-lux)",
              "hover:-translate-y-0.5 hover:text-white hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.4),inset_0_0_0_1px_rgb(72_164_164/0.8),0_12px_26px_-8px_rgb(72_164_164/0.8)]",
              itemClassName,
            )}
          >
            <CmsIcon icon={social.icon} url={social.iconUrl} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
