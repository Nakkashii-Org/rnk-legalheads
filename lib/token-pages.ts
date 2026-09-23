import type { Metadata } from "next";
import { showDrafts } from "@/lib/visibility";

/**
 * Pages reached from signed email links: not indexed, and no referrer is sent onwards so a
 * token in the URL never leaks to another site (guide p.131).
 */
export const tokenPageMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
  referrer: "no-referrer",
});

type RawParams = Record<string, string | string[] | undefined>;

export function readParam(params: RawParams, key: string): string {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Signed tokens are opaque, URL-safe strings; anything else is rejected before reaching the server. */
export function readToken(params: RawParams): string | undefined {
  const token = readParam(params, "token");
  return /^[A-Za-z0-9._~-]{16,512}$/.test(token) ? token : undefined;
}

/**
 * Draft review mode only: lets reviewers see states that normally need a verified email link.
 * Always false on the public site.
 */
export function previewState(params: RawParams, allowed: string[]): string | undefined {
  if (!showDrafts) return undefined;
  const state = readParam(params, "preview");
  return allowed.includes(state) ? state : undefined;
}
