import { unstable_cache } from "next/cache";
import { cache } from "react";
import { buildLocalContent } from "@/lib/content/local";
import { Content } from "@/lib/content/store";
import type { ContentData } from "@/lib/content/types";
import { showDrafts } from "@/lib/visibility";

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");
// Lets the backend include drafts for draft review mode. Server-only; never sent to a browser.
const PREVIEW_SECRET = process.env.CONTENT_PREVIEW_SECRET;

/** How long a content snapshot is reused before the backend is asked again (seconds). */
export const CONTENT_REVALIDATE = 300;

async function fetchBundle(): Promise<ContentData> {
  const response = await fetch(`${BACKEND_URL}/api/content/bundle`, {
    headers: showDrafts && PREVIEW_SECRET ? { "x-content-preview": PREVIEW_SECRET } : undefined,
    cache: "no-store",
    // Free Render services sleep; waking takes time, but pages must not hang for ever.
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Content API answered ${response.status}`);
  const data = (await response.json()) as ContentData;
  if (!data?.site || !Array.isArray(data.services)) throw new Error("Content API returned an unexpected shape");
  return data;
}

/**
 * Cached snapshot. If a refresh fails, Next.js keeps serving the last good snapshot, so a
 * temporary backend problem never empties the site (guide p.152).
 */
const cachedBundle = unstable_cache(fetchBundle, ["content-bundle", showDrafts ? "drafts" : "public"], {
  revalidate: CONTENT_REVALIDATE,
  tags: ["content"],
});

// At most one fallback warning per minute, so a sleeping backend doesn't flood the logs.
let lastWarning = 0;
function warnFallback(error: unknown) {
  if (Date.now() - lastWarning < 60_000) return;
  lastWarning = Date.now();
  console.error(JSON.stringify({ level: "error", event: "content.fallback_to_local", error: (error as Error).message }));
}

/**
 * The site's content for the current request (one fetch per request at most). Without a
 * backend, or if it has never answered, the content built into the website's files is used.
 */
export const getContent = cache(async (): Promise<Content> => {
  if (!BACKEND_URL) return new Content(buildLocalContent());
  try {
    return new Content(await cachedBundle());
  } catch (error) {
    warnFallback(error);
    return new Content(buildLocalContent());
  }
});
