import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { contentTypes, type WorkflowStatus } from "@/lib/admin/config";
import { listRecords } from "@/lib/admin/records";
import { getContent } from "@/lib/content/source";

export const metadata: Metadata = { title: "Review queue" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const tabs: { key: string; label: string; status: WorkflowStatus; empty: string }[] = [
  { key: "waiting", label: "Waiting for review", status: "in_review", empty: "Nothing is waiting for review." },
  { key: "approved", label: "Ready to publish", status: "approved", empty: "No approved revisions are waiting to be published." },
  { key: "changes", label: "Changes requested", status: "changes_requested", empty: "No records are waiting for changes." },
];

/** A04: reviewers approve an exact revision; publishers release approved revisions. */
export default async function ReviewQueuePage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).tab;
  const current = tabs.find((t) => t.key === (Array.isArray(raw) ? raw[0] : raw)) ?? tabs[0];
  const content = await getContent();
  const records = contentTypes.flatMap((t) => listRecords(content, t.key));
  const rows = records.filter((r) => r.status === current.status);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Review queue" }]}
        title="Review queue"
        description="Legal reviewers check each record against its sources and the checklist, then approve that exact revision or request changes. Publishers release approved revisions."
      />

      <nav aria-label="Review queue sections" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex gap-6 whitespace-nowrap border-b border-line">
          {tabs.map((tab) => {
            const active = tab === current;
            const count = records.filter((r) => r.status === tab.status).length;
            return (
              <li key={tab.key}>
                <Link
                  href={tab.key === "waiting" ? "/admin/review" : `/admin/review?tab=${tab.key}`}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-12 items-center gap-2 text-[14px] font-bold ${
                    active ? "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rnk" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {tab.label}
                  <span className="bg-warm px-1.5 text-[12px] tabular-nums">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {rows.length === 0 ? (
        <EmptyState title={current.empty}>
          Records appear here when an author selects <strong>Send for review</strong> in the editor. To see the reviewer
          screen now, open any record and choose <strong>Open the reviewer view</strong>.
        </EmptyState>
      ) : (
        <ul className="border-t border-line">
          {rows.map((r) => (
            <li key={`${r.type}-${r.id}`} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3">
              <Link href={`/admin/review/${r.type}/${r.id}`} className="font-bold underline-offset-4 hover:underline">
                {r.title}
              </Link>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
