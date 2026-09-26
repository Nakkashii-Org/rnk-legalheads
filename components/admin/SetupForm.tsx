"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import MfaEnrolment, { type Enrolment } from "@/components/admin/MfaEnrolment";
import ErrorSummary from "@/components/forms/ErrorSummary";
import Arrow from "@/components/ui/Arrow";

type Errors = Partial<Record<"password" | "confirm" | "code", string>>;

const inputClass =
  "mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] focus:border-charcoal aria-[invalid=true]:border-action";

/** Invitation link: choose a password, then connect an authenticator app. */
export default function SetupForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [enrolment, setEnrolment] = useState<Enrolment>();
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string>();
  const [busy, setBusy] = useState(false);

  function show(found: Errors) {
    setErrors(found);
    if (Object.keys(found).length) requestAnimationFrame(() => summaryRef.current?.focus());
    return Object.keys(found).length === 0;
  }

  async function post(path: string, body: object) {
    setBusy(true);
    setFailure(undefined);
    try {
      const response = await fetch(`/api/admin/setup/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token, ...body }),
      });
      return { status: response.status, data: (await response.json().catch(() => ({}))) as Record<string, unknown> };
    } catch {
      return { status: 0, data: {} };
    } finally {
      setBusy(false);
    }
  }

  const expired = "This setup link has expired or has already been used. Ask your CMS Administrator for a new invitation.";

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors = {};
    if (password.length < 12) found.password = "Use at least 12 characters.";
    if (confirm !== password) found.confirm = "The two passwords don't match.";
    if (!show(found)) return;
    const { status, data } = await post("password", { password });
    if (status === 200) setEnrolment({ qr: String(data.qr), secret: String(data.secret) });
    else if (status === 422) show((data.errors as Errors) ?? { password: "Choose a stronger password." });
    else setFailure(status === 410 ? expired : "Setup isn't available right now. Please try again in a minute.");
  }

  async function onCode(e: React.FormEvent) {
    e.preventDefault();
    if (!show(/^\d{6}$/.test(code) ? {} : { code: "Enter the 6-digit code from your authenticator app." })) return;
    const { status } = await post("verify", { code });
    if (status === 200) {
      router.push("/admin");
      router.refresh();
    } else if (status === 401) {
      setCode("");
      setFailure("That code is not correct. Wait for the next code in the app and try again.");
    } else setFailure(status === 410 ? expired : "Setup isn't available right now. Please try again in a minute.");
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-[13px] font-bold text-action">
        {errors[k]}
      </p>
    ) : null;
  const failureBox = failure && (
    <p role="alert" className="border-l-2 border-action bg-warm px-4 py-3 text-[14px] leading-[22px]">
      {failure}
    </p>
  );

  return (
    <div className="space-y-6">
      <ErrorSummary ref={summaryRef} errors={(Object.keys(errors) as (keyof Errors)[]).filter((k) => errors[k]).map((k) => ({ field: k, message: errors[k]! }))} />

      {!enrolment ? (
        <form onSubmit={onPassword} noValidate aria-label="Choose a password" className="space-y-5">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Step 1 of 2 · Password</p>
          {/* Lets password managers save the new password against the right account. */}
          <input type="email" autoComplete="username" value={email} readOnly hidden />
          <div>
            <label htmlFor="password" className="text-[14px] font-bold">
              New password
            </label>
            <p id="password-hint" className="text-[12px] text-muted">
              At least 12 characters. A short sentence is easy to remember and hard to guess.
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
          {failureBox}
          <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
            {busy ? "Saving…" : "Continue"} {!busy && <Arrow direction="right" />}
          </button>
        </form>
      ) : (
        <form onSubmit={onCode} noValidate aria-label="Connect your authenticator app" className="space-y-5">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Step 2 of 2 · 2-step verification</p>
          <MfaEnrolment enrolment={enrolment} intro="Every sign-in needs your password and a 6-digit code from your phone." />
          <div>
            <label htmlFor="code" className="text-[14px] font-bold">
              Verification code
            </label>
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              aria-invalid={Boolean(errors.code)}
              aria-describedby={errors.code ? "code-error" : undefined}
              className={`${inputClass} ${errors.code ? "border-action" : "border-[#8a8782]"} tracking-[0.4em]`}
            />
            {err("code")}
          </div>
          {failureBox}
          <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
            {busy ? "Verifying…" : "Finish and sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
