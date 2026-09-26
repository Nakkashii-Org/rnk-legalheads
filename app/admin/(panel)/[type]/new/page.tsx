import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RecordEditor from "@/components/admin/RecordEditor";
import { emptyValues, getContentType } from "@/lib/admin/config";
import { editorOptions } from "@/lib/admin/records";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ type: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const config = getContentType((await params).type);
  return { title: config ? `New ${config.singular.toLowerCase()}` : "Not found" };
}

export default async function NewRecordPage({ params }: { params: Params }) {
  const config = getContentType((await params).type);
  if (!config) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: config.plural, href: `/admin/${config.key}` }, { label: "New" }]}
        title={`New ${config.singular.toLowerCase()}`}
        description="Fields marked optional can be left blank. Everything else is needed before the record can be sent for review."
      />
      <RecordEditor typeKey={config.key} status="draft" initialValues={emptyValues(config)} options={editorOptions(await getContent())} />
    </div>
  );
}
