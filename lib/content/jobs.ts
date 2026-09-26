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
export const jobs: Job[] = [];

export const jobLayoutPreview: Job = {
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
