export const site = {
  name: "RNK Legalheads",
  established: 2024,
  statement: "Built on Trust, Driven by Commitment.",
  disclaimer:
    "Registered with limited liability. General information only. Not legal advice. No advocate-client relationship is created by use of this website.",
};

/**
 * Office contact facts, supplied by the firm. Placeholder addresses or unmonitored mailboxes must
 * never go live; leave a field undefined until it is verified. Telephone numbers appear in the footer
 * only (numbers separated by "|"); the contact page asks visitors to get in touch by email.
 */
export const contactDetails: {
  address?: string;
  phone?: string;
  email?: string;
  /** Search text for the Google Maps embed and "Open in Google Maps" link. */
  mapQuery?: string;
} = {
  address: "Plot No. 94, 3rd Floor, Pocket 10, Dwarka Sector 13, New Delhi 110078, India",
  phone: "+91 97792 02789 | +91 60034 16196",
  email: "contact@rnklegalheads.com",
  mapQuery: "Plot Number 94, Pocket 10, Sector 13, Dwarka, New Delhi 110078",
};

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Firm", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "The firm", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Knowledge",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Articles", href: "/articles" },
      { label: "Recent Judgments", href: "/recent-judgments" },
      { label: "Legal Updates", href: "/legal-updates" },
      { label: "Newsletters", href: "/newsletters" },
    ],
  },
  {
    heading: "Information",
    links: [
      { label: "Subscribe", href: "/subscribe" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-and-conditions" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export type HeroSlide = {
  heading: string;
  body: string;
  cta: NavLink;
};

// Final screens, slides 1–3. The H1 stays outside the slides; only this content changes.
export const heroSlides: HeroSlide[] = [
  {
    heading: "Intellectual property, in a wider legal context.",
    body: "We advise on protecting, managing and enforcing intellectual property, alongside commercial transactions, civil and criminal disputes, arbitration, taxation and private matters.",
    cta: { label: "Explore services", href: "/services" },
  },
  {
    heading: "Legal support for business decisions.",
    body: "From contracts and financing to acquisitions, property and tax, we connect the legal work with the transaction and the decisions it requires.",
    cta: { label: "Business services", href: "/services?group=Business" },
  },
  {
    heading: "Representation across disputes.",
    body: "Civil and commercial litigation, criminal defence, arbitration, recovery and tax disputes, with attention to the facts, the forum and the relief available.",
    cta: { label: "Disputes and recovery", href: "/services?group=Disputes" },
  },
];
