import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceCard from "@/components/services/ServiceCard";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ slug: string }>;

// Only approved sector pages exist; unfinished sectors are a 404.
// Unknown slugs render on request (then 404), so a signed-in staff preview can open unpublished drafts.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getContent()).publicIndustries().map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const industry = (await getContent()).publicIndustry((await params).slug);
  if (!industry) return {};
  return {
    title: industry.name,
    description: industry.summary,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Params }) {
  const content = await getContent();
  const industry = content.publicIndustry((await params).slug);
  if (!industry) notFound();

  const publicServices = content.publicServices();
  const related = industry.serviceIds.map((id) => publicServices.find((service) => service.id === id)).filter((service) => service !== undefined);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: industry.name }]}
        eyebrow="Industries"
        title={industry.name}
        lead={industry.intro ?? industry.summary}
      >
        <Link href={`/contact?industry=${industry.slug}`} className="btn btn-primary mt-8">
          Contact the Team
        </Link>
      </PageHero>

      {industry.overview && (
        <section aria-label="Sector overview" className="shell pt-12 md:pt-16">
          <p className="max-w-[780px] text-muted">{industry.overview}</p>
        </section>
      )}

      {industry.workAreas && industry.workAreas.length > 0 && (
        <section aria-labelledby="focus-title" className="shell pt-12 md:pt-16">
          <h2 id="focus-title" className="section-title">
            Areas of focus
          </h2>
          <ul className="mt-6 grid gap-x-8 md:grid-cols-2">
            {industry.workAreas.map((area) => (
              <li key={area.title} className="border-t border-line py-6">
                <h3 className="font-serif text-[20px] leading-[28px]">{area.title}</h3>
                {area.text && <p className="mt-2 text-[14px] leading-[22px] text-muted">{area.text}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="shell pb-16 pt-12 md:pb-24 md:pt-16">
          <h2 id="related-title" className="section-title">
            Related Services
          </h2>
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
