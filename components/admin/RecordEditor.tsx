"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import FieldInput, { fieldId, type EditorOptions } from "@/components/admin/FieldInput";
import StatusBadge from "@/components/admin/StatusBadge";
import ErrorSummary from "@/components/forms/ErrorSummary";
import Arrow from "@/components/ui/Arrow";
import {
  allFields,
  getContentType,
  slugify,
  validateForReview,
  type ContentTypeKey,
  type FieldValue,
  type RecordValues,
  type WorkflowStatus,
} from "@/lib/admin/config";
import { previewHref } from "@/lib/admin/preview";
import ReviewHistory from "@/components/admin/ReviewHistory";
import type { ReviewEventRow, RevisionRow, Workflow } from "@/lib/admin/records";
import type { AdminRole } from "@/lib/admin/session";
import { useAdminAction, type AdminResult } from "@/lib/admin/request";

/** A rejected record is archived; it is restored as a draft before it can be edited again. */
const LOCKED: WorkflowStatus[] = ["archived"];
/** States from which "Send for review" makes sense (an unchanged approved or published revision needs no new review). */
const SENDABLE: WorkflowStatus[] = ["draft", "changes_requested", "unpublished"];

const when = (at?: string) => (at ? new Date(at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

/**
 * A03 / A05 / A06 editor. Save draft needs only a title and URL slug; Send for review runs every
 * required check. The server checks everything again and its field errors are shown here.
 */
export default function RecordEditor({
  typeKey,
  recordId,
  status,
  publicHref,
  layoutPreview,
  initialValues,
  options,
  revisions = [],
  events = [],
  workflow = { revision: 0 },
  roles = [],
  canDelete = false,
}: {
  typeKey: ContentTypeKey;
  recordId?: string;
  status: WorkflowStatus;
  publicHref?: string;
  layoutPreview?: boolean;
  initialValues: RecordValues;
  options: EditorOptions;
  revisions?: RevisionRow[];
  events?: ReviewEventRow[];
  workflow?: Workflow;
  roles?: AdminRole[];
  canDelete?: boolean;
}) {
  const config = getContentType(typeKey)!;
  const isNew = !recordId;
  const summaryRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<RecordValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const action = useAdminAction();
  const router = useRouter();
  const locked = LOCKED.includes(status);
  const canPublish = roles.includes("publisher") || roles.includes("admin");

  const slugField = allFields(config).find((f) => f.kind === "slug");
  const title = (values[config.titleField] as string) || `Untitled ${config.singular.toLowerCase()}`;

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(name: string, value: FieldValue) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (slugField && slugField.kind === "slug" && name === slugField.from && !slugTouched) next[slugField.name] = slugify(value as string);
      return next;
    });
    if (slugField && name === slugField.name) setSlugTouched(true);
    setDirty(true);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function report(found: Record<string, string>) {
    setErrors(found);
    const has = Object.values(found).some(Boolean);
    if (has) requestAnimationFrame(() => summaryRef.current?.focus());
    return !has;
  }

  const path = isNew ? `/content/${typeKey}` : `/content/${typeKey}/${recordId}`;
  const body = () => JSON.stringify({ values });

  /** Shows the server's field errors (422); returns the saved record's id, or undefined. */
  function saved(result: AdminResult): string | undefined {
    if (result.status === 422 && result.data?.errors) report(result.data.errors as Record<string, string>);
    if (!result.ok) return undefined;
    setDirty(false);
    return String(result.data?.id ?? recordId);
  }

  /** After a save: open the record's own page (new record or changed slug), or refresh status and history. */
  function show(id: string) {
    if (id !== recordId) router.replace(`/admin/${typeKey}/${id}`);
    else router.refresh();
  }

  async function saveDraft() {
    const titleLabel = allFields(config).find((f) => f.name === config.titleField)!.label;
    if (!report(values[config.titleField] ? {} : { [config.titleField]: `${titleLabel} is required to save a draft.` })) return;
    const id = saved(await action.call("Saving draft", path, { method: isNew ? "POST" : "PATCH", body: body() }, "Draft saved as a new revision."));
    if (id) show(id);
  }

  async function sendForReview() {
    if (!report(validateForReview(config, values))) {
      action.setState({ kind: "idle" });
      return;
    }
    let id = recordId;
    // A new record is saved as a draft first, then sent.
    if (isNew) {
      id = saved(await action.call("Saving draft", path, { method: "POST", body: body() }, "Draft saved."));
      if (!id) return;
    }
    const sent = saved(
      await action.call("Sending for review", `/content/${typeKey}/${id}/submit`, { method: "POST", body: body() }, "Sent to the review queue. Editing it again takes it back to draft."),
    );
    if (sent) show(sent);
    else if (id !== recordId) show(id!);
  }

  async function restore() {
    if (await action.run("Restoring", `/content/${typeKey}/${recordId}/restore`, { method: "POST" }, "Restored as a draft. You can edit it again.")) router.refresh();
  }

  async function deleteDraft() {
    const ok = await action.run("Deleting draft", path, { method: "DELETE" }, "Draft deleted.");
    setConfirmDelete(false);
    if (ok) {
      setDirty(false);
      router.replace(`/admin/${typeKey}`);
    }
  }

  const errorList = allFields(config)
    .filter((f) => errors[f.name])
    .map((f) => ({ field: fieldId(f.name), message: errors[f.name] }));
  if (errors.sourceChecked && !errorList.some((e) => e.field === fieldId("sourceChecked")))
    errorList.push({ field: fieldId("sourceChecked"), message: errors.sourceChecked });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <form onSubmit={(e) => { e.preventDefault(); saveDraft(); }} noValidate aria-label={`Edit ${config.singular.toLowerCase()}`} className="min-w-0 space-y-8">
        <ErrorSummary ref={summaryRef} errors={errorList} />

        {config.sections.map((section) => (
          <fieldset key={section.title} className="space-y-5 border border-line px-4 py-5 md:px-6">
            <legend className="px-2 font-serif text-[20px] leading-[28px]">{section.title}</legend>
            {section.description && <p className="-mt-2 text-[13px] leading-5 text-muted">{section.description}</p>}
            {section.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(v) => update(field.name, v)}
                error={errors[field.name] || undefined}
                options={options}
              />
            ))}
          </fieldset>
        ))}

        {/* Primary actions repeated below the form for long records on small screens. */}
        <div className="flex flex-wrap gap-3 lg:hidden">
          <button type="submit" disabled={action.busy || locked} className="btn btn-primary">
            Save draft
          </button>
          <button type="button" onClick={sendForReview} disabled={action.busy || locked || status === "in_review"} className="btn btn-secondary">
            Send for review
          </button>
        </div>
      </form>

      <aside aria-label="Status and actions" className="lg:order-none">
        <div className="space-y-5 lg:sticky lg:top-6">
          <section className="border border-line bg-warm px-5 py-5">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Status</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              {layoutPreview && <span className="text-[12px] text-muted">Layout preview record</span>}
            </div>
            <p className="mt-3 text-[13px] leading-5 text-muted" aria-live="polite">
              {dirty ? "You have unsaved changes." : isNew ? "Not saved yet." : "No unsaved changes."}
            </p>

            <div className="mt-4 grid gap-2">
              <button type="button" onClick={saveDraft} disabled={action.busy || locked} className="btn btn-primary justify-center disabled:cursor-wait disabled:opacity-70">
                Save draft
              </button>
              {publicHref && !isNew ? (
                <a href={previewHref(publicHref)} target="_blank" rel="noopener" className="btn btn-secondary justify-center">
                  Preview <Arrow />
                  <span className="sr-only"> (staff-only preview of the saved draft, opens in a new tab)</span>
                </a>
              ) : (
                <p className="text-[12px] leading-[18px] text-muted">Preview is available after the first save.</p>
              )}
              {!isNew && dirty && <p className="text-[12px] leading-[18px] text-muted">Preview shows the last saved version. Save first to see your changes.</p>}
              {status === "in_review" && (
                <p className="text-[12px] leading-[18px] text-muted">
                  Already sent for review, so it can&apos;t be sent again. Saving a change takes it back to Draft; send it again after that.
                </p>
              )}
              {status === "approved" && (
                <p className="text-[12px] leading-[18px] text-muted">
                  Revision {workflow.approval?.revision} was approved{workflow.approval?.by ? ` by ${workflow.approval.by}` : ""}. A publisher can now publish it. Saving a
                  change withdraws the approval.
                </p>
              )}
              {status === "published" && (
                <p className="text-[12px] leading-[18px] text-muted">
                  This version is live. Saving a change creates a new draft; the website keeps showing this version until the new one is
                  approved and published.
                </p>
              )}
              {locked && (
                <p className="text-[12px] leading-[18px] text-muted">
                  This record was rejected and archived. {canDelete ? "Restore it as a draft to edit it again." : "Its creator or an Administrator can restore it."}
                </p>
              )}
              {locked && canDelete && (
                <button type="button" onClick={restore} disabled={action.busy} className="btn btn-secondary justify-center">
                  Restore as draft
                </button>
              )}
              <button type="button" onClick={sendForReview} disabled={action.busy || !SENDABLE.includes(status)} className="btn btn-secondary justify-center">
                Send for review
              </button>
            </div>

            <ActionNotice state={action.state} className="mt-4" />
          </section>

          {workflow.live && publicHref && (
            <section className="border border-charcoal px-5 py-5">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">On the website</h2>
              <p className="mt-2 text-[13px] leading-5">
                {workflow.live.revision !== undefined ? (
                  <>
                    Revision {workflow.live.revision} is live
                    {workflow.live.at && (
                      <>
                        {" "}
                        since <time dateTime={workflow.live.at}>{when(workflow.live.at)}</time>
                      </>
                    )}
                    {workflow.live.by && ` (published by ${workflow.live.by})`}.
                  </>
                ) : (
                  "A published version is live."
                )}
              </p>
              {status !== "published" && (
                <p className="mt-2 text-[12px] leading-[18px] text-muted">
                  Newer changes are saved here but not public yet. They appear after review and publishing.
                </p>
              )}
              <a href={publicHref} target="_blank" rel="noopener" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold underline underline-offset-4 md:min-h-0">
                View the live page <Arrow />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </section>
          )}

          {events[0]?.action === "changes_requested" && status === "changes_requested" && (
            <section role="note" className="border-l-2 border-action bg-warm px-5 py-4">
              <h2 className="text-[13px] font-bold">Changes requested by {events[0].by}</h2>
              <p className="mt-1 whitespace-pre-line text-[13px] leading-5">{events[0].comment}</p>
              <p className="mt-2 text-[12px] leading-[18px] text-muted">Make the changes, save, then send it for review again.</p>
            </section>
          )}

          <section className="border border-line px-5 py-5">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Publishing steps</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-5">
              {[
                ["Draft", "Write and save."],
                ["In review", "A legal reviewer checks facts, sources and wording."],
                ["Approved", "The exact revision is approved."],
                ["Published", "A publisher releases it; the website updates."],
              ].map(([step, text], i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-charcoal text-[11px] font-bold">{i + 1}</span>
                  <span>
                    <strong>{step}.</strong> <span className="text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12px] leading-[18px] text-muted">Editing an approved or published record needs review again; the live version stays until then.</p>
            {!isNew && (
              <Link href={`/admin/review/${typeKey}/${recordId}`} className="mt-3 inline-flex min-h-11 items-center text-[13px] font-bold underline underline-offset-4 md:min-h-0">
                Open the reviewer view
              </Link>
            )}
          </section>

          {typeKey === "newsletters" && !isNew && (
            <section className="border border-line px-5 py-5">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Email</h2>
              <p className="mt-2 text-[13px] leading-5 text-muted">
                Publishing the web issue emails no one. Once it is published, a publisher creates a draft campaign in Brevo; the
                email is tested and sent from Brevo.
              </p>
              {workflow.campaignId ? (
                <p className="mt-3 text-[13px] leading-5">
                  Email draft created in Brevo (campaign <strong>{workflow.campaignId}</strong>). Open it in Brevo to test and send.
                </p>
              ) : !canPublish ? (
                <p className="mt-3 text-[12px] leading-[18px] text-muted">Only a Publisher or Administrator can create the email draft.</p>
              ) : !workflow.live ? (
                <p className="mt-3 text-[12px] leading-[18px] text-muted">Publish the issue on the website first.</p>
              ) : (
                <button
                  type="button"
                  disabled={action.busy}
                  onClick={async () => {
                    if (await action.run("Creating email draft", `/content/newsletters/${recordId}/email-draft`, { method: "POST" }, "Draft campaign created in Brevo. Nothing has been sent."))
                      router.refresh();
                  }}
                  className="btn btn-secondary mt-3 w-full justify-center"
                >
                  Create email draft
                </button>
              )}
            </section>
          )}

          {!isNew && (
            <section className="border border-line px-5 py-5">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Review decisions</h2>
              <ReviewHistory events={events} className="mt-3" />
            </section>
          )}

          <section className="border border-line px-5 py-5">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Revision history</h2>
            {revisions.length === 0 ? (
              <p className="mt-2 text-[13px] leading-5 text-muted">
                {isNew ? "No saved revisions yet." : "No revisions saved in the CMS yet. This record was imported; each save will be listed here."}
              </p>
            ) : (
              <ol className="mt-3 space-y-2 text-[13px] leading-5">
                {revisions.map((r) => (
                  <li key={r.number}>
                    <strong>Revision {r.number}</strong> <span className="text-muted">· {r.action}</span>
                    <span className="block text-[12px] text-muted">
                      {r.savedBy} ·{" "}
                      <time dateTime={r.savedAt}>{new Date(r.savedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</time>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {!isNew && canDelete && (status === "draft" || status === "changes_requested") && (
            <section className="border border-line px-5 py-5">
              {confirmDelete ? (
                <div role="group" aria-label="Confirm delete">
                  <p className="text-[13px] leading-5">
                    Delete the draft <strong>{title}</strong>? This cannot be undone.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={deleteDraft}
                      className="inline-flex min-h-11 items-center border border-action px-3 text-[13px] font-bold text-action hover:bg-warm md:min-h-9"
                    >
                      Delete draft
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="inline-flex min-h-11 items-center px-3 text-[13px] underline md:min-h-9">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex min-h-11 items-center text-[13px] text-action underline underline-offset-4 md:min-h-0">
                  Delete this draft
                </button>
              )}
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
