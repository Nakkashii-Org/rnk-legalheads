"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import MfaEnrolment, { type Enrolment } from "@/components/admin/MfaEnrolment";
import ErrorSummary from "@/components/forms/ErrorSummary";
import Arrow from "@/components/ui/Arrow";

type Step = "credentials" | "mfa";
type Errors = Partial<Record<"email" | "password" | "code", string>>;

const inputClass =
  "mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal aria-[invalid=true]:border-action";

/** A01: named accounts, password then authenticator code. No sign-up and no shared password. */
export default function LoginForm() {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("credentials");
  const [enrolment, setEnrolment] = useState<Enrolment>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string>();
  const [busy, setBusy] = useState(false);

  function showErrors(found: Errors) {
    setErrors(found);
    if (Object.keys(found).length) requestAnimationFrame(() => summaryRef.current?.focus());
    return Object.keys(found).length === 0;
  }

  async function post(path: string, body: object) {
    setBusy(true);
    setFailure(undefined);
    try {
      const response = await fetch(`/api/admin/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as Record<string, string>;
      return { status: response.status, data };
    } catch {
      return { status: 0, data: {} as Record<string, string> };
    } finally {
      setBusy(false);
    }
  }

  const unavailable = "Sign-in isn't available right now. Please try again in a minute.";

  async function onCredentials(event: React.FormEvent) {
    event.preventDefault();
    const found: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = "Enter your work email address.";
    if (!password) found.password = "Enter your password.";
    if (!showErrors(found)) return;
    const { status, data } = await post("login", { email: email.trim(), password });
    if (status === 200) {
      setPassword("");
      setCode("");
      setEnrolment(data.step === "enroll" ? { qr: data.qr, secret: data.secret } : undefined);
      setStep("mfa");
      requestAnimationFrame(() => codeRef.current?.focus());
    } else if (status === 401) setFailure("The email address or password is not correct.");
    else if (status === 429)
      setFailure(data.error === "locked" ? "Too many wrong attempts. This account is locked for 15 minutes." : "Too many attempts. Please wait a few minutes.");
    else setFailure(unavailable);
  }

  async function onCode(event: React.FormEvent) {
    event.preventDefault();
    if (!showErrors(/^\d{6}$/.test(code) ? {} : { code: "Enter the 6-digit code from your authenticator app." })) return;
    const { status, data } = await post("mfa", { code });
    if (status === 200) {
      router.push("/admin");
      router.refresh();
    } else if (status === 401 && data.error === "start_again") {
      setStep("credentials");
      setEnrolment(undefined);
      setFailure("For your security, please sign in again.");
    } else if (status === 401) {
      setCode("");
      setFailure("That code is not correct or has already been used. Wait for the next code and try again.");
    } else if (status === 429) setFailure("Too many attempts. Please wait a few minutes.");
    else setFailure(unavailable);
  }

  const errorList = (Object.keys(errors) as (keyof Errors)[]).filter((k) => errors[k]);
  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-[13px] font-bold text-action">
        {errors[key]}
      </p>
    ) : null;
  const failureBox = failure && (
    <p role="alert" className="border-l-2 border-action bg-warm px-4 py-3 text-[14px] leading-[22px]">
      {failure}
    </p>
  );

  return (
    <div className="space-y-6">
      <ErrorSummary ref={summaryRef} errors={errorList.map((k) => ({ field: k, message: errors[k]! }))} />

      {step === "credentials" ? (
        <form onSubmit={onCredentials} noValidate aria-label="Sign in" className="space-y-5">
          <div>
            <label htmlFor="email" className="text-[14px] font-bold">
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${inputClass} ${errors.email ? "border-action" : "border-[#8a8782]"}`}
            />
            {fieldError("email")}
          </div>
          <div>
            <label htmlFor="password" className="text-[14px] font-bold">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${inputClass} ${errors.password ? "border-action" : "border-[#8a8782]"}`}
            />
            {fieldError("password")}
          </div>
          {failureBox}
          <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
            {busy ? "Checking…" : "Continue"} {!busy && <Arrow direction="right" />}
          </button>
        </form>
      ) : (
        <form onSubmit={onCode} noValidate aria-label="Two-step verification" className="space-y-5">
          {enrolment ? (
            <MfaEnrolment enrolment={enrolment} intro="Your 2-step verification was reset. Connect your authenticator app again:" />
          ) : (
            <p className="text-[14px] leading-[22px] text-muted">Open your authenticator app and enter the 6-digit code for RNK Legalheads CMS.</p>
          )}
          <div>
            <label htmlFor="code" className="text-[14px] font-bold">
              Verification code
            </label>
            <input
              ref={codeRef}
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
            {fieldError("code")}
          </div>
          {failureBox}
          <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
            {busy ? "Verifying…" : "Verify and sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("credentials");
              setEnrolment(undefined);
              setFailure(undefined);
            }}
            className="inline-flex min-h-11 items-center text-[13px] underline underline-offset-4"
          >
            Use a different account
          </button>
        </form>
      )}

      <p className="border-t border-line pt-5 text-[13px] leading-5 text-muted">
        Accounts are created by the firm&apos;s CMS Administrator. There is no public sign-up. Forgot your password? Ask
        the Administrator to send you a password reset link. Lost your phone? Ask them to reset your 2-step verification.
      </p>
    </div>
  );
}
