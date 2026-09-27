import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RecordEditor from "@/components/admin/RecordEditor";
import { getContentType } from "@/lib/admin/config";
import { editorOptions, getRecord, getRevisions } from "@/lib/admin/records";
import { getAdminUser, isAdmin } from "@/lib/admin/session";

type Params = Promise<{ type: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type, id } = await params;
  const config = getContentType(type);
  const found = config && (await getRecord(config.key, id));
  return { title: found ? `Edit: ${found.record.title}` : "Not found" };
}

export default async function EditRecordPage({ params }: { params: Params }) {
  const { type, id } = await params;
  const config = getContentType(type);
  const [found, options, revisions, user] = config
    ? await Promise.all([getRecord(config.key, id), editorOptions(), getRevisions(config.key, id), getAdminUser()])
    : [undefined, undefined, [], undefined];
  if (!config || !found) notFound();
  // The backend enforces this too: only the creator or an Administrator may delete a draft.
  const canDelete = isAdmin(user) || (Boolean(found.createdBy) && found.createdBy === user?.email);

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
        options={options!}
        revisions={revisions}
        canDelete={canDelete}
      />
    </div>
  );
}
