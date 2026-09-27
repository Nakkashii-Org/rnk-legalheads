import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RecordEditor from "@/components/admin/RecordEditor";
import { getContentType } from "@/lib/admin/config";
import { editorOptions, getHistory, getRecord } from "@/lib/admin/records";
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
  const [found, options, history, user] = config
    ? await Promise.all([getRecord(config.key, id), editorOptions(), getHistory(config.key, id), getAdminUser()])
    : [undefined, undefined, { revisions: [], events: [] }, undefined];
  if (!config || !found) notFound();
  const { createdBy } = found.workflow;
  // The backend enforces these too: the creator or an Administrator may delete a draft or restore a rejected record.
  const canDelete = isAdmin(user) || (Boolean(createdBy) && createdBy === user?.email);

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
        revisions={history.revisions}
        events={history.events}
        workflow={found.workflow}
        roles={user?.roles ?? []}
        canDelete={canDelete}
      />
    </div>
  );
}
