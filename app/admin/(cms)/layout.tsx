import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/cms/admin";
import { signOut } from "../actions";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Every CMS page. The proxy already sends signed-out visitors to the login
 * page; this re-checks on the server and also requires an admins row.
 */
export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();
  if (!ctx.user) redirect("/admin/login");

  if (!ctx.isAdmin) {
    return (
      <main className="grid min-h-dvh place-items-center p-4">
        <div className="adm-card max-w-sm p-6 text-center">
          <h1 className="text-lg font-bold">No CMS access</h1>
          <p className="mt-2 text-sm text-[#5c7373]">{ctx.user.email} is signed in but is not a CMS admin.</p>
          <form action={signOut} className="mt-5">
            <button type="submit" className="adm-btn adm-btn-primary">
              Sign out
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <AdminShell email={ctx.user.email ?? ""}>{children}</AdminShell>;
}
