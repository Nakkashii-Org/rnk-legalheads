import { getPublicServices } from "@/lib/content/services";
import { matchesAll, queryWords } from "@/lib/search";
import { showDrafts } from "@/lib/visibility";

export type PublicationType = "article" | "judgment" | "update";

/** Structured body blocks (plain text only, so nothing needs HTML sanitising). Sanity Portable Text maps onto these in Step 8. */
export type BodyBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

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
  article: { label: "Article", plural: "Articles", action: "Read article", basePath: "/articles" },
  judgment: { label: "Judgment note", plural: "Recent judgments", action: "Read note", basePath: "/recent-judgments" },
  update: { label: "Legal update", plural: "Legal updates", action: "Read update", basePath: "/legal-updates" },
};

export const updateStatusLabel: Record<UpdateStatus, string> = {
  proposed: "Proposed",
  notified: "Notified",
  "in-force": "In force",
};

export function publicationHref(p: Pick<Publication, "type" | "slug">): string {
  return `${publicationTypeMeta[p.type].basePath}/${p.slug}`;
}

// Approved publications are added here until the CMS takes over (Step 8). The guide supplies none.
const publications: Publication[] = [];

// Layout previews from the guide's K03, J02 and U02 screens. Draft review mode only.
const layoutPreviews: Publication[] = [
  {
    type: "article",
    slug: "preparing-for-a-commercial-transaction",
    title: "Preparing for a commercial transaction",
    summary: "A working outline for reviewing scope, documents and responsibilities.",
    author: { name: "Approved lawyer" },
    serviceIds: ["S10", "S09"],
    body: [
      { kind: "h2", text: "The starting point" },
      { kind: "p", text: "Begin with the question the article addresses. Define its scope and identify the documents or facts needed to understand the issue." },
      { kind: "h2", text: "Points to consider" },
      { kind: "p", text: "Use short sections with informative headings. Support legal propositions with primary sources and make assumptions explicit." },
      { kind: "h2", text: "Sources and review" },
      { kind: "p", text: "Link to the official materials used, record the review date and keep a correction history for material changes." },
    ],
    sources: [{ label: "Official source to be added on approval" }],
    approved: false,
    preview: true,
  },
  {
    type: "judgment",
    slug: "a-structured-note-on-a-recent-decision",
    title: "A structured note on a recent decision",
    summary: "The case, issue, decision and source are recorded separately.",
    author: { name: "Approved lawyer" },
    serviceIds: ["S10", "S09"],
    caseName: "Verified case name",
    court: "Court or tribunal",
    caseNumber: "Official court record required",
    neutralCitation: "Verified citation, where available",
    proceduralStatus: "Final / interim / appeal status to be checked",
    body: [
      { kind: "h2", text: "Background" },
      { kind: "p", text: "Set out the parties, the dispute and the material procedural history in neutral terms." },
      { kind: "h2", text: "The issue" },
      { kind: "p", text: "Summarise the question before the court without suggesting that the ruling answers every related dispute. Identify the material procedural context." },
      { kind: "h2", text: "The decision and its limits" },
      { kind: "p", text: "Separate the court's holding from the author's analysis. Explain the relevant limits, exceptions and any subsequent development checked by the reviewer." },
      { kind: "h2", text: "Implications" },
      { kind: "p", text: "RNK commentary on the practical effect, clearly identified as analysis rather than the holding." },
    ],
    sources: [{ label: "Official judgment to be linked on approval" }],
    approved: false,
    preview: true,
  },
  {
    type: "update",
    slug: "tracking-a-regulatory-development",
    title: "Tracking a regulatory development",
    summary: "The status, effective date and source stay visible to the reader.",
    author: { name: "Approved lawyer" },
    serviceIds: ["S34", "S10"],
    issuer: "Verified authority",
    instrument: "Official notification or instrument",
    status: "notified",
    body: [
      { kind: "h2", text: "What has changed" },
      { kind: "p", text: "Set out the change in clear terms. Distinguish a proposal from a final instrument and identify any transition provisions." },
      { kind: "h2", text: "Who may be affected" },
      { kind: "p", text: "Use short sections with informative headings. Support legal propositions with primary sources and make assumptions explicit." },
      { kind: "h2", text: "Relevant dates" },
      { kind: "p", text: "State the publication date and each commencement or effective date, including any phased commencement." },
      { kind: "h2", text: "Points requiring attention" },
      { kind: "ul", items: ["Actions that may be needed", "Open questions awaiting clarification"] },
    ],
    sources: [{ label: "Official instrument to be linked on approval" }],
    approved: false,
    preview: true,
  },
];

/** Newest first; records without a date (previews) sort last. */
function byDateDesc(a: Publication, b: Publication): number {
  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}

export function getPublicPublications(type?: PublicationType): Publication[] {
  const approved = publications.filter((p) => p.approved);
  const list = approved.length > 0 || !showDrafts ? approved : [...publications, ...layoutPreviews];
  return list.filter((p) => !type || p.type === type).sort(byDateDesc);
}

export function getPublicPublication(type: PublicationType, slug: string): Publication | undefined {
  return getPublicPublications(type).find((p) => p.slug === slug);
}

/** Three most recent approved publications for the homepage (H05). */
export function getHomePublications(): Publication[] {
  return getPublicPublications().slice(0, 3);
}

export function getPublicationsForService(serviceId: string, limit = 3): Publication[] {
  return getPublicPublications()
    .filter((p) => p.serviceIds.includes(serviceId))
    .slice(0, limit);
}

export function getRelatedPublications(current: Publication, limit = 3): Publication[] {
  return getPublicPublications()
    .filter((p) => p.slug !== current.slug && p.serviceIds.some((id) => current.serviceIds.includes(id)))
    .slice(0, limit);
}

export function bodyText(p: Publication): string {
  return p.body.map((block) => (block.kind === "ul" ? block.items.join(" ") : block.text)).join(" ");
}

export function publicationSearchText(p: Publication): string {
  const services = getPublicServices()
    .filter((s) => p.serviceIds.includes(s.id))
    .map((s) => s.title)
    .join(" ");
  const extra =
    p.type === "judgment" ? `${p.caseName} ${p.court}` : p.type === "update" ? `${p.issuer} ${p.instrument}` : "";
  return `${p.title} ${p.summary} ${p.author.name} ${extra} ${services} ${bodyText(p)}`;
}

export type PublicationFilters = {
  query: string;
  serviceId?: string;
  year?: string;
  court?: string;
};

export function filterPublications(list: Publication[], filters: PublicationFilters): Publication[] {
  const words = queryWords(filters.query);
  return list.filter(
    (p) =>
      (!filters.serviceId || p.serviceIds.includes(filters.serviceId)) &&
      (!filters.year || p.publishedAt?.startsWith(filters.year)) &&
      (!filters.court || (p.type === "judgment" && p.court === filters.court)) &&
      (words.length === 0 || matchesAll(publicationSearchText(p), words)),
  );
}

export function readingMinutes(p: Publication): number {
  return Math.max(1, Math.ceil(bodyText(p).split(/\s+/).length / 200));
}

/** Date-only values are formatted in UTC so they never shift a day (guide p.126). */
export function formatDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
