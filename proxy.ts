import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n";
import { guardAdmin } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The CMS: refresh the Supabase session and require sign-in.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return guardAdmin(request);

  // Every public page lives under /ar or /en. Bare paths are redirected to the
  // visitor's last chosen language, falling back to Arabic (the default).
  const first = pathname.split("/")[1];
  if (isLocale(first)) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = saved && isLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
