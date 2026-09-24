/**
 * Legal pages G01–G03 (guide p.138). The firm's approved text is added section by section; the
 * guide forbids generic placeholder policies, so unapproved sections show only what they must cover
 * (in draft review mode) and nothing invented.
 */
export type LegalSection = {
  id: string;
  heading: string;
  /** What the approved text must cover, from the guide. Shown to reviewers only. */
  covers: string;
  /** Approved paragraphs. Empty until the responsible lawyer signs off. */
  text: string[];
};

export type LegalPage = {
  path: "/privacy-policy" | "/terms-and-conditions" | "/disclaimer";
  title: string;
  shortTitle: string;
  lead: string;
  effectiveDate?: string;
  sections: LegalSection[];
};

export const legalPages: LegalPage[] = [
  {
    path: "/privacy-policy",
    title: "Privacy notice",
    shortTitle: "privacy notice",
    lead: "How RNK Legalheads collects and uses personal information through this website.",
    sections: [
      { id: "who-we-are", heading: "Who we are", covers: "The legal entity, its address and how to contact the firm about privacy.", text: [] },
      { id: "information", heading: "Information we collect", covers: "Contact enquiries, newsletter subscriptions, job applications and resumes, server logs and any analytics.", text: [] },
      { id: "purposes", heading: "Why we use it", covers: "The purpose of each collection point, kept separate for enquiries, marketing and recruitment.", text: [] },
      { id: "processors", heading: "Service providers", covers: "The processors and vendors used (hosting, email provider, file storage) and where data is stored.", text: [] },
      { id: "subscriptions", heading: "Newsletter choices", covers: "Double opt-in, topic preferences, and how to change them or unsubscribe.", text: [] },
      { id: "retention", heading: "How long we keep it", covers: "Retention criteria for enquiries, applications, resumes and subscriber records.", text: [] },
      { id: "rights", heading: "Your rights and grievances", covers: "Rights available under applicable law, and the grievance and privacy-contact process.", text: [] },
      { id: "cookies", heading: "Cookies and embedded content", covers: "Essential cookies only; the Google Map loads only after a visitor chooses to show it.", text: [] },
      { id: "changes", heading: "Changes to this notice", covers: "How updates are published, and the effective date.", text: [] },
    ],
  },
  {
    path: "/terms-and-conditions",
    title: "Website terms",
    shortTitle: "website terms",
    lead: "The terms that apply to using this website.",
    sections: [
      { id: "purpose", heading: "Information only", covers: "The website is informational; browsing it does not create an engagement.", text: [] },
      { id: "use", heading: "Using this website", covers: "Acceptable use of the site and its forms.", text: [] },
      { id: "ip", heading: "Intellectual property", covers: "Ownership of the site content and permitted reuse.", text: [] },
      { id: "links", heading: "Links to other websites", covers: "Responsibility for third-party sites and official sources linked from publications.", text: [] },
      { id: "liability", heading: "Limitations", covers: "Limitations of liability approved for the actual entity.", text: [] },
      { id: "law", heading: "Governing law", covers: "Governing provisions and jurisdiction approved for the actual entity.", text: [] },
    ],
  },
  {
    path: "/disclaimer",
    title: "Disclaimer",
    shortTitle: "disclaimer",
    lead: "Important information about the content on this website.",
    sections: [
      { id: "not-advice", heading: "General information, not legal advice", covers: "Content is general information and not a substitute for advice on specific facts.", text: [] },
      { id: "no-relationship", heading: "No lawyer-client relationship", covers: "Contacting the firm or using the site does not by itself create a lawyer-client relationship.", text: [] },
      { id: "review", heading: "Professional review", covers: "Readers should obtain advice on their own matter before acting.", text: [] },
      { id: "accuracy", heading: "Accuracy and updates", covers: "Publications reflect the law on their stated date; limits on accuracy and updating.", text: [] },
      { id: "conduct", heading: "Professional conduct", covers: "The approved conduct wording required for advocates' websites in India.", text: [] },
    ],
  },
];

export function getLegalPage(path: LegalPage["path"]): LegalPage {
  return legalPages.find((p) => p.path === path)!;
}

export const isApproved = (page: LegalPage) => page.sections.every((s) => s.text.length > 0) && Boolean(page.effectiveDate);
