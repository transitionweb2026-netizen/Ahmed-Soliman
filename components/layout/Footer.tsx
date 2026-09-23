import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, tr, type Locale } from "@/lib/i18n";
import { navItems } from "@/lib/nav";
import { site, whatsappLink } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Logo } from "./Logo";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const contactRows = [
    { icon: "phone" as const, label: site.phone, href: site.phoneHref, ltr: true },
    { icon: "whatsapp" as const, label: dict.contactPage.whatsapp, href: whatsappLink(), external: true },
    { icon: "mail" as const, label: site.email, href: `mailto:${site.email}`, ltr: true },
    { icon: "pin" as const, label: tr(site.address, locale) },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.06] bg-linear-to-b from-transparent to-ink-950">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/60 to-transparent" />
      <div aria-hidden="true" className="absolute -top-40 start-1/2 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl rtl:translate-x-1/2" />

      <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <Logo href={localePath(locale)} name={tr(site.name, locale)} tagline={dict.hero.eyebrow} />
          <p className="max-w-sm text-sm leading-relaxed text-mist/60">{dict.footer.about}</p>
          <SocialLinks />
        </div>

        <nav aria-label={dict.footer.pages}>
          <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand-light rtl:tracking-normal">
            {dict.footer.pages}
          </h2>
          <ul className="grid gap-3 text-sm">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={localePath(locale, item.path)}
                  className="group inline-flex items-center gap-2 text-mist/65 transition-colors hover:text-white"
                >
                  <span className="h-px w-3 bg-brand/60 transition-all duration-500 group-hover:w-5 group-hover:bg-brand-light" />
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand-light rtl:tracking-normal">
            {dict.footer.contact}
          </h2>
          <ul className="grid gap-4 text-sm">
            {contactRows.map((row) => {
              const body = (
                <>
                  <span className="glass-chip h-9 w-9 shrink-0 rounded-xl">
                    <Icon name={row.icon} size={16} />
                  </span>
                  <span dir={row.ltr ? "ltr" : undefined} className="leading-snug">
                    {row.label}
                  </span>
                </>
              );
              return (
                <li key={row.icon}>
                  {row.href ? (
                    <a
                      href={row.href}
                      {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-center gap-3 text-mist/70 transition-colors hover:text-white"
                    >
                      {body}
                    </a>
                  ) : (
                    <p className="flex items-center gap-3 text-mist/70">{body}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand-light rtl:tracking-normal">
            {dict.footer.hours}
          </h2>
          <div className="glass glass-soft rounded-2xl p-5 text-sm">
            <p className="flex items-center gap-3 text-mist/80">
              <Icon name="clock" size={18} className="text-brand-light" />
              {tr(site.hours, locale)}
            </p>
          </div>
        </div>
      </div>

      <div className="container-lux flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-7 text-xs text-mist/45 sm:flex-row">
        <p>
          © {year} {tr(site.name, locale)}. {dict.footer.rights}
        </p>
        <p>{dict.footer.tagline}</p>
      </div>
    </footer>
  );
}
