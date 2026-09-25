/**
 * Server-side calls from Next.js pages to rnk-legalhead-backend. Browser form posts go through
 * the /api rewrite in next.config.ts instead. BACKEND_URL is server-only (never NEXT_PUBLIC_).
 */
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");

export type BackendResult<T> = { ok: true; data: T } | { ok: false; status: number };

export async function backendGet<T>(path: string): Promise<BackendResult<T>> {
  if (!BACKEND_URL) return { ok: false, status: 503 };
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return { ok: false, status: response.status };
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: 503 };
  }
}
