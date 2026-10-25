import type { ServiceDetail } from "@/lib/content/service-details";
import { matchesAll, queryWords } from "@/lib/search";

export type ServiceGroupKey =
  | "business"
  | "disputes"
  | "tax"
  | "property"
  | "ip"
  | "people"
  | "regulated"
  | "international";

export type ServiceGroup = {
  key: ServiceGroupKey;
  /** Value used in /services?group=. */
  alias: string;
  /** Short label on the /services filter chips. */
  chip: string;
  name: string;
  /** One-line description on the homepage service cards. */
  description: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  group: ServiceGroupKey;
  summary: string;
  approved: boolean;
  /** Publication hold: never public while set. */
  hold?: boolean;
};

/**
 * The practice groups shown on the website, in their order: the six of the final screens plus
 * International Counsel Support. The keys are the ones the CMS and the newsletter lists use
 * (backend SERVICE_GROUPS and NEWSLETTER_TOPIC_IDS): "people" now holds Private Client & Consumer,
 * and "regulated" has no services, so it is not listed. Each group listed here is also a
 * newsletter topic on /subscribe.
 */
export const serviceGroups: ServiceGroup[] = [
  { key: "ip", alias: "IP", chip: "IP", name: "Intellectual Property", description: "Protection, prosecution, ownership, commercialisation and enforcement." },
  { key: "business", alias: "Business", chip: "Business", name: "Corporate, Finance & Transactions", description: "Corporate advice, commercial agreements, acquisitions and finance." },
  { key: "disputes", alias: "Disputes", chip: "Disputes", name: "Disputes, Investigations & Recovery", description: "Civil and criminal proceedings, arbitration, investigations and recovery." },
  { key: "tax", alias: "Tax", chip: "Tax", name: "Tax", description: "GST, indirect tax, tax disputes and investigation response." },
  { key: "property", alias: "Property", chip: "Property", name: "Real Estate, Projects & Energy", description: "Property, construction, infrastructure and energy matters." },
  { key: "people", alias: "Private", chip: "Private client", name: "Private Client & Consumer", description: "Succession, family matters and consumer disputes." },
  {
    key: "international",
    alias: "International",
    chip: "International",
    name: "International Counsel Support",
    description: "Support for overseas law firms and in-house teams on matters involving Indian law.",
  },
];

