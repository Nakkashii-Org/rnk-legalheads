import Link from "next/link";
import Arrow from "@/components/ui/Arrow";

/** Crawlable previous/next links that keep the current filters (guide p.120). */
export default function Pagination({ page, pageCount, hrefFor }: { page: number; pageCount: number; hrefFor: (page: number) => string }) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6 text-[14px]">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="link-action" rel="prev">
          <Arrow direction="left" /> Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} className="link-action" rel="next">
          Next <Arrow direction="right" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
