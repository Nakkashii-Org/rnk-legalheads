import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/layout/Logo";
import DraftNote from "@/components/ui/DraftNote";
import { previewState } from "@/lib/token-pages";
import { showDrafts } from "@/lib/visibility";

export const metadata: Metadata = { title: "Sign in" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const preview = previewState(await searchParams, ["mfa"]);

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
            <LoginForm initialStep={preview === "mfa" ? "mfa" : "credentials"} />
          </div>
        </div>

        {showDrafts && (
          <div className="mt-6 space-y-3">
            <DraftNote className="bg-canvas">
              Review mode: sign-in needs the backend, which is not built yet. The CMS screens can be reviewed without
              signing in. Nothing in them is saved.
            </DraftNote>
            <p className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              <Link href="/admin" className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">
                Open the CMS preview
              </Link>
              <Link href={preview === "mfa" ? "/admin/login" : "/admin/login?preview=mfa"} className="inline-flex min-h-11 items-center underline underline-offset-4">
                {preview === "mfa" ? "Show the password step" : "Show the code step"}
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
