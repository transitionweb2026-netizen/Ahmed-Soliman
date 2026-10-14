import { cn } from "@/lib/cn";
import type { SocialLink } from "@/lib/cms/types";
import { Icon } from "./Icon";
import { SocialLinks } from "./SocialLinks";

type SocialContactBarProps = {
  label: string;
  callLabel: string;
  socials: SocialLink[];
  phone: { display: string; href: string };
  className?: string;
};

/**
 * One horizontal glass bar: social icons │ phone number. Phones narrower than
 * 390px get a tighter bar (and below 360px no handset icon) so it stays one row.
 */
export function SocialContactBar({ label, callLabel, socials, phone, className }: SocialContactBarProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "glass glass-interactive inline-flex max-w-full items-center gap-2 rounded-full p-1.5 pe-4 max-[390px]:gap-1.5 max-[390px]:pe-3 sm:gap-3 sm:p-2 sm:pe-5",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute -top-6 start-1/3 -z-10 h-16 w-32 rounded-full bg-brand/30 blur-2xl" />
      <SocialLinks
        socials={socials}
        className="gap-1 sm:gap-1.5"
        itemClassName="h-9 w-9 max-[390px]:h-8 max-[390px]:w-8 max-[360px]:h-7 max-[360px]:w-7 sm:h-10 sm:w-10"
        size={16}
      />

      {socials.length > 0 && phone.display && (
        <span aria-hidden="true" className="h-7 w-px shrink-0 bg-linear-to-b from-transparent via-brand-light/70 to-transparent" />
      )}

      {phone.display && (
        <a
          href={phone.href}
          aria-label={`${callLabel}: ${phone.display}`}
          className="group flex shrink-0 items-center gap-2 rounded-full text-mist/90 transition-colors hover:text-white"
        >
          <Icon name="phone" size={16} className="text-brand-light transition-transform duration-500 group-hover:rotate-12 max-[360px]:hidden" />
          <span dir="ltr" className="whitespace-nowrap text-sm font-semibold tracking-wide max-[390px]:text-[0.8125rem] max-[390px]:tracking-normal sm:text-[0.95rem]">
            {phone.display}
          </span>
        </a>
      )}
    </div>
  );
}
