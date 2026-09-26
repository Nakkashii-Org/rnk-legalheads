import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { adminGet } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Audit log" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type AuditRow = { id: string; at: string; action: string; actor?: string; target?: string; detail?: string };

const LABELS: Record<string, string> = {
  "auth.signed_in": "Signed in",
  "auth.mfa_enrolled_and_signed_in": "Set up a new authenticator and signed in",
  "auth.signed_out": "Signed out",
  "auth.signed_out_everywhere": "Signed out on all devices",
  "auth.login_failed": "Failed sign-in",
  "auth.mfa_failed": "Wrong 6-digit code",
  "auth.account_locked": "Account locked",
  "auth.login_blocked_locked": "Sign-in blocked (account locked)",
  "user.invited": "Invited a user",
  "user.invite_resent": "Resent an invitation",
  "user.setup_completed": "Finished account setup",
  "user.updated": "Changed a user",
  "user.disabled": "Disabled a user",
  "user.mfa_reset": "Reset 2-step verification",
  "user.admin_created_by_command": "Administrator created (setup command)",
  "user.password_reset_sent": "Sent a password reset link",
  "auth.password_reset_completed": "Changed password (reset link)",
  "auth.password_reset_code_failed": "Wrong code on password reset",
};

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(iso));

/** B5: who did what, and when. Newest first, 50 per page. Administrators only. */
export default async function AuditPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).page;
  const page = Math.max(1, Number.parseInt(Array.isArray(raw) ? raw[0]! : (raw ?? "1"), 10) || 1);
  const result = await adminGet<{ events: AuditRow[]; total: number; page: number; pageCount: number }>(`/audit?page=${page}`);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Audit log" }]}
        title="Audit log"
        description="A permanent record of sign-ins and account changes, and later of saves, approvals and publishing: who, what and when (guide p.152). It never stores passwords, codes, enquiry text or resumes."
      />

      {!result.ok ? (
        <EmptyState title={result.status === 403 ? "Administrators only" : "The audit log can't be loaded right now"} />
      ) : result.data.events.length === 0 ? (
        <EmptyState title="No events recorded yet" />
      ) : (
        <>
          <p className="text-[12px] uppercase tracking-[0.12em] text-muted">
            {result.data.total} events · page {result.data.page} of {result.data.pageCount}
          </p>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
              <caption className="sr-only">Audit events, newest first</caption>
              <thead>
                <tr className="border-b border-charcoal">
                  {["Time", "Who", "What", "Affected", "Detail"].map((h) => (
                    <th key={h} scope="col" className="py-2 pr-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.events.map((e) => (
                  <tr key={e.id} className="border-b border-line align-top">
                    <td className="whitespace-nowrap py-2 pr-4 tabular-nums">{when(e.at)}</td>
                    <td className="break-all py-2 pr-4">{e.actor ?? "—"}</td>
                    <td className={`py-2 pr-4 ${/failed|locked|blocked/.test(e.action) ? "text-action" : ""}`}>{LABELS[e.action] ?? e.action}</td>
                    <td className="break-all py-2 pr-4">{e.target ?? "—"}</td>
                    <td className="py-2 pr-4 text-muted">{e.detail ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Audit log pages" className="flex gap-6 text-[14px]">
            {result.data.page > 1 && (
              <Link href={`/admin/audit?page=${result.data.page - 1}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
                Newer events
              </Link>
            )}
            {result.data.page < result.data.pageCount && (
              <Link href={`/admin/audit?page=${result.data.page + 1}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
                Older events
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
