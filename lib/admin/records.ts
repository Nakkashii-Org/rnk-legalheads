import {
  emptyValues,
  getContentType,
  type ContentTypeConfig,
  type ContentTypeKey,
  type Option,
  type RecordValues,
  type WorkflowStatus,
} from "@/lib/admin/config";
import {
  publicationHref,
  publicationTypeMeta,
  type BodyBlock,
  type Publication,
  type PublicationType,
} from "@/lib/content/publications";
import type { Content } from "@/lib/content/store";

/**
 * Until the CMS admin APIs exist (phase C), the admin UI reads the website's content snapshot.
 * Every record is unapproved, so they show as drafts; nothing here is written back.
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
};

const publicationTypeFor: Partial<Record<ContentTypeKey, PublicationType>> = {
  articles: "article",
  judgments: "judgment",
  "legal-updates": "update",
};

const statusOf = (approved: boolean): WorkflowStatus => (approved ? "published" : "draft");

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function blocksToHtml(blocks: BodyBlock[]): string {
  return blocks
    .map((b) =>
      b.kind === "ul" ? `<ul>${b.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<${b.kind}>${escapeHtml(b.text)}</${b.kind}>`,
    )
    .join("");
}

const paragraphsToHtml = (paragraphs: string[]) => paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");

export function listRecords(content: Content, type: ContentTypeKey): AdminRecord[] {
  const pubType = publicationTypeFor[type];
  if (pubType) {
    return content.publicPublications(pubType).map((p) => ({
      type,
      id: p.slug,
      title: p.title,
      status: statusOf(p.approved),
      author: p.author.name,
      detail: p.publishedAt ?? "Not published",
      publicHref: publicationHref(p),
      layoutPreview: Boolean(p.preview),
    }));
  }
  switch (type) {
    case "services":
      return content.publicServices().map((s) => ({
        type,
        id: s.slug,
        title: s.title,
        status: statusOf(s.approved),
        detail: s.hold ? "Publication hold" : s.id,
        publicHref: `/services/${s.slug}`,
        layoutPreview: false,
      }));
    case "people":
      return content.publicPeople().map((p) => ({
        type,
        id: p.slug,
        title: p.name,
        status: statusOf(p.approved),
        detail: p.role,
        publicHref: `/people/${p.slug}`,
        layoutPreview: Boolean(p.preview),
      }));
    case "industries":
      return content.publicIndustries().map((i) => ({
        type,
        id: i.slug,
        title: i.name,
        status: statusOf(i.approved),
        detail: `${i.serviceIds.length} services`,
        publicHref: `/industries/${i.slug}`,
        layoutPreview: false,
      }));
    case "newsletters":
      return content.publicIssues().map((n) => ({
        type,
        id: n.slug,
        title: n.title,
        status: statusOf(n.approved),
        detail: `${n.items.length} publications`,
        publicHref: `/newsletters/${n.slug}`,
        layoutPreview: Boolean(n.preview),
      }));
    case "jobs":
      return content.publicJobs().map((j) => ({
        type,
        id: j.slug,
        title: j.title,
        status: statusOf(j.approved),
        detail: j.status === "open" ? "Open" : "Closed",
        publicHref: `/careers/${j.slug}`,
        layoutPreview: Boolean(j.preview),
      }));
    default:
      return [];
  }
}

export function getRecord(content: Content, type: ContentTypeKey, id: string): { record: AdminRecord; values: RecordValues } | undefined {
  const record = listRecords(content, type).find((r) => r.id === id);
  const config = getContentType(type);
  if (!record || !config) return undefined;
  return { record, values: { ...emptyValues(config), ...valuesFor(content, config, id) } };
}

function publicationValues(p: Publication): RecordValues {
  const base: RecordValues = {
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    body: blocksToHtml(p.body),
    author: p.author.personSlug ? [p.author.personSlug] : [],
    services: p.serviceIds,
    sources: p.sources.length ? p.sources.map((s) => ({ label: s.label, url: s.url ?? "" })) : [{ label: "", url: "" }],
  };
  if (p.type === "judgment")
    return {
      ...base,
      caseName: p.caseName,
      court: p.court,
      caseNumber: p.caseNumber,
      neutralCitation: p.neutralCitation ?? "",
      decisionDate: p.decisionDate ?? "",
      officialSourceUrl: p.officialSourceUrl ?? "",
      proceduralStatus: p.proceduralStatus,
      sourceChecked: Boolean(p.sourceCheckedAt),
    };
  if (p.type === "update")
    return {
      ...base,
      issuer: p.issuer,
      instrument: p.instrument,
      status: p.status,
      instrumentPublishedOn: p.instrumentPublishedOn ?? "",
      effectiveDate: p.effectiveDate ?? "",
      officialSourceUrl: p.officialSourceUrl ?? "",
      sourceChecked: Boolean(p.sourceCheckedAt),
    };
  return base;
}

function valuesFor(content: Content, config: ContentTypeConfig, id: string): RecordValues {
  const pubType = publicationTypeFor[config.key];
  if (pubType) {
    const p = content.publicPublications(pubType).find((x) => x.slug === id);
    return p ? publicationValues(p) : {};
  }
  switch (config.key) {
    case "services": {
      const s = content.publicServices().find((x) => x.slug === id);
      if (!s) return {};
      const d = content.serviceDetail(s.id);
      const bySlug = new Map(content.publicServices().map((x) => [x.id, x.slug]));
      return {
        title: s.title,
        slug: s.slug,
        group: s.group,
        summary: s.summary,
        overview: d?.overview ?? "",
        scope: d?.scope ?? [],
        related: (d?.related ?? []).map((rid) => bySlug.get(rid) ?? "").filter(Boolean),
        hold: Boolean(s.hold),
        jurisdiction: "India",
      };
    }
    case "people": {
      const p = content.publicPeople().find((x) => x.slug === id);
      if (!p) return {};
      return {
        name: p.name,
        slug: p.slug,
        role: p.role,
        practiceSummary: p.practiceSummary,
        biography: paragraphsToHtml(p.biography),
        priorExperience: p.priorExperience ?? "",
        qualifications: p.qualifications ?? "",
        enrolment: p.enrolment ?? "",
        languages: p.languages ?? "",
        office: p.office ?? "",
        services: serviceSlugs(content, p.serviceIds),
      };
    }
    case "industries": {
      const i = content.publicIndustries().find((x) => x.slug === id);
      if (!i) return {};
      return {
        name: i.name,
        slug: i.slug,
        summary: i.summary,
        intro: i.intro ?? "",
        overview: i.overview ?? "",
        workAreas: i.workAreas?.length ? i.workAreas : [{ title: "", text: "" }],
        services: serviceSlugs(content, i.serviceIds),
      };
    }
    case "newsletters": {
      const n = content.publicIssues().find((x) => x.slug === id);
      if (!n) return {};
      return {
        title: n.title,
        slug: n.slug,
        focus: n.focus,
        issueDate: n.issueDate ?? "",
        introduction: n.introduction,
        items: n.items.map((item) => `${item.type}:${item.slug}`),
      };
    }
    case "jobs": {
      const j = content.publicJobs().find((x) => x.slug === id);
      if (!j) return {};
      return {
        jobId: j.jobId,
        title: j.title,
        slug: j.slug,
        practice: j.practice,
        location: j.location,
        workArrangement: j.workArrangement,
        experience: j.experience,
        summary: j.summary,
        responsibilities: j.responsibilities,
        qualifications: j.qualifications,
        applicationInstructions: j.applicationInstructions,
        openedOn: j.openedOn ?? "",
        closesOn: j.closesOn ?? "",
        jobStatus: j.status,
      };
    }
    default:
      return {};
  }
}

function serviceSlugs(content: Content, ids: string[]): string[] {
  const bySlug = new Map(content.publicServices().map((s) => [s.id, s.slug]));
  return ids.map((id) => bySlug.get(id) ?? "").filter(Boolean);
}

/** Picker options for relationship fields. */
export function editorOptions(content: Content): { services: Option[]; people: Option[]; publications: Option[] } {
  return {
    services: content.publicServices().map((s) => ({ value: s.slug, label: s.title })),
    people: content.publicPeople().map((p) => ({ value: p.slug, label: p.name })),
    publications: content.publicPublications().map((p) => ({
      value: `${p.type}:${p.slug}`,
      label: `${publicationTypeMeta[p.type].label}: ${p.title}`,
    })),
  };
}
