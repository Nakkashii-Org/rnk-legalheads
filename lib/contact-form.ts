/**
 * Contact form field rules (guide p.136). Shared so the future POST /api/contact can apply
 * exactly the same checks on the server; browser validation alone is never trusted.
 */
export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  service: string;
  message: string;
  acknowledged: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 1500;
export const GENERAL_ENQUIRY = "general-enquiry";
export const NOT_SURE = "not-sure";

// Syntax check only; it does not prove the mailbox exists (guide p.136).
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Line breaks in single-line fields are rejected to prevent email header injection.
const LINE_BREAK = /[\r\n]/;

export function validateContact(fields: ContactFields, allowedServices: string[]): ContactErrors {
  const errors: ContactErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  // International names are accepted; no letters-only restriction.
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";
  else if (LINE_BREAK.test(name)) errors.name = "Name must be on one line.";

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email) || LINE_BREAK.test(email)) errors.email = "Please enter a valid email address.";

  if (fields.phone.trim().length > 30 || LINE_BREAK.test(fields.phone)) errors.phone = "Enter a phone number of 30 characters or fewer.";
  if (fields.organisation.trim().length > 150 || LINE_BREAK.test(fields.organisation))
    errors.organisation = "Organisation must be 150 characters or fewer.";

  if (!allowedServices.includes(fields.service)) errors.service = "Please select a service or choose Not sure.";

  if (!message) errors.message = "Please enter a brief, non-confidential message.";
  else if (message.length < MESSAGE_MIN) errors.message = `Please describe the subject in at least ${MESSAGE_MIN} characters.`;
  else if (message.length > MESSAGE_MAX) errors.message = `Keep the description to ${MESSAGE_MAX.toLocaleString("en-GB")} characters or fewer.`;

  if (!fields.acknowledged) errors.acknowledged = "Please confirm that you have read the Privacy Policy.";

  return errors;
}
