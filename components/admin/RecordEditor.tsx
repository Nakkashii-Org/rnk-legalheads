"use client";

import Link from "next/link";
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
import { useAdminAction } from "@/lib/admin/request";

/**
 * A03 / A05 / A06 editor. Save draft needs only a title; Send for review runs every required
 * check. All actions go to the admin API and report honestly when it is not available.
 */
export default function RecordEditor({
  typeKey,
  recordId,
  status,
  publicHref,
  layoutPreview,
  initialValues,
  options,
}: {
  typeKey: ContentTypeKey;
  recordId?: string;
  status: WorkflowStatus;
  publicHref?: string;
  layoutPreview?: boolean;
  initialValues: RecordValues;
  options: EditorOptions;
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

  const path = isNew ? `/${typeKey}` : `/${typeKey}/${recordId}`;
  const body = () => JSON.stringify(values);

  async function saveDraft() {
    if (!report(values[config.titleField] ? {} : { [config.titleField]: `${allFields(config).find((f) => f.name === config.titleField)!.label} is required to save a draft.` }))
      return;
    const ok = await action.run("Saving draft", path, { method: isNew ? "POST" : "PATCH", body: body() }, "Draft saved as a new revision.");
    if (ok) setDirty(false);
  }

  async function sendForReview() {
    if (!report(validateForReview(config, values))) {
      action.setState({ kind: "idle" });
      return;
    }
    await action.run("Sending for review", `${path}/submit`, { method: "POST", body: body() }, "Sent to the review queue. Legal reviewers have been notified.");
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
          <button type="submit" disabled={action.busy} className="btn btn-primary">
            Save draft
          </button>
          <button type="button" onClick={sendForReview} disabled={action.busy} className="btn btn-secondary">
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
              <button type="button" onClick={saveDraft} disabled={action.busy} className="btn btn-primary justify-center disabled:cursor-wait disabled:opacity-70">
                Save draft
              </button>
              {publicHref && !isNew ? (
                <Link href={publicHref} target="_blank" className="btn btn-secondary justify-center">
                  Preview <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </Link>
              ) : (
                <p className="text-[12px] leading-[18px] text-muted">Preview is available after the first save.</p>
              )}
              <button type="button" onClick={sendForReview} disabled={action.busy} className="btn btn-secondary justify-center">
                Send for review
              </button>
            </div>

            <ActionNotice state={action.state} className="mt-4" />
          </section>

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
            <p className="mt-3 text-[12px] leading-[18px] text-muted">Editing an approved or published record needs review again.</p>
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
                Publishing the web issue emails no one. After approval, create a draft campaign in Brevo; the Email
                operator tests and sends it there.
              </p>
              <button
                type="button"
                disabled={action.busy}
                onClick={() => action.run("Creating email draft", `/newsletters/${recordId}/email-draft`, { method: "POST" }, "Draft campaign created in Brevo. Nothing has been sent.")}
                className="btn btn-secondary mt-3 w-full justify-center"
              >
                Create email draft
              </button>
            </section>
          )}

          <section className="border border-line px-5 py-5">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Revision history</h2>
            <p className="mt-2 text-[13px] leading-5 text-muted">No saved revisions yet. Each save will be listed here with its author and time.</p>
          </section>

          {!isNew && status === "draft" && (
            <section className="border border-line px-5 py-5">
              {confirmDelete ? (
                <div role="group" aria-label="Confirm delete">
                  <p className="text-[13px] leading-5">
                    Delete the draft <strong>{title}</strong>? This cannot be undone.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await action.run("Deleting draft", path, { method: "DELETE" }, "Draft deleted.");
                        setConfirmDelete(false);
                      }}
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
