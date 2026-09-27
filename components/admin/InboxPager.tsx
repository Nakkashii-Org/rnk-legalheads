import Link from "next/link";

/** Previous / next links for long inbox lists, keeping the current filters. */
export default function InboxPager({ base, params, page, pageSize, total }: { base: string; params: Record<string, string>; page: number; pageSize: number; total: number }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)), page: String(p) })}`;
  return (
    <nav aria-label="Pages" className="flex items-center gap-4 text-[13px]">
      {page > 1 && (
        <Link href={href(page - 1)} className="inline-flex min-h-11 items-center underline underline-offset-4">
          Newer
        </Link>
      )}
      <span className="text-muted">
        Page {page} of {pages}
      </span>
      {page < pages && (
        <Link href={href(page + 1)} className="inline-flex min-h-11 items-center underline underline-offset-4">
          Older
        </Link>
      )}
    </nav>
  );
}
