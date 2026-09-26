import type { Service } from "@/lib/content/services";

export type Person = {
  slug: string;
  name: string;
  role: string;
  /** Short practice summary shown on cards and in the profile hero. */
  practiceSummary: string;
  biography: string[];
  /** Experience gained before joining RNK, kept separate from the firm's own history (guide p.112, p.118). */
  priorExperience?: string;
  qualifications?: string;
  enrolment?: string;
  languages?: string;
  office?: string;
  serviceIds: string[];
  /** Approved portrait with recorded consent; absent until supplied. */
  portrait?: { src: string; alt: string };
  approved: boolean;
  preview?: boolean;
};

// Verified profiles come from the CMS. The guide supplies none, so none are invented.
export const people: Person[] = [];

// Layout-only records for draft review (P01/P02). Never shown on the public site.
export const peopleLayoutPreviews: Person[] = [1, 2, 3].map((n) => ({
  slug: `lawyer-profile-${n}`,
  name: `Lawyer profile ${n}`,
  role: "Role / to be approved",
  practiceSummary: "Verified name, role and area of practice.",
  biography: ["A factual biography covering the lawyer's current work, qualifications and professional background."],
  priorExperience: "Experience gained before joining RNK Legalheads is described here separately.",
  qualifications: "Verified qualifications",
  enrolment: "Approved enrolment particulars",
  languages: "Confirmed languages",
  office: "Verified office details",
  serviceIds: n === 1 ? ["S10", "S09"] : n === 2 ? ["S01", "S02"] : ["S26", "S27"],
  approved: false,
  preview: true,
}));

/** Text used by site search: profile fields plus the names of linked services. */
export function personSearchText(person: Person, publicServices: Service[]): string {
  const services = publicServices
    .filter((s) => person.serviceIds.includes(s.id))
    .map((s) => s.title)
    .join(" ");
  return `${person.name} ${person.role} ${person.practiceSummary} ${person.biography.join(" ")} ${services}`;
}

export function filterPeople(list: Person[], name: string, serviceId: string | undefined): Person[] {
  const needle = name.trim().toLowerCase();
  return list.filter(
    (person) =>
      (!needle || person.name.toLowerCase().includes(needle)) &&
      (!serviceId || person.serviceIds.includes(serviceId)),
  );
}
