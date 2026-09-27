import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import InboxActions from "@/components/admin/InboxActions";
import InboxNotes from "@/components/admin/InboxNotes";
import { formatSize, formatWhen, getInboxItem, inboxLabels, statusLabel, type Application } from "@/lib/admin/inbox";
import { canUseInbox, getAdminUser, isAdmin } from "@/lib/admin/session";

type Params = Promise<{ reference: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: `Application ${(await params).reference}` };
}

export default async function ApplicationPage({ params }: { params: Params }) {
  const { reference } = await params;
  const user = await getAdminUser();
  const crumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Applications", href: "/admin/applications" }, { label: reference }];
  if (!canUseInbox(user))
    return (
      <div className="space-y-6">
        <AdminPageHeader crumbs={crumbs} title={`Application ${reference}`} />
        <EmptyState title="Publishers and Administrators only" />
      </div>
    );

  const [result, labels] = await Promise.all([getInboxItem<Application>("applications", reference), inboxLabels()]);
  if (!result.ok) {
    if (result.status === 404) notFound();
    return <EmptyState title="The application could not be loaded">Please refresh the page.</EmptyState>;
  }
  const a = result.data;
  const link = (href: string, text: string) => (
    <a href={href} className="underline underline-offset-4">
      {text}
    </a>
  );
  const rows: [string, React.ReactNode][] = [
    ["Received", formatWhen(a.receivedAt)],
    ["Position", labels.position(a.position)],
    ["Name", a.name],
    ["Email", link(`mailto:${a.email}?subject=${encodeURIComponent(`Your application to RNK Legalheads (${a.reference})`)}`, a.email)],
    ["Telephone", link(`tel:${a.phone.replace(/[^\d+]/g, "")}`, a.phone)],
    ["City", a.city],
    ["Experience", labels.experience(a.experience)],
    ["Highest qualification", a.qualification],
    ["Bar enrolment", a.barEnrolment || "—"],
    ["Current organisation", a.organisation || "—"],
    [
      "LinkedIn",
      a.linkedin ? (
        <a href={a.linkedin} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-4">
          {a.linkedin}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        "—"
      ),
    ],
    ["Email to the firm", a.emailed === "sent" ? "Delivered to the careers inbox" : a.emailed === "failed" ? "Failed: handle it from here" : "Pending"],
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader crumbs={crumbs} title={`Application from ${a.name}`} description={`${a.reference} · ${statusLabel("applications", a.status)}`} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          {a.resume && (
            <section aria-labelledby="resume-title" className="flex flex-wrap items-center justify-between gap-4 border border-charcoal px-5 py-4">
              <div>
                <h2 id="resume-title" className="text-[15px] font-bold">
                  Resume
                </h2>
                <p className="text-[13px] text-muted">
                  {a.resume.name} · {formatSize(a.resume.size)}
                </p>
              </div>
              {/* The backend checks the sign-in and role, then sends the file; every download is recorded in the audit log. */}
              <a href={`/api/admin/inbox/applications/${a.reference}/resume`} download className="btn btn-primary">
                Download resume
              </a>
            </section>
          )}
          <dl className="border-t border-line">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-line py-3 text-[14px] leading-[22px] sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4">
                <dt className="text-muted">{label}</dt>
                <dd className="min-w-0 break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {a.coverNote && (
            <section aria-labelledby="cover-title">
              <h2 id="cover-title" className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
                Cover note
              </h2>
              <p className="mt-2 whitespace-pre-line border border-line bg-canvas px-4 py-3 text-[15px] leading-[26px]">{a.coverNote}</p>
            </section>
          )}
          <InboxNotes notes={a.notes} />
        </div>
        <aside aria-label="Handle this application" className="h-fit border border-line bg-warm px-5 py-5 lg:sticky lg:top-6">
          <InboxActions kind="applications" reference={a.reference} status={a.status} admin={isAdmin(user)} />
        </aside>
      </div>
    </div>
  );
}
