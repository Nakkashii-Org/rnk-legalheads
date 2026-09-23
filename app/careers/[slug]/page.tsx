import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { getPublicJob, getPublicJobs, type Job } from "@/lib/content/jobs";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicJobs().map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const job = getPublicJob((await params).slug);
  if (!job) return {};
  return {
    title: job.title,
    description: job.summary,
    alternates: { canonical: `/careers/${job.slug}` },
    robots: job.preview || job.status === "closed" ? { index: false, follow: true } : undefined,
  };
}

/** JobPosting data only for real, open, approved roles (guide p.137). */
function jobPostingJsonLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    identifier: { "@type": "PropertyValue", name: "RNK Legalheads", value: job.jobId },
    datePosted: job.openedOn,
    validThrough: job.closesOn,
    hiringOrganization: { "@type": "Organization", name: "RNK Legalheads" },
    jobLocation: { "@type": "Place", address: job.location },
  };
}

export default async function JobPage({ params }: { params: Params }) {
  const job = getPublicJob((await params).slug);
  if (!job) notFound();

  const open = job.status === "open";
  const facts = [
    { label: "Reference", value: job.jobId },
    { label: "Location", value: job.location },
    { label: "Work arrangement", value: job.workArrangement },
    { label: "Experience", value: job.experience },
    { label: "Status", value: open ? "Open" : "Closed" },
    ...(job.closesOn ? [{ label: "Closing date", value: job.closesOn }] : []),
  ];

  return (
    <>
      {open && !job.preview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)).replace(/</g, "\\u003c") }}
        />
      )}

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }, { label: job.title }]}
        eyebrow="Careers"
        title={job.title}
        lead={job.summary}
      >
        {job.preview && <DraftNote className="mt-6">Vacancy layout only. Publish only real open roles with a job ID and application instructions.</DraftNote>}
        {open ? (
          <a href="#how-to-apply" className="btn btn-primary mt-8">
            Application instructions <Arrow />
          </a>
        ) : (
          <p className="mt-8 font-bold">This vacancy is closed and no longer accepting applications.</p>
        )}
      </PageHero>

      <section aria-labelledby="role-title" className="shell grid gap-10 py-14 md:grid-cols-[1fr_320px] md:gap-16 md:py-20">
        <div>
          <h2 id="role-title" className="section-title">
            The role
          </h2>
          <h3 className="mt-6 text-[15px] font-bold">Responsibilities</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-[15px] font-bold">Qualifications</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {job.qualifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {open && (
            <div id="how-to-apply" className="mt-12">
              <h2 className="section-title">How to apply</h2>
              <p className="mt-4 text-muted">{job.applicationInstructions}</p>
              {job.applicationEmail && (
                <a
                  href={`mailto:${job.applicationEmail}?subject=${encodeURIComponent(`Application: ${job.title} (${job.jobId})`)}`}
                  className="link-action mt-3"
                >
                  {job.applicationEmail} <Arrow />
                </a>
              )}
              <p className="mt-4 text-[14px] leading-[22px] text-muted">
                Please do not send identity documents or financial information at this stage. Information you
                provide is used for recruitment only, as described in our{" "}
                <Link href="/privacy-policy" className="underline underline-offset-4">
                  privacy notice
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        <dl className="h-fit bg-warm px-6 py-5 text-[14px] leading-[22px]">
          {facts.map((fact) => (
            <div key={fact.label} className="grid grid-cols-[120px_1fr] gap-4 border-b border-line py-2 last:border-b-0">
              <dt className="text-muted">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
