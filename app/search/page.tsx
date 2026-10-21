import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import Highlight from "@/components/ui/Highlight";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/services/ServiceCard";
import {
  publicationHref,
  publicationSearchText,
  publicationTypeMeta,
} from "@/lib/content/publications";
import { serviceSearchText } from "@/lib/content/services";
import { getContent } from "@/lib/content/source";
import { MAX_QUERY_LENGTH, matchesAll, queryWords } from "@/lib/search";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Result = { key: string; label: string; title: string; excerpt: string; href: string };
type Group = { id: "services" | "industries" | "insights"; heading: string; results: Result[] };

const TYPE_FILTERS = [
  { id: "", label: "All results" },
  { id: "services", label: "Services" },
  { id: "industries", label: "Industries" },
  { id: "insights", label: "Insights" },
] as const;

// Services shown before a term is entered (final screens).
const SUGGESTED_SERVICES = ["S26", "S09", "S10", "S19"];

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

// Search result pages are never indexed (guide p.161).
export const metadata: Metadata = {
  title: "Search",
  description: "Search services, industries and insights.",
  robots: { index: false, follow: true },
};

/** Searches only approved, published content; never enquiries or subscriber records (guide p.23). */
async function runSearch(query: string): Promise<Group[]> {
  const words = queryWords(query);
  if (words.length === 0) return [];

  const content = await getContent();
  const publicServices = content.publicServices();
  const services: Result[] = publicServices
    .filter((s) => matchesAll(serviceSearchText(s, content.serviceDetail(s.id)), words))
    .map((s) => ({
      key: s.id,
      label: "Service",
      title: s.title,
      excerpt: s.summary,
      href: `/services/${s.slug}`,
    }));

  const industries: Result[] = content
    .publicIndustries()
    .filter((i) => matchesAll(`${i.name} ${i.summary} ${i.intro ?? ""} ${(i.workAreas ?? []).map((w) => w.title).join(" ")}`, words))
    .map((i) => ({ key: i.slug, label: "Industry", title: i.name, excerpt: i.summary, href: `/industries/${i.slug}` }));

  const insights: Result[] = [
    ...content
      .publicPublications()
      .filter((p) => matchesAll(publicationSearchText(p, publicServices), words))
      .map((p) => ({
        key: `${p.type}-${p.slug}`,
        label: `${publicationTypeMeta[p.type].label}${p.preview ? " / Layout preview" : ""}`,
        title: p.title,
        excerpt: p.summary,
        href: publicationHref(p),
      })),
    // Newsletter issues are searchable too (guide p.23).
    ...content
      .publicIssues()
      .filter((issue) => matchesAll(`${issue.title} ${issue.focus} ${issue.introduction} ${issue.contents.join(" ")}`, words))
      .map((issue) => ({
        key: `issue-${issue.slug}`,
        label: `Newsletter issue${issue.preview ? " / Layout preview" : ""}`,
        title: issue.title,
        excerpt: issue.introduction,
        href: `/newsletters/${issue.slug}`,
      })),
  ];

  return [
    { id: "services", heading: "Services", results: services },
    { id: "industries", heading: "Industries", results: industries },
    { id: "insights", heading: "Insights", results: insights },
  ];
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = first(params.q).trim().slice(0, MAX_QUERY_LENGTH);
  const typeParam = first(params.type);
  const type = TYPE_FILTERS.some((t) => t.id === typeParam) ? typeParam : "";

  const words = queryWords(query);
  const groups = await runSearch(query);
  const suggested = query ? [] : (await getContent()).publicServices().filter((s) => SUGGESTED_SERVICES.includes(s.id));
  const total = groups.reduce((n, g) => n + g.results.length, 0);
  const shown = groups.filter((g) => (!type || g.id === type) && g.results.length > 0);

  const typeHref = (id: string) => {
    const qs = new URLSearchParams();
    if (query) qs.set("q", query);
    if (id) qs.set("type", id);
    const s = qs.toString();
    return s ? `/search?${s}` : "/search";
  };

  return (
    <>
      <PageHero eyebrow="Search" title="Search RNK Legalheads" lead="Search services, industries and insights." />

      <div className="shell pb-16 pt-8 md:pb-24 md:pt-10">
        <Form action="/search" role="search" aria-label="Search the website" className="bg-warm p-5 md:p-8">
          {type && <input type="hidden" name="type" value={type} />}
          <div className="flex">
            <label htmlFor="site-search" className="sr-only">
              Search the website
            </label>
            <input
              key={query}
              id="site-search"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Search"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 border border-[#8a8782] bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal"
            />
            <button type="submit" className="btn btn-primary h-12 shrink-0 px-6">
              Search
            </button>
          </div>
          <ul aria-label="Result type" className="mt-4 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => {
              const active = t.id === type;
              return (
                <li key={t.label}>
                  <Link
                    href={typeHref(t.id)}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`inline-flex min-h-11 items-center border px-4 text-[13px] md:min-h-9 md:px-3 md:text-[12px] ${
                      active ? "border-charcoal bg-charcoal text-white" : "border-[#8a8782] bg-canvas hover:border-charcoal"
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Form>

        {!query ? (
          suggested.length > 0 && (
            <section aria-labelledby="suggested-title" className="mt-12">
              <h2 id="suggested-title" className="section-title">
                Explore our services
              </h2>
              <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
                {suggested.map((service) => (
                  <li key={service.id}>
                    <ServiceCard service={service} />
                  </li>
                ))}
              </ul>
            </section>
          )
        ) : (
          <>
            <p role="status" aria-live="polite" className="mt-8 text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
              {total} {total === 1 ? "result" : "results"} for “{query}”
            </p>

            {shown.length === 0 ? (
              <div className="mt-6 border border-line bg-warm px-6 py-10 md:px-10">
                <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
                <h2 className="mt-5 font-serif text-[24px] leading-[32px]">No results match your search.</h2>
                <p className="mt-2 text-[15px] text-muted">Try a different term or explore our services.</p>
                <Link href="/services" className="btn btn-primary mt-6">
                  Explore services
                </Link>
              </div>
            ) : (
              shown.map((group) => (
                <section key={group.id} aria-labelledby={`results-${group.id}`} className="mt-10">
                  <h2 id={`results-${group.id}`} className="font-serif text-[24px] leading-[32px]">
                    {group.heading} <span className="text-[15px] text-muted">({group.results.length})</span>
                  </h2>
                  <ul className="mt-2">
                    {group.results.map((result) => (
                      <li key={result.key}>
                        <Link href={result.href} className="group flex items-start justify-between gap-6 border-b border-line py-5">
                          <span>
                            <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">{result.label}</span>
                            <span className="mt-2 block font-serif text-[20px] leading-[28px] group-hover:text-action">
                              <Highlight text={result.title} words={words} />
                            </span>
                            <span className="mt-1 block text-[14px] leading-[22px] text-muted">
                              <Highlight text={result.excerpt} words={words} />
                            </span>
                            <span className="mt-3 block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                              {result.label === "Service" ? "View service" : result.label === "Industry" ? "Explore industry" : "Read more"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
}
