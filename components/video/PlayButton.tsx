import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/** Glass play disc with a soft pulsing halo. Decorative — the parent is the button. */
export function PlayButton({ size = "lg" }: { size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <span aria-hidden="true" className="relative grid place-items-center">
      <span className={cn("absolute rounded-full bg-brand/40 motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]", lg ? "h-24 w-24" : "h-16 w-16")} />
      <span
        className={cn(
          "absolute rounded-full bg-brand/30 motion-safe:animate-[pulse-ring_2.4s_ease-out_1.2s_infinite]",
          lg ? "h-24 w-24" : "h-16 w-16",
        )}
      />
      <span
        className={cn(
          "relative grid place-items-center rounded-full text-white transition-transform duration-700 ease-(--ease-lux) group-hover:scale-110",
          "bg-[linear-gradient(180deg,rgb(255_255_255/0.35),rgb(255_255_255/0.05)_55%),linear-gradient(135deg,#5cb9b8,#48A4A4_50%,#104848)]",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.6),inset_0_0_0_1px_rgb(255_255_255/0.2),0_20px_40px_-10px_rgb(72_164_164/0.8)] backdrop-blur-md",
          lg ? "h-24 w-24" : "h-16 w-16",
        )}
      >
        <Icon name="play" size={lg ? 30 : 22} className="translate-x-0.5" />
      </span>
    </span>
  );
}
