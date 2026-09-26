"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import ErrorSummary from "@/components/forms/ErrorSummary";

type Errors = Partial<Record<"password" | "confirm" | "code", string>>;

const inputClass = "mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] focus:border-charcoal aria-[invalid=true]:border-action";

/** Password reset link from an Administrator: new password plus the authenticator code. */
export default function ResetPasswordForm({ token, email, codeRequired }: { token: string; email: string; codeRequired: boolean }) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function show(found: Errors) {
    setErrors(found);
    if (Object.keys(found).length) requestAnimationFrame(() => summaryRef.current?.focus());
    return Object.keys(found).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors = {};
    if (password.length < 12) found.password = "Use at least 12 characters.";
    if (confirm !== password) found.confirm = "The two passwords don't match.";
    if (codeRequired && !/^\d{6}$/.test(code)) found.code = "Enter the 6-digit code from your authenticator app.";
    if (!show(found)) return;

    setBusy(true);
    setFailure(undefined);
    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token, password, code }),
      });
      const data = (await response.json().catch(() => ({}))) as { errors?: Errors };
      if (response.ok) setDone(true);
      else if (response.status === 422 && data.errors) {
        if (data.errors.code) setCode("");
        show(data.errors);
      } else if (response.status === 410) setFailure("This link has expired or has already been used. Ask your CMS Administrator to send a new one.");
      else setFailure("The password couldn't be changed right now. Please try again in a minute.");
    } catch {
      setFailure("The password couldn't be changed right now. Please try again in a minute.");
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div role="status" className="space-y-4">
        <p className="text-[15px] leading-[24px]">Your password has been changed. For your security, you&apos;ve been signed out everywhere.</p>
        <Link href="/admin/login" className="btn btn-primary">
          Sign in with the new password
        </Link>
      </div>
    );

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-[13px] font-bold text-action">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Choose a new password" className="space-y-5">
      <ErrorSummary ref={summaryRef} errors={(Object.keys(errors) as (keyof Errors)[]).filter((k) => errors[k]).map((k) => ({ field: k, message: errors[k]! }))} />
      <input type="email" autoComplete="username" value={email} readOnly hidden />
      <div>
        <label htmlFor="password" className="text-[14px] font-bold">
          New password
        </label>
        <p id="password-hint" className="text-[12px] text-muted">
          At least 12 characters.
        </p>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={`password-hint${errors.password ? " password-error" : ""}`}
          className={`${inputClass} ${errors.password ? "border-action" : "border-[#8a8782]"}`}
        />
        {err("password")}
      </div>
      <div>
        <label htmlFor="confirm" className="text-[14px] font-bold">
          Repeat the password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={Boolean(errors.confirm)}
          aria-describedby={errors.confirm ? "confirm-error" : undefined}
          className={`${inputClass} ${errors.confirm ? "border-action" : "border-[#8a8782]"}`}
        />
        {err("confirm")}
      </div>
      {codeRequired && (
        <div>
          <label htmlFor="code" className="text-[14px] font-bold">
            Code from your authenticator app
          </label>
          <p id="code-hint" className="text-[12px] text-muted">
            This proves the reset is really you, even if someone else reads your email.
          </p>
          <input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            aria-invalid={Boolean(errors.code)}
            aria-describedby={`code-hint${errors.code ? " code-error" : ""}`}
            className={`${inputClass} ${errors.code ? "border-action" : "border-[#8a8782]"} tracking-[0.4em]`}
          />
          {err("code")}
        </div>
      )}
      {failure && (
        <p role="alert" className="border-l-2 border-action bg-warm px-4 py-3 text-[14px] leading-[22px]">
          {failure}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
