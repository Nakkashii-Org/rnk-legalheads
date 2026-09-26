import type { PublicationType } from "@/lib/content/publications";

export type NewsletterIssue = {
  slug: string;
  title: string;
  /** Short label for the issue series or focus, e.g. "Disputes & Recovery". */
  focus: string;
  /** ISO date, assigned only to approved editions (L01). */
  issueDate?: string;
  introduction: string;
  /** Section labels listed under "In this issue". */
  contents: string[];
  /** Ordered references to approved publications (guide p.150). */
  items: { type: PublicationType; slug: string }[];
  approved: boolean;
  preview?: boolean;
};

// Approved web issues come from the CMS. None have been supplied.
export const issues: NewsletterIssue[] = [];

const PREVIEW_INTRO =
  "A selected collection of approved publications, with a short editorial introduction.";
const PREVIEW_ITEMS: NewsletterIssue["items"] = [
  { type: "article", slug: "preparing-for-a-commercial-transaction" },
  { type: "judgment", slug: "a-structured-note-on-a-recent-decision" },
  { type: "update", slug: "tracking-a-regulatory-development" },
];

// Layout previews from the guide's L01/L02 screens. Draft review mode only.
export const issueLayoutPreviews: NewsletterIssue[] = [
  {
    slug: "rnk-legal-update",
    title: "RNK Legal Update",
    focus: "General legal update",
    introduction: "Selected articles, recent decisions and legal developments across our practices.",
    contents: ["Corporate and commercial matters", "Disputes and recent judgments", "Tax and regulatory updates"],
    items: PREVIEW_ITEMS,
    approved: false,
    preview: true,
  },
  {
    slug: "disputes-review",
    title: "Disputes Review",
    focus: "Disputes & Recovery",
    introduction: PREVIEW_INTRO,
    contents: ["Disputes and recent judgments"],
    items: PREVIEW_ITEMS.slice(1, 2),
    approved: false,
    preview: true,
  },
  {
    slug: "business-tax-review",
    title: "Business & Tax Review",
    focus: "Business & Tax",
    introduction: PREVIEW_INTRO,
    contents: ["Corporate and commercial matters", "Tax and regulatory updates"],
    items: [PREVIEW_ITEMS[0], PREVIEW_ITEMS[2]],
    approved: false,
    preview: true,
  },
];
