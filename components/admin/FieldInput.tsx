"use client";

import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { Field, FieldValue, Option, SourceLink, WorkArea } from "@/lib/admin/config";

export type EditorOptions = { services: Option[]; people: Option[]; publications: Option[] };

const inputClass =
  "mt-1.5 h-11 w-full border bg-canvas px-3 text-[15px] placeholder:text-muted focus:border-charcoal aria-[invalid=true]:border-action";
const smallButton =
  "inline-flex min-h-11 items-center border border-[#8a8782] bg-canvas px-3 text-[13px] hover:border-charcoal disabled:opacity-40 md:min-h-8";

export const fieldId = (name: string) => `f-${name}`;

/** One editor field: label, hint, control and inline error, wired for screen readers. */
export default function FieldInput({
  field,
  value,
  onChange,
  error,
  options,
}: {
  field: Field;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  error?: string;
  options: EditorOptions;
}) {
  const id = fieldId(field.name);
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const border = error ? "border-action" : "border-[#8a8782]";
  const common = { id, "aria-invalid": Boolean(error), "aria-describedby": describedBy };

  const label =
    field.kind === "checkbox" ? null : (
      <span className="text-[14px] font-bold">
        {field.label} {!field.required && <span className="font-normal text-muted">(optional)</span>}
      </span>
    );
  const labelled = (control: React.ReactNode, asGroup = false) =>
    asGroup ? (
      <fieldset aria-describedby={describedBy}>
        <legend className="text-[14px] font-bold">
          {field.label} {!field.required && <span className="font-normal text-muted">(optional)</span>}
        </legend>
        {control}
      </fieldset>
    ) : (
      <>
        <label htmlFor={id}>{label}</label>
        {control}
      </>
    );

  let control: React.ReactNode;

  switch (field.kind) {
    case "text":
    case "url":
    case "date": {
      const text = value as string;
      control = labelled(
        <input
          {...common}
          type={field.kind === "text" ? "text" : field.kind}
          inputMode={field.kind === "url" ? "url" : undefined}
          value={text}
          placeholder={field.kind === "url" ? "https://" : field.kind === "text" ? field.placeholder : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${border}`}
        />,
      );
      break;
    }
    case "slug":
      control = labelled(
        <div className={`mt-1.5 flex items-center border bg-canvas focus-within:border-charcoal ${border}`}>
          <span aria-hidden="true" className="pl-3 text-[14px] text-muted">
            /
          </span>
          <input
            {...common}
            value={value as string}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[15px] outline-none"
          />
        </div>,
      );
      break;
    case "textarea": {
      const text = value as string;
      control = labelled(
        <>
          <textarea
            {...common}
            rows={field.rows ?? 4}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} ${border} h-auto py-2 leading-[24px]`}
          />
          {field.max && (
            <p aria-hidden="true" className={`mt-1 text-right text-[12px] ${text.length > field.max ? "font-bold text-action" : "text-muted"}`}>
              {text.length} / {field.max}
            </p>
          )}
        </>,
      );
      break;
    }
    case "richtext":
      control = (
        <>
          <span id={`${id}-label`}>{label}</span>
          <RichTextEditor id={id} label={field.label} value={value as string} onChange={onChange} invalid={Boolean(error)} describedBy={describedBy} />
        </>
      );
      break;
    case "select":
      control = labelled(
        <select {...common} value={value as string} onChange={(e) => onChange(e.target.value)} className={`${inputClass} ${border}`}>
          <option value="">Choose…</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>,
      );
      break;
    case "checkbox":
      control = (
        <div className="flex items-start gap-3">
          <input
            {...common}
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
          />
          <label htmlFor={id} className="text-[14px] leading-[22px]">
            {field.label}
          </label>
        </div>
      );
      break;
    case "services":
    case "people":
    case "publications": {
      const list = options[field.kind];
      const selected = value as string[];
      const max = "max" in field ? field.max : undefined;
      const ordered = field.kind === "publications";
      const move = (i: number, d: number) => {
        const next = [...selected];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        onChange(next);
      };
      control = labelled(
        <div className="mt-2 space-y-2">
          {selected.length > 0 && (
            <ul className={ordered ? "space-y-2" : "flex flex-wrap gap-2"}>
              {selected.map((v, i) => {
                const name = list.find((o) => o.value === v)?.label ?? v;
                return (
                  <li
                    key={v}
                    className={ordered ? "flex flex-wrap items-center gap-2 border border-line bg-warm px-3 py-2 text-[14px]" : "inline-flex items-center gap-1 border border-line bg-warm pl-3 text-[13px]"}
                  >
                    {ordered && <span className="w-6 text-muted tabular-nums">{i + 1}.</span>}
                    <span className={ordered ? "min-w-0 flex-1" : ""}>{name}</span>
                    {ordered && (
                      <>
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={smallButton} aria-label={`Move ${name} up`}>
                          ↑
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === selected.length - 1} className={smallButton} aria-label={`Move ${name} down`}>
                          ↓
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onChange(selected.filter((x) => x !== v))}
                      aria-label={`Remove ${name}`}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center text-[16px] hover:text-action md:min-h-8 md:min-w-8"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {(!max || selected.length < max) && (
            <select
              {...common}
              value=""
              onChange={(e) => e.target.value && onChange([...selected, e.target.value])}
              className={`${inputClass} ${border} mt-0`}
            >
              <option value="">{list.length === 0 ? "Nothing available yet" : `Add ${field.kind === "people" ? "a person" : field.kind === "services" ? "a service" : "a publication"}…`}</option>
              {list
                .filter((o) => !selected.includes(o.value))
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </select>
          )}
        </div>,
        true,
      );
      break;
    }
    case "list": {
      const items = (value as string[]).length ? (value as string[]) : [""];
      control = labelled(
        <div className="mt-2 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <label htmlFor={i === 0 ? id : `${id}-${i}`} className="sr-only">
                {field.itemLabel} {i + 1}
              </label>
              <input
                id={i === 0 ? id : `${id}-${i}`}
                aria-invalid={Boolean(error)}
                value={item}
                onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                className={`${inputClass} ${border} mt-0`}
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                disabled={items.length === 1}
                className={`${smallButton} shrink-0`}
                aria-label={`Remove ${field.itemLabel.toLowerCase()} ${i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...items, ""])} className={smallButton}>
            + Add {field.itemLabel.toLowerCase()}
          </button>
        </div>,
        true,
      );
      break;
    }
    case "workAreas": {
      const areas = value as WorkArea[];
      const fixed = Boolean(field.count);
      control = labelled(
        <div className="mt-2 space-y-3">
          {areas.map((area, i) => (
            <div key={i} className="border border-line p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Area {i + 1}</p>
                {!fixed && (
                  <button type="button" onClick={() => onChange(areas.filter((_, j) => j !== i))} disabled={areas.length === 1} className={smallButton}>
                    Remove<span className="sr-only"> area {i + 1}</span>
                  </button>
                )}
              </div>
              <label htmlFor={i === 0 ? id : `${id}-${i}-title`} className="mt-2 block text-[13px]">
                Heading
              </label>
              <input
                id={i === 0 ? id : `${id}-${i}-title`}
                value={area.title}
                onChange={(e) => onChange(areas.map((a, j) => (j === i ? { ...a, title: e.target.value } : a)))}
                className={`${inputClass} ${border} mt-1`}
              />
              <label htmlFor={`${id}-${i}-text`} className="mt-2 block text-[13px]">
                Description
              </label>
              <textarea
                id={`${id}-${i}-text`}
                rows={2}
                value={area.text}
                onChange={(e) => onChange(areas.map((a, j) => (j === i ? { ...a, text: e.target.value } : a)))}
                className={`${inputClass} ${border} mt-1 h-auto py-2 leading-[22px]`}
              />
            </div>
          ))}
          {!fixed && (
            <button type="button" onClick={() => onChange([...areas, { title: "", text: "" }])} className={smallButton}>
              + Add area
            </button>
          )}
        </div>,
        true,
      );
      break;
    }
    case "sources": {
      const rows = value as SourceLink[];
      control = labelled(
        <div className="mt-2 space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid gap-2 border border-line p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
              <div>
                <label htmlFor={i === 0 ? id : `${id}-${i}-label`} className="text-[13px]">
                  Source name
                </label>
                <input
                  id={i === 0 ? id : `${id}-${i}-label`}
                  value={row.label}
                  onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
                  className={`${inputClass} ${border} mt-1`}
                />
              </div>
              <div>
                <label htmlFor={`${id}-${i}-url`} className="text-[13px]">
                  Link
                </label>
                <input
                  id={`${id}-${i}-url`}
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  value={row.url}
                  onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, url: e.target.value } : r)))}
                  className={`${inputClass} ${border} mt-1`}
                />
              </div>
              <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} disabled={rows.length === 1} className={smallButton}>
                Remove<span className="sr-only"> source {i + 1}</span>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...rows, { label: "", url: "" }])} className={smallButton}>
            + Add source
          </button>
        </div>,
        true,
      );
      break;
    }
    case "image":
      control = labelled(
        <div id={id} tabIndex={-1} className={`mt-2 flex flex-wrap items-center gap-4 border border-dashed p-4 ${border}`}>
          <span aria-hidden="true" className="flex h-16 w-24 items-center justify-center bg-warm text-[11px] uppercase tracking-[0.12em] text-muted">
            No image
          </span>
          <span className="min-w-0 flex-1 text-[13px] leading-5 text-muted">
            The media library is empty. Upload an approved image in the{" "}
            <Link href="/admin/media" className="text-charcoal underline underline-offset-4">
              media library
            </Link>
            , then choose it here.
          </span>
        </div>,
        true,
      );
      break;
  }

  return (
    <div>
      {control}
      {field.hint && (
        <p id={hintId} className="mt-1 text-[12px] leading-[18px] text-muted">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-[13px] font-bold text-action">
          {error}
        </p>
      )}
    </div>
  );
}
