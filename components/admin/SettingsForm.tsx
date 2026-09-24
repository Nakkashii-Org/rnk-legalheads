"use client";

import { useRef, useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import ErrorSummary from "@/components/forms/ErrorSummary";
import { useAdminAction } from "@/lib/admin/request";

export type SettingsValues = {
  brandName: string;
  legalEntity: string;
  established: string;
  domain: string;
  statement: string;
  disclaimer: string;
  address: string;
  phone: string;
  email: string;
  mapQuery: string;
};

type Key = keyof SettingsValues;

const groups: { title: string; fields: { key: Key; label: string; rows?: number; hint?: string; required?: boolean }[] }[] = [
  {
    title: "Firm identity",
    fields: [
      { key: "brandName", label: "Brand name", required: true },
      { key: "legalEntity", label: "Legal entity", required: true },
      { key: "established", label: "Established year", required: true },
      { key: "domain", label: "Website domain", required: true, hint: "One canonical host, e.g. https://www.rnklegalheads.com" },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { key: "address", label: "Office address", rows: 4, required: true, hint: "Shown on the contact page and in the footer. One line per row." },
      { key: "phone", label: "Telephone", hint: "Leave blank until a verified number is supplied." },
      { key: "email", label: "Enquiry email", required: true },
      { key: "mapQuery", label: "Map location", hint: "Search text used for the Google Map on the contact page." },
    ],
  },
  {
    title: "Footer text",
    fields: [
      { key: "statement", label: "Footer statement", rows: 2, required: true },
      { key: "disclaimer", label: "Footer disclaimer", rows: 3, required: true },
    ],
  },
];

/** A10: controlled settings. API keys and other secrets never belong here (guide p.149). */
export default function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const action = useAdminAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<Record<Key, string>> = {};
    for (const group of groups)
      for (const f of group.fields) if (f.required && !values[f.key].trim()) found[f.key] = `${f.label} is required.`;
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) found.email = "Enter a valid email address.";
    if (values.established && !/^(19|20)\d{2}$/.test(values.established.trim())) found.established = "Enter a four-digit year.";
    if (values.domain && !/^https:\/\/\S+\.\S+$/.test(values.domain.trim())) found.domain = "Enter the full address starting with https://";
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    await action.run("Saving settings", "/settings", { method: "PATCH", body: JSON.stringify(values) }, "Settings saved. The header, footer and contact page have been refreshed.");
  }

  const input = "mt-1.5 w-full border bg-canvas px-3 text-[15px] focus:border-charcoal";

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Site settings" className="max-w-[760px] space-y-8">
      <ErrorSummary
        ref={summaryRef}
        errors={(Object.keys(errors) as Key[]).filter((k) => errors[k]).map((k) => ({ field: `s-${k}`, message: errors[k]! }))}
      />
      {groups.map((group) => (
        <fieldset key={group.title} className="space-y-5 border border-line px-4 py-5 md:px-6">
          <legend className="px-2 font-serif text-[20px] leading-[28px]">{group.title}</legend>
          {group.fields.map((f) => {
            const id = `s-${f.key}`;
            const describedBy = [f.hint && `${id}-hint`, errors[f.key] && `${id}-error`].filter(Boolean).join(" ") || undefined;
            const props = {
              id,
              value: values[f.key],
              "aria-invalid": Boolean(errors[f.key]),
              "aria-describedby": describedBy,
              className: `${input} ${errors[f.key] ? "border-action" : "border-[#8a8782]"} ${f.rows ? "py-2 leading-[24px]" : "h-11"}`,
            };
            const onChange = (v: string) => {
              setValues((prev) => ({ ...prev, [f.key]: v }));
              if (errors[f.key]) setErrors((prev) => ({ ...prev, [f.key]: undefined }));
            };
            return (
              <div key={f.key}>
                <label htmlFor={id} className="text-[14px] font-bold">
                  {f.label} {!f.required && <span className="font-normal text-muted">(optional)</span>}
                </label>
                {f.rows ? (
                  <textarea {...props} rows={f.rows} onChange={(e) => onChange(e.target.value)} />
                ) : (
                  <input {...props} onChange={(e) => onChange(e.target.value)} />
                )}
                {f.hint && (
                  <p id={`${id}-hint`} className="mt-1 text-[12px] text-muted">
                    {f.hint}
                  </p>
                )}
                {errors[f.key] && (
                  <p id={`${id}-error`} className="mt-1 text-[13px] font-bold text-action">
                    {errors[f.key]}
                  </p>
                )}
              </div>
            );
          })}
        </fieldset>
      ))}
      <div className="space-y-4">
        <button type="submit" disabled={action.busy} className="btn btn-primary disabled:opacity-70">
          Save settings
        </button>
        <ActionNotice state={action.state} />
      </div>
    </form>
  );
}
