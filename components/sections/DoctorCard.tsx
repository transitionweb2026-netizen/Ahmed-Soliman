import Image from "next/image";
import { cn } from "@/lib/cn";

type DoctorCardProps = {
  image: string;
  name: string;
  role: string;
  alt: string;
  className?: string;
};

function Pip({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col items-center gap-1 text-brand-light", className)} aria-hidden="true">
      <span className="font-display text-lg font-semibold leading-none text-white">AS</span>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M6.5 1h3v5.5H15v3H9.5V15h-3V9.5H1v-3h5.5z" />
      </svg>
    </span>
  );
}

/**
 * The doctor's portrait presented as a premium playing card, with a fanned
 * deck of card-backs behind it that spreads a little on hover.
 */
export function DoctorCard({ image, name, role, alt, className }: DoctorCardProps) {
  return (
    <div className={cn("group relative mx-auto aspect-[3/4] w-full max-w-[25rem]", className)}>
      {/* Deck behind */}
      <div aria-hidden="true" className="card-back absolute inset-0 -rotate-[9deg] opacity-60 group-hover:-translate-x-6 group-hover:-rotate-[13deg]" />
      <div aria-hidden="true" className="card-back absolute inset-0 rotate-[7deg] opacity-75 group-hover:translate-x-6 group-hover:rotate-[11deg]" />
      <div aria-hidden="true" className="card-back absolute inset-0 -rotate-[3deg] opacity-90 group-hover:-rotate-[5deg]" />
      <div aria-hidden="true" className="absolute inset-[10%] -z-10 rounded-full bg-brand/35 blur-3xl" />

      {/* Front card */}
      <div data-tilt className="glass glass-interactive absolute inset-0 rounded-[2rem] p-2.5">
        <div className="frame-inner relative h-full">
          <Image
            src={image}
            alt={alt}
            fill
            quality={85}
            sizes="(min-width: 1024px) 400px, 85vw"
            className="object-cover object-top transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.04]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
          {/* Printed inner border, like a fine card */}
          <div aria-hidden="true" className="absolute inset-3 rounded-[1.1rem] border border-white/20" />
          <div aria-hidden="true" className="absolute inset-[1.05rem] rounded-[0.9rem] border border-brand/25" />

          <Pip className="absolute start-6 top-6" />
          <Pip className="absolute bottom-6 end-6 rotate-180" />

          <div className="absolute inset-x-6 bottom-8 flex flex-col items-center gap-1 text-center">
            <span aria-hidden="true" className="mb-2 h-px w-16 bg-linear-to-r from-transparent via-brand-light to-transparent" />
            <p className="font-display text-2xl text-white">{name}</p>
            <p className="text-xs text-brand-light">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
