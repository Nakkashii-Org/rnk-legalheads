import type { Service } from "@/lib/content/services";
import { matchesAll, queryWords } from "@/lib/search";

export type PublicationType = "article" | "judgment" | "update";

/** A run of text with its formatting. Links are checked by the CMS (https://, mailto: or a site path). */
export type Span = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
};

/**
 * Structured body blocks. `text`/`items` are always plain text (search, reading time); `rich`/
 * `richItems` carry bold, italic and links as data, never HTML, so nothing needs sanitising.
 */
export type BodyBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string; rich?: Span[] }
  | { kind: "ul" | "ol"; items: string[]; richItems?: Span[][] };

export type Source = { label: string; url?: string };

type PublicationBase = {
  slug: string;
  title: string;
  /** 25–45 word factual summary (guide p.126). */
  summary: string;
  author: { name: string; personSlug?: string };
  /** ISO dates (YYYY-MM-DD). Set on approval; previews have none (no sample dates, guide p.2). */
  publishedAt?: string;
  updatedAt?: string;
  serviceIds: string[];
  body: BodyBlock[];
  /** Optional image from the CMS media library (empty alt = decorative). */
  image?: { src: string; alt: string };
  sources: Source[];
  approved: boolean;
  /** Layout-preview record: draft review mode only, never production (guide p.19, p.126). */
  preview?: boolean;
};

export type Article = PublicationBase & { type: "article" };

export type JudgmentNote = PublicationBase & {
  type: "judgment";
  caseName: string;
  court: string;
  caseNumber: string;
  neutralCitation?: string;
  decisionDate?: string;
  officialSourceUrl?: string;
  proceduralStatus: string;
  sourceCheckedAt?: string;
};

export type UpdateStatus = "proposed" | "notified" | "in-force";

export type LegalUpdate = PublicationBase & {
  type: "update";
  issuer: string;
  instrument: string;
  status: UpdateStatus;
  instrumentPublishedOn?: string;
  effectiveDate?: string;
  officialSourceUrl?: string;
  sourceCheckedAt?: string;
  /** Material corrections are recorded, never silently replaced (guide p.125–126). */
  updateNotes?: { date: string; note: string }[];
};

export type Publication = Article | JudgmentNote | LegalUpdate;

export const publicationTypeMeta: Record<
  PublicationType,
  { label: string; plural: string; action: string; basePath: string }
> = {
  article: {
    label: "Article",
    plural: "Articles",
    action: "Read article",
    basePath: "/articles",
  },
  judgment: {
    label: "Judgment note",
    plural: "Recent judgments",
    action: "Read note",
    basePath: "/recent-judgments",
  },
  update: {
    label: "Legal update",
    plural: "Legal updates",
    action: "Read update",
    basePath: "/legal-updates",
  },
};

export const updateStatusLabel: Record<UpdateStatus, string> = {
  proposed: "Proposed",
  notified: "Notified",
  "in-force": "In force",
};

export function publicationHref(p: Pick<Publication, "type" | "slug">): string {
  return `${publicationTypeMeta[p.type].basePath}/${p.slug}`;
}

