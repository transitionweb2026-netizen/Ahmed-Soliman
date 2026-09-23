import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type GlassButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "glass";
  size?: "sm" | "md" | "lg";
  /** Leading icon. */
  icon?: IconName;
  /** Show the trailing arrow bubble (flips automatically in RTL). */
  arrow?: boolean;
  external?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function GlassButton({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  arrow = false,
  external = false,
  className,
  ...rest
}: GlassButtonProps) {
  const classes = cn(
    "btn",
    variant === "primary" ? "btn-primary" : "btn-glass",
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    className,
  );

  const content = (
    <>
      {icon && <Icon name={icon} size={size === "sm" ? 17 : 19} />}
      <span>{children}</span>
      {arrow && (
        <span className="btn-icon">
          <Icon name="arrow" size={15} className="rtl:-scale-x-100" />
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
