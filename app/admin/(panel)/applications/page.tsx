import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import InboxPager from "@/components/admin/InboxPager";
import { formatWhen, inboxLabels, listInbox, STATUSES, statusLabel, type ApplicationRow } from "@/lib/admin/inbox";
import { canUseInbox, getAdminUser } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Job applications" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const field = "mt-1 block h-11 max-w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

export default async function ApplicationsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const params = { position: first(sp.position), status: first(sp.status), q: first(sp.q), page: first(sp.page) };
  const header = (
    <AdminPageHeader
      crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Applications" }]}
      title="Job applications"
      description="Applications from the careers pages. Resumes are stored privately and download only after you sign in; every download is recorded. Publishers and Administrators only."
    />
  );
  if (!canUseInbox(await getAdminUser()))
    return (
      <div className="space-y-6">
        {header}
        <EmptyState title="Publishers and Administrators only">Applications contain personal details and resumes, so only these roles can see them.</EmptyState>
      </div>
    );

  const [result, labels] = await Promise.all([listInbox<ApplicationRow>("applications", params), inboxLabels()]);
  const positions = result.ok ? (result.data.positions ?? []) : [];

  return (
    <div className="space-y-6">
      {header}
      <form action="/admin/applications" className="flex flex-wrap items-end gap-3" aria-label="Filter applications">
        <div className="min-w-0">
          <label htmlFor="app-position" className="text-[13px] font-bold">
            Position
          </label>
          <select id="app-position" name="position" className={field} defaultValue={params.position}>
            <option value="">All positions</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {labels.position(p)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="app-status" className="text-[13px] font-bold">
            Status
          </label>
          <select id="app-status" name="status" className={field} defaultValue={params.status}>
            <option value="">All</option>
            {STATUSES.applications.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
                {result.ok ? ` (${result.data.counts[s.value] ?? 0})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="app-q" className="text-[13px] font-bold">
            Search
          </label>
          <input id="app-q" name="q" type="search" defaultValue={params.q} placeholder="Name, email, city or reference" className={`${field} w-[240px]`} />
        </div>
        <button type="submit" className="btn btn-secondary h-11">
          Filter
        </button>
      </form>

      {!result.ok ? (
        <EmptyState title="Applications could not be loaded">Please refresh the page. If it keeps happening, the backend may be asleep or down.</EmptyState>
      ) : result.data.items.length === 0 ? (
        <EmptyState title="No applications to show">
          {params.status || params.q || params.position ? "Nothing matches these filters." : "Applications from the careers pages appear here."}
        </EmptyState>
      ) : (
        <>
          <p role="status" className="text-[13px] text-muted">
            Showing {result.data.items.length} of {result.data.total}
          </p>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
              <caption className="sr-only">Job applications, newest first</caption>
              <thead>
                <tr className="border-b border-charcoal text-[11px] uppercase tracking-[0.12em] text-muted">
                  {["Reference", "Received", "Name", "Position", "Experience", "Status"].map((c) => (
                    <th key={c} scope="col" className="py-2 pr-4 font-bold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.items.map((a) => (
                  <tr key={a.reference} className={`border-b border-line ${a.status === "new" ? "font-bold" : ""}`}>
                    <td className="py-3 pr-4">
                      <Link href={`/admin/applications/${a.reference}`} className="underline underline-offset-4">
                        {a.reference}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-normal text-muted">{formatWhen(a.receivedAt)}</td>
                    <td className="py-3 pr-4">{a.name}</td>
                    <td className="py-3 pr-4 font-normal">{labels.position(a.position)}</td>
                    <td className="py-3 pr-4 font-normal">{labels.experience(a.experience)}</td>
                    <td className="py-3 pr-4">{statusLabel("applications", a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <InboxPager base="/admin/applications" params={params} page={result.data.page} pageSize={result.data.pageSize} total={result.data.total} />
        </>
      )}
    </div>
  );
}
