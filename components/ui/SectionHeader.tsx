import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "start";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Heading = "h2",
  id,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <header
      data-reveal=""
      className={cn("flex flex-col gap-5", centered ? "mx-auto max-w-3xl items-center text-center" : "items-start", className)}
    >
      <span className="eyebrow">{eyebrow}</span>
      <Heading id={id} className="text-gradient text-[2.1rem] leading-[1.15] sm:text-5xl lg:text-[3.4rem]">
        {title}
      </Heading>
      {centered && (
        <span aria-hidden="true" className="h-px w-24 bg-linear-to-r from-transparent via-brand to-transparent" />
      )}
      {subtitle && <p className="max-w-2xl text-base text-mist/70 sm:text-lg">{subtitle}</p>}
    </header>
  );
}
