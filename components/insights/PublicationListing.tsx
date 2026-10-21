import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import InsightsTabs from "@/components/insights/InsightsTabs";
import PublicationCard from "@/components/insights/PublicationCard";
import Pagination from "@/components/ui/Pagination";
import PageHero from "@/components/ui/PageHero";
import {
  filterPublications,
  type Publication,
  type PublicationType,
} from "@/lib/content/publications";
import { getContent } from "@/lib/content/source";
import { MAX_QUERY_LENGTH } from "@/lib/search";

export type RawParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 12;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

type ListingProps = {
  basePath: string;
  type?: PublicationType;
  title: string;
  lead: string;
  /** Shown when nothing of this type is published (final screens: points to the articles). */
  emptyText: string;
  params: RawParams;
};

/** Metadata for a listing: canonical base path, filtered variants not indexed (guide p.26, p.161). */
export function listingMetadata(basePath: string, title: string, description: string, params: RawParams): Metadata {
  const filtered = ["q", "service", "year", "court", "page"].some((key) => first(params[key]));
  return {
    title,
    description,
    alternates: { canonical: basePath },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

function yearsOf(list: Publication[]): string[] {
  return [...new Set(list.map((p) => p.publishedAt?.slice(0, 4)).filter((y): y is string => Boolean(y)))].sort().reverse();
}

export default async function PublicationListing({ basePath, type, title, lead, emptyText, params }: ListingProps) {
  const content = await getContent();
  const all = content.publicPublications(type);
  const services = content.publicServices();

  const query = first(params.q).trim().slice(0, MAX_QUERY_LENGTH);
  const service = services.find((s) => s.slug === first(params.service));

  // The filter bar is always shown (K01, K02, J01, U01). Year and court options come from the published records.
  const years = yearsOf(all);
  const courts =
    type === "judgment"
      ? [...new Set(all.map((p) => (p.type === "judgment" ? p.court : "")).filter(Boolean))].sort()
      : [];
  const year = years.includes(first(params.year)) ? first(params.year) : undefined;
  const court = courts.includes(first(params.court)) ? first(params.court) : undefined;

  const results = filterPublications(all, { query, serviceId: service?.id, year, court }, services);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(first(params.page), 10) || 1), pageCount);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hrefFor = (target: number) => {
    const qs = new URLSearchParams();
    if (query) qs.set("q", query);
    if (service) qs.set("service", service.slug);
    if (year) qs.set("year", year);
    if (court) qs.set("court", court);
    if (target > 1) qs.set("page", String(target));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const selectClass = "h-12 min-w-0 max-w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

  return (
    <>
      <PageHero eyebrow="Knowledge" title={title} lead={lead} />

      <div className="shell pb-16 pt-8 md:pb-24">
        <InsightsTabs current={basePath} />

        <Form action={basePath} scroll={false} role="search" aria-label={`Search ${title.toLowerCase()}`} className="mt-8">
          <div className="flex">
            <label htmlFor="insights-search" className="sr-only">
              Search insights
            </label>
            <input
              key={query}
              id="insights-search"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Search insights"
              className="h-12 min-w-0 flex-1 border border-[#8a8782] bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal"
            />
            <button type="submit" className="btn btn-primary h-12 shrink-0 px-6">
              Search
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor="insights-service" className="sr-only">
              Service
            </label>
            <select key={`s-${service?.slug}`} id="insights-service" name="service" defaultValue={service?.slug ?? ""} className={selectClass}>
              <option value="">All services</option>
              {services.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>

            {type === "judgment" && (
              <>
                <label htmlFor="insights-court" className="sr-only">
                  Court or tribunal
                </label>
                <select key={`c-${court}`} id="insights-court" name="court" defaultValue={court ?? ""} className={selectClass}>
                  <option value="">All courts</option>
                  {courts.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </>
            )}

          </div>
        </Form>

        {all.some((p) => p.preview) && (
          <p className="mt-6 border-l-2 border-rnk bg-warm px-4 py-3 text-[12px] leading-[18px] text-muted">
            Preview content demonstrates the layout. No example below is presented as a published legal opinion or
            verified judgment.
          </p>
        )}

        {all.length === 0 ? (
          // Honest empty state; no fictional records to fill the design (guide p.122).
          <div role="status" className="mt-10 border border-line bg-warm px-6 py-10 md:px-10">
            <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
            <h2 className="mt-5 font-serif text-[24px] leading-[32px]">Explore our articles.</h2>
            <p className="mt-2 max-w-[620px] text-[15px] text-muted">{emptyText}</p>
            <Link href="/articles" className="btn btn-primary mt-6">
              Browse articles
            </Link>
          </div>
        ) : (
          <>
            <p role="status" aria-live="polite" className="sr-only">
              {results.length} {results.length === 1 ? "publication" : "publications"}
              {service && ` / ${service.title}`}
            </p>

            {pageItems.length > 0 ? (
              <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((p) => (
                  <li key={`${p.type}-${p.slug}`}>
                    <PublicationCard publication={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 border border-line bg-warm px-6 py-10 md:px-10">
                <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
                <h2 className="mt-5 font-serif text-[24px] leading-[32px]">No publications match your filters.</h2>
                <p className="mt-2 text-[15px] text-muted">Try a different term or clear the filters.</p>
                <Link href={basePath} scroll={false} className="btn btn-primary mt-6">
                  Clear filters
                </Link>
              </div>
            )}

            <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} />
          </>
        )}
      </div>
    </>
  );
}
