"use client";

import { useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import { useAdminAction } from "@/lib/admin/request";

const CHECKLIST = [
  "Facts, names and dates match the primary sources.",
  "Every legal proposition is supported by a linked official source.",
  "Court decision and RNK commentary are clearly separated.",
  "No guarantees, comparisons, testimonials or unsupported claims.",
  "Author, reviewer and dates are correct.",
  "Wording meets professional-conduct requirements.",
];

/** A04 actions. Approve needs the full checklist; request changes and reject need a comment. */
export default function ReviewPanel({ path }: { path: string }) {
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false));
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const action = useAdminAction();
  const allChecked = checked.every(Boolean);

  const withComment = (label: string, suffix: string, message: string) => {
    if (comment.trim().length < 10) {
      setCommentError("Add a comment of at least 10 characters so the author knows what to change.");
      document.getElementById("review-comment")?.focus();
      return;
    }
    setCommentError("");
    action.run(label, `${path}/${suffix}`, { method: "POST", body: JSON.stringify({ comment: comment.trim() }) }, message);
  };

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-[15px] font-bold">Review checklist</legend>
        <ul className="mt-3 space-y-3">
          {CHECKLIST.map((item, i) => (
            <li key={item} className="flex items-start gap-3">
              <input
                id={`check-${i}`}
                type="checkbox"
                checked={checked[i]}
                onChange={(e) => setChecked((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))}
                className="mt-0.5 h-5 w-5 shrink-0 accent-charcoal"
              />
              <label htmlFor={`check-${i}`} className="text-[14px] leading-[22px]">
                {item}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div>
        <label htmlFor="review-comment" className="text-[14px] font-bold">
          Comment
        </label>
        <p id="review-comment-hint" className="text-[12px] text-muted">
          Required when requesting changes or rejecting. Kept with the approval record.
        </p>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-invalid={Boolean(commentError)}
          aria-describedby={`review-comment-hint${commentError ? " review-comment-error" : ""}`}
          className={`mt-1.5 w-full border bg-canvas px-3 py-2 text-[15px] leading-[24px] focus:border-charcoal ${commentError ? "border-action" : "border-[#8a8782]"}`}
        />
        {commentError && (
          <p id="review-comment-error" className="mt-1 text-[13px] font-bold text-action">
            {commentError}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          disabled={!allChecked || action.busy}
          aria-describedby="approve-hint"
          onClick={() => action.run("Approving", `${path}/approve`, { method: "POST", body: JSON.stringify({ comment: comment.trim() }) }, "Revision approved. A publisher can now release it.")}
          className="btn btn-primary justify-center disabled:opacity-50"
        >
          Approve this revision
        </button>
        <p id="approve-hint" className="text-[12px] text-muted">
          {allChecked ? "Approval applies to this exact revision only." : "Tick every checklist item to approve."}
        </p>
        <button type="button" disabled={action.busy} onClick={() => withComment("Requesting changes", "request-changes", "Changes requested. The author has been notified.")} className="btn btn-secondary justify-center">
          Request changes
        </button>
        <button
          type="button"
          disabled={action.busy}
          onClick={() => withComment("Rejecting", "reject", "Record rejected and archived.")}
          className="inline-flex min-h-11 items-center justify-center text-[13px] text-action underline underline-offset-4"
        >
          Reject
        </button>
      </div>

      <div className="border-t border-line pt-4">
        <p className="text-[13px] leading-5 text-muted">Publisher only, after approval:</p>
        <div className="mt-2 grid gap-2">
          <button type="button" disabled={action.busy} onClick={() => action.run("Publishing", `${path}/publish`, { method: "POST" }, "Published. The website has been refreshed.")} className="btn btn-secondary justify-center">
            Publish
          </button>
          <button type="button" disabled={action.busy} onClick={() => action.run("Unpublishing", `${path}/unpublish`, { method: "POST" }, "Unpublished and removed from listings, search and the sitemap.")} className="inline-flex min-h-11 items-center justify-center text-[13px] underline underline-offset-4">
            Unpublish
          </button>
        </div>
      </div>

      <ActionNotice state={action.state} />
    </div>
  );
}
