import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import Highlight from "@/components/ui/Highlight";
import PageHero from "@/components/ui/PageHero";
import { getPublicIssues } from "@/lib/content/newsletters";
import { getPublicPeople, personSearchText } from "@/lib/content/people";
import {
  getPublicPublications,
  publicationHref,
  publicationSearchText,
  publicationTypeMeta,
} from "@/lib/content/publications";
import { getPublicServices, getServiceGroup, serviceSearchText } from "@/lib/content/services";
import { MAX_QUERY_LENGTH, matchesAll, queryWords } from "@/lib/search";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Result = { key: string; label: string; title: string; excerpt: string; href: string };
type Group = { id: "services" | "people" | "insights"; heading: string; results: Result[] };

const TYPE_FILTERS = [
  { id: "", label: "All" },
  { id: "services", label: "Services" },
  { id: "people", label: "People" },
  { id: "insights", label: "Insights" },
] as const;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

// Search result pages are never indexed (guide p.161).
export const metadata: Metadata = {
  title: "Search",
  description: "Find a service, a lawyer or a publication.",
  robots: { index: false, follow: true },
};

/** Searches only approved, published content; never enquiries or subscriber records (guide p.23). */
function runSearch(query: string): Group[] {
  const words = queryWords(query);
  if (words.length === 0) return [];

  const services: Result[] = getPublicServices()
    .filter((s) => matchesAll(serviceSearchText(s), words))
    .map((s) => ({
      key: s.id,
      label: `Service / ${getServiceGroup(s.group).name}`,
      title: s.title,
      excerpt: s.summary,
      href: `/services/${s.slug}`,
    }));

  const people: Result[] = getPublicPeople()
    .filter((p) => matchesAll(personSearchText(p), words))
    .map((p) => ({ key: p.slug, label: `Person / ${p.role}`, title: p.name, excerpt: p.practiceSummary, href: `/people/${p.slug}` }));

  const insights: Result[] = [
    ...getPublicPublications()
      .filter((p) => matchesAll(publicationSearchText(p), words))
      .map((p) => ({
        key: `${p.type}-${p.slug}`,
        label: `${publicationTypeMeta[p.type].label}${p.preview ? " / Layout preview" : ""}`,
        title: p.title,
        excerpt: p.summary,
        href: publicationHref(p),
      })),
    // Newsletter issues are searchable too (guide p.23).
    ...getPublicIssues()
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
    { id: "people", heading: "People", results: people },
    { id: "insights", heading: "Insights", results: insights },
  ];
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = first(params.q).trim().slice(0, MAX_QUERY_LENGTH);
  const typeParam = first(params.type);
  const type = TYPE_FILTERS.some((t) => t.id === typeParam) ? typeParam : "";

  const words = queryWords(query);
  const groups = runSearch(query);
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
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Search RNK Legalheads" }]}
        eyebrow="Site search"
        title="Search RNK Legalheads"
        lead="Find a service, a lawyer or a publication."
      />

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
              placeholder="Search a service, lawyer or topic"
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
          <p className="mt-10 text-muted">Enter a term to search our services, people and publications.</p>
        ) : (
          <>
            <p role="status" aria-live="polite" className="mt-8 text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
              {total} {total === 1 ? "result" : "results"}
            </p>

            {shown.length === 0 ? (
              <div className="mt-6 border border-line bg-warm px-6 py-10 md:px-10">
                <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
                <h2 className="mt-5 font-serif text-[24px] leading-[32px]">No results found.</h2>
                <p className="mt-2 text-[15px] text-muted">Try a different term, or browse the services directory.</p>
                <Link href="/services" className="btn btn-primary mt-6">
                  Browse services <Arrow />
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
                          </span>
                          <Arrow className="mt-8 text-rnk" />
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
