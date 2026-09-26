import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type CmsIconProps = {
  icon: IconName;
  /** Icon uploaded in the CMS; takes precedence over the built-in one. */
  url?: string;
  size?: number;
  className?: string;
};

/**
 * Renders a CMS-controlled icon slot. Uploaded icons are drawn as a mask
 * filled with the current text colour, so they keep exactly the size and
 * brand tint of the built-in icons they replace.
 */
export function CmsIcon({ icon, url, size = 20, className }: CmsIconProps) {
  if (!url) return <Icon name={icon} size={size} className={className} />;

  const mask = `url("${url}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{ width: size, height: size, mask, WebkitMask: mask } as CSSProperties}
    />
  );
}
