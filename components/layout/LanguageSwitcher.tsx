"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { LOCALE_COOKIE, otherLocale, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
  onSwitch?: () => void;
};

/** Links to the same page in the other language and remembers the choice. */
export function LanguageSwitcher({ locale, label, ariaLabel, className, onSwitch }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const href = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${target}`) || `/${target}`;

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
        onSwitch?.();
      }}
      className={cn(
        "group inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold text-mist/90",
        "shadow-[inset_0_0_0_1px_rgb(72_164_164/0.35),inset_0_1px_0_rgb(255_255_255/0.15)]",
        "transition-all duration-500 ease-(--ease-lux) hover:bg-brand/15 hover:text-white",
        className,
      )}
    >
      <Icon name="globe" size={17} className="text-brand-light transition-transform duration-700 group-hover:rotate-180" />
      <span className={target === "ar" ? "font-['Thmanyah_Sans',sans-serif]" : "font-[family-name:var(--font-manrope)]"}>
        {label}
      </span>
    </Link>
  );
}
