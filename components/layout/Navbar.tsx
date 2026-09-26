"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileNavbar } from "./MobileNavbar";

type NavbarProps = {
  locale: Locale;
  labels: Dictionary["nav"];
  /** Menu items from the CMS (Navigation), already resolved to hrefs. */
  links: Array<{ key: string; href: string; label: string }>;
  book: { label: string; href: string };
  name: string;
  tagline: string;
  phone: { display: string; href: string };
  whatsappHref: string;
};

export function Navbar({ locale, labels, links: items, book, name, tagline, phone, whatsappHref }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const home = localePath(locale);
  const links = items.map((item) => ({
    ...item,
    active: item.href === home ? pathname === home : pathname.startsWith(item.href.split("#")[0]),
  }));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label={labels.primary}
        className={cn(
          "glass glass-interactive mx-auto flex max-w-7xl items-center gap-2 rounded-full py-2 ps-2 pe-2 transition-[background,box-shadow,padding] duration-700 ease-(--ease-lux) sm:ps-2.5",
          scrolled ? "glass-strong lg:py-1.5" : "lg:py-2.5",
        )}
      >
        <Logo href={localePath(locale)} name={name} tagline={tagline} className="me-auto ps-0.5 lg:me-0" />

        <ul className="relative hidden items-center gap-1 lg:mx-auto lg:flex">
          {links.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "group relative inline-flex h-10 items-center rounded-full px-4 text-[0.92rem] font-medium transition-colors duration-500",
                  link.active ? "text-white" : "text-mist/70 hover:text-white",
                )}
              >
                {link.active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-linear-to-b from-white/14 to-brand/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_0_0_1px_rgb(72_164_164/0.45),0_6px_18px_-8px_rgb(72_164_164/0.8)]"
                  />
                )}
                <span className="relative">{link.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-brand-light shadow-[0_0_8px_#48A4A4] transition-all duration-500",
                    link.active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={labels.switchTo} ariaLabel={labels.switchLabel} className="hidden sm:inline-flex" />
          <GlassButton href={book.href} size="sm" icon="calendar" className="hidden md:inline-flex lg:hidden xl:inline-flex">
            {book.label}
          </GlassButton>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label={labels.menu}
            className="btn btn-glass h-11 min-h-0 w-11 rounded-full p-0 lg:hidden"
          >
            <Icon name="menu" size={20} className="rtl:-scale-x-100" />
          </button>
        </div>
      </nav>

      <MobileNavbar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        labels={labels}
        bookLabel={book.label}
        links={links}
        name={name}
        phone={phone}
        whatsappHref={whatsappHref}
      />
    </header>
  );
}
