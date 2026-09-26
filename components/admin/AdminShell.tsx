"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ToastProvider } from "./Toast";

type NavItem = { href: string; label: string; icon: IconName };

const groups: Array<{ label: string; items: NavItem[] }> = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "activity" }] },
  {
    label: "Pages",
    items: [
      { href: "/admin/pages/home", label: "Home", icon: "sparkle" },
      { href: "/admin/pages/about", label: "About", icon: "user" },
      { href: "/admin/pages/services", label: "Services page", icon: "clipboard" },
      { href: "/admin/pages/videos", label: "Videos page", icon: "play" },
      { href: "/admin/pages/articles", label: "Articles page", icon: "book" },
      { href: "/admin/pages/contact", label: "Contact page", icon: "mail" },
      { href: "/admin/pages/global", label: "Global CTA & Footer", icon: "globe" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/services", label: "Services", icon: "bone" },
      { href: "/admin/treatments", label: "Treatments", icon: "drop" },
      { href: "/admin/technologies", label: "Technologies", icon: "scan" },
      { href: "/admin/specialties", label: "Specialties", icon: "target" },
      { href: "/admin/timeline", label: "Career Journey", icon: "calendar" },
      { href: "/admin/achievements", label: "Achievements", icon: "award" },
      { href: "/admin/certificates", label: "Certificates", icon: "shield" },
      { href: "/admin/videos", label: "Videos", icon: "play" },
      { href: "/admin/articles", label: "Articles", icon: "book" },
      { href: "/admin/reviews", label: "Reviews", icon: "star" },
      { href: "/admin/faqs", label: "FAQs", icon: "quote" },
      { href: "/admin/stats", label: "Statistics", icon: "activity" },
      { href: "/admin/journey", label: "Patient Journey", icon: "stethoscope" },
      { href: "/admin/reasons", label: "Why Dr. Ahmed", icon: "heart" },
    ],
  },
  { label: "Library", items: [{ href: "/admin/media", label: "Media Library", icon: "scan" }] },
  {
    label: "Settings",
    items: [
      { href: "/admin/social", label: "Social Media", icon: "instagram" },
      { href: "/admin/contact-info", label: "Contact Information", icon: "phone" },
      { href: "/admin/navigation", label: "Navigation", icon: "menu" },
      { href: "/admin/seo", label: "SEO", icon: "globe" },
      { href: "/admin/settings", label: "Site Settings", icon: "clipboard" },
    ],
  },
];

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="CMS" className="flex flex-col gap-5 px-3 pb-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#7d9292]">{group.label}</p>
          <ul className="grid gap-0.5">
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.86rem] font-medium transition-colors ${
                      active ? "bg-brand-soft text-brand-dark" : "text-[#3a5454] hover:bg-[#eef3f3] hover:text-[#0f2424]"
                    }`}
                  >
                    <Icon name={item.icon} size={16} className={active ? "text-brand" : "text-[#8aa0a0]"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-6 py-5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand to-brand-dark text-sm font-bold text-white">A</span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-[#0f2424]">Dr. Ahmed Soliman</span>
        <span className="block text-xs text-[#6b8080]">Content manager</span>
      </span>
    </Link>
  );

  return (
    <ToastProvider>
      <div className="lg:grid lg:grid-cols-[16.5rem_1fr]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh overflow-y-auto border-e border-[#e3ebea] bg-white lg:block">
          {brand}
          <Sidebar pathname={pathname} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 animate-[adm-fade_0.2s] bg-black/30" />
            <aside className="absolute inset-y-0 start-0 w-72 max-w-[85vw] animate-[adm-slide-in_0.2s] overflow-y-auto bg-white shadow-xl">
              {brand}
              <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <div className="min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[#e3ebea] bg-white/90 px-4 backdrop-blur sm:px-6">
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="adm-btn adm-btn-ghost adm-btn-icon lg:hidden">
              <Icon name="menu" size={18} />
            </button>
            <span className="truncate text-sm text-[#6b8080]">{email}</span>
            <div className="ms-auto flex items-center gap-2">
              <a href="/ar" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary">
                <Icon name="globe" size={15} />
                <span className="hidden sm:inline">View site</span>
              </a>
              <form action={signOut}>
                <button type="submit" className="adm-btn adm-btn-ghost">
                  Sign out
                </button>
              </form>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
