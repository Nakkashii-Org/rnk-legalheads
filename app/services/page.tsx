import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import ServiceCard from "@/components/services/ServiceCard";
import PageHero from "@/components/ui/PageHero";
import { filterServices, findGroupByAlias, groupServices, type ServiceGroup } from "@/lib/content/services";
import { getContent } from "@/lib/content/source";
import { showDrafts } from "@/lib/visibility";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LEAD =
  "Our work covers intellectual property, transactions, disputes, taxation, projects and private matters. Select a service to read its scope and the related areas of practice.";

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
    // The canonical directory is /services; filtered variants are not indexed.
    robots: group || query ? { index: false, follow: true } : undefined,
  };
}

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const { group, query } = readFilters(await searchParams);
  const content = await getContent();
  const groups = content.publicGroups();
  const results = filterServices(content.publicServices(), group, query, content.serviceDetails);
  const sections = groupServices(results);

  const chips = [{ label: "All services", group: undefined as ServiceGroup | undefined }, ...groups.map((g) => ({ label: g.chip, group: g }))];

  return (
    <>
      <PageHero breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]} eyebrow="Our practice" title="Services" lead={LEAD} />

      <div className="shell pb-16 pt-10 md:pb-24 md:pt-12">
        <Form action="/services" scroll={false} role="search" aria-label="Search services" className="max-w-[680px]">
          {group && <input type="hidden" name="group" value={group.alias} />}
          <label htmlFor="directory-search" className="text-[13px] font-bold">
            Search a service or legal issue
          </label>
          <div className="mt-2 flex">
            <input
              key={query}
              id="directory-search"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={100}
              className="h-12 min-w-0 flex-1 border border-r-0 border-[#8a8782] bg-canvas px-4 text-[15px] focus:border-charcoal"
            />
            <button type="submit" className="h-12 shrink-0 border border-[#8a8782] bg-canvas px-6 text-[14px] font-bold hover:bg-warm">
              Search
            </button>
          </div>
        </Form>

        {/* Group chips: one destination each, the active one filled */}
        <nav aria-label="Service groups" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const active = chip.group?.key === group?.key;
              return (
                <li key={chip.label}>
                  <Link
                    href={directoryHref(chip.group, query)}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`inline-flex min-h-11 min-w-[104px] items-center border px-4 text-[13px] font-bold md:min-w-[110px] ${
                      active ? "border-charcoal bg-charcoal text-white" : "border-charcoal bg-canvas text-charcoal hover:bg-warm"
                    }`}
                  >
                    {chip.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p role="status" aria-live="polite" className="mt-6 text-[14px] text-muted">
          {results.length} {results.length === 1 ? "service" : "services"}
          {showDrafts && " / Draft catalogue"}
        </p>

        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.key} aria-labelledby={`group-${section.key}`} className="mt-10">
              <h2 id={`group-${section.key}`} className="font-serif text-[28px] leading-[36px] md:text-[32px] md:leading-[40px]">
                {section.name}
              </h2>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {section.services.map((service) => (
                  <li key={service.id}>
                    <ServiceCard service={service} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <div className="mt-8 border border-line bg-warm px-6 py-10 md:px-10">
            <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
            <h2 className="mt-5 font-serif text-[24px] leading-[32px]">No services match your search.</h2>
            <p className="mt-2 text-[15px] text-muted">Try another term or view all services.</p>
            <Link href="/services" scroll={false} className="btn btn-primary mt-6">
              View all services
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
