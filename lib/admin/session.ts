import { headers } from "next/headers";

/**
 * Server-side calls to the backend's /api/admin/* with the visitor's own session cookie, so
 * every CMS page is checked by the backend before anything is rendered (plan section 7).
 */
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");

export type AdminRole = "contributor" | "reviewer" | "publisher" | "admin";
export type AdminUser = { id: string; name: string; email: string; roles: AdminRole[] };

export async function adminGet<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  if (!BACKEND_URL) return { ok: false, status: 503 };
  const cookie = (await headers()).get("cookie") ?? "";
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin${path}`, {
      headers: { cookie },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return { ok: false, status: response.status };
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: 503 };
  }
}

/** The signed-in user, or undefined (not signed in, session expired, or backend unreachable). */
export async function getAdminUser(): Promise<AdminUser | undefined> {
  const result = await adminGet<{ user: AdminUser }>("/auth/me");
  return result.ok ? result.data.user : undefined;
}

export const isAdmin = (user: AdminUser | undefined) => Boolean(user?.roles.includes("admin"));
