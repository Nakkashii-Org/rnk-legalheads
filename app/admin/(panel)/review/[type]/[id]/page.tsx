import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ReviewPanel from "@/components/admin/ReviewPanel";
import StatusBadge from "@/components/admin/StatusBadge";
import Arrow from "@/components/ui/Arrow";
import { getContentType, type Field, type FieldValue, type SourceLink, type WorkArea } from "@/lib/admin/config";
import { thumb } from "@/lib/admin/media";
import { previewHref } from "@/lib/admin/preview";
import ReviewHistory from "@/components/admin/ReviewHistory";
import { editorOptions, getHistory, getRecord } from "@/lib/admin/records";
import { getAdminUser } from "@/lib/admin/session";

type Params = Promise<{ type: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type, id } = await params;
  const config = getContentType(type);
  const found = config && (await getRecord(config.key, id));
  return { title: found ? `Review: ${found.record.title}` : "Not found" };
}

const plain = (html: string) =>
  html
    .replace(/<li[^>]*>/g, "• ")
    .replace(/<\/(p|h2|h3|li)>/g, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();

export default async function ReviewRecordPage({ params }: { params: Params }) {
  const { type, id } = await params;
  const config = getContentType(type);
  const found = config && (await getRecord(config.key, id));
  if (!config || !found) notFound();

  const [options, history, user] = await Promise.all([editorOptions(), getHistory(config.key, found.record.id), getAdminUser()]);
  const latest = history.revisions[0];
  const labelFor = (field: Field, value: string) =>
    field.kind === "services" || field.kind === "people" || field.kind === "publications"
      ? (options[field.kind].find((o) => o.value === value)?.label ?? value)
      : field.kind === "select"
        ? (field.options.find((o) => o.value === value)?.label ?? value)
        : value;

  const render = (field: Field, value: FieldValue): React.ReactNode => {
    if (field.kind === "checkbox") return value ? "Yes" : "No";
    if (field.kind === "richtext") return <span className="whitespace-pre-line">{plain(value as string) || "—"}</span>;
    if (field.kind === "sources")
      return (value as SourceLink[]).filter((s) => s.label || s.url).length ? (
        <ul className="list-disc pl-5">
          {(value as SourceLink[])
            .filter((s) => s.label || s.url)
            .map((s, i) => (
              <li key={i}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    {s.label || s.url}
                  </a>
                ) : (
                  <>
                    {s.label} <span className="text-action">(no link)</span>
                  </>
                )}
              </li>
            ))}
        </ul>
      ) : (
        <span className="text-action">No sources added</span>
      );
    if (field.kind === "workAreas")
      return (
        <ul className="list-disc pl-5">
          {(value as WorkArea[]).map((w, i) => (
            <li key={i}>
              <strong>{w.title || "—"}</strong> {w.text}
            </li>
          ))}
        </ul>
      );
    if (field.kind === "image") {
      const media = options.media.find((m) => m.value === value);
      if (!value) return "No image";
      if (!media) return <span className="text-action">The chosen image is no longer in the media library</span>;
      return (
        <span className="flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS thumbnail */}
          <img src={thumb(media.url)} alt="" className="h-16 w-24 bg-warm object-cover" />
          <span>
            {media.label}
            <span className="block text-[13px] text-muted">{media.decorative ? "Decorative (no alt text)" : `Alt text: ${media.alt}`}</span>
          </span>
        </span>
      );
    }
    if (Array.isArray(value))
      return (value as string[]).length ? (value as string[]).map((v) => labelFor(field, v)).join(", ") : "—";
    return (value as string) ? labelFor(field, value as string) : "—";
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Review queue", href: "/admin/review" }, { label: found.record.title }]}
        title={`Review: ${found.record.title}`}
        description={
          <>
            {config.singular} ·{" "}
            {latest
              ? `Revision ${latest.number}, saved by ${latest.savedBy}.`
              : "Revision: imported from the site's content files (not yet saved in the CMS)."}
          </>
        }
        actions={
          <>
            <a href={previewHref(found.record.publicHref)} target="_blank" rel="noopener" className="btn btn-secondary">
              Full preview <Arrow />
              <span className="sr-only"> (staff-only preview, opens in a new tab)</span>
            </a>
            <Link href={`/admin/${config.key}/${found.record.id}`} className="btn btn-secondary">
              Open in editor
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="package-title" className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="package-title" className="font-serif text-[22px] leading-[30px]">
              Review package
            </h2>
            <StatusBadge status={found.record.status} />
          </div>
          {config.sections.map((section) => (
            <div key={section.title} className="mt-6">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">{section.title}</h3>
              <dl className="mt-2 border-t border-line">
                {section.fields.map((field) => (
                  <div key={field.name} className="grid gap-1 border-b border-line py-3 text-[14px] leading-[22px] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
                    <dt className="text-muted">{field.label}</dt>
                    <dd className="min-w-0 break-words">{render(field, found.values[field.name])}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </section>

        <aside aria-label="Review decision" className="h-fit border border-line bg-warm px-5 py-5 lg:sticky lg:top-6">
          <ReviewPanel
            path={`/content/${config.key}/${found.record.id}`}
            status={found.record.status}
            workflow={found.workflow}
            roles={user?.roles ?? []}
            email={user?.email ?? ""}
            publicHref={found.record.publicHref}
          />
          <div className="mt-6 border-t border-line pt-4">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Review decisions</h2>
            <ReviewHistory events={history.events} className="mt-3" />
          </div>
        </aside>
      </div>
    </div>
  );
}
