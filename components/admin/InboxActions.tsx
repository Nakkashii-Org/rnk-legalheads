"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import { STATUSES, type InboxKind } from "@/lib/admin/inbox-shared";
import { useAdminAction } from "@/lib/admin/request";

/** Status, internal note and (Administrators) delete for one enquiry or application. */
export default function InboxActions({ kind, reference, status, admin }: { kind: InboxKind; reference: string; status: string; admin: boolean }) {
  const router = useRouter();
  const action = useAdminAction();
  const [nextStatus, setNextStatus] = useState(status);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const noun = kind === "enquiries" ? "enquiry" : "application";

  async function save() {
    if (nextStatus === status && !note.trim()) {
      setError("Change the status or write a note.");
      return;
    }
    setError("");
    const body = JSON.stringify({ status: nextStatus !== status ? nextStatus : undefined, note: note.trim() || undefined });
    const result = await action.call("Saving", `/inbox/${kind}/${reference}`, { method: "PATCH", body }, "Saved.");
    if (result.ok) {
      setNote("");
      router.refresh();
    } else if (result.status === 422 && result.data?.errors) setError(Object.values(result.data.errors as Record<string, string>)[0] ?? "");
  }

  async function remove() {
    const ok = await action.run("Deleting", `/inbox/${kind}/${reference}`, { method: "DELETE" }, `The ${noun} was deleted.`);
    setConfirmDelete(false);
    if (ok) router.replace(`/admin/${kind}`);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="inbox-status" className="text-[14px] font-bold">
          Status
        </label>
        <select
          id="inbox-status"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="mt-1.5 block h-11 w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal"
        >
          {STATUSES[kind].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inbox-note" className="text-[14px] font-bold">
          Internal note <span className="font-normal text-muted">(optional)</span>
        </label>
        <p id="inbox-note-hint" className="text-[12px] text-muted">
          Seen only by Publishers and Administrators, never by the sender. Notes can&apos;t be edited later.
        </p>
        <textarea
          id="inbox-note"
          rows={4}
          maxLength={2000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-describedby={`inbox-note-hint${error ? " inbox-error" : ""}`}
          className="mt-1.5 w-full border border-[#8a8782] bg-canvas px-3 py-2 text-[15px] leading-[24px] focus:border-charcoal"
        />
      </div>
      {error && (
        <p id="inbox-error" role="alert" className="text-[13px] font-bold text-action">
          {error}
        </p>
      )}
      <button type="button" onClick={save} disabled={action.busy} className="btn btn-primary w-full justify-center disabled:opacity-70">
        Save
      </button>
      <ActionNotice state={action.state} />

      {admin && (
        <div className="border-t border-line pt-4 text-[13px]">
          {confirmDelete ? (
            <div role="group" aria-label="Confirm delete">
              <p>
                Delete this {noun}
                {kind === "applications" && " and its resume"} permanently? Use this when the retention period has ended or the
                person asks to be removed.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={remove} disabled={action.busy} className="inline-flex min-h-11 items-center border border-action px-3 font-bold text-action hover:bg-warm md:min-h-9">
                  Delete permanently
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="inline-flex min-h-11 items-center px-3 underline md:min-h-9">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex min-h-11 items-center text-action underline underline-offset-4 md:min-h-0">
              Delete this {noun}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
