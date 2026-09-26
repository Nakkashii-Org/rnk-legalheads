import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/layout/Logo";
import { getAdminUser } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  // Already signed in: go straight to the dashboard.
  if (await getAdminUser()) redirect("/admin");

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-warm px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="border-l border-line pl-3 text-[12px] font-bold uppercase tracking-[0.14em] text-muted">CMS</span>
        </div>
        <div className="mt-6 border border-line bg-canvas px-6 py-8 md:px-8">
          <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
          <h1 className="mt-5 font-serif text-[28px] leading-[36px]">Sign in</h1>
          <p className="mt-2 text-[14px] leading-[22px] text-muted">For authorised RNK Legalheads staff only.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
