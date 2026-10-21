export type Industry = {
  slug: string;
  name: string;
  /** One sentence for the industry cards. */
  summary: string;
  serviceIds: string[];
  /** A sector page is public only once it is approved and published in the CMS. */
  approved: boolean;
  /** Hero paragraph of the industry page. */
  intro?: string;
  overview?: string;
  /** "Areas of focus": short titles (the text may be empty). */
  workAreas?: { title: string; text: string }[];
  /** Position among the six homepage sectors; unset = not featured. */
  homeOrder?: number;
};

const focus = (...titles: string[]) => titles.map((title) => ({ title, text: "" }));

// The seven sectors of the final screens, in their order.
export const industries: Industry[] = [
  {
    slug: "technology-digital-business",
    name: "Technology & Digital Business",
    summary: "Technology businesses depend on the relationship between their products, contracts and intellectual property.",
    intro:
      "Technology businesses depend on the relationship between their products, contracts and intellectual property. We advise on ownership, licensing and commercial arrangements, as well as disputes affecting development, distribution and use. Transactions involving technology also require attention to the rights that can be transferred and the obligations that continue after completion.",
    workAreas: focus("IP ownership and licensing", "Development and commercial agreements", "Transaction due diligence", "Contract and IP disputes"),
    serviceIds: ["S26", "S27", "S01", "S02", "S10"],
    approved: false,
  },
  {
    slug: "real-estate-construction",
    name: "Real Estate & Construction",
    summary: "Property and construction matters connect title, finance, contractual performance and remedies.",
    intro:
      "Property and construction matters connect title, finance, contractual performance and remedies. We advise owners, developers, occupiers, contractors and investors on documents and disputes across acquisition, development and occupation. Our work includes property due diligence, leasing, development arrangements, construction claims and RERA matters.",
    workAreas: focus("Title and property documentation", "Development and leasing", "Project contracts and claims", "RERA and dispute proceedings"),
    serviceIds: ["S22", "S23", "S04", "S09", "S10"],
    approved: false,
  },
  {
    slug: "financial-services-fintech",
    name: "Financial Services & FinTech",
    summary: "Financing arrangements require clear documentation of repayment, security, guarantees and the consequences of default.",
    intro:
      "Financing arrangements require clear documentation of repayment, security, guarantees and the consequences of default. We advise on these contractual issues and the disputes that may follow. For technology-based businesses, we also consider ownership and permitted use of the software, brands and other intellectual property relevant to a transaction.",
    workAreas: focus("Finance and security documents", "Debt recovery and restructuring", "Commercial and technology contracts", "IP ownership and licensing"),
    serviceIds: ["S04", "S14", "S15", "S01", "S26"],
    approved: false,
  },
  {
    slug: "healthcare-life-sciences",
    name: "Healthcare & Life Sciences",
    summary: "Research, products and commercial partnerships can bring several legal questions together.",
    intro:
      "Research, products and commercial partnerships can bring several legal questions together. We advise on patents and other intellectual property, ownership and licensing, commercial agreements and related disputes. Transaction reviews can address the chain of title and contractual restrictions affecting research, technology or brands.",
    workAreas: focus("Patents and portfolio management", "Research and licensing agreements", "Transaction due diligence", "IP and product-related disputes"),
    serviceIds: ["S26", "S27", "S01", "S02", "S33"],
    approved: false,
  },
  {
    slug: "consumer-retail",
    name: "Consumer & Retail",
    summary: "Brands, distribution arrangements and customer-facing terms shape consumer and retail businesses.",
    intro:
      "Brands, distribution arrangements and customer-facing terms shape consumer and retail businesses. We advise on trade marks, commercial contracts, consumer disputes and enforcement against unauthorised use. Our work connects the contractual record with the product representations, sales channels and rights relevant to the matter.",
    workAreas: focus("Brand protection and enforcement", "Distribution and supply contracts", "Customer terms and consumer disputes", "GST and transaction issues"),
    serviceIds: ["S26", "S27", "S01", "S33", "S19"],
    approved: false,
  },
  {
    slug: "manufacturing-industrials",
    name: "Manufacturing & Industrials",
    summary: "Manufacturing businesses rely on technical information, supply relationships, facilities and commercial documentation.",
    intro:
      "Manufacturing businesses rely on technical information, supply relationships, facilities and commercial documentation. We advise on protection and licensing of intellectual property, operating contracts, financing and disputes. Where a project or transaction depends on technical drawings, software or know-how, those rights are considered alongside the physical assets and performance obligations.",
    workAreas: focus("Technical IP and know-how", "Supply and operating contracts", "Project and finance documentation", "Payment and performance disputes"),
    serviceIds: ["S26", "S01", "S04", "S23", "S10", "S19"],
    approved: false,
  },
  {
    slug: "energy-infrastructure",
    name: "Energy & Infrastructure",
    summary: "Energy and infrastructure projects bring together land, construction, financing and long-term commercial arrangements.",
    intro:
      "Energy and infrastructure projects bring together land, construction, financing and long-term commercial arrangements. We advise on project documentation, supply and offtake terms, transactions and disputes. The work connects the relevant contracts with project records and any technology or intellectual-property arrangements material to delivery and operation.",
    workAreas: focus("Project and offtake agreements", "Land and infrastructure arrangements", "Financing and transaction support", "Project claims and arbitration"),
    serviceIds: ["S24", "S23", "S22", "S04", "S10"],
    approved: false,
  },
];

/** The six sectors featured on the homepage, in order. */
export const homeOrder = [
  "technology-digital-business",
  "real-estate-construction",
  "financial-services-fintech",
  "healthcare-life-sciences",
  "consumer-retail",
  "manufacturing-industrials",
];
