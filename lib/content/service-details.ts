/**
 * Service page copy from the final screens (October 2026). Each record still needs approval and
 * publishing in the CMS before it is public. Paragraphs in `overview` are separated by a blank line.
 */
export type WorkArea = { title: string; text: string };

export type ServiceDetail = {
  overview: string;
  scope: WorkArea[];
  /** Related service IDs, in the order of the screens. */
  related: string[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  S26: {
    overview:
      "We advise businesses, founders, inventors and rights owners on identifying, protecting, maintaining and commercialising intellectual property. The practice is designed around the full life cycle of an IP right: from creation and ownership, through filing and prosecution, to licensing, recordal, portfolio management and enforcement support.\n\nOur work has a particular emphasis on patent and trade mark prosecution, while also covering designs, copyright and related commercial documentation. We work with clients on drafting and filing, examination responses, hearings, post-filing formalities, assignments and licences, and the practical management of portfolios. Where protection is required outside India, we coordinate filing strategy and foreign-associate instructions as part of the agreed mandate.",
    scope: [
      { title: "Patents", text: "Patentability and filing strategy; drafting and review of patent specifications; Indian and convention/PCT filings; responses to examination reports; amendments, hearings, grant formalities and post-grant recordals." },
      { title: "Trade marks", text: "Clearance and filing strategy, applications, examination responses, show-cause hearings, renewals, recordals and portfolio management for word marks, device marks and other protectable brand elements." },
      { title: "Designs", text: "Registrability review, applications, examination responses, registration formalities, renewals and ownership recordals for industrial designs." },
      { title: "Copyright", text: "Advice on subsistence and ownership, registration where appropriate, commissioned and employee-created works, assignments, licences and commercial use of protected content." },
      { title: "Ownership and chain of title", text: "Founder, employee, consultant and vendor arrangements; assignments and confirmatory documents; recordals and review of chain-of-title issues affecting ownership or exploitation." },
      { title: "Licensing and technology transfer", text: "IP licences, technology-transfer arrangements, know-how and confidentiality terms, research and development arrangements, royalty provisions and commercialisation documentation." },
      { title: "IP due diligence", text: "Review of registered and unregistered rights, ownership, licences, encumbrances, disputes and portfolio status for investments, acquisitions, financings and commercial transactions." },
      { title: "Portfolio management", text: "Docketing and status review, renewals, recordals, prosecution strategy, portfolio rationalisation and coordinated instructions across patents, trade marks, designs and copyright." },
      { title: "International coordination", text: "Foreign-filing strategy and coordination with overseas associates for protection, prosecution, recordals and portfolio actions in jurisdictions relevant to the client." },
    ],
    related: ["S27", "S01", "S02"],
  },
  S27: {
    overview:
      "We advise and represent rights owners, businesses and defendants in disputes concerning patents, trade marks, designs, copyright, confidential information and related commercial rights. The work begins with the asserted right, its ownership and validity, the evidence of use or infringement, and the relief realistically available in the chosen forum.\n\nOur approach combines registry and court proceedings with practical enforcement. We assist with urgent injunctions, pleadings, evidence, technical and market material, settlement and enforcement of orders. Where a dispute is better resolved through coexistence, licensing or another commercial arrangement, we document that outcome with the underlying IP position in view.",
    scope: [
      { title: "Trade mark infringement and passing off", text: "Civil actions involving registered rights, goodwill, deceptive similarity, trade dress, comparative use, dilution and related brand disputes." },
      { title: "Patent disputes", text: "Infringement and validity issues, technical evidence, claim construction, interim relief, defences, counterclaims and coordination with patent-prosecution records." },
      { title: "Design and copyright disputes", text: "Infringement, ownership and validity issues relating to registered designs, artistic works, software, content and other protected subject matter." },
      { title: "Oppositions, rectification and cancellation", text: "Trade mark oppositions, cancellation and rectification proceedings, and other registry-based challenges concerning entitlement, validity and continued registration." },
      { title: "Counterfeiting and market enforcement", text: "Evidence collection, cease-and-desist strategy, civil enforcement and coordination of lawful anti-counterfeiting measures against unauthorised goods and channels." },
      { title: "Domain names and online use", text: "Domain-name disputes, impersonation, unauthorised online use, marketplace listings, social-media misuse and platform-based enforcement where appropriate." },
      { title: "Confidential information and trade secrets", text: "Disputes involving misuse of confidential information, know-how, technical material, customer information and restrictive contractual obligations." },
      { title: "Interim and final relief", text: "Applications for injunctions and other protective orders, damages or accounts where available, delivery-up, disclosure and enforcement of final orders." },
      { title: "Settlement and commercial resolution", text: "Coexistence terms, undertakings, licences, assignments, settlement agreements and structured resolutions of ongoing IP disputes." },
    ],
    related: ["S26", "S09", "S10"],
  },
  S01: {
    overview:
      "We advise businesses on the legal arrangements needed to establish, operate and grow. Our work covers corporate structure, governance, shareholder relationships, commercial agreements and recurring legal questions that arise in day-to-day operations.\n\nFor businesses whose value depends materially on brands, technology, know-how or other intangible assets, we also address ownership, confidentiality and licensing issues within the commercial documentation. The objective is to ensure that contracts and corporate decisions reflect the way the business actually operates and allocate rights, obligations and risk in clear terms.",
    scope: [
      { title: "Business formation and structuring", text: "Company and LLP formation, ownership arrangements, founder documentation and selection of an appropriate legal structure for proposed activities." },
      { title: "Corporate governance", text: "Board and shareholder processes, reserved matters, delegated authority, internal approvals, governance documentation and routine corporate actions." },
      { title: "Shareholder and founder arrangements", text: "Rights and obligations, transfers, management participation, vesting or exit-related provisions where required, and mechanisms for resolving differences." },
      { title: "Commercial contracts", text: "Supply, distribution, services, procurement, agency, franchise, manufacturing, consultancy and other operating agreements." },
      { title: "IP and technology arrangements", text: "Confidentiality, ownership of work product, IP clauses, licences, technology-transfer terms and related commercial provisions in business contracts." },
      { title: "Business reorganisations", text: "Internal restructurings, business transfers, changes in ownership and coordination of the contractual and corporate steps required for implementation." },
      { title: "Ongoing legal advisory", text: "Contract reviews, notices, routine corporate questions, negotiations and legal support under an agreed ongoing or matter-specific scope." },
      { title: "Commercial risk review", text: "Review of key agreements, termination rights, liability provisions, indemnities, dispute clauses and other issues affecting business continuity or transactions." },
    ],
    related: ["S02", "S26", "S04"],
  },
  S02: {
    overview:
      "We advise buyers, sellers, promoters and businesses on acquisitions, disposals, business transfers and joint ventures. The work starts with the proposed structure and the legal issues that may affect value, control, timing or completion, and then moves through diligence, negotiation, documentation and closing.\n\nWhere the target or transaction is IP-intensive, we place particular emphasis on ownership and chain of title, licences, registered rights, technology agreements and restrictions that may affect transfer or continued use. We coordinate the transaction documents with the corporate, financing, tax and dispute issues that need to be addressed for completion.",
    scope: [
      { title: "Transaction structuring", text: "Share purchases, asset or business transfers, joint ventures, mergers and other acquisition or disposal structures." },
      { title: "Legal due diligence", text: "Corporate records, material contracts, licences, disputes, property, employment-related documents where relevant, financing arrangements and identified legal liabilities." },
      { title: "IP and technology due diligence", text: "Ownership and status of patents, trade marks, designs and copyright; material licences; chain of title; disputes; encumbrances and technology-related contracts." },
      { title: "Definitive documentation", text: "Share or asset purchase agreements, business-transfer documents, shareholders agreements, disclosure documents, escrow arrangements and ancillary instruments." },
      { title: "Negotiation and risk allocation", text: "Warranties, indemnities, conditions precedent, covenants, termination rights, limitation provisions and completion mechanics." },
      { title: "Approvals and closing", text: "Identification of required corporate and other approvals, closing checklists, filings, consents and transfer documentation." },
      { title: "Joint ventures and strategic arrangements", text: "Governance, reserved matters, funding, transfers, deadlock provisions, IP ownership and commercial responsibilities between partners." },
      { title: "Post-closing implementation", text: "Corporate updates, assignment and recordal steps, transition arrangements and legal support for agreed integration actions." },
    ],
    related: ["S01", "S26", "S04"],
  },
  S04: {
    overview:
      "We advise on the legal terms of financing arrangements and the rights and obligations of borrowers, lenders, guarantors and other stakeholders. Our work includes review and preparation of finance and security documents, transaction diligence, conditions precedent and completion steps.\n\nWe also advise on amendments, refinancing and stressed situations before formal enforcement becomes necessary. Where a financing concerns an IP- or technology-led business, we review the contractual and ownership issues affecting material intangible assets so that the financing documents reflect the underlying business position.",
    scope: [
      { title: "Lending transactions", text: "Facility and loan documentation for bilateral, consortium or other agreed financing arrangements, including drawdown and repayment mechanics." },
      { title: "Security and guarantees", text: "Security documents, guarantees, charge-related documentation, priority arrangements and perfection or filing steps relevant to the transaction." },
      { title: "Borrower advisory", text: "Review of covenants, events of default, information obligations, conditions precedent, repayment provisions and proposed amendments." },
      { title: "Project and asset finance", text: "Financing documentation connected with projects, equipment or other business assets, together with the relevant project or commercial contracts." },
      { title: "Refinancing and restructuring", text: "Amendments, waivers, rescheduling, standstill arrangements, refinancing documentation and negotiated restructuring terms." },
      { title: "Finance due diligence", text: "Review of existing borrowing, security, guarantees, restrictions, defaults and material contractual issues affecting a financing or transaction." },
      { title: "Intangible-asset considerations", text: "Review of ownership and contractual restrictions affecting material IP, technology or other intangible assets where they are relevant to the financing." },
      { title: "Enforcement interface", text: "Assessment of finance documents and security rights when a matter moves toward recovery, SARFAESI, DRT or insolvency proceedings." },
    ],
    related: ["S14", "S15", "S01"],
  },
  S09: {
    overview:
      "We represent businesses and individuals in civil and commercial disputes and advise on the steps available before proceedings begin. Our work includes analysing the facts and documents, identifying the appropriate forum, preparing the claim or defence and addressing procedural, evidentiary and interim-relief issues as the matter develops.\n\nWe consider settlement, enforcement and the commercial consequences of litigation from the outset. Where the dispute involves intellectual property, technology, financing, property or another specialist subject, the contentious strategy is coordinated with the relevant underlying rights and documents.",
    scope: [
      { title: "Pre-litigation assessment", text: "Review of facts, contracts and correspondence; legal notices; preservation of records; forum and limitation analysis; and assessment of available remedies." },
      { title: "Commercial claims", text: "Contract, payment, shareholder, supply, distribution, services and business-relationship disputes, including defence of third-party claims." },
      { title: "Civil proceedings", text: "Property, injunction, declaration, damages, specific-relief and other civil claims within the agreed mandate." },
      { title: "Interim and protective relief", text: "Urgent applications for injunctions, preservation of property or evidence, security and other interim measures where legally available." },
      { title: "Pleadings, evidence and trial", text: "Preparation of pleadings and applications, document review, witness preparation, evidence strategy and coordination of hearings." },
      { title: "Appeals and challenges", text: "Assessment and conduct of appeals, revisions, reviews and other available challenges in appropriate cases." },
      { title: "Execution and enforcement", text: "Enforcement of decrees and orders, asset-related steps, recovery proceedings and negotiated compliance." },
      { title: "Parallel and connected proceedings", text: "Coordination of civil litigation with arbitration, IP proceedings, insolvency, criminal complaints or regulatory matters where they overlap." },
    ],
    related: ["S10", "S11", "S27"],
  },
  S10: {
    overview:
      "We advise and represent parties in arbitration arising from commercial, corporate, construction, technology and other contractual relationships. The work may begin with the drafting or interpretation of the arbitration clause, or after a dispute has already arisen.\n\nWe address jurisdiction, procedure, pleadings, evidence and relief as part of one litigation strategy and coordinate court proceedings where interim protection, appointment, challenge or enforcement is required. We also advise on settlement during the arbitral process where a negotiated resolution is commercially preferable.",
    scope: [
      { title: "Arbitration clauses", text: "Drafting and review of arbitration agreements, including seat, governing law, appointment mechanism, institution and procedural choices." },
      { title: "Pre-arbitration strategy", text: "Notices, claim assessment, jurisdictional issues, limitation, evidence preservation and preparation for commencement or defence." },
      { title: "Constitution and procedure", text: "Appointments, preliminary hearings, procedural orders, timetables and applications concerning the conduct of the arbitration." },
      { title: "Pleadings and evidence", text: "Statements of claim and defence, counterclaims, document production, witness evidence, expert coordination and hearing preparation." },
      { title: "Interim protection", text: "Applications before tribunals or courts for protective and interim measures where the applicable framework permits." },
      { title: "Hearings and submissions", text: "Case presentation, written submissions, examination of evidence and coordination with counsel and experts as required." },
      { title: "Challenges and enforcement", text: "Advice and representation in award challenges, recognition, enforcement and related court proceedings." },
      { title: "IP and technology disputes", text: "Arbitration arising from licences, technology transfer, confidentiality, research, distribution and other agreements involving intellectual property." },
    ],
    related: ["S09", "S23", "S27"],
  },
  S11: {
    overview:
      "We help clients evaluate and pursue negotiated resolution where it is appropriate to the dispute. This may involve direct negotiations, private mediation, court-referred mediation or another agreed process.\n\nOur role is to define the legal and commercial issues, prepare the client for negotiation, identify terms that need to be resolved and document an agreement that can be implemented. Where proceedings are already pending, we coordinate the settlement with withdrawal, consent orders, releases, payment terms and other procedural steps required to bring the matter to a close.",
    scope: [
      { title: "Settlement assessment", text: "Review of claims, defences, evidence, costs, business consequences and issues that may affect the settlement range." },
      { title: "Mediation preparation", text: "Position papers, chronology, supporting records, negotiation points and preparation of the client team for mediation." },
      { title: "Negotiation support", text: "Advice during discussions on payment, performance, releases, confidentiality, non-disparagement, future conduct and other settlement terms." },
      { title: "Settlement documentation", text: "Terms of settlement, consent terms, releases, undertakings, payment schedules and compliance provisions." },
      { title: "Court- and arbitration-related settlement", text: "Coordination with pending proceedings and preparation of the steps needed to record, stay, withdraw or dispose of the matter lawfully." },
      { title: "Commercial and IP settlements", text: "Coexistence, licensing, assignment, supply, transition and other arrangements used to resolve business or IP disputes." },
      { title: "Implementation and default", text: "Follow-through on agreed actions and advice on remedies where settlement obligations are not performed." },
    ],
    related: ["S09", "S10", "S31"],
  },
  S12: {
    overview:
      "We advise and represent individuals and organisations facing criminal allegations or proceedings. Our work begins with the stage of the matter, the allegations made, the available record and the immediate procedural risks, including the need for bail or other protective relief.\n\nWe prepare the defence with attention to the factual record, documentary evidence and the interaction between criminal proceedings and any connected civil, commercial, family, tax or IP dispute. Sensitive information is handled on a need-to-know basis within the engagement.",
    scope: [
      { title: "Early-stage assessment", text: "Review of complaints, notices, available records and procedural status, with advice on immediate steps and preservation of relevant material." },
      { title: "Investigation-stage representation", text: "Legal assistance during investigation, responses to notices and coordination of documents and submissions required by the competent authority." },
      { title: "Bail and protective relief", text: "Regular, anticipatory and other available bail-related remedies, together with connected applications appropriate to the matter." },
      { title: "Trial preparation and defence", text: "Pleadings and applications, evidence review, witness strategy, cross-examination preparation and conduct of trial-related proceedings." },
      { title: "Challenges to proceedings", text: "Petitions or applications challenging complaints, process or proceedings where the applicable law and facts support such relief." },
      { title: "Appeals and revisions", text: "Post-order and post-trial remedies, sentence-related issues and other available appellate or revisional proceedings." },
      { title: "Commercially connected allegations", text: "Criminal issues arising from business, contractual, property, financial or intellectual-property disputes, coordinated with parallel proceedings where required." },
    ],
    related: ["S13", "S09", "S27"],
  },
  S13: {
    overview:
      "We advise businesses, management and individuals on allegations of corporate or financial misconduct and on investigations that may follow. Matters may involve suspected fraud, misuse of funds or information, falsification of records, breach of trust, conflicts of interest or other conduct with potential criminal, civil, tax or regulatory consequences.\n\nOur work focuses on defining the legal issues, preserving and reviewing evidence, maintaining appropriate confidentiality and helping the client decide how to respond. Where several proceedings arise from the same facts, we coordinate the investigation record and litigation strategy to avoid inconsistent positions.",
    scope: [
      { title: "Internal investigations", text: "Scoping, document preservation, review protocols, interviews and preparation of findings for management, boards or other authorised decision-makers." },
      { title: "Fraud and financial allegations", text: "Assessment of alleged diversion, misrepresentation, falsification, breach of trust, misuse of corporate assets and related misconduct." },
      { title: "Regulatory and investigative response", text: "Assistance with notices, information requests, interviews, document production and legal submissions before competent authorities." },
      { title: "Evidence and confidentiality", text: "Management of documentary and electronic records, privilege and confidentiality issues, and preservation of material relevant to potential proceedings." },
      { title: "Management and employee issues", text: "Advice on the legal implications of alleged misconduct by directors, officers, employees, consultants or business counterparties." },
      { title: "Parallel proceedings", text: "Coordination with criminal defence, civil litigation, tax disputes, insolvency or corporate proceedings arising from the same events." },
      { title: "Remedial and governance measures", text: "Documentation of corrective steps, revised controls, contractual responses and governance actions following an investigation." },
    ],
    related: ["S12", "S21", "S01"],
  },
  S14: {
    overview:
      "We advise lenders, borrowers, guarantors and other affected parties on secured-credit and debt-recovery matters, subject to conflict checks. The work is based on the finance and security documents, the nature of the default, the enforcement steps already taken and the forum in which relief is available.\n\nWe act in proceedings relating to secured enforcement and recovery and also assist with negotiated solutions where a restructuring, one-time settlement or agreed realisation produces a better outcome than continued litigation. Insolvency and civil remedies are considered alongside the recovery process where they overlap.",
    scope: [
      { title: "Finance and security review", text: "Assessment of loan documents, guarantees, security interests, notices, defaults and enforcement rights before or during recovery action." },
      { title: "SARFAESI enforcement", text: "Advice on demand, possession, sale and other secured-enforcement measures, together with procedural compliance and available challenges." },
      { title: "Borrower and guarantor remedies", text: "Representation in challenges to enforcement action, disputes concerning liability, security, notice, possession and sale." },
      { title: "DRT proceedings", text: "Recovery applications, securitisation applications, interim applications, evidence and final proceedings before Debt Recovery Tribunals." },
      { title: "DRAT appeals", text: "Appeals and connected applications before Debt Recovery Appellate Tribunals, including procedural and pre-deposit issues where applicable." },
      { title: "Settlement and restructuring", text: "One-time settlements, payment schedules, standstill terms, restructuring discussions and documentation of negotiated resolutions." },
      { title: "Execution and asset recovery", text: "Enforcement of recovery orders, asset-related proceedings and coordination with other available civil or insolvency remedies." },
      { title: "Parallel insolvency proceedings", text: "Assessment of how SARFAESI/DRT action interacts with insolvency proceedings, moratorium issues and creditor strategy." },
    ],
    related: ["S04", "S15", "S09"],
  },
  S15: {
    overview:
      "We advise creditors, debtors, promoters, resolution applicants and other stakeholders dealing with financial distress. The work may involve a negotiated restructuring, the commencement or defence of a formal insolvency process, participation in a resolution process or litigation concerning rights and obligations under that process.\n\nOur advice considers the client’s legal position together with the underlying financing, contracts, assets and disputes. For businesses with significant brands, technology or other intangible assets, we also address the treatment, transfer and continued use of those assets in a resolution, restructuring or sale process.",
    scope: [
      { title: "Pre-insolvency assessment", text: "Review of defaults, debt documents, creditor position, restructuring options and the consequences of formal insolvency proceedings." },
      { title: "Initiation and defence of proceedings", text: "Applications by financial or operational creditors and responses by corporate debtors or other affected parties before the appropriate tribunal." },
      { title: "Creditor claims and committee issues", text: "Submission and review of claims, creditor classification, voting or process issues and advice connected with participation in the resolution process." },
      { title: "Resolution plans and applicants", text: "Legal review of resolution plans, eligibility and transaction structure, due diligence and documentation for proposed acquisitions through the insolvency process." },
      { title: "Avoidance and transaction disputes", text: "Proceedings concerning preferential, undervalued, fraudulent or other challenged transactions and related recovery issues." },
      { title: "Liquidation and asset sale", text: "Stakeholder rights, asset realisation, claims, distributions and legal issues arising during liquidation or sale processes." },
      { title: "Restructuring and settlements", text: "Debt restructuring, standstill arrangements, settlement documentation and negotiated solutions outside or alongside formal proceedings." },
      { title: "IP and intangible assets", text: "Ownership, licensing, encumbrance and transfer issues concerning brands, patents, technology and other intangible assets in resolution or asset-sale transactions." },
    ],
    related: ["S04", "S14", "S02"],
  },
  S19: {
    overview:
      "We advise businesses on GST and indirect-tax issues arising from the supply of goods and services and from the way transactions are structured and documented. The work may involve a proposed transaction, an existing tax position, a classification or credit issue, a refund claim or a notice from the tax authorities.\n\nOur role is to identify the legal issue, connect it with the underlying commercial documents and records, and help the client prepare a supportable position. Where a matter becomes contentious, we coordinate the advisory record with the tax-litigation strategy.",
    scope: [
      { title: "Transaction review", text: "GST implications of proposed supplies, contractual structures, bundled or composite arrangements and other business transactions." },
      { title: "Classification and rate issues", text: "Advice on classification of goods or services, applicable tax treatment and documentation supporting the adopted position." },
      { title: "Input tax credit", text: "Eligibility, documentation, reversals, mismatch issues and contractual allocation of credit-related risk." },
      { title: "Registration and operational issues", text: "Registration, place-of-supply and invoicing issues, business changes and recurring GST questions arising in operations." },
      { title: "Contracts and tax clauses", text: "Review of pricing, tax, gross-up, indemnity, invoicing and change-in-law provisions in commercial contracts." },
      { title: "Refunds and zero-rated supplies", text: "Legal support for refund positions, exports or other zero-rated supplies and related documentation." },
      { title: "Notices and adjudication support", text: "Responses to notices, factual and legal submissions and preparation of the record before a matter proceeds into formal litigation." },
      { title: "Audit and investigation support", text: "Document review, issue analysis and coordination with finance teams during departmental verification, audit or investigation." },
    ],
    related: ["S21", "S01", "S02"],
  },
  S21: {
    overview:
      "We advise and represent taxpayers in disputes concerning direct and indirect taxes. The work includes reviewing the factual and accounting record, identifying the legal issues, preparing submissions and addressing the procedural stage of the matter before the relevant authority, tribunal or court.\n\nWe work with the client’s finance team and other advisers so that the litigation position is supported by the underlying documents and transaction history. Where an investigation also carries potential criminal, corporate or insolvency consequences, the response is coordinated with those parallel risks.",
    scope: [
      { title: "Notices and show-cause proceedings", text: "Review and response to statutory notices, information requests and show-cause proceedings, including preparation of factual and legal submissions." },
      { title: "Assessment and adjudication", text: "Representation and submissions in assessment, reassessment, adjudication and penalty-related proceedings." },
      { title: "Appeals and tribunal proceedings", text: "Appellate strategy, preparation of grounds and paper books, written submissions and representation before the relevant appellate forum." },
      { title: "Writ and court proceedings", text: "Constitutional and other court remedies in tax matters where maintainable, including jurisdictional and procedural challenges." },
      { title: "Search, survey and investigation response", text: "Legal support during investigation-related proceedings, document production, statements and follow-up notices." },
      { title: "Evidence and record management", text: "Organisation and review of contracts, invoices, books, correspondence and other material required to support the tax position." },
      { title: "Recovery and interim protection", text: "Advice on demand, recovery, stay and other protective remedies available while a dispute is pending." },
      { title: "Parallel-risk coordination", text: "Coordination with white-collar, corporate, insolvency or civil proceedings arising from the same financial or transactional record." },
    ],
    related: ["S19", "S13", "S09"],
  },
  S22: {
    overview:
      "We advise on the acquisition, development, occupation, financing and dispute aspects of real estate. The work includes title and document review, transaction documentation, leasing, development arrangements, project-related approvals and RERA issues.\n\nWe approach property matters by connecting title, contract, financing and dispute risks rather than treating them separately. Where a matter involves a development project, secured financing or litigation, we coordinate the property documentation with the relevant construction, banking or dispute workstream.",
    scope: [
      { title: "Title and legal due diligence", text: "Review of title documents, encumbrances, chain of ownership, material approvals and identified legal risks affecting a property transaction." },
      { title: "Acquisitions and disposals", text: "Agreements to sell, conveyance and transfer documentation, conditions precedent, closing steps and related transaction support." },
      { title: "Leasing and occupation", text: "Commercial leases, leave-and-licence arrangements, renewals, fit-out obligations, deposits, termination and possession-related terms." },
      { title: "Development arrangements", text: "Development, joint-development, collaboration and owner-developer arrangements, including allocation of rights, revenue and responsibilities." },
      { title: "RERA advisory and proceedings", text: "Project and allottee issues, agreements for sale, disclosures, delay or possession disputes and representation before appropriate RERA fora." },
      { title: "Financing and security interface", text: "Property documentation and title issues relevant to mortgages, financing, security creation and lender due diligence." },
      { title: "Property disputes", text: "Possession, title, injunction, specific performance, partition, lease and development disputes before the appropriate forum." },
      { title: "Project handover and completion issues", text: "Documentation and disputes concerning completion, possession, common areas, defects and post-completion obligations." },
    ],
    related: ["S23", "S09", "S04"],
  },
  S23: {
    overview:
      "We advise project owners, developers, contractors, consultants and other participants on the legal arrangements used to develop and deliver construction and infrastructure projects. Our work covers contract preparation and review, risk allocation, procurement, project administration and disputes arising during performance.\n\nWhen a claim develops, we review the contract alongside the project record, correspondence, payment history and technical material. For technology-heavy projects, we also address ownership and permitted use of drawings, software, technical documents and other intellectual property where those rights affect project delivery.",
    scope: [
      { title: "Project and construction contracts", text: "EPC, works, construction, consultancy, project-management, supply and other project agreements." },
      { title: "Procurement and subcontracting", text: "Tender and procurement documentation, contractor and subcontractor terms, scope allocation and back-to-back obligations." },
      { title: "Risk and performance terms", text: "Milestones, specifications, testing, acceptance, warranties, indemnities, liquidated damages, performance security and termination." },
      { title: "Variations and delay claims", text: "Change orders, extensions of time, prolongation, disruption, escalation and other claims arising during project execution." },
      { title: "Payment and security disputes", text: "Interim and final payments, retention, bank guarantees, performance security and claims concerning certification or withholding." },
      { title: "Project records and claim preparation", text: "Review of correspondence, schedules, site records, certificates and technical documents required to present or defend a claim." },
      { title: "Arbitration and litigation", text: "Representation in project-related arbitration, court proceedings, interim relief and enforcement." },
      { title: "Project IP and technical material", text: "Ownership, licensing and permitted use of drawings, designs, software, technical know-how and project documentation where material to the contract." },
    ],
    related: ["S10", "S22", "S24"],
  },
  S24: {
    overview:
      "We advise on legal issues arising in energy and natural-resource projects and businesses. The work may involve project development, supply or offtake arrangements, investment and acquisition, land and infrastructure interfaces, financing, technology arrangements or a dispute concerning performance or regulatory obligations.\n\nOur role is to review the contractual allocation of rights and risk and to coordinate it with the approvals, land, financing and project documents that support the transaction. In renewable and technology-driven projects, we also address licensing, know-how and other IP issues where they are material to the equipment or technology being deployed.",
    scope: [
      { title: "Project development", text: "Legal support for project structures, implementation arrangements, key commercial contracts and coordination of transaction documents." },
      { title: "Supply and offtake arrangements", text: "Power, fuel, equipment, services and other supply or purchase arrangements, including performance, pricing and change-related provisions." },
      { title: "Land and infrastructure interface", text: "Land, access, right-of-way, construction and project-use arrangements required for development or operation." },
      { title: "Regulatory and approval issues", text: "Review of material licensing, approval and compliance issues affecting the transaction or dispute, with specialist coordination where required." },
      { title: "Transactions and investments", text: "Due diligence, acquisitions, joint ventures and commercial arrangements involving energy or natural-resource assets and businesses." },
      { title: "Financing interface", text: "Project-finance documents, security issues and coordination with key project agreements." },
      { title: "Technology and IP arrangements", text: "Licensing, know-how, software, technical documentation and intellectual-property provisions relevant to project technology or equipment." },
      { title: "Project and commercial disputes", text: "Contract, payment, delay, supply, performance and other disputes resolved through negotiation, arbitration or litigation." },
    ],
    related: ["S23", "S01", "S26"],
  },
  S32: {
    overview:
      "We advise individuals and families on the legal arrangements for ownership, succession and administration of private assets. The work considers the client’s intentions, family circumstances, asset profile and existing ownership structures, with the objective of documenting succession in a manner that is clear and workable.\n\nWe also assist after death with probate, administration and succession-related proceedings, and with disputes where the validity, interpretation or implementation of testamentary or family arrangements is contested. For business owners and creators, succession planning can also address shares, brands, copyright, patents and other intangible assets that require specific transfer or management arrangements.",
    scope: [
      { title: "Wills and codicils", text: "Preparation and review of wills, codicils and related testamentary documents, including appointment, bequest and residuary provisions." },
      { title: "Estate and succession planning", text: "Review of asset ownership, nominees, family arrangements and succession objectives, together with documentation required to implement the plan." },
      { title: "Probate and administration", text: "Probate, letters of administration, succession-related certificates and other court or administrative steps required to deal with an estate." },
      { title: "Family settlements and partitions", text: "Documentation of agreed family arrangements, partition or distribution of assets and settlement of succession-related differences." },
      { title: "Business succession", text: "Transfer and control issues involving family businesses, partnership or company interests, governance and continuity arrangements." },
      { title: "IP and intangible assets", text: "Succession and ownership issues concerning trade marks, patents, copyright, designs, digital assets and other intangible property." },
      { title: "Estate and testamentary disputes", text: "Challenges concerning validity, execution, interpretation, suspicious circumstances, competing claims and administration of estates." },
      { title: "Property and documentation support", text: "Coordination of estate planning with real-estate documents, corporate records and other ownership evidence relevant to the client’s assets." },
    ],
    related: ["S31", "S22", "S26"],
  },
  S31: {
    overview:
      "We advise individuals on family and matrimonial matters with attention to the personal and financial circumstances involved. Our work includes explaining the available legal options, preparing documents, representing clients in proceedings and assisting with settlement where an agreed resolution is possible.\n\nWe handle the court process alongside the practical issues that often accompany it, including maintenance, parenting arrangements, residence, property and enforcement. Confidentiality, proportionality and the interests of children are kept in view throughout the engagement.",
    scope: [
      { title: "Divorce and matrimonial proceedings", text: "Contested and mutual-consent proceedings, judicial separation and other matrimonial remedies available under the applicable personal law." },
      { title: "Maintenance and financial support", text: "Interim and final maintenance, alimony and related financial claims, including supporting financial disclosure and evidence." },
      { title: "Child custody and parenting", text: "Custody, guardianship, visitation, access and parenting arrangements, with focus on the welfare of the child." },
      { title: "Protective and family-law remedies", text: "Proceedings concerning residence, protection, domestic abuse allegations and other statutory family-law remedies where applicable." },
      { title: "Property and financial arrangements", text: "Disputes and settlements concerning jointly held property, matrimonial assets, stridhan and other financial arrangements." },
      { title: "Mediation and negotiated settlement", text: "Settlement strategy, mediation preparation, consent terms, mutual obligations and implementation of agreed outcomes." },
      { title: "Appeals and enforcement", text: "Challenges to family-court orders and steps required to enforce maintenance, custody, settlement or other directions." },
    ],
    related: ["S32", "S11", "S09"],
  },
  S33: {
    overview:
      "We advise businesses and consumers on disputes concerning goods, services and digital or marketplace transactions. The work includes assessing the complaint, relevant records, representations made to the consumer, contractual terms and the responsibilities of manufacturers, sellers, service providers and other parties involved.\n\nWe also assist businesses with customer-facing documentation and complaint handling so that recurring issues are identified before they develop into litigation. Where a matter involves counterfeit, look-alike or unauthorised products, consumer and product-liability issues may be coordinated with IP enforcement.",
    scope: [
      { title: "Consumer complaints and defence", text: "Preparation and defence of complaints concerning deficiency in service, defective goods, unfair practices, refund claims and other consumer disputes." },
      { title: "Product liability", text: "Claims concerning alleged product defects, warnings, instructions, safety, causation and the responsibilities of manufacturers, sellers or service providers." },
      { title: "E-commerce and platform disputes", text: "Online purchases, marketplace transactions, digital services, refunds, delivery, subscription and platform-related consumer issues." },
      { title: "Customer terms and warranties", text: "Review of terms of sale or service, warranties, exclusions, returns, refunds and customer-communication provisions." },
      { title: "Advertising and representations", text: "Assessment of product claims, descriptions, promotional statements and other representations that may create consumer-law exposure." },
      { title: "Complaint-handling processes", text: "Legal review of escalation, refund, replacement, warranty and grievance processes for consumer-facing businesses." },
      { title: "Appeals and enforcement", text: "Appellate remedies, compliance with consumer-forum orders and enforcement-related proceedings." },
      { title: "Counterfeit and look-alike products", text: "Coordination with IP enforcement where unauthorised branding, imitation or counterfeit goods create both consumer and brand-protection issues." },
    ],
    related: ["S09", "S27", "S01"],
  },
};

/**
 * How each related service is described on a particular service page (the final screens write a
 * short, page-specific line). Keyed "fromId:toId"; without an entry the related service's summary
 * is shown. Website copy only: the CMS edits the services themselves, not these lines.
 */
export const relatedNotes: Record<string, string> = {
  "S26:S27": "Infringement, passing off, validity, oppositions, rectification, online enforcement and other rights-specific disputes.",
  "S26:S01": "Commercial contracts, confidentiality, ownership provisions, technology arrangements and ongoing business advisory.",
  "S26:S02": "IP due diligence, ownership verification and transfer or licensing of intellectual property in transactions.",
  "S27:S26": "Prosecution, portfolio management, ownership, licensing and commercialisation of IP rights.",
  "S27:S09": "Commercial suits, injunctions, evidence, appeals and enforcement proceedings.",
  "S27:S10": "Contractual disputes involving licences, technology-transfer arrangements, joint ventures and other IP-related agreements.",
  "S01:S02": "Acquisitions, disposals, business transfers, joint ventures and transaction documentation.",
  "S01:S26": "Protection, ownership, licensing and management of patents, trade marks, designs and copyright.",
  "S01:S04": "Financing documents, security arrangements, refinancing and finance-related advisory.",
  "S02:S01": "Governance, shareholder arrangements, commercial contracts and ongoing corporate support.",
  "S02:S26": "IP ownership, due diligence, assignments, licensing and portfolio actions connected with the transaction.",
  "S02:S04": "Acquisition finance, security documents, refinancing and lender or borrower-side documentation.",
  "S04:S14": "Secured-credit enforcement, DRT/DRAT proceedings, borrower remedies and recovery disputes.",
  "S04:S15": "Financial distress, creditor and debtor advisory, resolution processes and restructuring.",
  "S04:S01": "Corporate approvals, guarantees, commercial arrangements and ongoing business advisory.",
  "S09:S10": "Commercial arbitration, interim measures, award challenges and enforcement.",
  "S09:S11": "Negotiated resolution, mediation preparation and settlement documentation.",
  "S09:S27": "Infringement, passing off, validity and other intellectual-property disputes.",
  "S10:S09": "Court proceedings, interim relief, appeals and enforcement connected with commercial disputes.",
  "S10:S23": "Project claims, delay, payment and performance disputes commonly resolved through arbitration.",
  "S10:S27": "Court and registry disputes where IP rights themselves, rather than only contract rights, are in issue.",
  "S11:S09": "Civil and commercial disputes, interim relief, appeals and enforcement.",
  "S11:S10": "Contractual disputes and arbitral proceedings in which settlement may be pursued alongside the formal process.",
  "S11:S31": "Negotiated resolution and mediation of family and matrimonial issues where appropriate.",
  "S12:S13": "Corporate misconduct, internal reviews, financial allegations and investigation response.",
  "S12:S09": "Parallel civil claims, injunctions, recovery or contractual disputes arising from the same facts.",
  "S12:S27": "Civil and other lawful enforcement issues involving counterfeiting, unauthorised use and related brand or content disputes.",
  "S13:S12": "Defence and representation in criminal investigations, bail, trial and appellate proceedings.",
  "S13:S21": "Tax notices, investigations, adjudication and appellate proceedings where financial records are under scrutiny.",
  "S13:S01": "Governance, contractual rights, internal approvals and remedial corporate actions.",
  "S14:S04": "Finance documents, security arrangements, borrower or lender advisory and refinancing.",
  "S14:S15": "Creditor and debtor rights, resolution processes, restructuring and insolvency disputes.",
  "S14:S09": "Recovery, injunction, guarantee and other civil disputes outside the specialised recovery framework.",
  "S15:S04": "Loan documents, security, refinancing and pre-default financing arrangements.",
  "S15:S14": "Secured enforcement, recovery proceedings and creditor remedies.",
  "S15:S02": "Acquisition of businesses or assets through resolution, restructuring or distressed transactions.",
  "S19:S21": "Contested tax matters, investigations, adjudication, appeals and writ proceedings.",
  "S19:S01": "Commercial documentation and business structures from which GST issues commonly arise.",
  "S19:S02": "Indirect-tax review of business transfers, asset transactions and transaction documentation.",
  "S21:S19": "Advisory and pre-dispute support on GST and indirect-tax positions.",
  "S21:S13": "Investigation response where alleged financial or corporate misconduct overlaps with tax issues.",
  "S21:S09": "Court strategy and connected civil disputes involving the same transactions or records.",
  "S22:S23": "Project contracts, procurement, claims, delays and construction disputes.",
  "S22:S09": "Property suits, injunctions, specific-relief claims, appeals and enforcement.",
  "S22:S04": "Property-backed financing, mortgage/security documents and lender due diligence.",
  "S23:S10": "Construction and infrastructure disputes, interim relief and award-related proceedings.",
  "S23:S22": "Land, development, title, project documentation and property-related disputes.",
  "S23:S24": "Energy and resource projects, supply arrangements and sector-specific project issues.",
  "S24:S23": "Project documentation, procurement, claims, delays and infrastructure disputes.",
  "S24:S01": "Commercial agreements, governance, joint ventures and operating arrangements.",
  "S24:S26": "Technology licensing, know-how, ownership and protection of project-related intellectual property.",
  "S32:S31": "Family arrangements, matrimonial disputes, maintenance, parenting and negotiated resolution.",
  "S32:S22": "Property ownership, conveyancing and disputes affecting estate assets.",
  "S32:S26": "Ownership and transfer of brands, patents, copyright and other intangible rights forming part of an estate or business succession plan.",
  "S31:S32": "Wills, estate planning, family settlements, succession and inheritance disputes.",
  "S31:S11": "Structured negotiation and mediation of disputes where consensual resolution is appropriate.",
  "S31:S09": "Connected property, injunction or civil proceedings that fall outside the family-court process.",
  "S33:S09": "Contract, damages, injunction and other civil disputes arising outside or alongside consumer proceedings.",
  "S33:S27": "Counterfeiting, passing off, unauthorised brand use and related enforcement.",
  "S33:S01": "Customer contracts, warranties, distribution and other business arrangements affecting consumer-facing operations.",
};

/** Short Latin maxims shown after a service overview in the final screens, keyed by service ID. */
export const serviceMaxims: Record<string, { latin: string; english: string }> = {
  S01: { latin: "Pacta sunt servanda", english: "Agreements are to be honoured." },
};
