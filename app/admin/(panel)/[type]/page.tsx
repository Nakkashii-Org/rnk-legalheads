import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import Arrow from "@/components/ui/Arrow";
import { getContentType, WORKFLOW_STATUSES, type WorkflowStatus } from "@/lib/admin/config";
import { listRecords } from "@/lib/admin/records";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ type: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: getContentType((await params).type)?.plural ?? "Not found" };
}

export default async function ContentListPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const config = getContentType((await params).type);
  if (!config) notFound();

  const sp = await searchParams;
  const query = first(sp.q).trim().slice(0, 100);
  const statusParam = first(sp.status);
  const status = WORKFLOW_STATUSES.some((s) => s.value === statusParam) ? (statusParam as WorkflowStatus) : undefined;

  const all = listRecords(await getContent(), config.key);
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = all.filter(
    (r) => (!status || r.status === status) && words.every((w) => `${r.title} ${r.id} ${r.detail ?? ""}`.toLowerCase().includes(w)),
  );

  const selectClass = "h-11 min-w-0 border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: config.plural }]}
        title={config.plural}
        description={`${all.length} ${all.length === 1 ? "record" : "records"}. Open a record to edit it, preview it or send it for review.`}
        actions={
          <Link href={`/admin/${config.key}/new`} className="btn btn-primary">
            New {config.singular.toLowerCase()} <span aria-hidden="true">+</span>
          </Link>
        }
      />

      <Form action={`/admin/${config.key}`} role="search" aria-label={`Filter ${config.plural.toLowerCase()}`} className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 basis-[220px]">
          <label htmlFor="list-q" className="text-[13px] font-bold">
            Search
          </label>
          <input
            id="list-q"
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Title or slug"
            className="mt-1 h-11 w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal"
          />
        </div>
        <div>
          <label htmlFor="list-status" className="text-[13px] font-bold">
            Status
          </label>
          <select id="list-status" name="status" defaultValue={status ?? ""} className={`${selectClass} mt-1 block`}>
            <option value="">All statuses</option>
            {WORKFLOW_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-secondary h-11">
          Filter
        </button>
        <Link href={`/admin/${config.key}`} className="inline-flex min-h-11 items-center text-[13px] underline underline-offset-4">
          Clear
        </Link>
      </Form>

      <p role="status" className="text-[12px] uppercase tracking-[0.12em] text-muted">
        Showing {rows.length} of {all.length}
      </p>

      {all.length === 0 ? (
        <EmptyState title={`No ${config.plural.toLowerCase()} yet`}>
          Create the first {config.singular.toLowerCase()} with the button above.
        </EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState title="Nothing matches these filters">Try a different search or clear the filters.</EmptyState>
      ) : (
        <ul className="border-t border-line">
          <li aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_150px_170px_120px] gap-4 border-b border-line py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted md:grid">
            <span>Title</span>
            <span>Status</span>
            <span>Details</span>
            <span className="text-right">Website</span>
          </li>
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-1 gap-2 border-b border-line py-3 md:grid-cols-[minmax(0,1fr)_150px_170px_120px] md:items-center md:gap-4">
              <div className="min-w-0">
                <Link href={`/admin/${config.key}/${r.id}`} className="text-[15px] font-bold underline-offset-4 hover:text-action hover:underline">
                  {r.title}
                </Link>
                <span className="block truncate text-[12px] text-muted">
                  /{r.id}
                  {r.layoutPreview && " · Layout preview"}
                </span>
              </div>
              <div>
                <StatusBadge status={r.status} />
              </div>
              <div className="text-[13px] text-muted">{r.author ? `${r.author} · ${r.detail}` : r.detail}</div>
              <div className="md:text-right">
                <Link href={r.publicHref} target="_blank" className="inline-flex min-h-11 items-center gap-1.5 text-[13px] underline underline-offset-4 md:min-h-0">
                  View <Arrow />
                  <span className="sr-only"> {r.title} on the website (opens in a new tab)</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
