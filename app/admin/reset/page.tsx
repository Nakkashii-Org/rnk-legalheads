import type { Metadata } from "next";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";
import Logo from "@/components/layout/Logo";
import { backendGet } from "@/lib/backend";

export const metadata: Metadata = { title: "Choose a new password" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Password reset link an Administrator sent: valid 1 hour, works once, needs the authenticator code. */
export default async function AdminResetPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" && /^[A-Za-z0-9_-]{20,100}$/.test(raw) ? raw : undefined;
  const info = token ? await backendGet<{ name: string; email: string; codeRequired: boolean }>(`/api/admin/reset?token=${encodeURIComponent(token)}`) : undefined;

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-warm px-4 py-12">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="border-l border-line pl-3 text-[12px] font-bold uppercase tracking-[0.14em] text-muted">CMS</span>
        </div>
        <div className="mt-6 border border-line bg-canvas px-6 py-8 md:px-8">
          <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
          {token && info?.ok ? (
            <>
              <h1 className="mt-5 font-serif text-[28px] leading-[36px]">Choose a new password</h1>
              <p className="mt-2 text-[14px] leading-[22px] text-muted">
                For <strong className="text-charcoal">{info.data.email}</strong>.
              </p>
              <div className="mt-6">
                <ResetPasswordForm token={token} email={info.data.email} codeRequired={info.data.codeRequired} />
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-5 font-serif text-[28px] leading-[36px]">This link can&apos;t be used</h1>
              <p className="mt-3 text-[15px] leading-[24px] text-muted">
                {info && !info.ok && info.status !== 410
                  ? "Password reset isn't available right now. Please try the link again in a minute."
                  : "It has expired (links last 1 hour) or has already been used. Ask your CMS Administrator to send a new one."}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
