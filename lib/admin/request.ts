"use client";

import { useState } from "react";

export type ActionState =
  | { kind: "idle" }
  | { kind: "working"; label: string }
  | { kind: "done"; message: string }
  | { kind: "failed"; message: string };

export const NOT_CONNECTED =
  "The CMS backend is not connected yet, so nothing was saved or changed. Your work is still on this page.";

/**
 * Calls an admin API. The routes are the contract in RNK_Backend_and_CMS_Plan.md; until they
 * exist every call fails, and the UI must say so rather than pretend it worked.
 */
export async function adminRequest(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number }> {
  try {
    const isForm = init.body instanceof FormData;
    const response = await fetch(`/api/admin${path}`, {
      ...init,
      credentials: "same-origin",
      headers: isForm || !init.body ? init.headers : { "Content-Type": "application/json", ...init.headers },
    });
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

export function useAdminAction() {
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  async function run(label: string, path: string, init: RequestInit, successMessage: string) {
    setState({ kind: "working", label });
    const result = await adminRequest(path, init);
    if (result.ok) setState({ kind: "done", message: successMessage });
    else if (result.status === 401 || result.status === 403)
      setState({ kind: "failed", message: "You do not have permission to do this, or your session has ended. Sign in again." });
    else setState({ kind: "failed", message: `${label} failed. ${NOT_CONNECTED}` });
    return result.ok;
  }

  return { state, run, setState, busy: state.kind === "working" };
}