// The twenty services of the final screens. IDs and slugs are kept from the earlier catalogue so the
// CMS records stay linked. Every record starts unapproved; each one is published from the CMS.
export const services: Service[] = [
  { id: "S26", slug: "intellectual-property", title: "Intellectual Property", group: "ip", summary: "Protection, prosecution, ownership, commercialisation and management of patents, trade marks, designs and copyright, with coordinated support for Indian and international portfolios.", approved: false },
  { id: "S27", slug: "ip-disputes-enforcement", title: "IP Disputes & Enforcement", group: "ip", summary: "Infringement, passing off, validity, oppositions and rectifications, patent and trade mark disputes, anti-counterfeiting, online enforcement and related commercial claims.", approved: false },
  { id: "S01", slug: "corporate-commercial", title: "Corporate & Commercial", group: "business", summary: "Business formation, governance, shareholder arrangements, commercial contracts and day-to-day legal support, with particular attention to IP- and technology-intensive businesses.", approved: false },
  { id: "S02", slug: "mergers-acquisitions", title: "Mergers & Acquisitions", group: "business", summary: "Acquisitions, disposals, business transfers and joint ventures, from structuring and due diligence through documentation, closing and post-closing implementation.", approved: false },
  { id: "S04", slug: "banking-finance", title: "Banking & Finance", group: "business", summary: "Borrowing, lending and security documentation, refinancing, structured arrangements and finance-related advisory for businesses, promoters and lenders.", approved: false },
  { id: "S09", slug: "civil-commercial-litigation", title: "Civil & Commercial Litigation", group: "disputes", summary: "Civil suits and commercial disputes involving contracts, shareholders, property, recovery, injunctions, business relationships and enforcement of rights.", approved: false },
  { id: "S10", slug: "arbitration", title: "Arbitration", group: "disputes", summary: "Domestic and cross-border commercial arbitration, interim relief, arbitral procedure, hearings, challenges and enforcement of awards.", approved: false },
  { id: "S11", slug: "mediation-settlement", title: "Mediation & Settlement", group: "disputes", summary: "Pre-litigation and pending-dispute negotiations, mediation preparation, structured settlements and implementation of agreed resolutions.", approved: false },
  { id: "S12", slug: "criminal-defence", title: "Criminal Defence", group: "disputes", summary: "Defence and representation in criminal complaints, investigations, bail, trial proceedings, appeals and criminal issues arising from commercial or personal disputes.", approved: false },
  { id: "S13", slug: "white-collar-investigations", title: "White-Collar Crime & Investigations", group: "disputes", summary: "Corporate and financial misconduct, internal investigations, fraud-related allegations, regulatory inquiries and connected criminal or commercial proceedings.", approved: false },
  { id: "S14", slug: "sarfaesi-drt-debt-recovery", title: "SARFAESI, DRT & Debt Recovery", group: "disputes", summary: "Secured-credit enforcement, borrower and guarantor remedies, DRT and DRAT proceedings, negotiated settlements and recovery disputes.", approved: false },
  { id: "S15", slug: "insolvency-restructuring", title: "Insolvency & Restructuring", group: "disputes", summary: "Financial distress, creditor and debtor advisory, insolvency proceedings, resolution plans, restructuring and disputes arising from the insolvency process.", approved: false },
  { id: "S19", slug: "gst-indirect-tax", title: "GST & Indirect Tax", group: "tax", summary: "GST and indirect-tax advice on transactions, classification, input tax credit, registrations, documentation, notices, refunds and recurring business issues.", approved: false },
  { id: "S21", slug: "tax-litigation-investigations", title: "Tax Litigation & Investigations", group: "tax", summary: "Tax notices, investigations, adjudication, assessment disputes, appeals and court proceedings involving direct and indirect tax issues.", approved: false },
  { id: "S22", slug: "real-estate-rera", title: "Real Estate & RERA", group: "property", summary: "Title review, acquisitions and disposals, leasing, development arrangements, RERA matters and property disputes for owners, developers, occupiers and investors.", approved: false },
  { id: "S23", slug: "construction-infrastructure", title: "Construction & Infrastructure", group: "property", summary: "Project contracts, procurement, construction claims, delays, variations, payment disputes and legal support for infrastructure and development projects.", approved: false },
  { id: "S24", slug: "energy-natural-resources", title: "Energy & Natural Resources", group: "property", summary: "Energy projects, commercial and supply arrangements, project development, investments, regulatory issues and disputes involving energy and natural-resource businesses.", approved: false },
  { id: "S32", slug: "private-client-succession", title: "Private Client, Wills & Succession", group: "people", summary: "Wills, estate and succession planning, probate and administration, family settlements, business succession and disputes concerning private assets.", approved: false },
  { id: "S31", slug: "family-matrimonial", title: "Family & Matrimonial", group: "people", summary: "Matrimonial proceedings, divorce, maintenance, parenting issues, family arrangements, protective remedies and negotiated resolution of personal disputes.", approved: false },
  { id: "S33", slug: "consumer-product-liability", title: "Consumer Protection & Product Liability", group: "people", summary: "Consumer complaints, product and service disputes, e-commerce issues, product-liability claims and legal support for businesses on consumer-facing terms and processes.", approved: false },
];

export function groupHref(group: ServiceGroup): string {
  return `/services?group=${encodeURIComponent(group.alias)}`;
}

/** The group a service belongs to (records saved before the six-group catalogue fall back to none). */
export function getServiceGroup(key: ServiceGroupKey): ServiceGroup | undefined {
  return serviceGroups.find((group) => group.key === key);
}

/** Accepts the short alias (?group=Business) or the key, case-insensitively. */
export function findGroupByAlias(value: string | undefined): ServiceGroup | undefined {
  if (!value) return undefined;
  const needle = value.trim().toLowerCase();
  return serviceGroups.find((group) => group.alias.toLowerCase() === needle || group.key === needle);
}

export function serviceSearchText(service: Service, detail: ServiceDetail | undefined): string {
  const scope = detail ? detail.scope.map((area) => `${area.title} ${area.text}`).join(" ") : "";
  return `${service.title} ${service.summary} ${getServiceGroup(service.group)?.name ?? ""} ${scope}`.toLowerCase();
}

/** Group and keyword filters combine. Every query word must match. */
export function filterServices(
  list: Service[],
  group: ServiceGroup | undefined,
  query: string,
  details: Record<string, ServiceDetail>,
): Service[] {
  const words = queryWords(query);
  return list.filter((service) => {
    if (group && service.group !== group.key) return false;
    return words.length === 0 || matchesAll(serviceSearchText(service, details[service.id]), words);
  });
}

export type GroupWithServices = ServiceGroup & { services: Service[] };

/** Groups that have at least one of the given services, in the screens' order. */
export function groupServices(visible: Service[]): GroupWithServices[] {
  return serviceGroups
    .map((group) => ({ ...group, services: visible.filter((s) => s.group === group.key) }))
    .filter((group) => group.services.length > 0);
}
