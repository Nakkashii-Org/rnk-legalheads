import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicationCard from "@/components/insights/PublicationCard";
import ServiceCard from "@/components/services/ServiceCard";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { relatedNotes, serviceMaxims } from "@/lib/content/service-details";
import { getServiceGroup } from "@/lib/content/services";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ slug: string }>;

// Only approved (or, in draft review, all) services get a page; anything else is a 404.
// Unknown slugs render on request (then 404), so a signed-in staff preview can open unpublished drafts.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getContent()).publicServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const service = (await getContent()).publicService((await params).slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

/** Paragraphs of a text field, separated by blank lines. */
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export default async function ServicePage({ params }: { params: Params }) {
  const content = await getContent();
  const service = content.publicService((await params).slug);
  const detail = service && content.serviceDetail(service.id);
  if (!service || !detail) notFound();

  const group = getServiceGroup(service.group);
  const publicServices = content.publicServices();
  const related = detail.related.map((id) => publicServices.find((s) => s.id === id)).filter((s) => s !== undefined);
  const insights = content.publicationsForService(service.id);
  const maxim = serviceMaxims[service.id];

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "scope", label: "Scope of Work" },
    ...(related.length > 0 ? [{ id: "related", label: "Related Services" }] : []),
    { id: "insights", label: "Insights" },
  ];

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
        eyebrow={group?.name ?? "Services"}
        title={service.title}
        lead={service.summary}
      >
        {service.hold && (
          <DraftNote className="mt-6">
            Publication hold: written legal and ethics clearance is required before this page can be published.
          </DraftNote>
        )}
        <Link href={`/contact?service=${service.slug}`} className="btn btn-primary mt-8">
          Contact the Team
        </Link>
      </PageHero>

      <nav aria-label="On this page" className="shell">
        <ul className="-mx-[var(--gutter)] flex gap-10 overflow-x-auto whitespace-nowrap border-b border-line px-[var(--gutter)] md:mx-0 md:gap-16 md:px-0">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="inline-flex min-h-12 items-center text-[13px] font-bold hover:text-action">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="overview" aria-labelledby="overview-title" className="shell scroll-mt-28 pt-10 md:pt-14">
        <h2 id="overview-title" className="section-title">
          Overview
        </h2>
        <div className="mt-6 max-w-[780px] space-y-4 text-muted">
          {paragraphs(detail.overview).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {maxim && (
          <p className="mt-6 font-serif italic text-muted">
            {maxim.latin} · {maxim.english}
          </p>
        )}
      </section>

      <section id="scope" aria-labelledby="scope-title" className="shell scroll-mt-28 pt-12 md:pt-16">
        <h2 id="scope-title" className="section-title">
          Scope of Work
        </h2>
        <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {detail.scope.map((area) => (
            <li key={area.title} className="border-t border-line pb-6 pt-4">
              <h3 className="font-serif text-[18px] leading-[26px]">{area.title}</h3>
              {area.text && <p className="mt-2 text-[14px] leading-[22px] text-muted">{area.text}</p>}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section id="related" aria-labelledby="related-title" className="shell scroll-mt-28 pt-12 md:pt-16">
          <h2 id="related-title" className="section-title">
            Related Services
          </h2>
          <ul className="mt-8 grid gap-x-8 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <ServiceCard service={item} text={relatedNotes[`${service.id}:${item.id}`]} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="insights" aria-labelledby="insights-title" className="shell scroll-mt-28 pb-16 pt-12 md:pb-24 md:pt-16">
        <h2 id="insights-title" className="section-title">
          Insights
        </h2>
        {insights.length > 0 ? (
          <>
            <ul className="mt-8 grid gap-x-8 md:grid-cols-3">
              {insights.map((item) => (
                <li key={`${item.type}-${item.slug}`}>
                  <PublicationCard publication={item} />
                </li>
              ))}
            </ul>
            <Link href={`/insights?service=${service.slug}`} className="mt-6 inline-flex min-h-11 items-center text-[13px] font-bold underline underline-offset-[6px] hover:text-action">
              Related Insights
            </Link>
          </>
        ) : (
          <>
            <p className="mt-6 text-muted">No insights are currently available for this service.</p>
            <Link href="/insights" className="mt-4 inline-flex min-h-11 items-center text-[13px] font-bold underline underline-offset-[6px] hover:text-action">
              Browse all insights
            </Link>
          </>
        )}
      </section>
    </>
  );
}
