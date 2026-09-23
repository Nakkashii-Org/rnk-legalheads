"use client";

import Link from "next/link";
import { useState } from "react";
import TopicFieldset from "@/components/forms/TopicFieldset";

type Status = "idle" | "saving" | "saved" | "failed";

/**
 * Topic preferences for the owner of a signed link (L06). The token is sent only to our own
 * server; it is never logged, sent to analytics or placed in a third-party request (guide p.131).
 */
export default function PreferencesForm({ token, initialTopics }: { token: string; initialTopics: string[] }) {
  const [topics, setTopics] = useState<string[]>(initialTopics);
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving") return;
    if (topics.length === 0) {
      setError("Choose at least one topic, or unsubscribe from all updates.");
      return;
    }
    setError(undefined);
    setStatus("saving");
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, topics }),
      });
      setStatus(response.ok ? "saved" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Newsletter preferences" className="space-y-6">
      <TopicFieldset
        selected={topics}
        error={error}
        onToggle={(id, checked) => {
          setTopics((prev) => (checked ? [...prev, id] : prev.filter((t) => t !== id)));
          setStatus("idle");
          setError(undefined);
        }}
      />

      <div role="status" aria-live="polite">
        {status === "saved" && <p className="border-l-2 border-charcoal bg-warm px-5 py-4 text-[14px]">Your preferences have been saved.</p>}
        {status === "failed" && (
          <p className="border-l-2 border-action bg-warm px-5 py-4 text-[14px] text-muted">
            Your preferences could not be saved. Nothing has changed. Please try again later.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <button type="submit" disabled={status === "saving"} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
          {status === "saving" ? "Saving…" : "Save preferences"}
        </button>
        <Link href={`/unsubscribe?token=${encodeURIComponent(token)}`} className="link-action">
          Unsubscribe from all updates
        </Link>
      </div>
    </form>
  );
}
