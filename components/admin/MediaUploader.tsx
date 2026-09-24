"use client";

import { useEffect, useRef, useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import { useAdminAction } from "@/lib/admin/request";

const ACCEPT = ".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 10 * 1024 * 1024;

const LICENCES = [
  { value: "own", label: "Firm's own photograph" },
  { value: "consent", label: "Portrait with the person's consent" },
  { value: "licensed", label: "Licensed image" },
  { value: "original", label: "Original illustration" },
];

type Pending = {
  key: string;
  file: File;
  url: string;
  title: string;
  alt: string;
  decorative: boolean;
  credit: string;
  licence: string;
  error?: string;
};

/** A09: every asset records its source, licence or consent, and an alt-text decision (guide p.148). */
export default function MediaUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const action = useAdminAction();

  // Release preview object URLs when the page closes (removed items are released as they go).
  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);
  useEffect(() => () => pendingRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function onFiles(files: FileList | null) {
    if (!files) return;
    const ok: Pending[] = [];
    const bad: string[] = [];
    for (const file of Array.from(files)) {
      if (!/\.(jpe?g|png|webp|avif)$/i.test(file.name)) bad.push(`${file.name}: use JPG, PNG, WebP or AVIF.`);
      else if (file.size > MAX_BYTES) bad.push(`${file.name}: larger than 10 MB.`);
      else
        ok.push({
          key: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          url: URL.createObjectURL(file),
          title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          alt: "",
          decorative: false,
          credit: "",
          licence: "",
        });
    }
    setRejected(bad);
    setPending((prev) => [...prev, ...ok.filter((p) => !prev.some((q) => q.key === p.key))]);
    if (inputRef.current) inputRef.current.value = "";
  }

  const edit = (key: string, patch: Partial<Pending>) =>
    setPending((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch, error: undefined } : p)));

  async function upload() {
    const checked = pending.map((p) => ({
      ...p,
      error: !p.title.trim()
        ? "Add a title."
        : !p.decorative && !p.alt.trim()
          ? "Add alt text, or mark the image as decorative."
          : !p.credit.trim()
            ? "Add the creator or source."
            : !p.licence
              ? "Choose the licence or consent basis."
              : undefined,
    }));
    setPending(checked);
    const firstBad = checked.find((p) => p.error);
    if (firstBad) {
      document.getElementById(`media-${firstBad.key}-title`)?.focus();
      return;
    }
    const body = new FormData();
    checked.forEach((p, i) => {
      body.append(`files`, p.file);
      body.append(`meta[${i}]`, JSON.stringify({ title: p.title, alt: p.decorative ? "" : p.alt, decorative: p.decorative, credit: p.credit, licence: p.licence }));
    });
    const ok = await action.run("Uploading", "/media", { method: "POST", body }, "Uploaded. Responsive sizes are being generated.");
    if (ok) setPending([]);
  }

  const input = "mt-1 h-11 w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

  return (
    <section aria-labelledby="upload-title" className="space-y-4">
      <h2 id="upload-title" className="text-[16px] font-bold">
        Upload images
      </h2>
      <div className="border border-dashed border-[#8a8782] bg-warm px-5 py-6">
        <label htmlFor="media-files" className="text-[14px] font-bold">
          Choose images
        </label>
        <p id="media-files-hint" className="text-[12px] text-muted">
          JPG, PNG, WebP or AVIF, up to 10 MB each. Use approved portraits or original/licensed images only.
        </p>
        <input
          ref={inputRef}
          id="media-files"
          type="file"
          multiple
          accept={ACCEPT}
          aria-describedby="media-files-hint"
          onChange={(e) => onFiles(e.target.files)}
          className="mt-3 block w-full text-[14px] text-muted file:mr-4 file:min-h-11 file:border-0 file:bg-charcoal file:px-5 file:text-[13px] file:font-bold file:text-canvas hover:file:bg-action"
        />
      </div>

      {rejected.length > 0 && (
        <div role="alert" className="border-l-2 border-action bg-warm px-4 py-3 text-[13px]">
          <strong>Some files were not added:</strong>
          <ul className="mt-1 list-disc pl-5">
            {rejected.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <ul className="space-y-4">
            {pending.map((p) => (
              <li key={p.key} className="grid gap-4 border border-line p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file not yet uploaded */}
                <img src={p.url} alt="" className="h-[90px] w-[120px] bg-warm object-cover" />
                <div className="grid min-w-0 gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`media-${p.key}-title`} className="text-[13px] font-bold">
                      Title
                    </label>
                    <input id={`media-${p.key}-title`} value={p.title} onChange={(e) => edit(p.key, { title: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label htmlFor={`media-${p.key}-credit`} className="text-[13px] font-bold">
                      Creator or source
                    </label>
                    <input id={`media-${p.key}-credit`} value={p.credit} onChange={(e) => edit(p.key, { credit: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label htmlFor={`media-${p.key}-alt`} className="text-[13px] font-bold">
                      Alt text
                    </label>
                    <input
                      id={`media-${p.key}-alt`}
                      value={p.alt}
                      disabled={p.decorative}
                      onChange={(e) => edit(p.key, { alt: e.target.value })}
                      className={`${input} disabled:bg-warm`}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id={`media-${p.key}-decorative`}
                        type="checkbox"
                        checked={p.decorative}
                        onChange={(e) => edit(p.key, { decorative: e.target.checked })}
                        className="h-5 w-5 accent-charcoal"
                      />
                      <label htmlFor={`media-${p.key}-decorative`} className="text-[13px]">
                        Decorative (no alt text needed)
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`media-${p.key}-licence`} className="text-[13px] font-bold">
                      Licence or consent
                    </label>
                    <select id={`media-${p.key}-licence`} value={p.licence} onChange={(e) => edit(p.key, { licence: e.target.value })} className={input}>
                      <option value="">Choose…</option>
                      {LICENCES.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 md:col-span-2">
                    <span className="text-[12px] text-muted">
                      {p.file.name} · {(p.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(p.url);
                        setPending((prev) => prev.filter((q) => q.key !== p.key));
                      }}
                      className="inline-flex min-h-11 items-center text-[13px] underline underline-offset-4 md:min-h-0"
                    >
                      Remove<span className="sr-only"> {p.file.name}</span>
                    </button>
                  </div>
                  {p.error && <p className="text-[13px] font-bold text-action md:col-span-2">{p.error}</p>}
                </div>
              </li>
            ))}
          </ul>
          <button type="button" onClick={upload} disabled={action.busy} className="btn btn-primary disabled:opacity-70">
            Upload {pending.length} {pending.length === 1 ? "image" : "images"}
          </button>
        </>
      )}

      <ActionNotice state={action.state} />
    </section>
  );
}
