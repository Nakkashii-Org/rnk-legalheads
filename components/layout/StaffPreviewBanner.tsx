"use client";

import { usePathname } from "next/navigation";

/**
 * Shown only in the staff preview (signed-in CMS users). Drafts on this page are not public;
 * the page is never indexed.
 */
export default function StaffPreviewBanner() {
  const pathname = usePathname();
  // The CMS itself is always private; the bar belongs only on website pages.
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div role="region" aria-label="Draft preview" className="sticky top-0 z-40 bg-charcoal px-4 py-3 text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13px] leading-5">
          <p>
            <strong>Draft preview, staff only.</strong> This page may show content that is not published. Do not share
            screenshots outside the firm.
          </p>
          {/* A plain link: the route handler clears the preview cookie, then shows the public page. */}
          <a href={`/admin/preview/exit?path=${encodeURIComponent(pathname)}`} className="inline-flex min-h-11 items-center font-bold underline underline-offset-4 md:min-h-0">
            Exit preview
          </a>
        </div>
      </div>
    </>
  );
}
