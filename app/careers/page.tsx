import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "@/components/careers/ApplicationForm";
import ApplicationNotes from "@/components/careers/ApplicationNotes";
import Arrow from "@/components/ui/Arrow";
import PageHero from "@/components/ui/PageHero";
import { GENERAL_POSITIONS } from "@/lib/career-form";
import { getContent } from "@/lib/content/source";

const LEAD =
  "Current opportunities are listed here when positions are open. Each listing explains the role, qualifications and application process.";

export const metadata: Metadata = {
  title: "Careers",
  description: LEAD,
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const jobs = (await getContent()).openJobs();
  // Real open roles first, then the general positions. Layout previews are never applied for.
  const positions = [
    ...jobs.filter((job) => !job.preview).map((job) => ({ value: job.slug, label: `${job.title} (${job.jobId})` })),
    ...GENERAL_POSITIONS,
  ];

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        eyebrow="Careers"
        title="Careers at RNK Legalheads"
        lead={LEAD}
      />

      <section aria-labelledby="opportunities-title" className="shell py-14 md:py-20">
        <h2 id="opportunities-title" className="section-title">
          Current opportunities
        </h2>

        {jobs.length === 0 ? (
          <p className="mt-6 max-w-[620px] border-t border-line pt-6 text-muted">
            There are no current vacancies listed. Please check this page for future opportunities, or{" "}
            <a href="#apply" className="text-charcoal underline underline-offset-4 hover:text-action">
              send us your CV
            </a>
            .
          </p>
        ) : (
          <ul className="mt-8">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/careers/${job.slug}`} className="group grid gap-2 border-t border-line py-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">
                      {job.practice} / {job.location}
                      {job.preview && " / Layout preview"}
                    </span>
                    <span className="mt-2 block font-serif text-[22px] leading-[30px] group-hover:text-action">{job.title}</span>
                    <span className="mt-2 block text-[14px] leading-[22px] text-muted">{job.summary}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                    View role <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="apply" aria-labelledby="apply-title" className="scroll-mt-24 border-t border-line bg-canvas">
        <div className="shell grid grid-cols-1 gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div>
            <h2 id="apply-title" className="section-title">
              Send us your CV
            </h2>
            <p className="mt-4 max-w-[620px] text-muted">
              Interested in joining RNK Legalheads? Share your details and resume. We will contact you if a suitable
              opportunity arises.
            </p>
            <div className="mt-10">
              <ApplicationForm positions={positions} />
            </div>
          </div>
          <ApplicationNotes />
        </div>
      </section>
    </>
  );
}
