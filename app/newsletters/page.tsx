import type { Metadata } from "next";
import Link from "next/link";
import InsightsTabs from "@/components/insights/InsightsTabs";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";

const LEAD = "Selected reading from RNK Legalheads, bringing together articles and legal developments by subject.";

export const metadata: Metadata = {
  title: "Newsletters",
  description: LEAD,
  alternates: { canonical: "/newsletters" },
};

export default async function NewslettersPage() {
  const issues = (await getContent()).publicIssues();

  return (
    <>
      <PageHero eyebrow="Knowledge" title="Newsletters" lead={LEAD} />

      <div className="shell pb-16 pt-8 md:pb-24">
        <InsightsTabs current="/newsletters" />

        {issues.some((i) => i.preview) && (
          <p className="mt-6 border-l-2 border-rnk bg-warm px-4 py-3 text-[12px] leading-[18px] text-muted">
            Archive layout preview. Issue numbers and dates are assigned only to approved editions.
          </p>
        )}

        {issues.length === 0 ? (
          <div role="status" className="mt-10 border border-line bg-warm px-6 py-10 md:px-10">
            <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
            <h2 className="mt-5 font-serif text-[24px] leading-[32px]">Explore our articles.</h2>
            <p className="mt-2 max-w-[620px] text-[15px] text-muted">No newsletter issues are currently available.</p>
            <Link href="/articles" className="btn btn-primary mt-6">
              Browse articles
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link href={`/newsletters/${issue.slug}`} className="group block h-full border-t border-line pb-8 pt-5">
                  <span className="block text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
                    {issue.focus}
                    {issue.preview && " / Issue preview"}
                  </span>
                  <span className="mt-3 block font-serif text-[21px] leading-[28px] group-hover:text-action">{issue.title}</span>
                  <span className="mt-3 block text-[14px] leading-[22px] text-muted">{issue.contents[0] ?? issue.introduction}</span>
                  <span className="mt-4 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                    Read issue
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
