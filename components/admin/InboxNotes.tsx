import { formatWhen, type Note } from "@/lib/admin/inbox-shared";

/** Internal notes on an enquiry or application, oldest first (never shown to the sender). */
export default function InboxNotes({ notes }: { notes: Note[] }) {
  return (
    <section aria-labelledby="notes-title" className="space-y-3">
      <h2 id="notes-title" className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
        Internal notes
      </h2>
      {notes.length === 0 ? (
        <p className="text-[13px] text-muted">No notes yet.</p>
      ) : (
        <ol className="space-y-3">
          {notes.map((n, i) => (
            <li key={i} className="border-l-2 border-line pl-3 text-[14px] leading-[22px]">
              <p className="whitespace-pre-line">{n.text}</p>
              <p className="text-[12px] text-muted">
                {n.by} · <time dateTime={n.at}>{formatWhen(n.at)}</time>
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
