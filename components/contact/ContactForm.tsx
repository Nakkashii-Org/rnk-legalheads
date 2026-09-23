"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ErrorSummary from "@/components/forms/ErrorSummary";
import Arrow from "@/components/ui/Arrow";
import {
  GENERAL_ENQUIRY,
  MESSAGE_MAX,
  NOT_SURE,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contact-form";

type ServiceOption = { slug: string; title: string };
export type EnquiryContext = { kind: "person" | "industry"; slug: string; label: string };

type Status = "idle" | "sending" | "unavailable" | "rate-limited";

const FIELD_ORDER: (keyof ContactFields)[] = ["name", "email", "phone", "organisation", "service", "message", "acknowledged"];

const inputClass =
  "mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal aria-[invalid=true]:border-action";

export default function ContactForm({
  services,
  initialService,
  context,
}: {
  services: ServiceOption[];
  initialService: string;
  context?: EnquiryContext;
}) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<ContactFields>({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    service: initialService,
    message: "",
    acknowledged: false,
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot: hidden from people, often filled by bots. The server decides what to do with it.
  const [website, setWebsite] = useState("");

  const allowed = [...services.map((s) => s.slug), GENERAL_ENQUIRY, NOT_SURE];

  function update<K extends keyof ContactFields>(key: K, value: ContactFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validateContact(fields, allowed);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      // Contract from guide p.158. Only the non-sensitive reference comes back.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          context: context ? { kind: context.kind, slug: context.slug } : undefined,
          website,
        }),
      });

      if (response.ok) {
        const data: { reference?: string } = await response.json().catch(() => ({}));
        if (data.reference) {
          router.push(`/contact/received?ref=${encodeURIComponent(data.reference)}`);
          return;
        }
      } else if (response.status === 422) {
        const data: { errors?: ContactErrors } = await response.json().catch(() => ({}));
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
      // Anything else, including an endpoint that is not live yet: never report success (guide p.156).
      setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  const errorList = FIELD_ORDER.filter((key) => errors[key]);
  const describedBy = (key: keyof ContactFields, hint?: string) =>
    [hint, errors[key] ? `${key}-error` : undefined].filter(Boolean).join(" ") || undefined;
  const fieldError = (key: keyof ContactFields) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-[13px] font-bold text-action">
        {errors[key]}
      </p>
    ) : null;
  const borderFor = (key: keyof ContactFields) => (errors[key] ? "border-action" : "border-[#8a8782]");

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Contact RNK Legalheads" className="space-y-6">
      <ErrorSummary ref={summaryRef} errors={errorList.map((key) => ({ field: key, message: errors[key]! }))} />

      {context && (
        <p className="bg-warm px-4 py-3 text-[14px]">
          {context.kind === "person" ? "Enquiry for" : "Sector"}: <strong>{context.label}</strong>
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-[14px] font-bold">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            placeholder="Your name"
            className={`${inputClass} ${borderFor("name")}`}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="email" className="text-[14px] font-bold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            placeholder="you@example.com"
            className={`${inputClass} ${borderFor("email")}`}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor="phone" className="text-[14px] font-bold">
            Phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            placeholder="Country code and number"
            className={`${inputClass} ${borderFor("phone")}`}
          />
          {fieldError("phone")}
        </div>
        <div>
          <label htmlFor="organisation" className="text-[14px] font-bold">
            Organisation <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            autoComplete="organization"
            value={fields.organisation}
            onChange={(e) => update("organisation", e.target.value)}
            aria-invalid={Boolean(errors.organisation)}
            aria-describedby={describedBy("organisation")}
            className={`${inputClass} ${borderFor("organisation")}`}
          />
          {fieldError("organisation")}
        </div>
      </div>

      <div>
        <label htmlFor="service" className="text-[14px] font-bold">
          Service
        </label>
        <select
          id="service"
          name="service"
          value={fields.service}
          onChange={(e) => update("service", e.target.value)}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={describedBy("service")}
          className={`${inputClass} ${borderFor("service")} px-3`}
        >
          <option value={GENERAL_ENQUIRY}>General enquiry</option>
          <option value={NOT_SURE}>Not sure</option>
          {services.length > 0 && (
            <optgroup label="Services">
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        {fieldError("service")}
      </div>

      <div>
        <label htmlFor="message" className="text-[14px] font-bold">
          Your enquiry
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={MESSAGE_MAX}
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", "message-hint")}
          placeholder="Please provide a brief, non-confidential description."
          className={`${inputClass} ${borderFor("message")} h-auto py-3 leading-[24px]`}
        />
        <p id="message-hint" className="mt-1.5 flex flex-wrap justify-between gap-2 text-[13px] text-muted">
          <span>Maximum 1,500 characters. Do not include documents or sensitive details.</span>
          <span aria-hidden="true">
            {fields.message.length.toLocaleString("en-GB")} / {MESSAGE_MAX.toLocaleString("en-GB")}
          </span>
        </p>
        {fieldError("message")}
      </div>

      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="acknowledged"
            name="acknowledged"
            type="checkbox"
            checked={fields.acknowledged}
            onChange={(e) => update("acknowledged", e.target.checked)}
            aria-invalid={Boolean(errors.acknowledged)}
            aria-describedby={describedBy("acknowledged")}
            className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
          />
          <label htmlFor="acknowledged" className="text-[14px] leading-[22px]">
            I understand that submitting this form does not create a lawyer-client relationship. My details will be
            used to assess and respond to this enquiry as described in the{" "}
            <Link href="/privacy-policy" className="underline underline-offset-4">
              privacy notice
            </Link>
            .
          </label>
        </div>
        {fieldError("acknowledged")}
      </div>

      {(status === "unavailable" || status === "rate-limited") && (
        <div role="alert" className="border-l-2 border-action bg-warm px-5 py-4">
          <h2 className="font-serif text-[20px] leading-[28px]">Your enquiry could not be sent</h2>
          <p className="mt-2 text-[14px] leading-[22px] text-muted">
            {status === "rate-limited"
              ? "Too many attempts were made in a short time. Please wait a few minutes and try again. Your message remains in the form."
              : "We could not complete your submission. Your message remains in the form. Please try again or use the published contact details. Do not rely on this form for urgent deadlines."}
          </p>
        </div>
      )}

      <button type="submit" disabled={status === "sending"} aria-disabled={status === "sending"} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
        {status === "sending" ? "Sending…" : status === "unavailable" || status === "rate-limited" ? "Try again" : "Send enquiry"}
        {status !== "sending" && <Arrow />}
      </button>
    </form>
  );
}
