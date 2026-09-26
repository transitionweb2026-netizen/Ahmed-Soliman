import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

const LOGIN_PATH = "/admin/login";

/**
 * Runs for every /admin request: refreshes the Supabase session cookie and
 * sends signed-out visitors to the login page. (Admin rights are checked
 * again on the server in the admin layout and in every Server Action.)
 */
export async function guardAdmin(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === LOGIN_PATH;
  if (!isSupabaseConfigured) return isLogin ? NextResponse.next() : redirect(request, LOGIN_PATH);

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  // getUser() validates the token with Supabase Auth (getSession() would trust the cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) return redirect(request, LOGIN_PATH, `${pathname}${search}`);
  if (user && isLogin) return redirect(request, "/admin");
  return response;
}

function redirect(request: NextRequest, path: string, next?: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = next && next !== "/admin" ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(url);
}
