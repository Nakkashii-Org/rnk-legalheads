import { showDrafts } from "@/lib/visibility";

export type PublicationType = "article" | "judgment" | "update";

export type PublicationCard = {
  type: PublicationType;
  title: string;
  summary: string;
  href: string;
  /** Layout-preview records must never reach production (guide p.19, p.126). */
  preview?: boolean;
};

export const publicationTypeMeta: Record<PublicationType, { label: string; action: string }> = {
  article: { label: "Article", action: "Read article" },
  judgment: { label: "Judgment note", action: "Read note" },
  update: { label: "Legal update", action: "Read update" },
};

// Replaced by approved CMS records in Step 8.
const publications: PublicationCard[] = [];

const layoutPreviews: PublicationCard[] = [
  {
    type: "article",
    title: "Preparing for a commercial transaction",
    summary: "A working outline for reviewing scope, documents and responsibilities.",
    href: "/articles/preparing-for-a-commercial-transaction",
    preview: true,
  },
  {
    type: "judgment",
    title: "A structured note on a recent decision",
    summary: "The case, issue, decision and source are recorded separately.",
    href: "/recent-judgments/a-structured-note-on-a-recent-decision",
    preview: true,
  },
  {
    type: "update",
    title: "Tracking a regulatory development",
    summary: "The status, effective date and source stay visible to the reader.",
    href: "/legal-updates/tracking-a-regulatory-development",
    preview: true,
  },
];

/** Three most recent approved publications; layout previews only in draft mode. */
export function getHomePublications(): PublicationCard[] {
  if (publications.length > 0) return publications.slice(0, 3);
  return showDrafts ? layoutPreviews : [];
}
