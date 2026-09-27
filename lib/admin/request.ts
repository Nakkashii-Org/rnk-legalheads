"use client";

import { useState } from "react";

export type ActionState =
  | { kind: "idle" }
  | { kind: "working"; label: string }
  | { kind: "done"; message: string }
  | { kind: "failed"; message: string };

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
    else if (serverMessage) setState({ kind: "failed", message: serverMessage });
    else if (result.status === 403) setState({ kind: "failed", message: "You do not have permission to do this." });
    else if (result.status === 404) setState({ kind: "failed", message: `${label} failed. ${NOT_CONNECTED}` });
    else setState({ kind: "failed", message: `${label} failed. Please try again; your work is still on this page.` });
    return result;
  }

  async function run(label: string, path: string, init: RequestInit, successMessage: string) {
    return (await call(label, path, init, successMessage)).ok;
  }

  return { state, run, call, setState, busy: state.kind === "working" };
}
