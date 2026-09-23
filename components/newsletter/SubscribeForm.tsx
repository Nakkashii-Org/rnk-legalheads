"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ErrorSummary from "@/components/forms/ErrorSummary";
import TopicFieldset from "@/components/forms/TopicFieldset";
import Arrow from "@/components/ui/Arrow";
import { SUBSCRIPTION_NOTICE_VERSION, validateSubscribe, type SubscribeErrors, type SubscribeFields } from "@/lib/newsletter";

type Status = "idle" | "sending" | "unavailable" | "rate-limited";

export default function SubscribeForm({ initialTopics = [] }: { initialTopics?: string[] }) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<SubscribeFields>({ email: "", topics: initialTopics, consent: false });
  const [errors, setErrors] = useState<SubscribeErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [website, setWebsite] = useState("");

  function update<K extends keyof SubscribeFields>(key: K, value: SubscribeFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function showErrors(found: SubscribeErrors) {
    setErrors(found);
    setStatus("idle");
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const found = validateSubscribe(fields);
    if (Object.values(found).some(Boolean)) return showErrors(found);

    setStatus("sending");
    try {
      // Contract from guide p.158: the server starts the provider's double opt-in; nothing is sent to the list yet.
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email.trim(),
          topics: fields.topics,
          consent: fields.consent,
          noticeVersion: SUBSCRIPTION_NOTICE_VERSION,
          website,
        }),
      });
      if (response.ok) {
        // Neutral pending page; it never reveals whether the address already exists (guide p.130).
        router.push("/subscribe/pending");
        return;
      }
      if (response.status === 422) {
        const data: { errors?: SubscribeErrors } = await response.json().catch(() => ({}));
        if (data.errors && Object.keys(data.errors).length > 0) return showErrors(data.errors);
      }
      setStatus(response.status === 429 ? "rate-limited" : "unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  const errorList = (["email", "topics", "consent"] as const)
    .filter((key) => errors[key])
    .map((key) => ({ field: key, message: errors[key]! }));

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Subscribe to RNK legal updates" className="space-y-6">
      <ErrorSummary ref={summaryRef} errors={errorList} />

      <div>
        <label htmlFor="email" className="text-[14px] font-bold">
          Email address
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
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="you@example.com"
          className={`mt-1.5 h-12 w-full border bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal ${
            errors.email ? "border-action" : "border-[#8a8782]"
          }`}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-[13px] font-bold text-action">
            {errors.email}
          </p>
        )}
      </div>

      <TopicFieldset
        selected={fields.topics}
        error={errors.topics}
        onToggle={(id, checked) =>
          update("topics", checked ? [...fields.topics, id] : fields.topics.filter((t) => t !== id))
        }
      />

      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {/* Separate, unticked consent control (guide p.129). */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={fields.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
          />
          <label htmlFor="consent" className="text-[14px] leading-[22px]">
            I agree to receive the legal updates I select from RNK Legalheads. I can unsubscribe or change my
            preferences at any time.
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-[13px] font-bold text-action">
            {errors.consent}
          </p>
        )}
        <p className="mt-3 text-[13px] leading-[20px] text-muted">
          We use your email address and selected topics to manage your subscription. Read our{" "}
          <Link href="/privacy-policy" className="underline underline-offset-4">
            privacy notice
          </Link>
          .
        </p>
      </div>

      {(status === "unavailable" || status === "rate-limited") && (
        <div role="alert" className="border-l-2 border-action bg-warm px-5 py-4">
          <h2 className="font-serif text-[20px] leading-[28px]">We could not send the confirmation email</h2>
          <p className="mt-2 text-[14px] leading-[22px] text-muted">
            {status === "rate-limited"
              ? "Too many attempts were made in a short time. Please wait a few minutes and try again."
              : "Your subscription has not been started. Please try again later. Your choices remain in the form."}
          </p>
        </div>
      )}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
        {status === "sending" ? "Sending…" : "Send confirmation email"}
        {status !== "sending" && <Arrow />}
      </button>
    </form>
  );
}