// The three articles of the final screens, written by the firm (no individual author). Each is
// published from the CMS. Judgment notes and legal updates: none yet.
export const publications: Publication[] = [
  {
    type: "article",
    slug: "organising-your-ip-records",
    title: "Organising your intellectual property records",
    summary:
      "An orderly IP record connects the right, its owner, the filing history and the agreements governing its use. A practical starting point for reviewing a portfolio.",
    author: {
      name: "RNK Legalheads LLP",
    },
    serviceIds: ["S26", "S27", "S01", "S02"],
    body: [
      {
        kind: "h2",
        text: "Start with the asset",
      },
      {
        kind: "p",
        text: "Prepare a list of the inventions, brands, product designs, software and other creative material that matter to the business. Record how each asset is used, which products or services depend on it and who in the organisation maintains the relevant records. The purpose is to create a usable inventory, rather than a list of registration numbers alone.",
      },
      {
        kind: "h2",
        text: "Connect ownership with documents",
      },
      {
        kind: "p",
        text: "Keep the documents that explain how the business acquired or developed each asset. These may include founder arrangements, employment or consultancy terms, assignments, licences and acquisition documents. Record any gap between the name on a registration and the entity using the asset. A payment record or an application number should not be treated as a complete answer to an ownership question.",
      },
      {
        kind: "h2",
        text: "Keep a filing history",
      },
      {
        kind: "p",
        text: "Store copies of applications, specifications or representations, examination communications, responses, orders and renewal records together. Record the responsible adviser and the next action in a controlled diary. Dates and procedural requirements should be checked against the particular right and jurisdiction, rather than copied from a general online checklist.",
      },
      {
        kind: "h2",
        text: "Record commercial restrictions",
      },
      {
        kind: "p",
        text: "A licence may limit territory, permitted use, sublicensing or transfer. Financing and transaction documents may create further restrictions. Keep these agreements alongside the asset record so that a proposed investment, product launch or sale does not overlook an existing obligation.",
      },
      {
        kind: "h2",
        text: "Prepare a focused review",
      },
      {
        kind: "p",
        text: "A useful review identifies missing documents, inconsistent ownership records, upcoming actions and the assets most important to the business. Seek advice on the issues that affect the intended transaction or use. Avoid sending unpublished technical material through a public enquiry form; agree a suitable channel before sharing it.",
      },
    ],
    sources: [],
    approved: false,
  },
  {
    type: "article",
    slug: "preparing-a-commercial-dispute-record",
    title: "Preparing a commercial dispute record",
    summary:
      "A clear chronology and a reliable document set help advisers assess a dispute. This note explains how to prepare the record without losing the context behind individual communications.",
    author: {
      name: "RNK Legalheads LLP",
    },
    serviceIds: ["S09", "S10", "S11", "S23", "S14"],
    body: [
      {
        kind: "h2",
        text: "Write a factual chronology",
      },
      {
        kind: "p",
        text: "Set out the key events in date order: the agreement, relevant performance, payments, disputed changes and communications. Distinguish what a document shows from what someone recalls. Identify any missing date or uncertain fact instead of filling the gap with an assumption.",
      },
      {
        kind: "h2",
        text: "Preserve the original material",
      },
      {
        kind: "p",
        text: "Keep contracts, amendments, invoices, notices, delivery records and relevant correspondence in their original form. Preserve electronic records and their context. Do not delete, alter or selectively rewrite material because a dispute has arisen. A readable working bundle can sit alongside the original files.",
      },
      {
        kind: "h2",
        text: "Identify the immediate issue",
      },
      {
        kind: "p",
        text: "Explain what has happened and what decision is needed now. Flag any notice, hearing or stated deadline for prompt legal assessment. An online enquiry or an unanswered email is not confirmation that a firm is monitoring time limits or acting in the matter.",
      },
      {
        kind: "h2",
        text: "Explain the commercial position",
      },
      {
        kind: "p",
        text: "Record the amount in dispute, continuing obligations, operational consequences and any discussions about resolution. If a working relationship must continue, explain why. These facts help frame instructions about negotiation, interim protection or proceedings without predetermining the legal route.",
      },
      {
        kind: "h2",
        text: "Share through an agreed channel",
      },
      {
        kind: "p",
        text: "Begin with the parties, a non-confidential outline and contact details so that conflicts and scope can be assessed. Share the detailed record through the channel agreed for the engagement. Keep advice and internal discussions within the appropriate group; confidentiality and privilege depend on the circumstances, not the label on an email.",
      },
    ],
    sources: [],
    approved: false,
  },
  {
    type: "article",
    slug: "preparing-records-for-a-tax-notice",
    title: "Preparing records for a tax notice",
    summary:
      "A tax response begins with the notice and the transactions behind it. A practical note on organising documents and coordinating factual inputs before a response is prepared.",
    author: {
      name: "RNK Legalheads LLP",
    },
    serviceIds: ["S19", "S21", "S01", "S13"],
    body: [
      {
        kind: "h2",
        text: "Read the complete communication",
      },
      {
        kind: "p",
        text: "Keep the notice, annexures and the record showing when and how it was received. Identify the issuing authority, reference number, period concerned, questions asked and any stated response date. Obtain advice on the applicable procedure and timeline; do not assume that another taxpayer’s deadline or remedy applies.",
      },
      {
        kind: "h2",
        text: "Connect the notice to the transactions",
      },
      {
        kind: "p",
        text: "Prepare the contracts, invoices, accounting entries, payment records and earlier correspondence relevant to the questions raised. Explain how the transaction was recorded and who can clarify the supporting documents. A concise index often makes a large record easier to review than an unlabelled collection of files.",
      },
      {
        kind: "h2",
        text: "Reconcile factual differences",
      },
      {
        kind: "p",
        text: "Ask the finance team and relevant business colleagues to identify inconsistencies between the notice, books and transaction documents. Record both the discrepancy and its possible explanation. Do not revise original records simply to make the record appear consistent.",
      },
      {
        kind: "h2",
        text: "Coordinate parallel matters",
      },
      {
        kind: "p",
        text: "Tell the adviser about related assessments, appeals, investigations or recovery steps. The same transaction may appear in more than one proceeding. Maintaining a shared factual chronology helps avoid inconsistent explanations while allowing each proceeding to be addressed on its own terms.",
      },
      {
        kind: "h2",
        text: "Keep the submitted version",
      },
      {
        kind: "p",
        text: "Retain the final response, attachments, filing acknowledgement and subsequent communications together. Record the next action and its owner. The decision about admissions, legal grounds, evidence and remedies requires advice on the actual notice and record.",
      },
    ],
    sources: [],
    approved: false,
  },
];

