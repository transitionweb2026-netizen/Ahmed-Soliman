import { cn } from "@/lib/cn";

/** Soft brand-colored light pooled behind a section. Purely decorative. */
export function Aurora({ className, variant = "brand" }: { className?: string; variant?: "brand" | "deep" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 aspect-square w-[42rem] max-w-[120vw] rounded-full blur-3xl",
        variant === "brand" ? "bg-brand/15" : "bg-brand-deep/50",
        className,
      )}
    />
  );
}
