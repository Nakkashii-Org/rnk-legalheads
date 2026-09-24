import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RecordEditor from "@/components/admin/RecordEditor";
import { getContentType } from "@/lib/admin/config";
import { editorOptions, getRecord } from "@/lib/admin/records";

type Params = Promise<{ type: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type, id } = await params;
  const config = getContentType(type);
  const found = config && getRecord(config.key, id);
  return { title: found ? `Edit: ${found.record.title}` : "Not found" };
}

export default async function EditRecordPage({ params }: { params: Params }) {
  const { type, id } = await params;
  const config = getContentType(type);
  const found = config && getRecord(config.key, id);
  if (!config || !found) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: config.plural, href: `/admin/${config.key}` }, { label: found.record.title }]}
        title={found.record.title}
        description={`${config.singular} · /${found.record.id}`}
      />
      <RecordEditor
        typeKey={config.key}
        recordId={found.record.id}
        status={found.record.status}
        publicHref={found.record.publicHref}
        layoutPreview={found.record.layoutPreview}
        initialValues={found.values}
        options={editorOptions()}
      />
    </div>
  );
}
