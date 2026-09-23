"use client";

import Link from "next/link";
import { useState } from "react";
import Arrow from "@/components/ui/Arrow";

type Status = "idle" | "working" | "done" | "failed";

/**
 * One deliberate click, no login (guide p.131). A button rather than a plain link, so email
 * scanners that prefetch links cannot unsubscribe someone by accident.
 */
export default function UnsubscribeConfirm({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function unsubscribe() {
    setStatus("working");
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setStatus(response.ok ? "done" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div role="status">
        <h2 className="font-serif text-[26px] leading-[34px] text-charcoal">You have been unsubscribed</h2>
        <p className="mt-3">You have been unsubscribed from RNK legal updates.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Return to the website <Arrow />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p>Select the button below to stop receiving RNK legal updates at this address.</p>
      {status === "failed" && (
        <p role="alert" className="mt-4 border-l-2 border-action bg-canvas px-4 py-3 text-[14px]">
          We could not complete the request. You have not been unsubscribed yet. Please try again later.
        </p>
      )}
      <button type="button" onClick={unsubscribe} disabled={status === "working"} className="btn btn-primary mt-8 disabled:cursor-wait disabled:opacity-70">
        {status === "working" ? "Unsubscribing…" : "Unsubscribe"}
      </button>
    </div>
  );
}
