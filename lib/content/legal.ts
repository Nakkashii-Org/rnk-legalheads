/**
 * Legal pages G01–G04 (guide p.138): the firm's approved texts (Website Disclaimer, Privacy Policy,
 * Terms of Use, Cookie Policy; last updated 24 September 2026). Copy them word for word; any change
 * needs the firm's approval and a new "Last updated" date.
 */

/** A paragraph, a paragraph with a bold lead-in, a bulleted list, a table, or the grievance-contact details from Site settings. */
export type LegalBlock =
  | string
  | { lead: string; text: string }
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { grievanceContact: true };

export type LegalSection = { id: string; heading: string; blocks: LegalBlock[] };

export type LegalPath = "/privacy-policy" | "/terms-and-conditions" | "/disclaimer" | "/cookie-policy";

export type LegalPage = {
  path: LegalPath;
  title: string;
  shortTitle: string;
  lead: string;
  /** "Last updated" date of the approved text. */
  lastUpdated: string;
  /** Paragraphs before the numbered sections. */
  intro: LegalBlock[];
  sections: LegalSection[];
};

const FIRM = "RNK Legalheads LLP";

/** The Website Disclaimer: shown in the "I Agree" pop-up to every visitor, and on /disclaimer. */
export const disclaimerText: LegalBlock[] = [
  {
    lead: "Under the rules of the Bar Council of India, advocates are prohibited from soliciting work or advertising, directly or indirectly, except to the extent permitted under the applicable rules.",
    text: `${FIRM} maintains this website solely for the purpose of providing general information about the Firm, its professionals and its areas of practice. Nothing on this website is intended to solicit clients or constitute advertising.`,
  },
  `By clicking "I Agree" and accessing this website, you acknowledge that the information made available on the website is for general informational purposes only and does not constitute legal advice, a legal opinion or any other professional advice. Accessing or using this website, or communicating with ${FIRM} through it, does not by itself create an advocate-client relationship.`,
  `You should not act, or refrain from acting, solely on the basis of any information contained on this website and should obtain legal advice appropriate to your particular circumstances. ${FIRM} does not accept responsibility for decisions taken solely in reliance on the information available on this website, to the fullest extent permitted by law.`,
  `Please do not send confidential, sensitive or privileged information through this website unless ${FIRM} has expressly agreed to act for you in the relevant matter. An unsolicited communication does not, by itself, create an advocate-client relationship or an obligation on the Firm to accept an engagement.`,
  "The website may contain links to third-party websites or resources. Such links are provided for convenience or reference only and do not imply endorsement. The Firm is not responsible for the content, availability or practices of third-party websites.",
  `By clicking "I Agree", you confirm that you have read and understood this Disclaimer and wish to continue to the website.`,
];

