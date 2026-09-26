import type { Industry } from "@/lib/content/industries";
import type { Job } from "@/lib/content/jobs";
import type { NewsletterIssue } from "@/lib/content/newsletters";
import type { Person } from "@/lib/content/people";
import type { Publication } from "@/lib/content/publications";
import type { ServiceDetail } from "@/lib/content/service-details";
import type { Service } from "@/lib/content/services";

export type ContactDetails = { address?: string; phone?: string; email?: string; mapQuery?: string };

export type SiteInfo = {
  name: string;
  legalEntity?: string;
  established: number;
  statement: string;
  disclaimer: string;
  contactDetails: ContactDetails;
};

/**
 * Everything the website shows, in one object. The backend's GET /api/content/bundle returns
 * exactly this shape; lib/content/local.ts builds it from the files as a fallback.
 * Records carry `approved` and `preview`; lib/content/store.ts decides what is visible.
 */
export type ContentData = {
  site: SiteInfo;
  services: Service[];
  serviceDetails: Record<string, ServiceDetail>;
  industries: Industry[];
  people: Person[];
  jobs: Job[];
  publications: Publication[];
  newsletters: NewsletterIssue[];
};
