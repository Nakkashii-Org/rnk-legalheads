import {
  emptyValues,
  getContentType,
  type ContentTypeConfig,
  type ContentTypeKey,
  type Option,
  type RecordValues,
  type WorkflowStatus,
} from "@/lib/admin/config";
import { adminGet } from "@/lib/admin/session";

/**
 * CMS data (C1): read from the backend's /api/admin/* APIs with the signed-in user's session.
 * Records come straight from MongoDB in every workflow status, including drafts.
 */

export type AdminRecord = {
  type: ContentTypeKey;
  id: string;
  title: string;
  status: WorkflowStatus;
  author?: string;
  detail?: string;
  publicHref: string;
  layoutPreview: boolean;
  updatedAt?: string;
};

type Row = { type: ContentTypeKey; id: string; title: string; status: WorkflowStatus; preview: boolean; detail?: string; author?: string; updatedAt?: string };
// Raw JSON from the admin API; valuesFor() below reads each field defensively.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rec = Record<string, any>;
type BodyBlock = { kind: "h2" | "h3" | "p" | "ul"; text?: string; items?: string[] };

export type Loaded<T> = { ok: true; data: T } | { ok: false; status: number };

const PUBLIC_BASE: Record<ContentTypeKey, string> = {
  articles: "/articles",
  judgments: "/recent-judgments",
  "legal-updates": "/legal-updates",
  newsletters: "/newsletters",
  services: "/services",
  people: "/people",
  industries: "/industries",
  jobs: "/careers",
};

const toRecord = (r: Row): AdminRecord => ({
  type: r.type,
  id: r.id,
  title: r.title,
  status: r.status,
  author: r.author,
  detail: r.detail,
  publicHref: `${PUBLIC_BASE[r.type]}/${r.id}`,
  layoutPreview: r.preview,
  updatedAt: r.updatedAt,
});

/** One content type, optionally filtered by status and a search text. */
export async function listRecords(type: ContentTypeKey, filters: { status?: string; q?: string } = {}): Promise<Loaded<{ items: AdminRecord[]; total: number }>> {
  const qs = new URLSearchParams();
  if (filters.status) qs.set("status", filters.status);
  if (filters.q) qs.set("q", filters.q);
  const res = await adminGet<{ items: Row[]; total: number }>(`/content/${type}${qs.size ? `?${qs}` : ""}`);
  return res.ok ? { ok: true, data: { items: res.data.items.map(toRecord), total: res.data.total } } : res;
}

/** Records of every type with one status (the review queue). */
export async function listByStatus(status: WorkflowStatus): Promise<Loaded<AdminRecord[]>> {
  const res = await adminGet<{ items: Row[] }>(`/content?status=${status}`);
  return res.ok ? { ok: true, data: res.data.items.map(toRecord) } : res;
}

export type Dashboard = {
  counts: Record<WorkflowStatus, number>;
  total: number;
  recentDrafts: AdminRecord[];
  /** In review or changes requested, newest first. */
  reviewRequests: AdminRecord[];
  inbox: { enquiries: number; applications: number } | null;
};

export async function loadDashboard(): Promise<Loaded<Dashboard>> {
  const res = await adminGet<Omit<Dashboard, "recentDrafts" | "reviewRequests"> & { recentDrafts: Row[]; reviewRequests: Row[] }>("/dashboard");
  return res.ok
    ? { ok: true, data: { ...res.data, recentDrafts: res.data.recentDrafts.map(toRecord), reviewRequests: (res.data.reviewRequests ?? []).map(toRecord) } }
    : res;
}

/** One record, mapped into the editor's field values. */
export async function getRecord(type: ContentTypeKey, id: string): Promise<{ record: AdminRecord; values: RecordValues } | undefined> {
  const config = getContentType(type);
  if (!config) return undefined;
  const res = await adminGet<{ summary: Row; record: Rec }>(`/content/${type}/${encodeURIComponent(id)}`);
  if (!res.ok) return undefined;
  return { record: toRecord(res.data.summary), values: { ...emptyValues(config), ...valuesFor(config, res.data.record) } };
}

/** Choices for the editors' relationship pickers. */
export async function editorOptions(): Promise<{ services: Option[]; people: Option[]; publications: Option[] }> {
  const res = await adminGet<{ services: Option[]; people: Option[]; publications: Option[] }>("/options");
  return res.ok ? res.data : { services: [], people: [], publications: [] };
}

