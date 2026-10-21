import type { PublicationType } from "@/lib/content/publications";

export type NewsletterIssue = {
  slug: string;
  title: string;
  /** Series label shown above the title, e.g. "RNK Legalheads Insights / Issue 01". */
  focus: string;
  /** ISO date, assigned only to approved editions. */
  issueDate?: string;
  /** Opening paragraph of the issue page. */
  introduction: string;
  /** Section labels; the first one is the one-line description on the newsletter list. */
  contents: string[];
  /** Ordered references to publications. */
  items: { type: PublicationType; slug: string }[];
  approved: boolean;
  preview?: boolean;
};

// Issue 01 of the final screens. Published from the CMS; publishing never sends an email.
export const issues: NewsletterIssue[] = [
  {
    slug: "issue-01-records-that-support-legal-decisions",
    title: "Records that support legal decisions",
    focus: "RNK Legalheads Insights / Issue 01",
    introduction:
      "This issue brings together three practical articles on preparing the information needed for an intellectual-property review, a commercial dispute and a tax notice. Each begins with the record: what happened, which documents support it and what needs attention next.",
    contents: ["Practical reading on IP records, commercial disputes and tax notices."],
    items: [
      { type: "article", slug: "organising-your-ip-records" },
      { type: "article", slug: "preparing-a-commercial-dispute-record" },
      { type: "article", slug: "preparing-records-for-a-tax-notice" },
    ],
    approved: false,
  },
];

// No layout previews any more: the pages show real content or their empty state.
export const issueLayoutPreviews: NewsletterIssue[] = [];
