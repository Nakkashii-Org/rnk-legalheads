import type { Industry } from "@/lib/content/industries";
import type { Job } from "@/lib/content/jobs";
import type { NewsletterIssue } from "@/lib/content/newsletters";
import type { Person } from "@/lib/content/people";
import { byDateDesc, type Publication, type PublicationType } from "@/lib/content/publications";
import type { ServiceDetail } from "@/lib/content/service-details";
import { groupServices, type GroupWithServices, type Service } from "@/lib/content/services";
import type { ContentData, ContactDetails, SiteInfo } from "@/lib/content/types";
import { isPublic, showDrafts } from "@/lib/visibility";

/**
 * Read-only view of the site content with the visibility rules (guide p.18, p.150):
 * - public site: only approved records; held services never appear;
 * - draft review mode: everything, and the labelled layout previews while nothing is approved.
 * The rules are applied here even when the backend already filtered, as a second safeguard.
 */
export class Content {
  constructor(private readonly data: ContentData) {}

  /** Approved records; in draft review mode, all records while none is approved (previews included). */
  private visibleWithPreviews<T extends { approved: boolean; preview?: boolean }>(records: T[]): T[] {
    const approved = records.filter((r) => r.approved && !r.preview);
    if (approved.length > 0 || !showDrafts) return approved;
    return records;
  }

  // ---- Site ----
  get site(): SiteInfo {
    return this.data.site;
  }
  get contactDetails(): ContactDetails {
    return this.data.site.contactDetails;
  }

  // ---- Services ----
  publicServices(): Service[] {
    return this.data.services.filter(isPublic);
  }
  publicService(slug: string): Service | undefined {
    return this.publicServices().find((s) => s.slug === slug);
  }
  get serviceDetails(): Record<string, ServiceDetail> {
    return this.data.serviceDetails;
  }
  serviceDetail(id: string): ServiceDetail | undefined {
    return this.data.serviceDetails[id];
  }
  /** Groups that have at least one public service, in the guide's order. */
  publicGroups(): GroupWithServices[] {
    return groupServices(this.publicServices());
  }

  // ---- Industries ----
  /** Every sector record (the index lists them all; only finished sectors are linked). */
  allIndustries(): Industry[] {
    return this.data.industries;
  }
  publicIndustries(): Industry[] {
    return this.data.industries.filter(isPublic);
  }
  publicIndustry(slug: string): Industry | undefined {
    return this.publicIndustries().find((i) => i.slug === slug);
  }
  /** The six homepage sectors (H06), in their set order. */
  homeIndustries(): Industry[] {
    return this.publicIndustries()
      .filter((i) => i.homeOrder)
      .sort((a, b) => a.homeOrder! - b.homeOrder!);
  }

  // ---- People ----
  publicPeople(): Person[] {
    return this.visibleWithPreviews(this.data.people);
  }
  publicPerson(slug: string): Person | undefined {
    return this.publicPeople().find((p) => p.slug === slug);
  }

  // ---- Jobs ----
  publicJobs(): Job[] {
    return this.visibleWithPreviews(this.data.jobs);
  }
  /** Open roles for the careers index. Closed roles drop out of the listing. */
  openJobs(): Job[] {
    return this.publicJobs().filter((job) => job.status === "open");
  }
  /** Detail pages stay available for closed roles so they can show a closed status (guide p.137). */
  publicJob(slug: string): Job | undefined {
    return this.publicJobs().find((job) => job.slug === slug);
  }

  // ---- Publications ----
  publicPublications(type?: PublicationType): Publication[] {
    return this.visibleWithPreviews(this.data.publications)
      .filter((p) => !type || p.type === type)
      .sort(byDateDesc);
  }
  publicPublication(type: PublicationType, slug: string): Publication | undefined {
    return this.publicPublications(type).find((p) => p.slug === slug);
  }
  /** Three most recent approved publications for the homepage (H05). */
  homePublications(): Publication[] {
    return this.publicPublications().slice(0, 3);
  }
  publicationsForService(serviceId: string, limit = 3): Publication[] {
    return this.publicPublications()
      .filter((p) => p.serviceIds.includes(serviceId))
      .slice(0, limit);
  }
  relatedPublications(current: Publication, limit = 3): Publication[] {
    return this.publicPublications()
      .filter((p) => p.slug !== current.slug && p.serviceIds.some((id) => current.serviceIds.includes(id)))
      .slice(0, limit);
  }

  // ---- Newsletters ----
  publicIssues(): NewsletterIssue[] {
    return [...this.visibleWithPreviews(this.data.newsletters)].sort((a, b) => (b.issueDate ?? "").localeCompare(a.issueDate ?? ""));
  }
  publicIssue(slug: string): NewsletterIssue | undefined {
    return this.publicIssues().find((issue) => issue.slug === slug);
  }
  /** Resolves the issue's references; anything unpublished since is left out, never shown as a broken link. */
  issuePublications(issue: NewsletterIssue): Publication[] {
    return issue.items
      .map((ref) => this.publicPublication(ref.type, ref.slug))
      .filter((p): p is Publication => p !== undefined);
  }
}