// No layout previews any more: the pages show real content or their empty state.
export const publicationLayoutPreviews: Publication[] = [];

/** Newest first; records without a date (previews) sort last. */
export function byDateDesc(a: Publication, b: Publication): number {
  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}

export function bodyText(p: Publication): string {
  return p.body
    .map((block) => ("items" in block ? block.items.join(" ") : block.text))
    .join(" ");
}

export function publicationSearchText(
  p: Publication,
  publicServices: Service[],
): string {
  const services = publicServices
    .filter((s) => p.serviceIds.includes(s.id))
    .map((s) => s.title)
    .join(" ");
  const extra =
    p.type === "judgment"
      ? `${p.caseName} ${p.court}`
      : p.type === "update"
        ? `${p.issuer} ${p.instrument}`
        : "";
  return `${p.title} ${p.summary} ${p.author.name} ${extra} ${services} ${bodyText(p)}`;
}

export type PublicationFilters = {
  query: string;
  serviceId?: string;
  year?: string;
  court?: string;
};

export function filterPublications(
  list: Publication[],
  filters: PublicationFilters,
  publicServices: Service[],
): Publication[] {
  const words = queryWords(filters.query);
  return list.filter(
    (p) =>
      (!filters.serviceId || p.serviceIds.includes(filters.serviceId)) &&
      (!filters.year || p.publishedAt?.startsWith(filters.year)) &&
      (!filters.court ||
        (p.type === "judgment" && p.court === filters.court)) &&
      (words.length === 0 ||
        matchesAll(publicationSearchText(p, publicServices), words)),
  );
}

export function readingMinutes(p: Publication): number {
  return Math.max(1, Math.ceil(bodyText(p).split(/\s+/).length / 200));
}

/** Date-only values are formatted in UTC so they never shift a day (guide p.126). */
export function formatDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
