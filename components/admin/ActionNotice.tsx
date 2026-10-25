import Link from "next/link";
import { linkedRecordHref, type ActionState } from "@/lib/admin/request";

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
  const links = failed ? state.links : undefined;
  return (
    <div
      role={failed ? "alert" : "status"}
      className={`border-l-2 px-4 py-3 text-[13px] leading-5 ${failed ? "border-action bg-warm" : "border-charcoal bg-warm"} ${className}`}
    >
      <strong className="block text-[14px]">{failed ? "Not completed" : "Done"}</strong>
      <span className="text-muted">{state.message}</span>
      {links && (
        // Each record that still links here, and the field to change in it (opens in a new tab so this page stays).
        <ul className="mt-2 space-y-1.5">
          {links.map((link) => {
            const href = linkedRecordHref(link);
            return (
              <li key={`${link.kind}-${link.slug}-${link.field}`}>
                {href ? (
                  <Link href={href} target="_blank" className="font-bold text-charcoal underline underline-offset-4 hover:text-action">
                    {link.title}
                  </Link>
                ) : (
                  <strong className="text-charcoal">{link.title}</strong>
                )}
                <span className="block text-muted">
                  {link.kind} · remove it from <strong className="font-bold">{link.field}</strong>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
