/**
 * CMS content types and their editor fields (guide p.142–150). Shared by the server pages and the
 * client editor, so it must not import server-only content modules.
 */

export type Option = { value: string; label: string };

export type WorkArea = { title: string; text: string };
export type SourceLink = { label: string; url: string };

export type FieldValue = string | boolean | string[] | WorkArea[] | SourceLink[];
export type RecordValues = Record<string, FieldValue>;

type Base = { name: string; label: string; hint?: string; required?: boolean };

export type Field =
  | (Base & { kind: "text" | "url" | "date"; max?: number; placeholder?: string })
  | (Base & { kind: "slug"; from: string })
  | (Base & { kind: "textarea"; rows?: number; max?: number })
  | (Base & { kind: "richtext" })
  | (Base & { kind: "select"; options: Option[] })
  | (Base & { kind: "checkbox" })
  | (Base & { kind: "services" | "people"; max?: number })
  | (Base & { kind: "list"; itemLabel: string })
  | (Base & { kind: "workAreas"; count?: number })
  | (Base & { kind: "sources" })
  | (Base & { kind: "publications" })
  | (Base & { kind: "image" });

export type Section = { title: string; description?: string; fields: Field[] };

export type ContentTypeKey =
  | "articles"
  | "judgments"
  | "legal-updates"
  | "newsletters"
  | "services"
  | "people"
  | "industries"
  | "jobs";

export type ContentTypeConfig = {
  key: ContentTypeKey;
  singular: string;
  plural: string;
  /** Field that holds the record's display title. */
  titleField: string;
  /** Records that need a checked primary source before review (guide p.144). */
  sourceCheck?: boolean;
  sections: Section[];
};

export const WORKFLOW_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In review" },
  { value: "changes_requested", label: "Changes requested" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "unpublished", label: "Unpublished" },
  { value: "archived", label: "Archived" },
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number]["value"];

export const ROLES = [
  { value: "contributor", label: "Contributor", text: "Creates and edits drafts; sends them for review." },
  { value: "reviewer", label: "Legal reviewer", text: "Approves a revision or requests changes." },
  { value: "publisher", label: "Publisher", text: "Publishes and unpublishes approved revisions; reads the inbox." },
  { value: "admin", label: "Administrator", text: "Manages users, roles and site settings." },
];

export const statusLabel =(status: WorkflowStatus) => WORKFLOW_STATUSES.find((s) => s.value === status)!.label;

export const SERVICE_GROUP_OPTIONS: Option[] = [
  { value: "business", label: "Business & Transactions" },
  { value: "disputes", label: "Disputes & Recovery" },
  { value: "tax", label: "Tax & Trade" },
  { value: "property", label: "Property & Projects" },
  { value: "ip", label: "IP, Technology & Media" },
  { value: "people", label: "People & Private Matters" },
  { value: "regulated", label: "Regulated Sectors & Public Law" },
];

const seo: Section = {
  title: "Search and sharing",
  description: "Leave blank to use the title and summary.",
  fields: [
    { kind: "text", name: "seoTitle", label: "Search title", max: 60, hint: "Up to 60 characters." },
    { kind: "textarea", name: "seoDescription", label: "Search description", rows: 2, max: 160, hint: "Up to 160 characters." },
  ],
};

const publicationCore = (bodyLabel: string): Section => ({
  title: "Content",
  fields: [
    { kind: "text", name: "title", label: "Title", required: true, max: 120 },
    { kind: "slug", name: "slug", label: "URL slug", from: "title", required: true },
    { kind: "textarea", name: "summary", label: "Summary", rows: 3, max: 240, required: true, hint: "Shown on cards and listings. Up to 240 characters." },
    { kind: "richtext", name: "body", label: bodyLabel, required: true },
  ],
});

const publicationRelations: Section = {
  title: "Author, services and image",
  fields: [
    { kind: "people", name: "author", label: "Author", max: 1, required: true, hint: "Choose one approved profile." },
    { kind: "services", name: "services", label: "Service tags", hint: "Listings and service pages use these tags." },
    { kind: "image", name: "image", label: "Image", hint: "Optional. Choose from the media library." },
  ],
};

const sources: Section = {
  title: "Sources",
  description: "Link the primary sources relied on: legislation, official notifications, judgments.",
  fields: [{ kind: "sources", name: "sources", label: "Sources" }],
};

const sourceCheck: Field = {
  kind: "checkbox",
  name: "sourceChecked",
  label: "I have checked the primary source and the details above against it.",
  hint: "Required before the record can be sent for review.",
};

