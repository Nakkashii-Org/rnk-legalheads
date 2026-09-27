"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ActionNotice from "@/components/admin/ActionNotice";
import type { WorkflowStatus } from "@/lib/admin/config";
import type { Workflow } from "@/lib/admin/records";
import { useAdminAction } from "@/lib/admin/request";
import type { AdminRole } from "@/lib/admin/session";

const CHECKLIST = [
  "Facts, names and dates match the primary sources.",
  "Every legal proposition is supported by a linked official source.",
  "Court decision and RNK commentary are clearly separated.",
  "No guarantees, comparisons, testimonials or unsupported claims.",
  "Author, reviewer and dates are correct.",
  "Wording meets professional-conduct requirements.",
];

/** The website caches content for up to 5 minutes; after publishing, it is refreshed at once. */
const refreshSite = () => fetch("/admin/refresh-site", { method: "POST" }).catch(() => undefined);

/**
 * A04 actions (phase D). Legal reviewers approve (full checklist), request changes or reject (with
 * a comment); publishers publish and unpublish. The server checks every rule again.
 */
export default function ReviewPanel({
  path,
  status,
  workflow,
  roles,
  email,
  publicHref,
}: {
  path: string;
  status: WorkflowStatus;
  workflow: Workflow;
  roles: AdminRole[];
  email: string;
  publicHref: string;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false));
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const action = useAdminAction();
  const allChecked = checked.every(Boolean);

  const admin = roles.includes("admin");
  const canReview = admin || roles.includes("reviewer");
  const canPublish = admin || roles.includes("publisher");
  const ownRevision = workflow.updatedBy === email && !admin;
  const approvedNow = workflow.approval?.revision === workflow.revision;
  const publishable = approvedNow && (status === "approved" || status === "unpublished");
  const live = Boolean(workflow.live);

  async function run(label: string, suffix: string, message: string, body?: object, site = false) {
    const ok = await action.run(label, `${path}/${suffix}`, { method: "POST", body: body ? JSON.stringify(body) : undefined }, message);
    if (!ok) return;
    if (site) await refreshSite();
    setComment("");
    setChecked(CHECKLIST.map(() => false));
    router.refresh();
  }

  const withComment = (label: string, suffix: string, message: string) => {
    if (comment.trim().length < 10) {
      setCommentError("Add a comment of at least 10 characters so the author knows what to change.");
      document.getElementById("review-comment")?.focus();
      return;
    }
    setCommentError("");
    run(label, suffix, message, { comment: comment.trim() });
  };

  return (
    <div className="space-y-5">
      {!canReview ? (
        <p className="text-[13px] leading-5 text-muted">Only a Legal reviewer or Administrator can approve, request changes or reject.</p>
      ) : status !== "in_review" ? (
        <p className="text-[13px] leading-5 text-muted">
          Nothing to review: this record is not in review. {status === "approved" && "It has been approved and is ready to publish."}
        </p>
      ) : (
        <>
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
              Required when requesting changes or rejecting. Kept with the review record and shown to the author.
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
              disabled={!allChecked || action.busy || ownRevision}
              aria-describedby="approve-hint"
              onClick={() => run("Approving", "approve", "Revision approved. A publisher can now publish it.", { checklist: checked, comment: comment.trim() })}
              className="btn btn-primary justify-center disabled:opacity-50"
            >
              Approve this revision
            </button>
            <p id="approve-hint" className="text-[12px] text-muted">
              {ownRevision
                ? "You saved this revision, so another legal reviewer must approve it."
                : allChecked
                  ? `Approval applies to revision ${workflow.revision} only.`
                  : "Tick every checklist item to approve."}
            </p>
            <button
              type="button"
              disabled={action.busy}
              onClick={() => withComment("Requesting changes", "request-changes", "Changes requested. The author sees your comment in the editor.")}
              className="btn btn-secondary justify-center"
            >
              Request changes
            </button>
            <button
              type="button"
              disabled={action.busy}
              onClick={() =>
                withComment(
                  "Rejecting",
                  "reject",
                  live ? "Changes rejected. The live version stays on the website." : "Record rejected and archived.",
                )
              }
              className="inline-flex min-h-11 items-center justify-center text-[13px] text-action underline underline-offset-4"
            >
              Reject
            </button>
          </div>
        </>
      )}

      <div className="border-t border-line pt-4">
        <h3 className="text-[15px] font-bold">Publishing</h3>
        {!canPublish ? (
          <p className="mt-2 text-[13px] leading-5 text-muted">Only a Publisher or Administrator can publish or unpublish.</p>
        ) : (
          <div className="mt-2 grid gap-2">
            <p className="text-[12px] leading-[18px] text-muted">
              {publishable
                ? `Revision ${workflow.revision} is approved and ready to publish.`
                : status === "published"
                  ? "This version is live on the website."
                  : "Publishing needs an approved revision."}
            </p>
            <button
              type="button"
              disabled={action.busy || !publishable}
              onClick={() => run("Publishing", "publish", "Published. The website now shows this version.", undefined, true)}
              className="btn btn-primary justify-center disabled:opacity-50"
            >
              Publish
            </button>
            {live && (
              <>
                <a href={publicHref} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center justify-center text-[13px] underline underline-offset-4">
                  View the live page<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <button
                  type="button"
                  disabled={action.busy}
                  onClick={() => run("Unpublishing", "unpublish", "Unpublished and removed from listings, search and the sitemap.", undefined, true)}
                  className="inline-flex min-h-11 items-center justify-center text-[13px] text-action underline underline-offset-4"
                >
                  Unpublish
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <ActionNotice state={action.state} />
    </div>
  );
}
