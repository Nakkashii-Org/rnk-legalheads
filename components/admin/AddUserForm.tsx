"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import ErrorSummary from "@/components/forms/ErrorSummary";
import { ROLES } from "@/lib/admin/config";
import { useAdminAction } from "@/lib/admin/request";
import type { ActionState } from "@/lib/admin/request";

type Errors = Partial<Record<"u-name" | "u-email" | "u-roles", string>>;

/** Administrator only. The new user gets an email to set a password and an authenticator. */
export default function AddUserForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const action = useAdminAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors = {};
    if (name.trim().length < 2) found["u-name"] = "Enter the person's full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found["u-email"] = "Enter a valid work email address.";
    if (roles.length === 0) found["u-roles"] = "Choose at least one role.";
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    action.setState({ kind: "working", label: "Sending invitation" });
    let result: ActionState;
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), roles }),
      });
      const data = (await response.json().catch(() => ({}))) as { emailed?: boolean; errors?: Errors };
      if (response.ok) {
        result = {
          kind: "done",
          message: data.emailed
            ? `Invitation sent to ${email.trim()}. They set a password and connect an authenticator before their first sign-in.`
            : `Account created for ${email.trim()}, but the invitation email could not be sent. Use "Resend invitation" in the list.`,
        };
        setName("");
        setEmail("");
        setRoles([]);
        router.refresh();
      } else if (response.status === 422 && data.errors) {
        setErrors(data.errors);
        requestAnimationFrame(() => summaryRef.current?.focus());
        result = { kind: "idle" };
      } else if (response.status === 401 || response.status === 403) {
        result = { kind: "failed", message: "Only a signed-in Administrator can invite users. Please sign in again." };
      } else result = { kind: "failed", message: "The invitation could not be sent. Please try again." };
    } catch {
      result = { kind: "failed", message: "The invitation could not be sent. Please try again." };
    }
    action.setState(result);
  }

  const input = "mt-1 h-11 w-full border bg-canvas px-3 text-[15px] focus:border-charcoal";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 text-[13px] font-bold text-action">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Add a user" className="space-y-5 border border-line px-4 py-5 md:px-6">
      <h2 className="font-serif text-[20px] leading-[28px]">Add a user</h2>
      <ErrorSummary ref={summaryRef} errors={(Object.keys(errors) as (keyof Errors)[]).filter((k) => errors[k]).map((k) => ({ field: k, message: errors[k]! }))} />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="u-name" className="text-[14px] font-bold">
            Full name
          </label>
          <input
            id="u-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors["u-name"])}
            aria-describedby={errors["u-name"] ? "u-name-error" : undefined}
            className={`${input} ${errors["u-name"] ? "border-action" : "border-[#8a8782]"}`}
          />
          {err("u-name")}
        </div>
        <div>
          <label htmlFor="u-email" className="text-[14px] font-bold">
            Work email
          </label>
          <input
            id="u-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors["u-email"])}
            aria-describedby={errors["u-email"] ? "u-email-error" : undefined}
            className={`${input} ${errors["u-email"] ? "border-action" : "border-[#8a8782]"}`}
          />
          {err("u-email")}
        </div>
      </div>
      <fieldset aria-describedby={errors["u-roles"] ? "u-roles-error" : undefined}>
        <legend className="text-[14px] font-bold">Roles</legend>
        <p className="text-[12px] text-muted">One person can hold more than one role.</p>
        <ul className="mt-2 grid gap-2 md:grid-cols-2">
          {ROLES.map((role, i) => (
            <li key={role.value} className="flex items-start gap-3 border border-line px-3 py-2">
              <input
                id={i === 0 ? "u-roles" : `u-role-${role.value}`}
                type="checkbox"
                checked={roles.includes(role.value)}
                onChange={(e) => {
                  setRoles((prev) => (e.target.checked ? [...prev, role.value] : prev.filter((r) => r !== role.value)));
                  if (errors["u-roles"]) setErrors((prev) => ({ ...prev, "u-roles": undefined }));
                }}
                className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
              />
              <label htmlFor={i === 0 ? "u-roles" : `u-role-${role.value}`} className="text-[14px] leading-[20px]">
                <strong>{role.label}</strong>
                <span className="block text-[12px] text-muted">{role.text}</span>
              </label>
            </li>
          ))}
        </ul>
        {err("u-roles")}
      </fieldset>
      <button type="submit" disabled={action.busy} className="btn btn-primary disabled:opacity-70">
        Send invitation
      </button>
      <ActionNotice state={action.state} />
    </form>
  );
}
