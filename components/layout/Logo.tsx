import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  href: string;
  name: string;
  tagline?: string;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
};

/** Monogram mark in a glass disc + wordmark. */
export function Logo({ href, name, tagline, compact = false, className, onClick }: LogoProps) {
  return (
    <Link href={href} onClick={onClick} className={cn("group flex items-center gap-3 rounded-full", className)}>
      <span className="glass-chip relative h-11 w-11 shrink-0 rounded-full transition-transform duration-700 ease-(--ease-lux) group-hover:rotate-[8deg]">
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#8fd3d1" />
            </linearGradient>
          </defs>
          {/* Stylised "A" + "S" sharing one stroke — a medical cross hides in the counter. */}
          <path
            d="M8 31 17.5 9h2L29 31M12.2 23h13.6"
            fill="none"
            stroke="url(#logo-g)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M18.5 15.5v5M16 18h5" stroke="#48A4A4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-[1.05rem] font-semibold tracking-wide text-white">{name}</span>
          {tagline && <span className="hidden text-[0.7rem] text-brand-light/80 sm:block">{tagline}</span>}
        </span>
      )}
    </Link>
  );
}
