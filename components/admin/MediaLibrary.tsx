"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import { LICENCES, thumb, type MediaItem } from "@/lib/admin/media";
import { useAdminAction } from "@/lib/admin/request";

const licenceLabel = (v: string) => LICENCES.find((l) => l.value === v)?.label ?? v;
const size = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/** A09 library: every image with its source, licence, alt text and where it is used. */
export default function MediaLibrary({ items, email, admin }: { items: MediaItem[]; email: string; admin: boolean }) {
  const [q, setQ] = useState("");
  const shown = q.trim() ? items.filter((m) => m.title.toLowerCase().includes(q.trim().toLowerCase())) : items;

  return (
    <div className="space-y-4">
      <div className="max-w-[360px]">
        <label htmlFor="media-search" className="text-[13px] font-bold">
          Find by title
        </label>
        <input id="media-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 h-11 w-full border border-[#8a8782] bg-canvas px-3 text-[14px]" />
      </div>
      <p role="status" className="text-[13px] text-muted">
        Showing {shown.length} of {items.length} {items.length === 1 ? "image" : "images"}
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((m) => (
          <MediaCard key={m.id} item={m} canDelete={admin || m.uploadedBy === email} />
        ))}
      </ul>
    </div>
  );
}

function MediaCard({ item, canDelete }: { item: MediaItem; canDelete: boolean }) {
  const router = useRouter();
  const action = useAdminAction();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({ title: item.title, alt: item.alt, decorative: item.decorative, credit: item.credit, licence: item.licence as string });
  const [error, setError] = useState("");
  const input = "mt-1 h-11 w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";
  const key = `m-${item.id}`;

  async function save() {
    const problem = !form.title.trim()
      ? "Add a title."
      : !form.decorative && !form.alt.trim()
        ? "Add alt text, or mark the image as decorative."
        : !form.credit.trim()
          ? "Add the creator or source."
          : "";
    setError(problem);
    if (problem) return;
    const result = await action.call("Saving", `/media/${item.id}`, { method: "PATCH", body: JSON.stringify(form) }, "Saved. The new alt text is used wherever this image appears.");
    if (result.ok) {
      setEditing(false);
      router.refresh();
    } else if (typeof result.data?.errors === "object") setError(Object.values(result.data.errors as Record<string, string>)[0] ?? "");
  }

  async function remove() {
    const ok = await action.run("Deleting", `/media/${item.id}`, { method: "DELETE" }, "Image deleted.");
    setConfirmDelete(false);
    if (ok) router.refresh();
  }

  return (
    <li className="border border-line p-4">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS thumbnail */}
        <img src={thumb(item.url)} alt="" className="h-[90px] w-[120px] shrink-0 bg-warm object-cover" />
        <div className="min-w-0 text-[13px] leading-5">
          <p className="text-[15px] font-bold">{item.title}</p>
          <p className="text-muted">{item.decorative ? "Decorative (no alt text)" : `Alt: ${item.alt}`}</p>
          <p className="text-muted">
            {item.credit} · {licenceLabel(item.licence)}
          </p>
          <p className="text-muted">
            {size(item.bytes)}
            {item.width && item.height ? ` · ${item.width}×${item.height}` : ""} · {item.uploadedBy}
          </p>
          <p className="mt-1">{item.usedBy.length ? `Used by: ${item.usedBy.join(", ")}` : <span className="text-muted">Not used yet</span>}</p>
        </div>
      </div>

      {editing ? (
        <div role="group" aria-label={`Edit ${item.title}`} className="mt-4 grid gap-3">
          <div>
            <label htmlFor={`${key}-title`} className="text-[13px] font-bold">
              Title
            </label>
            <input id={`${key}-title`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
          </div>
          <div>
            <label htmlFor={`${key}-alt`} className="text-[13px] font-bold">
              Alt text
            </label>
            <input id={`${key}-alt`} value={form.alt} disabled={form.decorative} onChange={(e) => setForm({ ...form, alt: e.target.value })} className={`${input} disabled:bg-warm`} />
            <div className="mt-2 flex items-center gap-2">
              <input
                id={`${key}-decorative`}
                type="checkbox"
                checked={form.decorative}
                onChange={(e) => setForm({ ...form, decorative: e.target.checked })}
                className="h-5 w-5 accent-charcoal"
              />
              <label htmlFor={`${key}-decorative`} className="text-[13px]">
                Decorative (no alt text needed)
              </label>
            </div>
          </div>
          <div>
            <label htmlFor={`${key}-credit`} className="text-[13px] font-bold">
              Creator or source
            </label>
            <input id={`${key}-credit`} value={form.credit} onChange={(e) => setForm({ ...form, credit: e.target.value })} className={input} />
          </div>
          <div>
            <label htmlFor={`${key}-licence`} className="text-[13px] font-bold">
              Licence or consent
            </label>
            <select id={`${key}-licence`} value={form.licence} onChange={(e) => setForm({ ...form, licence: e.target.value })} className={input}>
              {LICENCES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p role="alert" className="text-[13px] font-bold text-action">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={save} disabled={action.busy} className="btn btn-primary">
              Save details
            </button>
            <button type="button" onClick={() => setEditing(false)} className="inline-flex min-h-11 items-center px-3 text-[13px] underline">
              Cancel
            </button>
          </div>
        </div>
      ) : confirmDelete ? (
        <div role="group" aria-label="Confirm delete" className="mt-4 text-[13px]">
          <p>
            Delete <strong>{item.title}</strong>? This cannot be undone.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={remove} disabled={action.busy} className="inline-flex min-h-11 items-center border border-action px-3 font-bold text-action hover:bg-warm md:min-h-9">
              Delete image
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="inline-flex min-h-11 items-center px-3 underline md:min-h-9">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-4 text-[13px]">
          <button type="button" onClick={() => setEditing(true)} className="inline-flex min-h-11 items-center underline underline-offset-4 md:min-h-0">
            Edit details<span className="sr-only"> of {item.title}</span>
          </button>
          {canDelete &&
            (item.usedBy.length ? (
              <span className="inline-flex min-h-11 items-center text-muted md:min-h-0">In use, can&apos;t be deleted</span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex min-h-11 items-center text-action underline underline-offset-4 md:min-h-0">
                Delete<span className="sr-only"> {item.title}</span>
              </button>
            ))}
        </div>
      )}
      <ActionNotice state={action.state} className="mt-3" />
    </li>
  );
}
