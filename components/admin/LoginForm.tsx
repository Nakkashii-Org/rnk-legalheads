"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ErrorSummary from "@/components/forms/ErrorSummary";
import Arrow from "@/components/ui/Arrow";

type Step = "credentials" | "mfa";
type Errors = Partial<Record<"email" | "password" | "code", string>>;

const inputClass =
  "mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal aria-[invalid=true]:border-action";

/** A01: named accounts, password then authenticator code. No sign-up and no shared password. */
export default function LoginForm({ initialStep = "credentials" }: { initialStep?: Step }) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(initialStep);
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
      return response;
    } catch {
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  function explain(response: Response | undefined) {
    if (response?.status === 401) setFailure("The email address or password is not correct.");
    else if (response?.status === 429) setFailure("Too many attempts. Sign-in is locked for a few minutes.");
    else setFailure("Sign-in is not available yet. The CMS backend is not connected, so no account can be checked.");
  }

  async function onCredentials(event: React.FormEvent) {
    event.preventDefault();
    const found: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = "Enter your work email address.";
    if (!password) found.password = "Enter your password.";
    if (!showErrors(found)) return;
    const response = await post("login", { email: email.trim(), password });
    if (response?.ok) {
      setPassword("");
      setStep("mfa");
    } else explain(response);
  }

  async function onCode(event: React.FormEvent) {
    event.preventDefault();
    if (!showErrors(/^\d{6}$/.test(code) ? {} : { code: "Enter the 6-digit code from your authenticator app." })) return;
    const response = await post("mfa", { code });
    if (response?.ok) router.push("/admin");
    else if (response?.status === 401) setFailure("That code is not correct or has expired. Try the current code.");
    else explain(response);
  }

  const errorList = (Object.keys(errors) as (keyof Errors)[]).filter((k) => errors[k]);
  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-[13px] font-bold text-action">
        {errors[key]}
      </p>
    ) : null;

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
          {failure && (
            <p role="alert" className="border-l-2 border-action bg-warm px-4 py-3 text-[14px] leading-[22px]">
              {failure}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
            {busy ? "Checking…" : "Continue"} {!busy && <Arrow direction="right" />}
          </button>
        </form>
      ) : (
        <form onSubmit={onCode} noValidate aria-label="Two-step verification" className="space-y-5">
          <p className="text-[14px] leading-[22px] text-muted">Open your authenticator app and enter the 6-digit code for RNK CMS.</p>
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
            {fieldError("code")}
          </div>
          {failure && (
            <p role="alert" className="border-l-2 border-action bg-warm px-4 py-3 text-[14px] leading-[22px]">
              {failure}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
            {busy ? "Verifying…" : "Verify and sign in"}
          </button>
          <button type="button" onClick={() => setStep("credentials")} className="inline-flex min-h-11 items-center text-[13px] underline underline-offset-4">
            Use a different account
          </button>
        </form>
      )}

      <p className="border-t border-line pt-5 text-[13px] leading-5 text-muted">
        Accounts are created by the firm&apos;s CMS Administrator. There is no public sign-up. If you have forgotten your
        password or lost your authenticator, ask the Administrator to reset it.
      </p>
    </div>
  );
}
