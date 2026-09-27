/** Inbox types and labels shared by server pages and browser components (phase E). */
export type InboxKind = "enquiries" | "applications";
export type Note = { text: string; by: string; at: string };
export type ResumeInfo = { name: string; size: number; type: string };

export type EnquiryRow = { reference: string; receivedAt: string; name: string; email: string; service: string; status: string; emailed?: string };
export type ApplicationRow = {
  reference: string;
  receivedAt: string;
  name: string;
  email: string;
  position: string;
  experience: string;
  resume?: ResumeInfo;
  status: string;
  emailed?: string;
};

export type Enquiry = EnquiryRow & {
  phone?: string;
  organisation?: string;
  message: string;
  context?: { kind: "person" | "industry"; slug: string };
  notes: Note[];
};
export type Application = ApplicationRow & {
  phone: string;
  city: string;
  qualification: string;
  barEnrolment?: string;
  organisation?: string;
  linkedin?: string;
  coverNote?: string;
  notes: Note[];
};

export type InboxList<T> = { items: T[]; total: number; page: number; pageSize: number; counts: Record<string, number>; positions?: string[] };

export const STATUSES: Record<InboxKind, { value: string; label: string }[]> = {
  enquiries: [
    { value: "new", label: "New" },
    { value: "in-progress", label: "In progress" },
    { value: "closed", label: "Closed" },
  ],
  applications: [
    { value: "new", label: "New" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "rejected", label: "Not progressed" },
  ],
};

export const statusLabel = (kind: InboxKind, value: string) => STATUSES[kind].find((s) => s.value === value)?.label ?? value;

export const formatWhen = (at: string) => new Date(at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
export const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
