import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Opacity of the glass body. */
  tone?: "soft" | "default" | "strong";
  /** Brighten border, glow and light on hover. */
  interactive?: boolean;
  /** Subtle 3D perspective tilt following the pointer. */
  tilt?: boolean;
  reveal?: "up" | "fade" | "scale" | "start" | "end";
  delay?: number;
  style?: CSSProperties;
  id?: string;
};

/** The base Liquid Glass surface every card in the system is built from. */
export function GlassCard({
  as: Tag = "div",
  children,
  className,
  tone = "default",
  interactive = false,
  tilt = false,
  reveal,
  delay,
  style,
  id,
}: GlassCardProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "glass",
        tone === "soft" && "glass-soft",
        tone === "strong" && "glass-strong",
        (interactive || tilt) && "glass-interactive",
        className,
      )}
      data-tilt={tilt || undefined}
      data-reveal={reveal === "up" ? "" : reveal}
      style={delay ? ({ ...style, "--delay": `${delay}ms` } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}
