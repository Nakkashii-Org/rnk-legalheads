"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROLES } from "@/lib/admin/config";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: "invited" | "active" | "disabled";
  mfaEnabled: boolean;
  locked: boolean;
  lastLoginAt?: string;
  inviteExpiresAt?: string;
};

const ROLE_LABEL = Object.fromEntries(ROLES.map((r) => [r.value, r.label]));
const STATUS: Record<AdminUserRow["status"], string> = { invited: "Invited", active: "Active", disabled: "Disabled" };
const when = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)) : "—";

/** B4: accounts with their actions. Every action is checked again by the server. */
export default function UsersTable({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string>();
  const [editing, setEditing] = useState<string>();
  const [roles, setRoles] = useState<string[]>([]);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();

  async function call(id: string, path: string, init: RequestInit, done: string) {
    setBusy(id);
    setMessage(undefined);
    try {
      const response = await fetch(`/api/admin/users/${id}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; emailed?: boolean; errors?: Record<string, string> };
      if (response.ok) {
        setMessage({ ok: true, text: data.emailed === false ? `${done} The email could not be sent; try "Resend invitation" later.` : done });
        setEditing(undefined);
        router.refresh();
      } else if (response.status === 401) setMessage({ ok: false, text: "Your session has ended. Please sign in again." });
      else setMessage({ ok: false, text: data.message ?? Object.values(data.errors ?? {})[0] ?? "That didn't work. Please try again." });
    } catch {
      setMessage({ ok: false, text: "That didn't work. Please try again." });
    } finally {
      setBusy(undefined);
    }
  }

  const small = "inline-flex min-h-11 items-center text-[13px] underline underline-offset-4 hover:text-action disabled:opacity-50 md:min-h-8";

  return (
    <div className="space-y-3">
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`border-l-2 bg-warm px-4 py-3 text-[14px] ${message.ok ? "border-charcoal" : "border-action"}`}>
          {message.text}
        </p>
      )}
      <ul className="border-t border-line">
        {users.map((u) => {
          const self = u.id === currentUserId;
          return (
            <li key={u.id} className="grid gap-3 border-b border-line py-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
              <div className="min-w-0">
                <p className="font-bold">
                  {u.name} {self && <span className="text-[12px] font-normal text-muted">(you)</span>}
                </p>
                <p className="break-all text-[13px] text-muted">{u.email}</p>
                <p className="mt-1 text-[12px] text-muted">
                  <span className={u.status === "active" ? "text-charcoal" : u.status === "disabled" ? "text-action" : ""}>{STATUS[u.status]}</span>
                  {u.locked && " · Locked (wrong attempts)"}
                  {u.status !== "invited" && ` · 2-step ${u.mfaEnabled ? "on" : "to set up at next sign-in"}`}
                  {u.status === "invited" && u.inviteExpiresAt && ` · link expires ${when(u.inviteExpiresAt)}`}
                </p>
                <p className="text-[12px] text-muted">Last sign-in: {when(u.lastLoginAt)}</p>
              </div>

              <div>
                {editing === u.id ? (
                  <fieldset>
                    <legend className="sr-only">Roles for {u.name}</legend>
                    {ROLES.map((r) => (
                      <label key={r.value} className="flex min-h-9 items-center gap-2 text-[13px]">
                        <input
                          type="checkbox"
                          checked={roles.includes(r.value)}
                          onChange={(e) => setRoles((prev) => (e.target.checked ? [...prev, r.value] : prev.filter((x) => x !== r.value)))}
                          className="h-4 w-4 accent-charcoal"
                        />
                        {r.label}
                      </label>
                    ))}
                    <div className="mt-1 flex gap-4">
                      <button
                        type="button"
                        disabled={busy === u.id || roles.length === 0}
                        onClick={() => call(u.id, "", { method: "PATCH", body: JSON.stringify({ roles }) }, `Roles updated for ${u.name}.`)}
                        className="btn btn-primary h-9 px-4 text-[13px]"
                      >
                        Save roles
                      </button>
                      <button type="button" onClick={() => setEditing(undefined)} className={small}>
                        Cancel
                      </button>
                    </div>
                  </fieldset>
                ) : (
                  <p className="text-[13px]">{u.roles.map((r) => ROLE_LABEL[r] ?? r).join(", ")}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 lg:justify-end">
                {editing !== u.id && (
                  <button type="button" disabled={Boolean(busy)} onClick={() => { setEditing(u.id); setRoles(u.roles); }} className={small}>
                    Change roles<span className="sr-only"> for {u.name}</span>
                  </button>
                )}
                {u.status === "invited" && (
                  <button type="button" disabled={Boolean(busy)} onClick={() => call(u.id, "/resend-invite", { method: "POST" }, `A new invitation was sent to ${u.email}.`)} className={small}>
                    Resend invitation
                  </button>
                )}
                {u.status !== "invited" && !self && (
                  <button type="button" disabled={Boolean(busy)} onClick={() => call(u.id, "/reset-mfa", { method: "POST" }, `2-step verification reset. ${u.name} will scan a new QR code at the next sign-in.`)} className={small}>
                    Reset 2-step<span className="sr-only"> for {u.name}</span>
                  </button>
                )}
                {u.status === "active" && !self && (
                  <button type="button" disabled={Boolean(busy)} onClick={() => call(u.id, "", { method: "PATCH", body: JSON.stringify({ status: "disabled" }) }, `${u.name} is disabled and signed out.`)} className={`${small} text-action`}>
                    Disable<span className="sr-only"> {u.name}</span>
                  </button>
                )}
                {u.status === "disabled" && (
                  <button type="button" disabled={Boolean(busy)} onClick={() => call(u.id, "", { method: "PATCH", body: JSON.stringify({ status: "active" }) }, `${u.name} can sign in again.`)} className={small}>
                    Enable<span className="sr-only"> {u.name}</span>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
