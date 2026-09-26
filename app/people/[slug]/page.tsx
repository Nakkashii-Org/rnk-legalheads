import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Portrait from "@/components/people/Portrait";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getContent()).publicPeople().map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const person = (await getContent()).publicPerson((await params).slug);
  if (!person) return {};
  return {
    title: person.name,
    description: `${person.role}. ${person.practiceSummary}`,
    alternates: { canonical: `/people/${person.slug}` },
    robots: person.preview ? { index: false, follow: false } : undefined,
  };
}

export default async function PersonPage({ params }: { params: Params }) {
  const content = await getContent();
  const person = content.publicPerson((await params).slug);
  if (!person) notFound();

  const services = content.publicServices().filter((service) => person.serviceIds.includes(service.id));
  const facts = [
    { label: "Qualifications", value: person.qualifications },
    { label: "Enrolment", value: person.enrolment },
    { label: "Languages", value: person.languages },
    { label: "Office", value: person.office },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "People", href: "/people" }, { label: person.name }]}
        eyebrow={person.preview ? "People / Profile preview" : "People"}
        title={person.name}
        lead={`${person.role}. ${person.practiceSummary}`}
      >
        {person.preview && <DraftNote className="mt-6">Profile layout only. Replace every placeholder with approved information before publication.</DraftNote>}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href={`/contact?person=${person.slug}`} className="btn btn-primary">
            Contact <Arrow />
          </Link>
          <Link href="/people" className="link-action">
            All people <Arrow />
          </Link>
        </div>
      </PageHero>

      <section aria-labelledby="profile-title" className="shell grid gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <Portrait person={person} sizes="(min-width: 768px) 50vw, 100vw" />
        <div>
          <h2 id="profile-title" className="section-title">
            Professional profile
          </h2>
          <div className="mt-4 space-y-4 text-muted">
            {person.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {person.priorExperience && (
            <>
              <h3 className="mt-8 text-[15px] font-bold">Before RNK Legalheads</h3>
              <p className="mt-2 text-muted">{person.priorExperience}</p>
            </>
          )}

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-[130px_1fr] gap-x-6 gap-y-3 bg-warm px-6 py-5 text-[14px] leading-[22px]">
              {facts.map((fact) => (
                <div key={fact.label} className="contents">
                  <dt className="text-muted">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {services.length > 0 && (
            <>
              <h3 className="mt-8 text-[15px] font-bold">Areas of practice</h3>
              <ul className="mt-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/services/${service.slug}`} className="link-action">
                      {service.title} <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