export const contentTypes: ContentTypeConfig[] = [
  {
    key: "articles",
    singular: "Article",
    plural: "Articles",
    titleField: "title",
    sections: [publicationCore("Article body"), publicationRelations, sources, seo],
  },
  {
    key: "judgments",
    singular: "Judgment note",
    plural: "Judgments",
    titleField: "title",
    sourceCheck: true,
    sections: [
      publicationCore("Note body"),
      {
        title: "Judgment details",
        description: "The court decision is shown separately from our commentary.",
        fields: [
          { kind: "text", name: "caseName", label: "Official case name", required: true },
          { kind: "text", name: "court", label: "Court or tribunal", required: true },
          { kind: "text", name: "caseNumber", label: "Case number", required: true },
          { kind: "text", name: "neutralCitation", label: "Neutral citation", hint: "If available." },
          { kind: "date", name: "decisionDate", label: "Decision date", required: true },
          { kind: "url", name: "officialSourceUrl", label: "Official judgment URL", required: true },
          { kind: "text", name: "proceduralStatus", label: "Procedural status", required: true, placeholder: "Final, interim, under appeal…" },
          sourceCheck,
        ],
      },
      publicationRelations,
      sources,
      seo,
    ],
  },
  {
    key: "legal-updates",
    singular: "Legal update",
    plural: "Legal updates",
    titleField: "title",
    sourceCheck: true,
    sections: [
      publicationCore("Update body"),
      {
        title: "Instrument details",
        fields: [
          { kind: "text", name: "issuer", label: "Issuing authority", required: true },
          { kind: "text", name: "instrument", label: "Instrument title and number", required: true },
          {
            kind: "select",
            name: "status",
            label: "Status",
            required: true,
            options: [
              { value: "proposed", label: "Proposed" },
              { value: "notified", label: "Notified" },
              { value: "in-force", label: "In force" },
            ],
          },
          { kind: "date", name: "instrumentPublishedOn", label: "Publication date" },
          { kind: "date", name: "effectiveDate", label: "Commencement date" },
          { kind: "url", name: "officialSourceUrl", label: "Official source URL", required: true },
          sourceCheck,
        ],
      },
      publicationRelations,
      sources,
      seo,
    ],
  },
  {
    key: "newsletters",
    singular: "Newsletter issue",
    plural: "Newsletters",
    titleField: "title",
    sections: [
      {
        title: "Issue",
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "slug", name: "slug", label: "URL slug", from: "title", required: true },
          { kind: "text", name: "focus", label: "Series or focus", placeholder: "General legal update" },
          { kind: "date", name: "issueDate", label: "Issue date", required: true },
          { kind: "textarea", name: "introduction", label: "Introduction", rows: 4, max: 600, required: true },
        ],
      },
      {
        title: "Publications in this issue",
        description: "Only approved publications can be added. Their order here is the order in the issue.",
        fields: [{ kind: "publications", name: "items", label: "Publications", required: true }],
      },
    ],
  },
  {
    key: "services",
    singular: "Service",
    plural: "Services",
    titleField: "title",
    sections: [
      {
        title: "Content",
        fields: [
          { kind: "text", name: "title", label: "Service name", required: true },
          { kind: "slug", name: "slug", label: "URL slug", from: "title", required: true },
          { kind: "select", name: "group", label: "Service group", required: true, options: SERVICE_GROUP_OPTIONS },
          { kind: "textarea", name: "summary", label: "Summary", rows: 3, max: 200, required: true, hint: "Shown in the directory. Up to 200 characters." },
          { kind: "textarea", name: "overview", label: "Overview", rows: 6, required: true },
          { kind: "workAreas", name: "scope", label: "Scope of work", count: 6, required: true },
        ],
      },
      {
        title: "Relationships",
        fields: [
          { kind: "services", name: "related", label: "Related services", max: 3 },
          { kind: "people", name: "people", label: "Lawyers for this service" },
        ],
      },
      {
        title: "Service register",
        description: "Internal. Not shown on the website (guide p.149).",
        fields: [
          { kind: "text", name: "owner", label: "Responsible lawyer" },
          { kind: "text", name: "jurisdiction", label: "Jurisdiction", placeholder: "India" },
          { kind: "checkbox", name: "hold", label: "Publication hold", hint: "A held service stays off the website, menus and contact options." },
        ],
      },
      seo,
    ],
  },
  {
    key: "people",
    singular: "Profile",
    plural: "People",
    titleField: "name",
    sections: [
      {
        title: "Profile",
        fields: [
          { kind: "text", name: "name", label: "Full name", required: true },
          { kind: "slug", name: "slug", label: "URL slug", from: "name", required: true },
          { kind: "text", name: "role", label: "Role", required: true, placeholder: "Partner, Associate…" },
          { kind: "textarea", name: "practiceSummary", label: "Practice summary", rows: 2, max: 200, required: true },
          { kind: "richtext", name: "biography", label: "Approved biography", required: true },
          { kind: "textarea", name: "priorExperience", label: "Before RNK Legalheads", rows: 3 },
        ],
      },
      {
        title: "Credentials",
        fields: [
          { kind: "text", name: "qualifications", label: "Qualifications" },
          { kind: "text", name: "enrolment", label: "Enrolment / admissions" },
          { kind: "text", name: "languages", label: "Languages" },
          { kind: "text", name: "office", label: "Office" },
        ],
      },
      {
        title: "Portrait and services",
        fields: [
          { kind: "image", name: "portrait", label: "Portrait" },
          { kind: "checkbox", name: "portraitConsent", label: "The lawyer has consented to this portrait being published." },
          { kind: "services", name: "services", label: "Services" },
        ],
      },
    ],
  },
  {
    key: "industries",
    singular: "Industry",
    plural: "Industries",
    titleField: "name",
    sections: [
      {
        title: "Content",
        fields: [
          { kind: "text", name: "name", label: "Sector name", required: true },
          { kind: "slug", name: "slug", label: "URL slug", from: "name", required: true },
          { kind: "textarea", name: "summary", label: "Summary", rows: 2, max: 200, required: true },
          { kind: "textarea", name: "intro", label: "Introduction", rows: 3 },
          { kind: "textarea", name: "overview", label: "Sector overview", rows: 5 },
          { kind: "workAreas", name: "workAreas", label: "Work areas" },
        ],
      },
      {
        title: "Relationships",
        fields: [
          { kind: "services", name: "services", label: "Related services", required: true },
          { kind: "people", name: "people", label: "Lawyers for this sector" },
        ],
      },
    ],
  },
  {
    key: "jobs",
    singular: "Vacancy",
    plural: "Jobs",
    titleField: "title",
    sections: [
      {
        title: "Role",
        fields: [
          { kind: "text", name: "jobId", label: "Job ID", required: true, placeholder: "RNK-2026-01" },
          { kind: "text", name: "title", label: "Role title", required: true },
          { kind: "slug", name: "slug", label: "URL slug", from: "title", required: true },
          { kind: "text", name: "practice", label: "Practice", required: true },
          { kind: "text", name: "location", label: "Location", required: true },
          { kind: "text", name: "workArrangement", label: "Work arrangement", required: true, placeholder: "Office-based, hybrid…" },
          { kind: "text", name: "experience", label: "Experience", required: true },
          { kind: "textarea", name: "summary", label: "Summary", rows: 3, required: true },
        ],
      },
      {
        title: "Details",
        fields: [
          { kind: "list", name: "responsibilities", label: "Responsibilities", itemLabel: "Responsibility", required: true },
          { kind: "list", name: "qualifications", label: "Qualifications", itemLabel: "Qualification", required: true },
          { kind: "textarea", name: "applicationInstructions", label: "Application instructions", rows: 3, required: true },
        ],
      },
      {
        title: "Dates and status",
        fields: [
          { kind: "date", name: "openedOn", label: "Opening date" },
          { kind: "date", name: "closesOn", label: "Closing date" },
          {
            kind: "select",
            name: "jobStatus",
            label: "Vacancy status",
            required: true,
            options: [
              { value: "open", label: "Open" },
              { value: "closed", label: "Closed" },
            ],
          },
        ],
      },
    ],
  },
];

