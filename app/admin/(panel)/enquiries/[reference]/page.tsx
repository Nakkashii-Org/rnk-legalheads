import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import InboxActions from "@/components/admin/InboxActions";
import InboxNotes from "@/components/admin/InboxNotes";
import { formatWhen, getInboxItem, inboxLabels, statusLabel, type Enquiry } from "@/lib/admin/inbox";
import { canUseInbox, getAdminUser, isAdmin } from "@/lib/admin/session";

type Params = Promise<{ reference: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: `Enquiry ${(await params).reference}` };
}

export default async function EnquiryPage({ params }: { params: Params }) {
  const { reference } = await params;
  const user = await getAdminUser();
  const crumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Enquiries", href: "/admin/enquiries" }, { label: reference }];
  if (!canUseInbox(user))
    return (
      <div className="space-y-6">
        <AdminPageHeader crumbs={crumbs} title={`Enquiry ${reference}`} />
        <EmptyState title="Publishers and Administrators only" />
      </div>
    );

  const [result, labels] = await Promise.all([getInboxItem<Enquiry>("enquiries", reference), inboxLabels()]);
  if (!result.ok) {
    if (result.status === 404) notFound();
    return <EmptyState title="The enquiry could not be loaded">Please refresh the page.</EmptyState>;
  }
  const e = result.data;
  const rows: [string, React.ReactNode][] = [
    ["Received", formatWhen(e.receivedAt)],
    ["Name", e.name],
    [
      "Email",
      <a key="email" href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry to RNK Legalheads (${e.reference})`)}`} className="underline underline-offset-4">
        {e.email}
      </a>,
    ],
    ["Telephone", e.phone ? <a key="tel" href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4">{e.phone}</a> : "—"],
    ["Organisation", e.organisation || "—"],
    ["Service", labels.service(e.service)],
    ["Sent from", e.context ? `${e.context.kind === "person" ? "Lawyer profile" : "Industry page"}: ${e.context.slug}` : "Contact page"],
    ["Email to the firm", e.emailed === "sent" ? "Delivered to the enquiry inbox" : e.emailed === "failed" ? "Failed: reply from here" : "Pending"],
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader crumbs={crumbs} title={`Enquiry from ${e.name}`} description={`${e.reference} · ${statusLabel("enquiries", e.status)}`} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          <dl className="border-t border-line">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-line py-3 text-[14px] leading-[22px] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
                <dt className="text-muted">{label}</dt>
                <dd className="min-w-0 break-words">{value}</dd>
              </div>
            ))}
          </dl>
          <section aria-labelledby="message-title">
            <h2 id="message-title" className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
              Message
            </h2>
            <p className="mt-2 whitespace-pre-line border border-line bg-canvas px-4 py-3 text-[15px] leading-[26px]">{e.message}</p>
          </section>
          <InboxNotes notes={e.notes} />
        </div>
        <aside aria-label="Handle this enquiry" className="h-fit border border-line bg-warm px-5 py-5 lg:sticky lg:top-6">
          <InboxActions kind="enquiries" reference={e.reference} status={e.status} admin={isAdmin(user)} />
        </aside>
      </div>
    </div>
  );
}
