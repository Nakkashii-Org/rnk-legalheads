"use client";

import { useState } from "react";

export type ActionState =
  | { kind: "idle" }
  | { kind: "working"; label: string }
  | { kind: "done"; message: string }
  | { kind: "failed"; message: string };

export const NOT_CONNECTED =
  "Saving content arrives in the next phase of the CMS, so nothing was saved or changed. Your work is still on this page.";

/**
 * Calls an admin API (the contract in RNK_Backend_and_CMS_Plan.md). Sign-in, users and the
 * audit log are live; content endpoints arrive in phase C and answer 404 until then. Failures are
 * always reported, never presented as success.
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
