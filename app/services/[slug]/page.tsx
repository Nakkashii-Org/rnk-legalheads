import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceCard from "@/components/services/ServiceCard";
import Arrow from "@/components/ui/Arrow";
import PageHero from "@/components/ui/PageHero";
import { serviceDetails } from "@/lib/content/service-details";
import { getPublicService, getPublicServices, getServiceGroup } from "@/lib/content/services";

type Params = Promise<{ slug: string }>;

// Only approved (or, in draft review, all) services get a page; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const service = getPublicService((await params).slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const service = getPublicService((await params).slug);
  const detail = service && serviceDetails[service.id];
  if (!service || !detail) notFound();

  const group = getServiceGroup(service.group);
  const publicServices = getPublicServices();
  const related = detail.related
    .map((id) => publicServices.find((s) => s.id === id))
    .filter((s) => s !== undefined);
  // Approved publications tagged to this service arrive with the CMS (Step 8).
  const insights: { title: string; href: string }[] = [];

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "scope", label: "Scope of work" },
    ...(related.length > 0 ? [{ id: "related", label: "Related services" }] : []),
    { id: "insights", label: "Insights" },
  ];

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
        eyebrow={group.name}
        title={service.title}
        lead={service.summary}
      >
        {!service.approved && (
          <p className="mt-6 max-w-[640px] border-l-2 border-rnk bg-canvas px-4 py-3 text-[13px] leading-5 text-muted">
            {service.hold
              ? "Publication hold: written legal and ethics clearance is required before this page can be published."
              : "Draft: awaiting practice-owner and legal approval. Visible only in draft review mode."}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href={`/contact?service=${service.slug}`} className="btn btn-primary">
            Contact the team <Arrow />
          </Link>
          <Link href={`/insights?service=${service.slug}`} className="link-action">
            Related insights <Arrow />
          </Link>
        </div>
      </PageHero>

      {/* In-page links (guide p.30) */}
      <nav aria-label="On this page" className="shell">
        <ul className="-mx-[var(--gutter)] flex gap-7 overflow-x-auto whitespace-nowrap border-b border-line px-[var(--gutter)] md:mx-0 md:px-0">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="inline-flex min-h-12 items-center text-[13px] font-bold hover:text-action">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="overview" aria-labelledby="overview-title" className="shell pt-10 md:pt-14">
        <h2 id="overview-title" className="sr-only">
          Overview
        </h2>
        <p className="max-w-[780px]">{detail.overview}</p>
      </section>

      <section id="scope" aria-labelledby="scope-title" className="shell pb-16 pt-12 md:pb-24 md:pt-16">
        <h2 id="scope-title" className="section-title">
          Scope of work
        </h2>
        <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {detail.scope.map((area) => (
            <li key={area.title} className="border-t border-line pb-6 pt-4">
              <h3 className="text-[15px] font-bold leading-[22px]">{area.title}</h3>
              <p className="mt-2 text-[14px] leading-[22px] text-muted">{area.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section id="related" aria-labelledby="related-title" className="bg-warm">
          <div className="shell py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-title" className="section-title">
                Related services
              </h2>
              <Link href="/services" className="link-action">
                All services <Arrow />
              </Link>
            </div>
            <ul className="mt-8 grid gap-x-8 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ServiceCard service={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* People section stays hidden until approved profiles exist (guide p.30). */}

      <section id="insights" aria-labelledby="insights-title" className="shell py-14 md:py-20">
        <h2 id="insights-title" className="section-title">
          Insights
        </h2>
        {insights.length > 0 ? (
          <ul className="mt-8 grid gap-x-8 md:grid-cols-3">
            {insights.map((item) => (
              <li key={item.href} className="border-t border-line pt-5">
                <Link href={item.href} className="font-serif text-[21px] leading-[28px] hover:text-action">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-muted">No publications are tagged to this service yet.</p>
            <Link href="/insights" className="link-action">
              Browse all insights <Arrow />
            </Link>
          </div>
        )}
      </section>

      {/* One restrained contact action with the service pre-selected (guide p.30) */}
      <section aria-labelledby="contact-title" className="border-t border-line">
        <div className="shell flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center md:py-16">
          <div className="max-w-[620px]">
            <h2 id="contact-title" className="font-serif text-[26px] leading-[34px] md:text-[30px] md:leading-[38px]">
              Contact the team
            </h2>
            <p className="mt-2 text-[15px] leading-[24px] text-muted">
              Share your contact details and a brief, non-confidential description of the subject. Sending an
              enquiry does not create a lawyer-client relationship.
            </p>
          </div>
          <Link href={`/contact?service=${service.slug}`} className="btn btn-primary shrink-0">
            Contact the team <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
