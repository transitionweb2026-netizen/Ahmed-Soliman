import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(60rem_40rem_at_80%_-10%,#dff0ef,transparent),radial-gradient(40rem_30rem_at_0%_110%,#e6f4f3,transparent)] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-brand to-brand-dark text-lg font-bold text-white shadow-lg shadow-brand/30">
            A
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#0f2424]">Dr. Ahmed Soliman</h1>
            <p className="text-sm text-[#5c7373]">Website content manager</p>
          </div>
        </div>
        <div className="adm-card p-6">
          {isSupabaseConfigured ? (
            <LoginForm next={typeof next === "string" ? next : ""} />
          ) : (
            <p className="text-sm text-red-700">
              Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the environment.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
