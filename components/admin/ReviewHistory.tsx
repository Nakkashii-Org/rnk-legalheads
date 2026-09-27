import type { ReviewEventRow } from "@/lib/admin/records";

const LABELS: Record<ReviewEventRow["action"], string> = {
  approved: "Approved",
  changes_requested: "Changes requested",
  rejected: "Rejected",
  published: "Published",
  unpublished: "Unpublished",
  restored: "Restored as draft",
  email_draft: "Email draft created in Brevo",
};

const when = (at: string) => new Date(at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

/** Review and publishing decisions, newest first, with the reviewer's comment. */
export default function ReviewHistory({ events, className = "" }: { events: ReviewEventRow[]; className?: string }) {
  if (!events.length) return <p className={`text-[13px] leading-5 text-muted ${className}`}>No review decisions yet.</p>;
  return (
    <ol className={`space-y-3 text-[13px] leading-5 ${className}`}>
      {events.map((e, i) => (
        <li key={i}>
          <strong>{LABELS[e.action]}</strong> <span className="text-muted">· revision {e.revision}</span>
          {e.comment && <span className="mt-1 block border-l-2 border-line pl-3 whitespace-pre-line">{e.comment}</span>}
          <span className="block text-[12px] text-muted">
            {e.by} · <time dateTime={e.at}>{when(e.at)}</time>
          </span>
        </li>
      ))}
    </ol>
  );
}
