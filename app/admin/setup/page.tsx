import type { Metadata } from "next";
import SetupForm from "@/components/admin/SetupForm";
import Logo from "@/components/layout/Logo";
import { backendGet } from "@/lib/backend";

export const metadata: Metadata = { title: "Set up your account" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Invitation link from the CMS (B1/B4): choose a password and connect an authenticator app. */
export default async function AdminSetupPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" && /^[A-Za-z0-9_-]{20,100}$/.test(raw) ? raw : undefined;
  const invite = token ? await backendGet<{ name: string; email: string }>(`/api/admin/setup?token=${encodeURIComponent(token)}`) : undefined;

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-warm px-4 py-12">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="border-l border-line pl-3 text-[12px] font-bold uppercase tracking-[0.14em] text-muted">CMS</span>
        </div>
        <div className="mt-6 border border-line bg-canvas px-6 py-8 md:px-8">
          <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
          {token && invite?.ok ? (
            <>
              <h1 className="mt-5 font-serif text-[28px] leading-[36px]">Set up your account</h1>
              <p className="mt-2 text-[14px] leading-[22px] text-muted">
                Welcome, {invite.data.name}. You&apos;ll sign in as <strong className="text-charcoal">{invite.data.email}</strong>.
              </p>
              <div className="mt-6">
                <SetupForm token={token} email={invite.data.email} />
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-5 font-serif text-[28px] leading-[36px]">This link can&apos;t be used</h1>
              <p className="mt-3 text-[15px] leading-[24px] text-muted">
                {invite && !invite.ok && invite.status !== 410
                  ? "Account setup isn't available right now. Please try the link again in a minute."
                  : "It has expired (links last 72 hours) or has already been used. Ask your CMS Administrator to send a new invitation."}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
