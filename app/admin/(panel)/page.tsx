import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { contentTypes } from "@/lib/admin/config";
import { listRecords } from "@/lib/admin/records";

export const metadata: Metadata = { title: "Dashboard" };

const createActions = [
  { label: "New article", href: "/admin/articles/new" },
  { label: "New judgment note", href: "/admin/judgments/new" },
  { label: "New legal update", href: "/admin/legal-updates/new" },
  { label: "New newsletter issue", href: "/admin/newsletters/new" },
];

/** A02: every number comes from real records; nothing is a hardcoded sample (guide p.141). */
export default function DashboardPage() {
  const records = contentTypes.flatMap((t) => listRecords(t.key));
  const count = (status: string) => records.filter((r) => r.status === status).length;
  const drafts = records.filter((r) => r.status === "draft");
  const recentDrafts = drafts.filter((r) => ["articles", "judgments", "legal-updates", "newsletters"].includes(r.type)).slice(0, 6);

  const stats = [
    { label: "Drafts", value: count("draft"), href: "/admin/articles?status=draft" },
    { label: "In review", value: count("in_review"), href: "/admin/review" },
    { label: "Ready to publish", value: count("approved"), href: "/admin/review?tab=approved" },
    { label: "Published", value: count("published"), href: "/admin/services?status=published" },
  ];

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

      <section aria-labelledby="status-title">
        <h2 id="status-title" className="text-[16px] font-bold">
          Content status
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label}>
              <Link href={stat.href} className="block border border-line bg-warm px-4 py-4 hover:border-charcoal">
                <span className="block font-serif text-[32px] leading-[40px] tabular-nums">{stat.value}</span>
                <span className="text-[13px] text-muted">{stat.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-muted">Counted across all {records.length} records in the site&apos;s draft content files.</p>
      </section>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <section aria-labelledby="drafts-title">
          <h2 id="drafts-title" className="text-[16px] font-bold">
            Publication drafts
          </h2>
          {recentDrafts.length === 0 ? (
            <div className="mt-3">
              <EmptyState title="No publication drafts" />
            </div>
          ) : (
            <ul className="mt-3 border-t border-line">
              {recentDrafts.map((r) => (
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
              { label: "New enquiries", href: "/admin/enquiries" },
              { label: "New job applications", href: "/admin/applications" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block border border-line px-4 py-4 hover:border-charcoal">
                  <span className="block font-serif text-[32px] leading-[40px] text-muted">–</span>
                  <span className="text-[13px] text-muted">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-muted">Counts appear once the contact and careers forms are connected to the backend.</p>
        </section>
      </div>
    </div>
  );
}
