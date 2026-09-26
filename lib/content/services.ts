import type { ServiceDetail } from "@/lib/content/service-details";
import { matchesAll, queryWords } from "@/lib/search";

export type ServiceGroupKey =
  | "business"
  | "disputes"
  | "tax"
  | "property"
  | "ip"
  | "people"
  | "regulated";

export type ServiceGroup = {
  key: ServiceGroupKey;
  /** Value used in /services?group= (guide p.10). */
  alias: string;
  name: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  group: ServiceGroupKey;
  summary: string;
  approved: boolean;
  /** Publication hold, e.g. Litigation Funding Advisory (guide p.63). */
  hold?: boolean;
};

export const serviceGroups: ServiceGroup[] = [
  { key: "business", alias: "Business", name: "Business & Transactions" },
  { key: "disputes", alias: "Disputes", name: "Disputes & Recovery" },
  { key: "tax", alias: "Tax", name: "Tax & Trade" },
  { key: "property", alias: "Property", name: "Property & Projects" },
  { key: "ip", alias: "IP", name: "IP, Technology & Media" },
  { key: "people", alias: "People", name: "People & Private Matters" },
  { key: "regulated", alias: "Regulated", name: "Regulated Sectors & Public Law" },
];

// All 40 records start unapproved (guide p.27, p.150). Approve individually, never globally.
export const services: Service[] = [
  { id: "S01", slug: "corporate-commercial", title: "Corporate & Commercial", group: "business", summary: "Business formation, governance, commercial agreements and legal support for day-to-day operations.", approved: false },
  { id: "S02", slug: "mergers-acquisitions", title: "Mergers & Acquisitions", group: "business", summary: "Acquisitions, disposals, joint ventures and transaction documentation, from diligence through completion.", approved: false },
  { id: "S03", slug: "private-equity-venture-capital-startups", title: "Private Equity, Venture Capital & Startups", group: "business", summary: "Founder arrangements, fundraising, investment documentation and legal support through business growth.", approved: false },
  { id: "S04", slug: "banking-finance", title: "Banking & Finance", group: "business", summary: "Lending, borrowing, security documents, project finance and financing-related advisory.", approved: false },
  { id: "S05", slug: "capital-markets-securities", title: "Capital Markets & Securities", group: "business", summary: "Securities transactions, disclosure obligations, listed-company advisory and enforcement matters.", approved: false },
  { id: "S06", slug: "investment-funds", title: "Investment Funds & Asset Management", group: "business", summary: "Fund structures, investment documents, manager arrangements and legal compliance support.", approved: false },
  { id: "S07", slug: "competition-antitrust", title: "Competition & Antitrust", group: "business", summary: "Merger-control advice, competition assessments, investigations and compliance programmes.", approved: false },
  { id: "S08", slug: "foreign-investment-exchange-control", title: "Foreign Investment & Exchange Control", group: "business", summary: "Inbound and outbound investment, cross-border transactions and exchange-control compliance.", approved: false },
  { id: "S09", slug: "civil-commercial-litigation", title: "Civil & Commercial Litigation", group: "disputes", summary: "Civil suits, commercial claims, interim applications, appeals and enforcement proceedings.", approved: false },
  { id: "S10", slug: "arbitration", title: "Arbitration", group: "disputes", summary: "Arbitration agreements, domestic and international proceedings, interim relief and award-related litigation.", approved: false },
  { id: "S11", slug: "mediation-settlement", title: "Mediation & Settlement", group: "disputes", summary: "Negotiated resolution, mediation preparation and the documentation of settlement terms.", approved: false },
  { id: "S12", slug: "criminal-defence", title: "Criminal Defence", group: "disputes", summary: "Criminal proceedings, bail applications, trial preparation, appeals and related legal representation.", approved: false },
  { id: "S13", slug: "white-collar-investigations", title: "White-Collar Crime & Investigations", group: "disputes", summary: "Internal investigations, corporate misconduct, financial allegations and regulatory investigations.", approved: false },
  { id: "S14", slug: "sarfaesi-drt-debt-recovery", title: "SARFAESI, DRT & Debt Recovery", group: "disputes", summary: "Secured-credit enforcement, borrower remedies, DRT and DRAT proceedings, and debt-recovery disputes.", approved: false },
  { id: "S15", slug: "insolvency-restructuring", title: "Insolvency & Restructuring", group: "disputes", summary: "Financial distress, creditor and debtor advisory, resolution processes and insolvency-related disputes.", approved: false },
  { id: "S16", slug: "litigation-strategy-portfolio", title: "Litigation Strategy & Portfolio Management", group: "disputes", summary: "Coordinated oversight of multiple disputes, reporting, external counsel and settlement strategy.", approved: false },
  { id: "S17", slug: "litigation-funding-advisory", title: "Litigation Funding Advisory", group: "disputes", summary: "Legal review of third-party funding arrangements, subject to applicable professional and jurisdictional restrictions.", approved: false, hold: true },
  { id: "S18", slug: "direct-international-tax", title: "Direct & International Tax", group: "tax", summary: "Tax advice on business structures, transactions, cross-border matters and private-client arrangements.", approved: false },
  { id: "S19", slug: "gst-indirect-tax", title: "GST & Indirect Tax", group: "tax", summary: "GST and indirect-tax advice, transaction review, notices, classification and credit-related issues.", approved: false },
  { id: "S20", slug: "customs-international-trade", title: "Customs & International Trade", group: "tax", summary: "Import and export transactions, customs disputes, trade remedies and cross-border compliance.", approved: false },
  { id: "S21", slug: "tax-litigation-investigations", title: "Tax Litigation & Investigations", group: "tax", summary: "Tax notices, investigations, assessment disputes, appeals and proceedings before relevant fora.", approved: false },
  { id: "S22", slug: "real-estate-rera", title: "Real Estate & RERA", group: "property", summary: "Title review, property transactions, leasing, development arrangements and real-estate disputes.", approved: false },
  { id: "S23", slug: "construction-infrastructure", title: "Construction & Infrastructure", group: "property", summary: "Project contracts, procurement, claims, delays, payment disputes and infrastructure transactions.", approved: false },
  { id: "S24", slug: "energy-natural-resources", title: "Energy & Natural Resources", group: "property", summary: "Energy projects, commercial arrangements, resource transactions and regulatory disputes.", approved: false },
  { id: "S25", slug: "environment-climate", title: "Environment & Climate", group: "property", summary: "Environmental permissions, compliance reviews, project risk and environmental proceedings.", approved: false },
  { id: "S26", slug: "intellectual-property", title: "Intellectual Property", group: "ip", summary: "Patents, trade marks, designs, copyright, ownership, licensing and portfolio management.", approved: false },
  { id: "S27", slug: "ip-disputes-enforcement", title: "IP Disputes & Enforcement", group: "ip", summary: "Infringement, passing off, validity, trade-secret disputes and rights-specific enforcement.", approved: false },
  { id: "S28", slug: "technology-data-cybersecurity", title: "Technology, Data & Cybersecurity", group: "ip", summary: "Technology contracts, data protection, digital products, cybersecurity response and platform issues.", approved: false },
  { id: "S29", slug: "media-entertainment-sports", title: "Media, Entertainment & Sports", group: "ip", summary: "Content, production, licensing, advertising, talent, sports agreements and related disputes.", approved: false },
  { id: "S30", slug: "employment-labour-posh", title: "Employment, Labour & POSH", group: "people", summary: "Employment documents, workplace policies, labour issues, investigations and employment disputes.", approved: false },
  { id: "S31", slug: "family-matrimonial", title: "Family & Matrimonial", group: "people", summary: "Matrimonial proceedings, family arrangements, maintenance, parenting issues and negotiated resolution.", approved: false },
  { id: "S32", slug: "private-client-succession", title: "Private Client, Wills & Succession", group: "people", summary: "Wills, estate planning, succession, family businesses and private-wealth legal arrangements.", approved: false },
  { id: "S33", slug: "consumer-product-liability", title: "Consumer Protection & Product Liability", group: "people", summary: "Consumer claims, product and service disputes, e-commerce issues and business compliance.", approved: false },
  { id: "S34", slug: "regulatory-public-law", title: "Regulatory & Public Law", group: "regulated", summary: "Regulatory advice, administrative decisions, statutory challenges and constitutional remedies.", approved: false },
  { id: "S35", slug: "healthcare-life-sciences", title: "Healthcare, Pharmaceuticals & Life Sciences", group: "regulated", summary: "Sector regulation, transactions, commercial agreements, IP and healthcare-related disputes.", approved: false },
  { id: "S36", slug: "insurance", title: "Insurance", group: "regulated", summary: "Insurance contracts, coverage disputes, claims, regulatory matters and insurance transactions.", approved: false },
  { id: "S37", slug: "transport-maritime-aviation", title: "Transport, Maritime & Aviation", group: "regulated", summary: "Transport contracts, logistics, maritime and aviation matters, claims and sector regulation.", approved: false },
  { id: "S38", slug: "education-trusts-nonprofits", title: "Education, Trusts & Non-profits", group: "regulated", summary: "Educational institutions, charitable structures, governance, commercial agreements and regulatory issues.", approved: false },
  { id: "S39", slug: "immigration-global-mobility", title: "Immigration & Global Mobility", group: "regulated", summary: "Indian immigration and mobility advice, documentation and coordination of overseas legal requirements.", approved: false },
  { id: "S40", slug: "government-contracts-procurement", title: "Government Contracts & Procurement", group: "regulated", summary: "Tender documents, public contracts, bid-related disputes and project implementation.", approved: false },
];

export function groupHref(group: ServiceGroup): string {
  return `/services?group=${encodeURIComponent(group.alias)}`;
}

export function getServiceGroup(key: ServiceGroupKey): ServiceGroup {
  return serviceGroups.find((group) => group.key === key)!;
}

/** Accepts the short alias (?group=Business) or the key, case-insensitively. */
export function findGroupByAlias(value: string | undefined): ServiceGroup | undefined {
  if (!value) return undefined;
  const needle = value.trim().toLowerCase();
  return serviceGroups.find((group) => group.alias.toLowerCase() === needle || group.key === needle);
}

export function serviceSearchText(service: Service, detail: ServiceDetail | undefined): string {
  const scope = detail ? detail.scope.map((area) => `${area.title} ${area.text}`).join(" ") : "";
  return `${service.title} ${service.summary} ${getServiceGroup(service.group).name} ${scope}`.toLowerCase();
}

/** Group and keyword filters combine (guide p.26). Every query word must match. */
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

/** Groups that have at least one of the given services, in the guide's order. */
export function groupServices(visible: Service[]): GroupWithServices[] {
  return serviceGroups
    .map((group) => ({ ...group, services: visible.filter((s) => s.group === group.key) }))
    .filter((group) => group.services.length > 0);
}
