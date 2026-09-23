import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import Portrait from "@/components/people/Portrait";
import Arrow from "@/components/ui/Arrow";
import PageHero from "@/components/ui/PageHero";
import { filterPeople, getPublicPeople } from "@/lib/content/people";
import { getPublicServices } from "@/lib/content/services";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LEAD = "Our lawyers, their qualifications and their areas of practice.";

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  return {
    title: "People",
    description: LEAD,
    alternates: { canonical: "/people" },
    robots: first(params.q) || first(params.service) ? { index: false, follow: true } : undefined,
  };
}

export default async function PeoplePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const name = first(params.q).trim().slice(0, 80);
  const services = getPublicServices();
  const service = services.find((s) => s.slug === first(params.service));

  const people = getPublicPeople();
  const results = filterPeople(people, name, service?.id);
  const hasPreviews = people.some((person) => person.preview);
  // Only offer services that at least one listed person is linked to.
  const serviceOptions = services.filter((s) => people.some((person) => person.serviceIds.includes(s.id)));

  return (
    <>
      <PageHero breadcrumb={[{ label: "Home", href: "/" }, { label: "People" }]} eyebrow="The team" title="People" lead={LEAD} />

      <section aria-label="Lawyer directory" className="shell py-12 md:py-16">
        {people.length === 0 ? (
          // Truthful introduction until approved profiles are ready (guide p.117).
          <div className="max-w-[640px]">
            <h2 className="section-title">Lawyer profiles</h2>
            <p className="mt-4 text-muted">
              Profiles of our lawyers, including their qualifications and areas of practice, will be published here
              once they have been approved. In the meantime, the services directory describes the work offered across
              our practice groups.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link href="/services" className="btn btn-primary">
                Explore our services <Arrow />
              </Link>
              <Link href="/contact" className="link-action">
                Contact <Arrow />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Form action="/people" scroll={false} role="search" aria-label="Filter lawyers" className="flex flex-wrap items-end gap-3">
              <div className="flex min-w-[220px] flex-1 flex-col gap-1 sm:max-w-[320px]">
                <label htmlFor="people-name" className="text-[13px]">
                  Search by name
                </label>
                <input
                  key={name}
                  id="people-name"
                  name="q"
                  type="search"
                  defaultValue={name}
                  maxLength={80}
                  placeholder="Name"
                  className="h-12 border border-[#b9b5af] bg-canvas px-4 text-[15px] placeholder:text-muted focus:border-charcoal"
                />
              </div>
              {serviceOptions.length > 0 && (
                <div className="flex min-w-[220px] flex-1 flex-col gap-1 sm:max-w-[320px]">
                  <label htmlFor="people-service" className="text-[13px]">
                    Service
                  </label>
                  <select
                    key={service?.slug ?? "all"}
                    id="people-service"
                    name="service"
                    defaultValue={service?.slug ?? ""}
                    className="h-12 border border-[#b9b5af] bg-canvas px-3 text-[15px] focus:border-charcoal"
                  >
                    <option value="">All services</option>
                    {serviceOptions.map((s) => (
                      <option key={s.id} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button type="submit" className="btn btn-primary h-12">
                Search
              </button>
              {(name || service) && (
                <Link href="/people" scroll={false} className="link-action">
                  Clear filters
                </Link>
              )}
            </Form>

            <p role="status" aria-live="polite" className="mt-6 text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
              {results.length} {results.length === 1 ? "profile" : "profiles"}
              {hasPreviews && " / Profile layout only. Replace every placeholder with approved information."}
            </p>

            {results.length > 0 ? (
              <ul className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((person) => (
                  <li key={person.slug}>
                    <Link href={`/people/${person.slug}`} className="group block">
                      <Portrait person={person} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                      <span className="mt-4 block text-[11px] uppercase tracking-[0.14em] text-muted">{person.role}</span>
                      <span className="mt-2 block font-serif text-[21px] leading-[28px] group-hover:text-action">
                        {person.name}
                      </span>
                      <span className="mt-2 block text-[14px] leading-[22px] text-muted">{person.practiceSummary}</span>
                      <span className="mt-3 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                        View profile
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 border border-line bg-warm px-6 py-10 md:px-10">
                <h2 className="font-serif text-[24px] leading-[32px]">No profiles match your search.</h2>
                <p className="mt-2 text-[15px] text-muted">Try a different name or clear the filters.</p>
                <Link href="/people" scroll={false} className="btn btn-primary mt-6">
                  Clear filters
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
