import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ReviewPanel from "@/components/admin/ReviewPanel";
import StatusBadge from "@/components/admin/StatusBadge";
import Arrow from "@/components/ui/Arrow";
import { getContentType, type Field, type FieldValue, type SourceLink, type WorkArea } from "@/lib/admin/config";
import { editorOptions, getRecord } from "@/lib/admin/records";

type Params = Promise<{ type: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type, id } = await params;
  const config = getContentType(type);
  const found = config && getRecord(config.key, id);
  return { title: found ? `Review: ${found.record.title}` : "Not found" };
}

const plain = (html: string) =>
  html
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
  const found = config && getRecord(config.key, id);
  if (!config || !found) notFound();

  const options = editorOptions();
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
    if (field.kind === "image") return "No image";
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
            {config.singular} · Revision: draft from the site&apos;s content files (not yet saved in the CMS).
          </>
        }
        actions={
          <>
            <Link href={found.record.publicHref} target="_blank" className="btn btn-secondary">
              Full preview <Arrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </Link>
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
          <ReviewPanel path={`/${config.key}/${found.record.id}`} />
        </aside>
      </div>
    </div>
  );
}
