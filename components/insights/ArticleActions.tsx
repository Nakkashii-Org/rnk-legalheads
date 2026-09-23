"use client";

import { useState } from "react";

/** Print and copy-link actions for reading pages (K03). */
export default function ArticleActions() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
  }

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button type="button" onClick={() => window.print()} className="btn btn-secondary min-h-11 px-5">
        Print article
      </button>
      <button type="button" onClick={copyLink} className="btn btn-secondary min-h-11 px-5">
        Copy link
      </button>
      <p role="status" aria-live="polite" className="w-full text-[12px] text-muted">
        {copied === "done" ? "Link copied." : copied === "failed" ? "Could not copy. Use the address bar instead." : ""}
      </p>
    </div>
  );
}
