"use client";

import { useState } from "react";

export type ActionState =
  | { kind: "idle" }
  | { kind: "working"; label: string }
  | { kind: "done"; message: string }
  | { kind: "failed"; message: string; links?: LinkedRecord[] };

/** A record that links to the one being deleted (from the backend's "in_use" answer). */
export type LinkedRecord = { kind: string; title: string; slug: string; field: string };

const LINK_KIND_PATH: Record<string, string> = {
  Service: "services",
  Industry: "industries",
  Person: "people",
  Article: "articles",
  Judgment: "judgments",
  "Legal update": "legal-updates",
  Newsletter: "newsletters",
};

/** The admin edit page of a linking record, where the link can be removed. */
export function linkedRecordHref(link: LinkedRecord): string | undefined {
  const type = LINK_KIND_PATH[link.kind];
  return type ? `/admin/${type}/${encodeURIComponent(link.slug)}` : undefined;
}

function linkedRecords(data: Record<string, unknown> | null): LinkedRecord[] | undefined {
  if (data?.error !== "in_use" || !Array.isArray(data.links)) return undefined;
  const links = data.links.filter(
    (l): l is LinkedRecord => typeof l?.title === "string" && typeof l?.slug === "string" && typeof l?.kind === "string" && typeof l?.field === "string",
  );
  return links.length ? links : undefined;
}

export const NOT_CONNECTED =
  "This action arrives in a later phase of the CMS, so nothing was saved or changed. Your work is still on this page.";

/**
 * Calls an admin API (the contract in RNK_Backend_and_CMS_Plan.md). Sign-in, users and the
 * audit log are live; content endpoints arrive in phase C and answer 404 until then. Failures are
 * always reported, never presented as success.
 */
export type AdminResult = { ok: boolean; status: number; data: Record<string, unknown> | null };

export async function adminRequest(path: string, init: RequestInit = {}): Promise<AdminResult> {
  try {
    const isForm = init.body instanceof FormData;
    const response = await fetch(`/api/admin${path}`, {
      ...init,
      credentials: "same-origin",
      headers: isForm || !init.body ? init.headers : { "Content-Type": "application/json", ...init.headers },
    });
    const data = response.headers.get("content-type")?.includes("json") ? await response.json().catch(() => null) : null;
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

export function useAdminAction() {
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  /** Runs the request and reports the outcome; returns the full result for callers that need the reply. */
  async function call(label: string, path: string, init: RequestInit, successMessage: string): Promise<AdminResult> {
    setState({ kind: "working", label });
    const result = await adminRequest(path, init);
    const serverMessage = typeof result.data?.message === "string" ? result.data.message : "";
    if (result.ok) setState({ kind: "done", message: successMessage });
    else if (result.status === 401) setState({ kind: "failed", message: "Your session has ended. Sign in again; your work is still on this page." });
    else if (result.status === 422 && result.data?.errors) setState({ kind: "failed", message: `${label} failed. Fix the fields listed at the top of the form.` });
    else if (linkedRecords(result.data))
      setState({
        kind: "failed",
        message: "This draft can't be deleted because these records link to it. Open each one, remove the link, save, then delete this draft.",
        links: linkedRecords(result.data),
      });
    else if (serverMessage) setState({ kind: "failed", message: serverMessage });
    else if (result.status === 403) setState({ kind: "failed", message: "You do not have permission to do this." });
    else if (result.status === 404) setState({ kind: "failed", message: `${label} failed. ${NOT_CONNECTED}` });
    else
      setState({
        kind: "failed",
        message: `${label} failed (${result.status ? `server answered ${result.status}` : "the server could not be reached"}). Please try again; your work is still on this page.`,
      });
    return result;
  }

  async function run(label: string, path: string, init: RequestInit, successMessage: string) {
    return (await call(label, path, init, successMessage)).ok;
  }

  return { state, run, call, setState, busy: state.kind === "working" };
}
