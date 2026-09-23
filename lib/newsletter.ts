import { EMAIL_PATTERN } from "@/lib/contact-form";
import { serviceGroups } from "@/lib/content/services";

/** Subscription topics follow the seven service groups (L03). */
export const NEWSLETTER_TOPICS = serviceGroups.map((group) => ({ id: group.key, label: group.name }));

/**
 * Privacy-notice version recorded with each consent (guide p.130, p.158).
 * Update when the approved privacy notice changes.
 */
export const SUBSCRIPTION_NOTICE_VERSION = "draft-2026-09";

export type SubscribeFields = { email: string; topics: string[]; consent: boolean };
export type SubscribeErrors = Partial<Record<"email" | "topics" | "consent", string>>;

/** Shared with the future POST /api/subscribe so browser and server apply the same rules. */
export function validateSubscribe(fields: SubscribeFields): SubscribeErrors {
  const errors: SubscribeErrors = {};
  const email = fields.email.trim();
  const allowed: string[] = NEWSLETTER_TOPICS.map((t) => t.id);

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = "Enter an email address in the format name@example.com.";

  // Sends are topic-specific, so at least one allowlisted topic is required (guide p.129).
  if (fields.topics.length === 0) errors.topics = "Choose at least one topic.";
  else if (fields.topics.some((t) => !allowed.includes(t))) errors.topics = "Choose topics from the list.";

  if (!fields.consent) errors.consent = "Confirm that you agree to receive the legal updates you select.";
  return errors;
}
