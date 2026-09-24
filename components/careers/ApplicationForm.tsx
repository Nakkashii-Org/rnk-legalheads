"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ErrorSummary from "@/components/forms/ErrorSummary";
import Arrow from "@/components/ui/Arrow";
import {
  COVER_NOTE_MAX,
  EXPERIENCE_OPTIONS,
  RESUME_ACCEPT,
  formatFileSize,
  resumeError,
  validateApplication,
  type ApplicationErrors,
  type ApplicationFields,
  type Option,
} from "@/lib/career-form";

type Status = "idle" | "sending" | "unavailable" | "rate-limited";

const FIELD_ORDER: (keyof ApplicationFields)[] = [
  "name",
  "email",
  "phone",
  "city",
  "position",
  "experience",
  "qualification",
  "barEnrolment",
  "organisation",
  "linkedin",
  "coverNote",
  "resume",
  "consent",
];

type TextKey = Exclude<keyof ApplicationFields, "resume" | "consent">;

const inputClass =
  "mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal aria-[invalid=true]:border-action";

/**
 * Careers application with a compulsory resume. On a vacancy page the position is fixed to that
 * role; on /careers the applicant chooses from the open roles and general positions.
 */
export default function ApplicationForm({
  positions,
  lockedPosition,
}: {
  positions: Option[];
  lockedPosition?: Option;
}) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState<ApplicationFields>({
    name: "",
    email: "",
    phone: "",
    city: "",
    position: lockedPosition?.value ?? "",
    experience: "",
    qualification: "",
    barEnrolment: "",
    organisation: "",
    linkedin: "",
    coverNote: "",
    resume: null,
    consent: false,
  });
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot: hidden from people, often filled by bots. The server decides what to do with it.
  const [website, setWebsite] = useState("");

  const allowed = lockedPosition ? [lockedPosition.value] : positions.map((p) => p.value);

  function update<K extends keyof ApplicationFields>(key: K, value: ApplicationFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFields((prev) => ({ ...prev, resume: file }));
    // Tell the applicant straight away if the file cannot be accepted, rather than on submit.
    setErrors((prev) => ({ ...prev, resume: file ? resumeError(file) : undefined }));
  }

  function removeFile() {
    if (fileRef.current) fileRef.current.value = "";
    update("resume", null);
    fileRef.current?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validateApplication(fields, allowed);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      // Multipart so the resume travels with the fields. The browser sets the boundary header.
      const body = new FormData();
      for (const key of FIELD_ORDER) {
        if (key === "resume") body.append("resume", fields.resume!);
        else if (key === "consent") body.append("consent", String(fields.consent));
        else body.append(key, fields[key].trim());
      }
      body.append("website", website);

      const response = await fetch("/api/careers", { method: "POST", body });

      if (response.ok) {
        const data: { reference?: string } = await response.json().catch(() => ({}));
        if (data.reference) {
          router.push(`/careers/received?ref=${encodeURIComponent(data.reference)}`);
          return;
        }
      } else if (response.status === 422) {
        const data: { errors?: ApplicationErrors } = await response.json().catch(() => ({}));
        if (data.errors && Object.keys(data.errors).length > 0) {
          setErrors(data.errors);
          setStatus("idle");
          requestAnimationFrame(() => summaryRef.current?.focus());
          return;
        }
      } else if (response.status === 429) {
        setStatus("rate-limited");
        return;
      }
      // Anything else, including an endpoint that is not live yet: never report success.
      setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  const errorList = FIELD_ORDER.filter((key) => errors[key]);
  const describedBy = (key: keyof ApplicationFields, hint?: string) =>
    [hint, errors[key] ? `${key}-error` : undefined].filter(Boolean).join(" ") || undefined;
  const fieldError = (key: keyof ApplicationFields) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-[13px] font-bold text-action">
        {errors[key]}
      </p>
    ) : null;
  const borderFor = (key: keyof ApplicationFields) => (errors[key] ? "border-action" : "border-[#8a8782]");
  const optional = <span className="font-normal text-muted">(optional)</span>;

  const textField = (
    key: TextKey,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> & { optional?: boolean; hint?: string } = {},
  ) => {
    const { optional: isOptional, hint, ...rest } = props;
    return (
      <div>
        <label htmlFor={key} className="text-[14px] font-bold">
          {label} {isOptional && optional}
        </label>
        <input
          id={key}
          name={key}
          value={fields[key]}
          onChange={(e) => update(key, e.target.value)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={describedBy(key, hint ? `${key}-hint` : undefined)}
          className={`${inputClass} ${borderFor(key)}`}
          {...rest}
        />
        {hint && (
          <p id={`${key}-hint`} className="mt-1.5 text-[13px] text-muted">
            {hint}
          </p>
        )}
        {fieldError(key)}
      </div>
    );
  };

  const legendClass = "font-serif text-[22px] leading-[30px]";

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Apply to RNK Legalheads" className="space-y-10">
      <ErrorSummary ref={summaryRef} errors={errorList.map((key) => ({ field: key, message: errors[key]! }))} />

      <fieldset className="space-y-6">
        <legend className={legendClass}>Your details</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          {textField("name", "Full name", { autoComplete: "name" })}
          {textField("email", "Email", { type: "email", autoComplete: "email", inputMode: "email", placeholder: "you@example.com" })}
          {textField("phone", "Phone", { type: "tel", autoComplete: "tel", placeholder: "10-digit mobile number" })}
          {textField("city", "Current city", { autoComplete: "address-level2" })}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className={legendClass}>Role and experience</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            {lockedPosition ? (
              <>
                <p className="text-[14px] font-bold">Position applying for</p>
                <p className="mt-1.5 bg-warm px-4 py-3 text-[15px]">
                  {lockedPosition.label}
                </p>
              </>
            ) : (
              <>
                <label htmlFor="position" className="text-[14px] font-bold">
                  Position applying for
                </label>
                <select
                  id="position"
                  name="position"
                  value={fields.position}
                  onChange={(e) => update("position", e.target.value)}
                  aria-invalid={Boolean(errors.position)}
                  aria-describedby={describedBy("position")}
                  className={`${inputClass} ${borderFor("position")} px-3`}
                >
                  <option value="">Choose a position</option>
                  {positions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {fieldError("position")}
              </>
            )}
          </div>
          <div>
            <label htmlFor="experience" className="text-[14px] font-bold">
              Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={fields.experience}
              onChange={(e) => update("experience", e.target.value)}
              aria-invalid={Boolean(errors.experience)}
              aria-describedby={describedBy("experience")}
              className={`${inputClass} ${borderFor("experience")} px-3`}
            >
              <option value="">Choose your experience</option>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {fieldError("experience")}
          </div>
          {textField("qualification", "Highest qualification", { placeholder: "For example, LL.B. or LL.M." })}
          {textField("barEnrolment", "Bar enrolment number", { optional: true })}
          {textField("organisation", "Current organisation", { optional: true, autoComplete: "organization" })}
          <div className="sm:col-span-2">
            {textField("linkedin", "LinkedIn profile", {
              optional: true,
              type: "url",
              inputMode: "url",
              placeholder: "https://www.linkedin.com/in/your-name",
            })}
          </div>
        </div>

        <div>
          <label htmlFor="coverNote" className="text-[14px] font-bold">
            Cover note {optional}
          </label>
          <textarea
            id="coverNote"
            name="coverNote"
            rows={5}
            maxLength={COVER_NOTE_MAX}
            value={fields.coverNote}
            onChange={(e) => update("coverNote", e.target.value)}
            aria-invalid={Boolean(errors.coverNote)}
            aria-describedby={describedBy("coverNote", "coverNote-hint")}
            placeholder="Tell us briefly why you are interested in this role."
            className={`${inputClass} ${borderFor("coverNote")} h-auto py-3 leading-[24px]`}
          />
          <p id="coverNote-hint" className="mt-1.5 flex flex-wrap justify-between gap-2 text-[13px] text-muted">
            <span>Maximum 1,500 characters.</span>
            <span aria-hidden="true">
              {fields.coverNote.length.toLocaleString("en-GB")} / {COVER_NOTE_MAX.toLocaleString("en-GB")}
            </span>
          </p>
          {fieldError("coverNote")}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legendClass}>Resume</legend>
        <label htmlFor="resume" className="mt-4 block text-[14px] font-bold">
          Upload your resume
        </label>
        <p id="resume-hint" className="mt-1 text-[13px] text-muted">
          Required. PDF, DOC or DOCX, up to 5 MB. Do not include identity documents or financial details.
        </p>
        <input
          ref={fileRef}
          id="resume"
          name="resume"
          type="file"
          accept={RESUME_ACCEPT}
          onChange={onFileChange}
          aria-invalid={Boolean(errors.resume)}
          aria-describedby={describedBy("resume", "resume-hint")}
          className={`mt-3 block w-full border border-dashed bg-canvas p-3 text-[14px] text-muted file:mr-4 file:min-h-11 file:border-0 file:bg-charcoal file:px-5 file:text-[13px] file:font-bold file:text-canvas hover:file:bg-action ${
            errors.resume ? "border-action" : "border-[#8a8782]"
          }`}
        />
        {fields.resume && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-warm px-4 py-2 text-[14px]">
            <span className="min-w-0 break-all">
              <strong>{fields.resume.name}</strong>{" "}
              <span className="text-muted">({formatFileSize(fields.resume.size)})</span>
            </span>
            <button type="button" onClick={removeFile} className="inline-flex min-h-11 items-center text-[13px] font-bold underline underline-offset-4 hover:text-action">
              Remove<span className="sr-only"> {fields.resume.name}</span>
            </button>
          </div>
        )}
        {fieldError("resume")}
      </fieldset>

      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={fields.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
          />
          <label htmlFor="consent" className="text-[14px] leading-[22px]">
            I agree that RNK Legalheads may use my details and resume for recruitment only, as described in the{" "}
            <Link href="/privacy-policy" className="underline underline-offset-4">
              privacy notice
            </Link>
            .
          </label>
        </div>
        {fieldError("consent")}
      </div>

      {(status === "unavailable" || status === "rate-limited") && (
        <div role="alert" className="border-l-2 border-action bg-warm px-5 py-4">
          <h2 className="font-serif text-[20px] leading-[28px]">Your application could not be sent</h2>
          <p className="mt-2 text-[14px] leading-[22px] text-muted">
            {status === "rate-limited"
              ? "Too many attempts were made in a short time. Please wait a few minutes and try again. Your details remain in the form."
              : "We could not complete your submission. Your details and resume remain in the form. Please try again later."}
          </p>
        </div>
      )}

      <button type="submit" disabled={status === "sending"} aria-disabled={status === "sending"} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
        {status === "sending" ? "Sending…" : status === "unavailable" || status === "rate-limited" ? "Try again" : "Submit application"}
        {status !== "sending" && <Arrow />}
      </button>
    </form>
  );
}