export const legalPages: LegalPage[] = [
  {
    path: "/disclaimer",
    title: "Website Disclaimer",
    shortTitle: "disclaimer",
    lead: "Important information about this website and the rules that govern advocates in India.",
    lastUpdated: "24 September 2026",
    intro: disclaimerText,
    sections: [],
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    shortTitle: "privacy policy",
    lead: "How RNK Legalheads collects, uses, discloses, retains and protects personal information through this website.",
    lastUpdated: "24 September 2026",
    intro: [
      `${FIRM} ("RNK Legalheads", "the Firm", "we", "us" or "our") respects the privacy of individuals who visit or interact with our website. This Privacy Policy explains how we collect, use, disclose, retain and protect personal information in connection with the website and related communications with the Firm.`,
      "This Policy is intended to be read together with our Website Disclaimer, Terms of Use and Cookie Policy. It applies to information collected through the website, contact or enquiry forms, recruitment or internship communications made through the website, and other website-related interactions. Client and matter information may also be subject to separate engagement terms, professional obligations and duties of confidentiality.",
    ],
    sections: [
      {
        id: "information",
        heading: "Information we may collect",
        blocks: [
          {
            lead: "Information you provide to us.",
            text: "When you contact the Firm, submit an enquiry, request information, register for an event or publication, or communicate with us through the website, we may receive information such as your name, email address, telephone number, organisation, designation, location and the contents of your communication.",
          },
          {
            lead: "Recruitment information.",
            text: "If you apply for an internship, employment or other professional opportunity, we may receive your curriculum vitae, educational and employment history, qualifications, writing samples, references and other information you choose to provide.",
          },
          {
            lead: "Technical and usage information.",
            text: "When you access the website, certain technical information may be generated automatically, such as internet protocol address, browser type, device type, operating system, date and time of access, pages viewed, referring page and similar log or analytics information. Some of this information may be collected through cookies or similar technologies.",
          },
          {
            lead: "Information from third parties.",
            text: "Where appropriate and lawful, we may receive personal information from professional contacts, clients, service providers, publicly available sources or other third parties in connection with an enquiry, event, recruitment process or other interaction with the Firm.",
          },
        ],
      },
      {
        id: "use",
        heading: "How we use personal information",
        blocks: [
          "We may use personal information for lawful purposes connected with the operation of the website and the Firm, including to:",
          {
            list: [
              "respond to enquiries, requests and communications;",
              "provide information about the Firm, its professionals, areas of practice, publications, events and updates that you have requested or chosen to receive;",
              "consider applications for employment, internships or other professional opportunities;",
              "maintain and improve the website, understand website usage, diagnose technical issues and protect the security of our systems;",
              "manage professional, administrative, compliance and record-keeping requirements;",
              "prevent misuse, fraud, security incidents or unlawful activity;",
              "comply with applicable law, court orders, regulatory requirements and professional obligations; and",
              "establish, exercise or defend legal rights where reasonably necessary.",
            ],
          },
          "Where consent is required by applicable law, we will process personal information on the basis of consent and will provide a means to withdraw consent. We may also process personal information for other uses permitted by applicable law.",
        ],
      },
      {
        id: "no-relationship",
        heading: "No advocate-client relationship merely by website use",
        blocks: [
          "Submitting information through the website, sending an email to the Firm or otherwise communicating with us does not by itself create an advocate-client relationship. Such a relationship is formed only after the Firm has agreed to act and the applicable engagement requirements have been completed.",
          "You should not send confidential, sensitive or privileged information through the website unless the Firm has expressly agreed to receive it in connection with an existing or proposed engagement. Unsolicited information may not be treated as confidential to the same extent as information received within an established professional relationship, subject always to applicable professional obligations and law.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies and similar technologies",
        blocks: [
          "The website may use cookies and similar technologies to enable core functionality, remember preferences, understand website performance and, where enabled, support analytics or other features. Further information is set out in our Cookie Policy. Where applicable law requires consent for non-essential cookies or similar technologies, we will seek that consent through an appropriate mechanism.",
        ],
      },
      {
        id: "sharing",
        heading: "Sharing and disclosure of information",
        blocks: [
          "We do not sell personal information. We may disclose personal information only where reasonably necessary for the purposes described in this Policy, including to:",
          {
            list: [
              "partners, lawyers, employees and authorised personnel of the Firm who require access for a relevant purpose;",
              "website hosting providers, cloud service providers, information-technology vendors, analytics providers, communication providers and other service providers acting on our instructions or supporting our operations;",
              "professional advisers, auditors or insurers where appropriate;",
              "courts, regulators, government authorities or law-enforcement bodies where disclosure is required or permitted by law; and",
              "other persons where you have authorised the disclosure or where it is otherwise lawful and necessary.",
            ],
          },
          "Where a service provider processes personal information for us, we expect it to use the information only for the relevant service and to apply appropriate safeguards, subject to applicable law and contractual arrangements.",
        ],
      },
      {
        id: "cross-border",
        heading: "International or cross-border processing",
        blocks: [
          "Some service providers or technology infrastructure used by the Firm may process or store information outside India. Where personal information is transferred or made accessible across borders, we will take steps required under applicable law and will observe any restrictions or conditions notified by competent authorities from time to time.",
        ],
      },
      {
        id: "retention",
        heading: "Retention",
        blocks: [
          "We retain personal information only for so long as reasonably necessary for the purpose for which it was collected, to manage our professional and business records, to meet legal, regulatory, contractual or professional obligations, or to establish, exercise or defend legal rights. Retention periods may vary depending on the nature of the information and the context in which it was received.",
          "When personal information is no longer required, we will take reasonable steps to delete, anonymise or securely dispose of it, subject to applicable retention obligations and technical limitations.",
        ],
      },
      {
        id: "security",
        heading: "Security",
        blocks: [
          "We use reasonable administrative, technical and organisational safeguards designed to protect personal information against unauthorised access, disclosure, alteration, loss or misuse. No internet transmission, website or information system can be guaranteed to be completely secure, and you provide information through the website with that understanding.",
        ],
      },
      {
        id: "rights",
        heading: "Your rights and choices",
        blocks: [
          "Depending on the law applicable to the processing and the provisions in force from time to time, you may have rights in relation to your personal information, including the right to seek access to information about processing, correction or updating of inaccurate information, erasure where legally available, withdrawal of consent, and grievance redressal.",
          "You may also opt out of non-essential communications at any time by using the unsubscribe option provided in the communication or by contacting us. Withdrawal of consent will not affect processing already carried out lawfully before withdrawal and may be subject to legal or professional retention requirements.",
        ],
      },
      {
        id: "children",
        heading: "Children",
        blocks: [
          "The website is intended primarily for adults and professional users. We do not knowingly seek to collect personal information from children through the website. If information concerning a child is provided to us, it will be handled in accordance with applicable law and, where required, appropriate consent or authorisation will be obtained.",
        ],
      },
      {
        id: "third-party",
        heading: "Third-party websites and services",
        blocks: [
          "The website may contain links to third-party websites, platforms or services. Those third parties operate under their own terms and privacy practices. The Firm is not responsible for the privacy, security or content of third-party websites merely because a link is provided on our website.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to this Privacy Policy",
        blocks: [
          'We may update this Privacy Policy from time to time to reflect changes in law, technology, our website or our practices. The revised version will be posted on the website with an updated "Last updated" date. Material changes may be brought to users\' attention through an appropriate notice on the website where required.',
        ],
      },
      {
        id: "grievance",
        heading: "Grievance and privacy contact",
        blocks: [
          "For questions, requests or grievances concerning this Privacy Policy or the handling of personal information through the website, please contact the Firm using the contact details below.",
          { grievanceContact: true },
        ],
      },
      {
        id: "governing",
        heading: "Governing framework",
        blocks: [
          "This Privacy Policy is intended to operate in accordance with applicable Indian law, including data-protection and information-technology requirements that are in force from time to time. Nothing in this Policy limits any right or obligation that cannot lawfully be excluded or restricted.",
        ],
      },
    ],
  },
  {
    path: "/terms-and-conditions",
    title: "Terms of Use",
    shortTitle: "terms of use",
    lead: "The terms that govern access to and use of this website.",
    lastUpdated: "24 September 2026",
    intro: [
      `These Terms of Use govern access to and use of the website operated by ${FIRM} ("RNK Legalheads", "the Firm", "we", "us" or "our"). By accessing or using the website after accepting the Website Disclaimer, you agree to these Terms of Use. If you do not agree, you should not use the website.`,
    ],
    sections: [
      {
        id: "purpose",
        heading: "Informational purpose and professional regulation",
        blocks: [
          "The website is intended to provide general information about the Firm, its professionals, areas of practice, publications, activities and other matters of general interest. It is not intended to solicit work or advertise legal services in a manner prohibited by the rules governing advocates in India.",
          "Nothing on the website should be treated as a representation that the Firm is entitled to provide legal services in every jurisdiction or in relation to every matter referred to on the website.",
        ],
      },
      {
        id: "no-advice",
        heading: "No legal advice",
        blocks: [
          "Content on the website is general in nature and may not reflect the most recent legal, regulatory or factual developments. It is not legal advice, a legal opinion or a substitute for advice based on the facts of a particular matter.",
          "You should obtain independent legal advice before acting or refraining from acting on the basis of any website content.",
        ],
      },
      {
        id: "no-relationship",
        heading: "No advocate-client relationship",
        blocks: [
          "Your access to the website, use of any contact form, subscription to an update, or communication with the Firm does not by itself create an advocate-client relationship. The Firm becomes engaged only after it has expressly agreed to act and applicable engagement requirements, including conflict checks where appropriate, have been completed.",
          "Until an engagement is confirmed, you should not send information that you consider confidential, sensitive or privileged.",
        ],
      },
      {
        id: "permitted-use",
        heading: "Permitted use",
        blocks: [
          "You may access and use the website for lawful, personal, informational and professional reference purposes. You may print or download a reasonable number of pages for your own non-commercial use, provided that copyright and other proprietary notices are retained and the material is not altered in a misleading manner.",
        ],
      },
      {
        id: "prohibited-use",
        heading: "Prohibited use",
        blocks: [
          "You must not use the website in a manner that is unlawful, fraudulent, abusive, harmful to the website or inconsistent with these Terms. Without limitation, you must not:",
          {
            list: [
              "attempt to gain unauthorised access to the website, servers, systems or data;",
              "introduce malware, malicious code or any material intended to disrupt or damage the website;",
              "interfere with the operation, security or availability of the website;",
              "misrepresent your identity or affiliation when communicating with the Firm;",
              "copy, republish or exploit substantial parts of the website for commercial purposes without permission;",
              "use automated tools to scrape, harvest or systematically extract website content or personal information, except ordinary indexing by generally available search engines; or",
              "use the website in a way that infringes intellectual-property, privacy or other legal rights.",
            ],
          },
        ],
      },
      {
        id: "ip",
        heading: "Intellectual property",
        blocks: [
          `Unless otherwise stated, the website, its text, layout, graphics, logos, publications, articles and other original content are owned by or licensed to ${FIRM} and are protected by applicable intellectual-property laws.`,
          "No licence or right is granted except the limited right to access and use the website in accordance with these Terms. The Firm name, logos and other branding may not be used in a manner that suggests endorsement, affiliation or authorisation without prior written permission.",
        ],
      },
      {
        id: "publications",
        heading: "Publications and legal updates",
        blocks: [
          "Articles, alerts, case notes, newsletters and similar materials are prepared for general information. They may summarise complex issues and may become outdated. They should not be relied upon as a complete statement of law or as advice on a specific matter.",
        ],
      },
      {
        id: "accuracy",
        heading: "Accuracy and availability",
        blocks: [
          "We aim to keep the website useful and reasonably current, but we do not warrant that all content is complete, accurate, error-free or continuously available. We may change, suspend, remove or update any part of the website without prior notice.",
          "The website may occasionally be unavailable because of maintenance, hosting issues, security events or circumstances beyond our reasonable control.",
        ],
      },
      {
        id: "links",
        heading: "Third-party links and content",
        blocks: [
          "The website may contain links to third-party websites, databases, social-media platforms or other resources. Links are provided for convenience or reference and do not amount to endorsement or responsibility for the third party, its content or its privacy and security practices. Your use of third-party services is governed by their own terms.",
        ],
      },
      {
        id: "submissions",
        heading: "Communications and submissions",
        blocks: [
          "Information you submit through a website form or email should be accurate and should not infringe the rights of another person. The Firm may use the information to respond to the communication and for related administrative, compliance and security purposes in accordance with the Privacy Policy.",
          "If you send unsolicited documents or information before the Firm has agreed to act, the Firm is not obliged to accept the engagement and may be unable to treat the information as confidential to the same extent as information received within an established professional relationship, subject always to applicable law and professional duties.",
        ],
      },
      {
        id: "privacy-cookies",
        heading: "Privacy and cookies",
        blocks: [
          "Personal information collected through the website is handled in accordance with our Privacy Policy. The website may also use cookies or similar technologies as described in our Cookie Policy. These documents form part of the website framework and should be read together with these Terms.",
        ],
      },
      {
        id: "limitation",
        heading: "Limitation of responsibility",
        blocks: [
          `To the fullest extent permitted by law, ${FIRM} and its partners, lawyers, employees and representatives will not be liable for loss arising solely from reliance on general website content, inability to access the website, use of third-party links, or unauthorised interference with the website, except where liability cannot lawfully be excluded or limited.`,
          "Nothing in these Terms excludes any professional duty or liability that cannot be excluded under applicable law or the rules governing advocates.",
        ],
      },
      {
        id: "security",
        heading: "Security",
        blocks: [
          "You must not attempt to test, probe or circumvent website security without written authorisation. If you become aware of a suspected security issue affecting the website, please notify the Firm using the contact details published on the website and do not exploit or publicly disclose the issue in a manner that creates further risk.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to these Terms",
        blocks: [
          'We may amend these Terms of Use from time to time. The revised Terms will be posted on the website and the "Last updated" date will be changed. Continued use of the website after an update constitutes acceptance of the revised Terms to the extent permitted by law.',
        ],
      },
      {
        id: "law",
        heading: "Governing law and jurisdiction",
        blocks: [
          "These Terms and the use of the website are governed by the laws of India. Subject to any mandatory law to the contrary, courts at New Delhi, India will have jurisdiction in relation to disputes arising from or connected with the website or these Terms.",
        ],
      },
      {
        id: "severability",
        heading: "Severability and no waiver",
        blocks: [
          "If any provision of these Terms is held invalid or unenforceable, the remaining provisions will continue to apply to the extent possible. A failure by the Firm to enforce a provision on one occasion does not amount to a waiver of that provision or any other right.",
        ],
      },
      {
        id: "contact",
        heading: "Contact",
        blocks: ["Questions concerning these Terms of Use may be sent to the Firm using the contact details published on the website."],
      },
    ],
  },
  {
    path: "/cookie-policy",
    title: "Cookie Policy",
    shortTitle: "cookie policy",
    lead: "How RNK Legalheads may use cookies and similar technologies on this website.",
    lastUpdated: "24 September 2026",
    intro: [
      `This Cookie Policy explains how ${FIRM} ("RNK Legalheads", "the Firm", "we", "us" or "our") may use cookies and similar technologies on its website. It should be read together with our Privacy Policy and Terms of Use.`,
    ],
    sections: [
      {
        id: "what",
        heading: "What are cookies?",
        blocks: [
          "A cookie is a small text file or similar data item that a website may store on a user's device. Cookies can help a website function, remember preferences, maintain security, understand how visitors use the website, or support other website features. Similar technologies may include local storage, pixels, tags, software-development tools and comparable mechanisms.",
        ],
      },
      {
        id: "types",
        heading: "Types of cookies we may use",
        blocks: [
          {
            table: {
              head: ["Category", "Purpose", "Use on the website"],
              rows: [
                [
                  "Strictly necessary / functional",
                  "Enable core website functions, security, session management, consent records and user preferences. These technologies are generally required for the website to operate as intended.",
                  "Usually active where technically necessary.",
                ],
                [
                  "Analytics / performance",
                  "Help us understand how visitors use the website, such as pages viewed, approximate traffic patterns and technical performance, so that we can improve the website.",
                  "Use only if enabled and, where required, after appropriate consent.",
                ],
                ["Preference", "Remember optional settings or choices made by a visitor, such as display or language preferences.", "Use only where the relevant feature is enabled."],
                [
                  "Embedded or third-party content",
                  "May be set when the website includes content or services provided by a third party, such as maps, video players, security tools or social-media features.",
                  "Depends on the final website configuration and the third party.",
                ],
                [
                  "Advertising / marketing",
                  "Would be used to measure campaigns or deliver targeted advertising.",
                  "Not intended to be enabled unless separately reviewed and this Policy and the website controls are updated accordingly.",
                ],
              ],
            },
          },
        ],
      },
      {
        id: "first-third-party",
        heading: "First-party and third-party cookies",
        blocks: [
          "Cookies set directly by the website are commonly referred to as first-party cookies. Some website features may rely on third-party services that can set or read cookies or similar identifiers. A third party's handling of information is governed by its own privacy and cookie terms in addition to any arrangements it has with the Firm.",
        ],
      },
      {
        id: "consent",
        heading: "Consent and cookie controls",
        blocks: [
          "Where applicable law requires a choice before non-essential cookies or similar technologies are used, we will provide an appropriate cookie control or consent mechanism. Strictly necessary technologies may operate without a separate opt-in where they are required to provide a service or function requested by the visitor.",
          "You can also control many cookies through your browser settings. Blocking or deleting cookies may affect website functionality or cause preferences to be lost.",
        ],
      },
      {
        id: "analytics",
        heading: "Analytics",
        blocks: [
          "If analytics tools are enabled, they may collect technical and usage information such as pages viewed, approximate location derived from internet protocol address, browser and device information, referral source and interaction events. Where required, analytics should be configured so that non-essential tracking does not begin until the visitor has made the relevant choice.",
        ],
      },
      {
        id: "embedded",
        heading: "Embedded content and external services",
        blocks: [
          "Pages may include third-party services such as maps, video, document viewers, anti-spam or security tools. Those services may place cookies or collect technical information when a page loads or when you interact with the embedded feature. We recommend reviewing the relevant third party's privacy information.",
        ],
      },
      {
        id: "duration",
        heading: "How long cookies remain",
        blocks: [
          "Some cookies operate only during a browsing session and expire when the browser is closed. Others may remain for a defined period so that a preference or setting can be remembered. Retention periods depend on the particular cookie and service. The website should not retain cookies longer than reasonably necessary for their stated purpose.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to this Cookie Policy",
        blocks: [
          'We may update this Cookie Policy when the website, technology providers or applicable legal requirements change. The updated version will be posted on the website and the "Last updated" date will be revised.',
        ],
      },
      {
        id: "contact",
        heading: "Contact",
        blocks: ["Questions about the use of cookies or similar technologies may be sent to the Firm using the contact details published on the website."],
      },
    ],
  },
];

export function getLegalPage(path: LegalPath): LegalPage {
  return legalPages.find((p) => p.path === path)!;
}
