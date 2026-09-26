import { homeOrder, industries } from "@/lib/content/industries";
import { jobLayoutPreview, jobs } from "@/lib/content/jobs";
import { issueLayoutPreviews, issues } from "@/lib/content/newsletters";
import { people, peopleLayoutPreviews } from "@/lib/content/people";
import { publicationLayoutPreviews, publications } from "@/lib/content/publications";
import { serviceDetails } from "@/lib/content/service-details";
import { services } from "@/lib/content/services";
import { contactDetails, site } from "@/lib/content/site";
import type { ContentData } from "@/lib/content/types";

/**
 * The content built into the website's files: every record, including drafts and the labelled
 * layout previews (lib/content/store.ts hides what should not be public).
 *
 * Used (1) to export the seed for the backend (scripts/export-content.ts) and (2) as the last-resort
 * fallback when the backend has never answered, so the site is never blank.
 */
export function buildLocalContent(): ContentData {
  return {
    site: { ...site, legalEntity: "RNK Legalheads LLP", contactDetails: { ...contactDetails } },
    services,
    serviceDetails,
    industries: industries.map((industry) => {
      const position = homeOrder.indexOf(industry.slug);
      return position >= 0 ? { ...industry, homeOrder: position + 1 } : industry;
    }),
    people: [...people, ...peopleLayoutPreviews],
    jobs: [...jobs, jobLayoutPreview],
    publications: [...publications, ...publicationLayoutPreviews],
    newsletters: [...issues, ...issueLayoutPreviews],
  };
}