export function getContentType(key: string): ContentTypeConfig | undefined {
  return contentTypes.find((t) => t.key === key);
}

export function allFields(config: ContentTypeConfig): Field[] {
  return config.sections.flatMap((s) => s.fields);
}

export function emptyValue(field: Field): FieldValue {
  switch (field.kind) {
    case "checkbox":
      return false;
    case "services":
    case "people":
    case "list":
    case "publications":
      return [];
    case "workAreas":
      return Array.from({ length: field.count ?? 1 }, () => ({ title: "", text: "" }));
    case "sources":
      return [{ label: "", url: "" }];
    default:
      return "";
  }
}

export function emptyValues(config: ContentTypeConfig): RecordValues {
  return Object.fromEntries(allFields(config).map((f) => [f.name, emptyValue(f)]));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Checks run before "Send for review". Saving a draft only needs a title. */
export function validateForReview(config: ContentTypeConfig, values: RecordValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of allFields(config)) {
    const value = values[field.name];
    if (field.required) {
      const empty =
        value === "" ||
        value === false ||
        (Array.isArray(value) &&
          (value.length === 0 ||
            (field.kind === "workAreas" && (value as WorkArea[]).some((w) => !w.title.trim() || !w.text.trim())) ||
            (field.kind === "list" && (value as string[]).every((v) => !v.trim())))) ||
        (typeof value === "string" && (!value.trim() || value.replace(/<[^>]*>/g, "").trim() === ""));
      if (empty) errors[field.name] = field.kind === "workAreas" ? `Complete every ${field.label.toLowerCase()} entry.` : `${field.label} is required.`;
    }
    if (field.kind === "slug" && typeof value === "string" && value && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value))
      errors[field.name] = "Use lowercase letters, numbers and single hyphens only.";
    if (field.kind === "url" && typeof value === "string" && value && !/^https?:\/\/\S+\.\S+/.test(value))
      errors[field.name] = "Enter a full link starting with https://";
    if ((field.kind === "text" || field.kind === "textarea") && "max" in field && field.max && typeof value === "string" && value.length > field.max)
      errors[field.name] = `${field.label} must be ${field.max} characters or fewer.`;
    if (field.kind === "sources" && Array.isArray(value)) {
      const bad = (value as SourceLink[]).find((s) => s.url && !/^https?:\/\/\S+\.\S+/.test(s.url));
      if (bad) errors[field.name] = "Each source link must start with https://";
    }
  }
  if (config.sourceCheck && values.sourceChecked !== true)
    errors.sourceChecked = "Confirm that the primary source has been checked.";
  return errors;
}
