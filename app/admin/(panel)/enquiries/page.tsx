import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import InboxPager from "@/components/admin/InboxPager";
import { formatWhen, inboxLabels, listInbox, STATUSES, statusLabel, type EnquiryRow } from "@/lib/admin/inbox";
import { canUseInbox, getAdminUser } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Enquiries" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const field = "mt-1 block h-11 border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

export default async function EnquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const params = { status: first(sp.status), q: first(sp.q), page: first(sp.page) };
  const header = (
    <AdminPageHeader
      crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Enquiries" }]}
      title="Enquiries"
      description="Messages sent from the website contact form. Each one is also emailed to the firm's enquiry inbox. Publishers and Administrators only."
    />
  );
  if (!canUseInbox(await getAdminUser()))
    return (
      <div className="space-y-6">
        {header}
        <EmptyState title="Publishers and Administrators only">Enquiries contain personal details, so only these roles can see them.</EmptyState>
      </div>
    );

  const [result, labels] = await Promise.all([listInbox<EnquiryRow>("enquiries", params), inboxLabels()]);

  return (
    <div className="space-y-6">
      {header}
      <form action="/admin/enquiries" className="flex flex-wrap items-end gap-3" aria-label="Filter enquiries">
        <div>
          <label htmlFor="enq-status" className="text-[13px] font-bold">
            Status
          </label>
          <select id="enq-status" name="status" className={field} defaultValue={params.status}>
            <option value="">All</option>
            {STATUSES.enquiries.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
                {result.ok ? ` (${result.data.counts[s.value] ?? 0})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="enq-q" className="text-[13px] font-bold">
            Search
          </label>
          <input id="enq-q" name="q" type="search" defaultValue={params.q} placeholder="Name, email or reference" className={`${field} w-[240px] max-w-full`} />
        </div>
        <button type="submit" className="btn btn-secondary h-11">
          Filter
        </button>
      </form>

      {!result.ok ? (
        <EmptyState title="Enquiries could not be loaded">Please refresh the page. If it keeps happening, the backend may be asleep or down.</EmptyState>
      ) : result.data.items.length === 0 ? (
        <EmptyState title="No enquiries to show">{params.status || params.q ? "Nothing matches these filters." : "Messages from the contact form appear here."}</EmptyState>
      ) : (
        <>
          <p role="status" className="text-[13px] text-muted">
            Showing {result.data.items.length} of {result.data.total}
          </p>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <caption className="sr-only">Contact enquiries, newest first</caption>
              <thead>
                <tr className="border-b border-charcoal text-[11px] uppercase tracking-[0.12em] text-muted">
                  {["Reference", "Received", "Name", "Service", "Status"].map((c) => (
                    <th key={c} scope="col" className="py-2 pr-4 font-bold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.items.map((e) => (
                  <tr key={e.reference} className={`border-b border-line ${e.status === "new" ? "font-bold" : ""}`}>
                    <td className="py-3 pr-4">
                      <Link href={`/admin/enquiries/${e.reference}`} className="underline underline-offset-4">
                        {e.reference}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-normal text-muted">{formatWhen(e.receivedAt)}</td>
                    <td className="py-3 pr-4">{e.name}</td>
                    <td className="py-3 pr-4 font-normal">{labels.service(e.service)}</td>
                    <td className="py-3 pr-4">{statusLabel("enquiries", e.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <InboxPager base="/admin/enquiries" params={params} page={result.data.page} pageSize={result.data.pageSize} total={result.data.total} />
        </>
      )}
    </div>
  );
}
