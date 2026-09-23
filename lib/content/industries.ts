import { isPublic } from "@/lib/visibility";

export type Industry = {
  slug: string;
  name: string;
  summary: string;
  serviceIds: string[];
  /** A sector page is published only once its lawyer-approved detail exists (guide p.113, p.115). */
  approved: boolean;
};

export const industries: Industry[] = [
  { slug: "technology-digital-business", name: "Technology & Digital Business", summary: "Legal work for technology businesses, digital services and data-led operations.", serviceIds: ["S01", "S03", "S26", "S28", "S30"], approved: false },
  { slug: "financial-services-fintech", name: "Financial Services & FinTech", summary: "Regulation, transactions, financing and dispute issues for financial-service businesses.", serviceIds: ["S04", "S05", "S06", "S14", "S28", "S34"], approved: false },
  { slug: "real-estate-construction", name: "Real Estate & Construction", summary: "Property transactions, development, construction, finance and related disputes.", serviceIds: ["S22", "S23", "S04", "S19", "S10"], approved: false },
  { slug: "energy-infrastructure", name: "Energy & Infrastructure", summary: "Project development, commercial arrangements, regulation and dispute issues.", serviceIds: ["S23", "S24", "S25", "S04", "S10"], approved: false },
  { slug: "manufacturing-industrials", name: "Manufacturing & Industrials", summary: "Supply chains, facilities, workforce, trade, contracts and dispute matters.", serviceIds: ["S01", "S20", "S25", "S26", "S30"], approved: false },
  { slug: "consumer-retail", name: "Consumer & Retail", summary: "Product, distribution, advertising, consumer and digital-commerce questions.", serviceIds: ["S01", "S19", "S26", "S28", "S33"], approved: false },
  { slug: "healthcare-life-sciences", name: "Healthcare & Life Sciences", summary: "Regulatory, commercial, IP, employment and compliance issues in healthcare and life sciences.", serviceIds: ["S26", "S28", "S30", "S33", "S35"], approved: false },
  { slug: "media-entertainment-sports", name: "Media, Entertainment & Sports", summary: "Rights, production, licensing, distribution and disputes for creative and sporting activities.", serviceIds: ["S01", "S26", "S27", "S28", "S29"], approved: false },
  { slug: "transport-logistics", name: "Transport & Logistics", summary: "Contracts, assets, regulation, customs and disputes across transport and logistics.", serviceIds: ["S04", "S20", "S30", "S36", "S37"], approved: false },
  { slug: "education-nonprofits", name: "Education & Non-profits", summary: "Governance, operations, regulation, employment and property matters for institutions.", serviceIds: ["S01", "S22", "S30", "S34", "S38"], approved: false },
  { slug: "hospitality-leisure", name: "Hospitality & Leisure", summary: "Property, operating agreements, licensing, workforce and consumer matters.", serviceIds: ["S01", "S19", "S22", "S30", "S33"], approved: false },
  { slug: "professional-business-services", name: "Professional & Business Services", summary: "Business structure, client contracts, employment, tax and liability questions.", serviceIds: ["S01", "S18", "S28", "S30", "S36"], approved: false },
];

/** The six sectors featured on the homepage (H06). */
const homeOrder = [
  "technology-digital-business",
  "real-estate-construction",
  "financial-services-fintech",
  "healthcare-life-sciences",
  "consumer-retail",
  "manufacturing-industrials",
];

export function getHomeIndustries(): Industry[] {
  return homeOrder
    .map((slug) => industries.find((industry) => industry.slug === slug))
    .filter((industry): industry is Industry => industry !== undefined && isPublic(industry));
}
