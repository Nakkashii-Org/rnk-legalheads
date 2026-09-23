import { showDrafts } from "@/lib/visibility";

export type Job = {
  jobId: string;
  slug: string;
  title: string;
  practice: string;
  location: string;
  workArrangement: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  /** How to apply, e.g. the monitored careers mailbox and the reference to quote (guide p.137). */
  applicationInstructions: string;
  applicationEmail?: string;
  openedOn?: string;
  closesOn?: string;
  status: "open" | "closed";
  approved: boolean;
  preview?: boolean;
};

// Only real, approved vacancies are listed (guide p.12, p.137). None have been supplied.
const jobs: Job[] = [];

const layoutPreview: Job = {
  jobId: "Approved job ID",
  slug: "approved-role-title",
  title: "Approved role title",
  practice: "Practice",
  location: "Verified office",
  workArrangement: "Approved work arrangement",
  experience: "Experience requirement",
  summary: "Practice, location and experience requirements are set out in the approved vacancy.",
  responsibilities: ["Approved responsibilities, reporting arrangements and qualifications belong here."],
  qualifications: ["State the office, work arrangement and closing date."],
  applicationInstructions:
    "Use the verified careers email or approved application system. Include the vacancy reference.",
  status: "open",
  approved: false,
  preview: true,
};

function visibleJobs(): Job[] {
  const approved = jobs.filter((job) => job.approved);
  if (approved.length > 0 || !showDrafts) return approved;
  return [...jobs, layoutPreview];
}

/** Open roles for the careers index. Closed roles drop out of the listing. */
export function getOpenJobs(): Job[] {
  return visibleJobs().filter((job) => job.status === "open");
}

/** Detail pages stay available for closed roles so they can show a closed status (guide p.137). */
export function getPublicJob(slug: string): Job | undefined {
  return visibleJobs().find((job) => job.slug === slug);
}

export function getPublicJobs(): Job[] {
  return visibleJobs();
}
