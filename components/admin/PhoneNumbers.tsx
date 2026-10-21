"use client";

import { useState } from "react";

/** Same checks as the backend (settings.controller.ts). */
export const MAX_PHONES = 3;
const PHONE = /^\+?[0-9 ()-]{7,20}$/;

/** "number 1 | number 2" → ["number 1", "number 2"]. */
export function splitPhones(value: string): string[] {
  return value
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
}

const digits = (p: string) => p.replace(/[^\d+]/g, "");

/**
 * Telephone numbers for the website footer: add up to 3, remove any. The list is saved as one
 * value, "number 1 | number 2 | number 3", which is exactly how the footer shows it.
 */
export default function PhoneNumbers({
  id,
  value,
  onChange,
  pending,
  onPendingChange,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Text typed but not yet added; the form refuses to save while it is not empty. */
  pending: string;
  onPendingChange: (value: string) => void;
  error?: string;
}) {
  const phones = splitPhones(value);
  const [addError, setAddError] = useState("");
  const full = phones.length >= MAX_PHONES;
  const shownError = addError || error;

  function add() {
    const phone = pending.trim().replace(/\s+/g, " ");
    if (!phone) return setAddError("Type a telephone number first.");
    if (full) return setAddError(`You can add up to ${MAX_PHONES} numbers. Remove one to add another.`);
    if (!PHONE.test(phone)) return setAddError("Use digits only (spaces, +, brackets and - allowed), 7 to 20 characters.");
    if (phones.some((p) => digits(p) === digits(phone))) return setAddError("This number has already been added.");
    onChange([...phones, phone].join(" | "));
    onPendingChange("");
    setAddError("");
  }

  function remove(index: number) {
    onChange(phones.filter((_, i) => i !== index).join(" | "));
    setAddError("");
  }

  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-bold">
        Telephone numbers <span className="font-normal text-muted">(optional)</span>
      </label>
      <p id={`${id}-hint`} className="mt-1 text-[12px] text-muted">
        Up to {MAX_PHONES} numbers. Shown in the website footer as: number 1 | number 2 | number 3. Not shown on the contact page.
      </p>

      {phones.length > 0 ? (
        <ul aria-label="Added telephone numbers" className="mt-3 border-t border-line">
          {phones.map((phone, i) => (
            <li key={phone} className="flex min-h-12 items-center justify-between gap-4 border-b border-line text-[15px]">
              <span>
                <span className="mr-3 text-[12px] font-bold tabular-nums text-muted">{i + 1}</span>
                {phone}
              </span>
              <button type="button" onClick={() => remove(i)} className="inline-flex min-h-10 items-center px-2 text-[13px] font-bold text-action hover:underline">
                Remove<span className="sr-only"> {phone}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[14px] text-muted">No telephone numbers added. The footer shows none.</p>
      )}

      {phones.length > 0 && (
        <p className="mt-3 bg-warm px-3 py-2 text-[13px]">
          <span className="text-muted">Footer preview: </span>
          {phones.join(" | ")}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <input
          id={id}
          type="tel"
          value={pending}
          disabled={full}
          placeholder={full ? `${MAX_PHONES} numbers added` : "+91 98765 43210"}
          onChange={(e) => {
            onPendingChange(e.target.value);
            if (addError) setAddError("");
          }}
          onKeyDown={(e) => {
            // Enter adds the number instead of submitting the whole settings form.
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          aria-invalid={Boolean(shownError)}
          aria-describedby={[`${id}-hint`, shownError && `${id}-error`].filter(Boolean).join(" ")}
          className={`h-11 min-w-0 flex-1 border bg-canvas px-3 text-[15px] focus:border-charcoal disabled:bg-warm ${
            shownError ? "border-action" : "border-[#8a8782]"
          }`}
        />
        <button type="button" onClick={add} disabled={full} className="btn btn-secondary h-11 shrink-0 px-4 disabled:opacity-50">
          Add number
        </button>
      </div>
      <p className="mt-1 text-[12px] text-muted">
        {phones.length} of {MAX_PHONES} added. Click Save settings to publish the change.
      </p>
      {shownError && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[13px] font-bold text-action">
          {shownError}
        </p>
      )}
    </div>
  );
}
