import { adminGet } from "@/lib/admin/session";
import { EXPERIENCE_OPTIONS, GENERAL_POSITIONS } from "@/lib/career-form";
import { GENERAL_ENQUIRY, NOT_SURE } from "@/lib/contact-form";
import { getContent } from "@/lib/content/source";
import type { InboxKind, InboxList } from "@/lib/admin/inbox-shared";
import type { Loaded } from "@/lib/admin/records";

export * from "@/lib/admin/inbox-shared";

export async function listInbox<T>(kind: InboxKind, params: Record<string, string>): Promise<Loaded<InboxList<T>>> {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
  return adminGet<InboxList<T>>(`/inbox/${kind}${qs.size ? `?${qs}` : ""}`);
}

export async function getInboxItem<T>(kind: InboxKind, reference: string): Promise<Loaded<T>> {
  const res = await adminGet<{ item: T }>(`/inbox/${kind}/${encodeURIComponent(reference)}`);
  return res.ok ? { ok: true, data: res.data.item } : res;
}

const humanize = (v: string) => v.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Readable names for the form values stored with each message (service slugs, job slugs, experience bands). */
export async function inboxLabels() {
  const content = await getContent();
  const services = new Map(content.publicServices().map((s) => [s.slug, s.title]));
  const jobs = new Map([...content.openJobs().map((j) => [j.slug, j.title] as const), ...GENERAL_POSITIONS.map((p) => [p.value, p.label] as const)]);
  return {
    service: (v: string) => (v === GENERAL_ENQUIRY ? "General enquiry" : v === NOT_SURE ? "Not sure" : (services.get(v) ?? humanize(v))),
    position: (v: string) => jobs.get(v) ?? humanize(v),
    experience: (v: string) => EXPERIENCE_OPTIONS.find((o) => o.value === v)?.label ?? v,
  };
}

