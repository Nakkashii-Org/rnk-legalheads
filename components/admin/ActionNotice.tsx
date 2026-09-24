import type { ActionState } from "@/lib/admin/request";

/** Result of a CMS action. Failures are announced assertively; success politely. */
export default function ActionNotice({ state, className = "" }: { state: ActionState; className?: string }) {
  if (state.kind === "idle") return <div aria-live="polite" className="sr-only" />;
  if (state.kind === "working")
    return (
      <p aria-live="polite" className={`text-[13px] text-muted ${className}`}>
        {state.label}…
      </p>
    );
  const failed = state.kind === "failed";
  return (
    <div
      role={failed ? "alert" : "status"}
      className={`border-l-2 px-4 py-3 text-[13px] leading-5 ${failed ? "border-action bg-warm" : "border-charcoal bg-warm"} ${className}`}
    >
      <strong className="block text-[14px]">{failed ? "Not completed" : "Done"}</strong>
      <span className="text-muted">{state.message}</span>
    </div>
  );
}
