/**
 * Careers application field rules. Shared so the future POST /api/careers can apply exactly the
 * same checks on the server; browser validation alone is never trusted.
 */
export type ApplicationFields = {
  name: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  experience: string;
  qualification: string;
  barEnrolment: string;
  organisation: string;
  linkedin: string;
  coverNote: string;
  resume: File | null;
  consent: boolean;
};

export type ApplicationErrors = Partial<Record<keyof ApplicationFields, string>>;

export type Option = { value: string; label: string };

export const COVER_NOTE_MAX = 1500;
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const RESUME_ACCEPT = [
  ...RESUME_EXTENSIONS,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

export const GENERAL_POSITIONS: Option[] = [
  { value: "general-application", label: "General application" },
  { value: "associate", label: "Associate" },
  { value: "intern", label: "Intern" },
  { value: "support-staff", label: "Support staff" },
];

export const EXPERIENCE_OPTIONS: Option[] = [
  { value: "fresher", label: "Fresher / Student" },
  { value: "0-2", label: "0–2 years" },
  { value: "2-5", label: "2–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10-plus", label: "10+ years" },
];

// Syntax check only; it does not prove the mailbox exists.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Line breaks in single-line fields are rejected to prevent email header injection.
const LINE_BREAK = /[\r\n]/;
// 10-digit Indian number, or an international number with a leading + and country code.
const PHONE_PATTERN = /^(\d{10}|\+\d{8,15})$/;

export function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function resumeError(file: File | null): string | undefined {
  if (!file) return "Upload your resume.";
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) return "The resume must be a PDF, DOC or DOCX file.";
  if (file.size === 0) return "The selected resume file is empty.";
  if (file.size > RESUME_MAX_BYTES) return "The resume must be 5 MB or smaller.";
  return undefined;
}

function singleLine(value: string, max: number, label: string, required: boolean): string | undefined {
  const text = value.trim();
  if (required && !text) return `Enter your ${label}.`;
  if (text.length > max) return `${label[0].toUpperCase()}${label.slice(1)} must be ${max} characters or fewer.`;
  if (LINE_BREAK.test(value)) return `${label[0].toUpperCase()}${label.slice(1)} must be on one line.`;
  return undefined;
}

export function validateApplication(fields: ApplicationFields, allowedPositions: string[]): ApplicationErrors {
  const errors: ApplicationErrors = {};

  // International names are accepted; no letters-only restriction.
  if (fields.name.trim().length < 2) errors.name = "Enter your full name.";
  else errors.name = singleLine(fields.name, 100, "full name", true);

  const email = fields.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !EMAIL_PATTERN.test(email) || LINE_BREAK.test(email))
    errors.email = "Enter an email address in the format name@example.com.";

  const phone = fields.phone.replace(/[\s()-]/g, "");
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!PHONE_PATTERN.test(phone)) errors.phone = "Enter a 10-digit mobile number, or + and the country code.";

  errors.city = singleLine(fields.city, 100, "current city", true);

  if (!allowedPositions.includes(fields.position)) errors.position = "Choose the position you are applying for.";
  if (!EXPERIENCE_OPTIONS.some((o) => o.value === fields.experience)) errors.experience = "Choose your experience.";

  errors.qualification = singleLine(fields.qualification, 150, "highest qualification", true);
  errors.barEnrolment = singleLine(fields.barEnrolment, 50, "bar enrolment number", false);
  errors.organisation = singleLine(fields.organisation, 150, "current organisation", false);

  const linkedin = fields.linkedin.trim();
  if (linkedin) {
    let valid = false;
    try {
      const url = new URL(linkedin);
      valid = (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
    } catch {}
    if (!valid || linkedin.length > 300) errors.linkedin = "Enter the full profile link, starting with https://";
  }

  if (fields.coverNote.trim().length > COVER_NOTE_MAX)
    errors.coverNote = `Keep the cover note to ${COVER_NOTE_MAX.toLocaleString("en-GB")} characters or fewer.`;

  errors.resume = resumeError(fields.resume);

  if (!fields.consent) errors.consent = "Confirm that your details may be used for recruitment.";

  for (const key of Object.keys(errors) as (keyof ApplicationFields)[]) if (!errors[key]) delete errors[key];
  return errors;
}
