"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

type MobileNavbarProps = {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  labels: Dictionary["nav"];
  bookLabel: string;
  links: Array<{ key: string; href: string; label: string; active: boolean }>;
  name: string;
  phone: { display: string; href: string };
  whatsappHref: string;
};

/**
 * Full-screen glass menu for small screens. Built on a modal <dialog>, so the
 * browser provides focus trapping, Escape-to-close and an inert background.
 */
export function MobileNavbar({ open, onClose, locale, labels, bookLabel, links, name, phone, whatsappHref }: MobileNavbarProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      aria-label={labels.menu}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 text-mist backdrop:bg-ink-950/70 backdrop:backdrop-blur-md sm:p-5 lg:hidden"
    >
      <div className="glass glass-strong flex h-full flex-col overflow-y-auto rounded-[2rem] p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <Logo href={localePath(locale)} name={name} onClick={onClose} />
          <button type="button" onClick={onClose} aria-label={labels.close} className="btn btn-glass h-11 min-h-0 w-11 rounded-full p-0">
            <Icon name="close" size={20} />
          </button>
        </div>

        <ul className="mt-10 flex flex-col gap-1.5">
          {links.map((link, i) => (
            <li key={link.key} style={{ animation: open ? `menu-in 0.7s var(--ease-lux) ${120 + i * 55}ms both` : undefined }}>
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl transition-colors",
                  link.active
                    ? "bg-linear-to-r from-brand/20 to-transparent text-white shadow-[inset_0_0_0_1px_rgb(72_164_164/0.35)] rtl:bg-linear-to-l"
                    : "text-mist/75 hover:bg-white/5 hover:text-white",
                )}
              >
                <span>{link.label}</span>
                <Icon name="arrow" size={18} className="text-brand-light opacity-60 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto grid gap-3 pt-10" style={{ animation: open ? "menu-in 0.7s var(--ease-lux) 480ms both" : undefined }}>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            <Icon name="whatsapp" size={19} />
            {bookLabel}
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a href={phone.href} className="btn btn-glass w-full" dir="ltr">
              <Icon name="phone" size={17} />
              <span className="truncate text-sm">{phone.display}</span>
            </a>
            <LanguageSwitcher
              locale={locale}
              label={labels.switchTo}
              ariaLabel={labels.switchLabel}
              onSwitch={onClose}
              className="h-auto min-h-[3.25rem] justify-center"
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
