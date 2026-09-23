import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Arrow from "@/components/ui/Arrow";
import ContactCta from "@/components/ui/ContactCta";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { getPublicIndustries, getPublicIndustry } from "@/lib/content/industries";
import { getPublicServices } from "@/lib/content/services";

type Params = Promise<{ slug: string }>;

// Only approved sector pages exist; unfinished sectors are a 404 (guide p.115).
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicIndustries().map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const industry = getPublicIndustry((await params).slug);
  if (!industry) return {};
  return {
    title: industry.name,
    description: industry.summary,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Params }) {
  const industry = getPublicIndustry((await params).slug);
  if (!industry) notFound();

  const publicServices = getPublicServices();
  const related = industry.serviceIds
    .map((id) => publicServices.find((service) => service.id === id))
    .filter((service) => service !== undefined);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: industry.name }]}
        eyebrow="Industries"
        title={industry.name}
        lead={industry.intro ?? industry.summary}
      >
        <Link href={`/contact?industry=${industry.slug}`} className="btn btn-primary mt-8">
          Contact the team <Arrow />
        </Link>
      </PageHero>

      {industry.overview && (
        <section aria-label="Sector overview" className="shell pt-12 md:pt-16">
          <p className="max-w-[780px]">{industry.overview}</p>
        </section>
      )}

      {industry.workAreas && industry.workAreas.length > 0 && (
        <section aria-labelledby="work-areas-title" className="shell pt-12 md:pt-16">
          <h2 id="work-areas-title" className="section-title">
            Current legal work
          </h2>
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {industry.workAreas.map((area) => (
              <li key={area.title} className="border-t border-line pb-6 pt-4">
                <h3 className="text-[15px] font-bold leading-[22px]">{area.title}</h3>
                <p className="mt-2 text-[14px] leading-[22px] text-muted">{area.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="related-work-title" className="shell grid gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <h2 id="related-work-title" className="section-title">
            Related legal work
          </h2>
          <p className="mt-4 max-w-[440px] text-muted">
            Use the service pages to see the scope of each practice and the subjects covered.
          </p>
          {!industry.approved && (
            <DraftNote className="mt-6 bg-warm">
              Sector-specific introduction and evidence of experience require approval before publication.
            </DraftNote>
          )}
        </div>
        <ul>
          {related.map((service) => (
            <li key={service.id}>
              <Link href={`/services/${service.slug}`} className="group block border-t border-line py-5">
                <span className="flex items-start justify-between gap-4">
                  <span className="font-serif text-[20px] leading-[28px] group-hover:text-action">{service.title}</span>
                  <Arrow className="mt-1 text-rnk" />
                </span>
                <span className="mt-2 block text-[14px] leading-[22px] text-muted">{service.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta href={`/contact?industry=${industry.slug}`} />
    </>
  );
}
