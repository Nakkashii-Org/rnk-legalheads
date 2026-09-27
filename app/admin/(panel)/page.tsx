import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { contentTypes } from "@/lib/admin/config";
import { loadDashboard } from "@/lib/admin/records";

export const metadata: Metadata = { title: "Dashboard" };

const createActions = [
  { label: "New article", href: "/admin/articles/new" },
  { label: "New judgment note", href: "/admin/judgments/new" },
  { label: "New legal update", href: "/admin/legal-updates/new" },
  { label: "New newsletter issue", href: "/admin/newsletters/new" },
];

/** A02: every number comes from the database; nothing is a hardcoded sample (guide p.141). */
export default async function DashboardPage() {
  const result = await loadDashboard();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Dashboard"
        description="Create publications, follow them through review and publish them to the website. Publishing never sends a newsletter email."
      />

      <section aria-labelledby="create-title">
        <h2 id="create-title" className="text-[16px] font-bold">
          Create
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {createActions.map((action) => (
            <li key={action.href}>
              <Link href={action.href} className="flex min-h-14 items-center justify-between border border-charcoal bg-canvas px-4 text-[14px] font-bold hover:bg-warm">
                {action.label}
                <span aria-hidden="true" className="text-[20px] leading-none">
                  +
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {!result.ok ? (
        <EmptyState title="The dashboard can't be loaded right now">Please refresh the page in a minute.</EmptyState>
      ) : (
        <>
          <section aria-labelledby="status-title">
            <h2 id="status-title" className="text-[16px] font-bold">
              Content status
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {[
                { label: "Drafts", value: result.data.counts.draft, href: "/admin/articles?status=draft" },
                { label: "In review", value: result.data.counts.in_review, href: "/admin/review" },
                { label: "Changes requested", value: result.data.counts.changes_requested, href: "/admin/review?tab=changes" },
                { label: "Ready to publish", value: result.data.counts.approved, href: "/admin/review?tab=approved" },
                { label: "Published", value: result.data.counts.published, href: "/admin/services?status=published" },
              ].map((stat) => (
                <li key={stat.label}>
                  <Link href={stat.href} className="block border border-line bg-warm px-4 py-4 hover:border-charcoal">
                    <span className="block font-serif text-[32px] leading-[40px] tabular-nums">{stat.value}</span>
                    <span className="text-[13px] text-muted">{stat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[12px] text-muted">Counted by status across all {result.data.total} records in the database.</p>
          </section>

          <section aria-labelledby="requests-title" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="requests-title" className="text-[16px] font-bold">
                Review requests
              </h2>
              <Link href="/admin/review" className="inline-flex min-h-11 items-center text-[13px] underline underline-offset-4 md:min-h-0">
                Open the review queue
              </Link>
            </div>
            {result.data.reviewRequests.length === 0 ? (
              <EmptyState title="Nothing is waiting for review">Records appear here when someone clicks Send for review, or when a reviewer asks for changes.</EmptyState>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
                  <caption className="sr-only">Records waiting for review or for changes, newest first</caption>
                  <thead>
                    <tr className="border-b border-charcoal">
                      {["Title", "Type", "Status", "Last updated", ""].map((h, i) => (
                        <th key={i} scope="col" className="py-2 pr-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.reviewRequests.map((r) => (
                      <tr key={`${r.type}-${r.id}`} className="border-b border-line align-middle">
                        <td className="py-2 pr-4 font-bold">{r.title}</td>
                        <td className="py-2 pr-4">{contentTypes.find((t) => t.key === r.type)!.singular}</td>
                        <td className="py-2 pr-4">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="whitespace-nowrap py-2 pr-4 text-muted tabular-nums">
                          {r.updatedAt
                            ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(r.updatedAt))
                            : "—"}
                        </td>
                        <td className="py-2 text-right">
                          <Link
                            href={r.status === "in_review" ? `/admin/review/${r.type}/${r.id}` : `/admin/${r.type}/${r.id}`}
                            className="inline-flex min-h-11 items-center whitespace-nowrap underline underline-offset-4 md:min-h-0"
                          >
                            {r.status === "in_review" ? "Review" : "Open"}
                            <span className="sr-only"> {r.title}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
            <section aria-labelledby="drafts-title">
              <h2 id="drafts-title" className="text-[16px] font-bold">
                Publication drafts
              </h2>
              {result.data.recentDrafts.length === 0 ? (
                <div className="mt-3">
                  <EmptyState title="No publication drafts" />
                </div>
              ) : (
                <ul className="mt-3 border-t border-line">
                  {result.data.recentDrafts.map((r) => (
                    <li key={`${r.type}-${r.id}`} className="border-b border-line">
                      <Link href={`/admin/${r.type}/${r.id}`} className="flex min-h-14 items-center justify-between gap-4 py-2 hover:bg-warm">
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-bold">{r.title}</span>
                          <span className="block text-[12px] text-muted">
                            {contentTypes.find((t) => t.key === r.type)!.singular}
                            {r.layoutPreview && " · Layout preview"}
                          </span>
                        </span>
                        <StatusBadge status={r.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="inbox-title">
              <h2 id="inbox-title" className="text-[16px] font-bold">
                Inbox
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "New enquiries", href: "/admin/enquiries", value: result.data.inbox?.enquiries },
                  { label: "New job applications", href: "/admin/applications", value: result.data.inbox?.applications },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block border border-line px-4 py-4 hover:border-charcoal">
                      <span className={`block font-serif text-[32px] leading-[40px] tabular-nums ${item.value === undefined ? "text-muted" : ""}`}>{item.value ?? "–"}</span>
                      <span className="text-[13px] text-muted">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12px] text-muted">
                {result.data.inbox
                  ? "New enquiries and applications received through the website. The inbox screens arrive in phase E."
                  : "Enquiries and applications are visible to Publishers and Administrators."}
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
