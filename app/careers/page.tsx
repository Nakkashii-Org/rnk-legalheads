import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import PageHero from "@/components/ui/PageHero";
import { getOpenJobs } from "@/lib/content/jobs";

const LEAD =
  "Current opportunities are listed here when positions are open. Each listing explains the role, qualifications and application process.";

export const metadata: Metadata = {
  title: "Careers",
  description: LEAD,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  const jobs = getOpenJobs();

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
            There are no current vacancies listed. Please check this page for future opportunities.
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
    </>
  );
}
