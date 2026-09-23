import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import ServiceCard from "@/components/services/ServiceCard";
import PageHero from "@/components/ui/PageHero";
import {
  filterServices,
  findGroupByAlias,
  getPublicGroups,
  getPublicServices,
  type ServiceGroup,
} from "@/lib/content/services";
import { showDrafts } from "@/lib/visibility";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LEAD = "Our work covers advisory, transactional and contentious matters across the following areas of law.";

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function readFilters(params: Record<string, string | string[] | undefined>) {
  const group = findGroupByAlias(first(params.group));
  const query = first(params.q).trim().slice(0, 100);
  return { group, query };
}

function directoryHref(group: ServiceGroup | undefined, query: string): string {
  const params = new URLSearchParams();
  if (group) params.set("group", group.alias);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/services?${qs}` : "/services";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { group, query } = readFilters(await searchParams);
  return {
    title: "Services",
    description: LEAD,
    alternates: { canonical: "/services" },
    // Canonical directory is /services; filtered variants are not indexed (guide p.26).
    robots: group || query ? { index: false, follow: true } : undefined,
  };
}

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const { group, query } = readFilters(await searchParams);
  const groups = getPublicGroups();
  const results = filterServices(getPublicServices(), group, query);
  const filtered = Boolean(group || query);

  const tabs = [{ label: "All services", group: undefined as ServiceGroup | undefined }, ...groups.map((g) => ({ label: g.name, group: g }))];

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Areas of practice"
        title="Services"
        lead={LEAD}
      />

      <div className="shell grid grid-cols-1 gap-8 pb-16 pt-8 md:pb-24 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12 lg:pt-12">
        {/* Group filters: a scrolling tab row on small screens, a list on desktop */}
        <nav aria-label="Service groups" className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-6 whitespace-nowrap lg:flex-col lg:gap-0 lg:whitespace-normal">
            {tabs.map((tab) => {
              const active = tab.group?.key === group?.key;
              return (
                <li key={tab.label} className="lg:border-b lg:border-line">
                  <Link
                    href={directoryHref(tab.group, query)}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`relative flex min-h-11 items-center text-[13px] lg:min-h-[46px] ${
                      active
                        ? "font-bold text-action after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rnk lg:after:hidden"
                        : "text-charcoal hover:text-action"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <Form action="/services" scroll={false} role="search" aria-label="Search services" className="flex">
            {group && <input type="hidden" name="group" value={group.alias} />}
            <label htmlFor="directory-search" className="sr-only">
              Search a service or legal issue
            </label>
            <input
              key={query}
              id="directory-search"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={100}
              placeholder="Search a service or legal issue"
              className="h-12 min-w-0 flex-1 border border-[#b9b5af] bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal"
            />
            <button type="submit" className="btn btn-primary h-12 shrink-0 px-6">
              Search
            </button>
          </Form>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 text-[13px]">
            <span className="text-muted">View by group or search by name.</span>
            {filtered && (
              <Link href="/services" scroll={false} className="link-action min-h-11 text-[13px]">
                Clear filters
              </Link>
            )}
          </div>

          <p role="status" aria-live="polite" className="mt-2 text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
            {results.length} {results.length === 1 ? "service" : "services"}
            {group && ` / ${group.name}`}
            {showDrafts && " / Draft catalogue"}
          </p>

          {results.length > 0 ? (
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {results.map((service) => (
                <li key={service.id}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 border border-line bg-warm px-6 py-10 md:px-10">
              <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
              <h2 className="mt-5 font-serif text-[24px] leading-[32px]">No services match your search.</h2>
              <p className="mt-2 text-[15px] text-muted">Try a different term or clear the filters.</p>
              <Link href="/services" scroll={false} className="btn btn-primary mt-6">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