// ---- Database record → editor values ----

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function blocksToHtml(blocks: BodyBlock[] = []): string {
  return blocks
    .map((b) => (b.kind === "ul" ? `<ul>${(b.items ?? []).map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<${b.kind}>${escapeHtml(b.text ?? "")}</${b.kind}>`))
    .join("");
}

const paragraphsToHtml = (paragraphs: string[] = []) => paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
const s = (v: unknown) => (typeof v === "string" ? v : "");

function valuesFor(config: ContentTypeConfig, d: Rec): RecordValues {
  switch (config.key) {
    case "articles":
    case "judgments":
    case "legal-updates": {
      const base: RecordValues = {
        title: s(d.title),
        slug: s(d.slug),
        summary: s(d.summary),
        body: blocksToHtml(d.body),
        author: d.author?.personSlug ? [d.author.personSlug] : [],
        services: d.serviceIds ?? [],
        sources: d.sources?.length ? d.sources.map((x: Rec) => ({ label: s(x.label), url: s(x.url) })) : [{ label: "", url: "" }],
        image: "",
      };
      if (config.key === "judgments")
        return {
          ...base,
          caseName: s(d.caseName),
          court: s(d.court),
          caseNumber: s(d.caseNumber),
          neutralCitation: s(d.neutralCitation),
          decisionDate: s(d.decisionDate),
          officialSourceUrl: s(d.officialSourceUrl),
          proceduralStatus: s(d.proceduralStatus),
          sourceChecked: Boolean(d.sourceCheckedAt),
        };
      if (config.key === "legal-updates")
        return {
          ...base,
          issuer: s(d.issuer),
          instrument: s(d.instrument),
          status: s(d.instrumentStatus),
          instrumentPublishedOn: s(d.instrumentPublishedOn),
          effectiveDate: s(d.effectiveDate),
          officialSourceUrl: s(d.officialSourceUrl),
          sourceChecked: Boolean(d.sourceCheckedAt),
        };
      return base;
    }
    case "services":
      return {
        title: s(d.title),
        slug: s(d.slug),
        group: s(d.group),
        summary: s(d.summary),
        overview: s(d.overview),
        scope: d.scope ?? [],
        related: d.related ?? [],
        people: [],
        owner: s(d.owner),
        jurisdiction: s(d.jurisdiction),
        hold: Boolean(d.hold),
      };
    case "people":
      return {
        name: s(d.name),
        slug: s(d.slug),
        role: s(d.role),
        practiceSummary: s(d.practiceSummary),
        biography: paragraphsToHtml(d.biography),
        priorExperience: s(d.priorExperience),
        qualifications: s(d.qualifications),
        enrolment: s(d.enrolment),
        languages: s(d.languages),
        office: s(d.office),
        portraitConsent: Boolean(d.portraitConsent),
        services: d.serviceIds ?? [],
      };
    case "industries":
      return {
        name: s(d.name),
        slug: s(d.slug),
        summary: s(d.summary),
        intro: s(d.intro),
        overview: s(d.overview),
        workAreas: d.workAreas?.length ? d.workAreas : [{ title: "", text: "" }],
        services: d.serviceIds ?? [],
        people: [],
      };
    case "newsletters":
      return {
        title: s(d.title),
        slug: s(d.slug),
        focus: s(d.focus),
        issueDate: s(d.issueDate),
        introduction: s(d.introduction),
        items: (d.items ?? []).map((i: Rec) => `${i.type}:${i.slug}`),
      };
    case "jobs":
      return {
        jobId: s(d.jobId),
        title: s(d.title),
        slug: s(d.slug),
        practice: s(d.practice),
        location: s(d.location),
        workArrangement: s(d.workArrangement),
        experience: s(d.experience),
        summary: s(d.summary),
        responsibilities: d.responsibilities ?? [],
        qualifications: d.qualifications ?? [],
        applicationInstructions: s(d.applicationInstructions),
        openedOn: s(d.openedOn),
        closesOn: s(d.closesOn),
        jobStatus: s(d.vacancyStatus) || "open",
      };
    default:
      return {};
  }
}
