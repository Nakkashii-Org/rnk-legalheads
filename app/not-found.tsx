import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import { MAX_QUERY_LENGTH } from "@/lib/search";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** E01: say what happened without blaming the visitor, and offer Home, Services and search (guide p.156). */
export default function NotFound() {
  return (
    <section className="shell py-16 md:py-24">
      <div className="max-w-[720px]">
        <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
        <p className="eyebrow mt-6">Error 404</p>
        <h1 className="mt-5 font-serif text-[40px] leading-[44px] tracking-[-0.02em] md:text-[54px] md:leading-[59px]">
          This page could not be found.
        </h1>
        <p className="mt-5 max-w-[560px] text-muted">
          The address may have changed, or the page may no longer be published. You can return to the homepage, browse
          our services or search the site.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/" className="btn btn-primary">
            Return to Home <Arrow />
          </Link>
          <Link href="/services" className="btn btn-secondary">
            Browse services <Arrow />
          </Link>
        </div>

        <form action="/search" role="search" aria-label="Search the site" className="mt-12 max-w-[560px] border-t border-line pt-8">
          <label htmlFor="notfound-search" className="text-[14px] font-bold">
            Search the site
          </label>
          <div className="mt-2 flex">
            <input
              id="notfound-search"
              type="search"
              name="q"
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Services, people or topics"
              className="h-12 min-w-0 flex-1 border border-[#8a8782] bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal"
            />
            <button type="submit" className="btn btn-primary h-12 shrink-0 px-6">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
