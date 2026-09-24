export const site = {
  name: "RNK Legalheads",
  established: 2024,
  statement: "A full-service law firm. Established in 2024.",
  disclaimer:
    "This website provides general information. It is not legal advice and does not create a lawyer-client relationship.",
};

/**
 * Office contact facts, supplied by the firm (guide p.136). Placeholder addresses or unmonitored
 * mailboxes must never go live; leave a field undefined until it is verified.
 */
export const contactDetails: {
  address?: string;
  phone?: string;
  email?: string;
  /** Search text for the Google Maps embed and "Open in Google Maps" link. */
  mapQuery?: string;
} = {
  address: "RNK Legalheads LLP\nThird Floor, Plot Number 94, Pocket 10\nSector 13, Dwarka\nNew Delhi 110078",
  email: "contact@rnklegalheads.com",
  mapQuery: "Plot Number 94, Pocket 10, Sector 13, Dwarka, New Delhi 110078",
};

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Firm", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "People", href: "/people" },
  { label: "Insights", href: "/insights" },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "The firm", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "People", href: "/people" },
    ],
  },
  {
    heading: "Knowledge",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Recent judgments", href: "/recent-judgments" },
      { label: "Newsletters", href: "/newsletters" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Subscribe", href: "/subscribe" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Website terms", href: "/terms-and-conditions" },
];

export type HeroSlide = {
  heading: string;
  body: string;
  cta: NavLink;
};

// Guide p.14–17. The H1 stays outside the slides; only this content changes.
export const heroSlides: HeroSlide[] = [
  {
    heading: "Advice for business and personal matters.",
    body: "RNK Legalheads advises businesses, institutions and individuals on transactions, disputes, taxation, regulation and private matters.",
    cta: { label: "Explore services", href: "/services" },
  },
  {
    heading: "Legal support for the life of a business.",
    body: "From formation and contracts to investment, property and tax, our work covers the legal questions that arise as a business develops.",
    cta: { label: "Business services", href: "/services?group=Business" },
  },
  {
    heading: "Representation across disputes and recovery.",
    body: "Civil and criminal proceedings, arbitration, secured recovery and insolvency are brought together within our disputes offering.",
    cta: { label: "Disputes and recovery", href: "/services?group=Disputes" },
  },
];
