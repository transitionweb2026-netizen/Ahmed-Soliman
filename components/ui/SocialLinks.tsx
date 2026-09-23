import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { Icon } from "./Icon";

type SocialLinksProps = {
  className?: string;
  itemClassName?: string;
  size?: number;
};

export function SocialLinks({ className, itemClassName, size = 18 }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-2.5", className)}>
      {site.socials.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={cn(
              "glass-chip h-11 w-11 rounded-full text-mist/85 transition-all duration-500 ease-(--ease-lux)",
              "hover:-translate-y-0.5 hover:text-white hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.4),inset_0_0_0_1px_rgb(72_164_164/0.8),0_12px_26px_-8px_rgb(72_164_164/0.8)]",
              itemClassName,
            )}
          >
            <Icon name={social.icon} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
