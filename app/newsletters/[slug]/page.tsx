import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicationCard from "@/components/insights/PublicationCard";
import NewsletterBand from "@/components/layout/NewsletterBand";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ slug: string }>;

// Unknown slugs render on request (then 404), so a signed-in staff preview can open unpublished drafts.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getContent()).publicIssues().map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const issue = (await getContent()).publicIssue((await params).slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.introduction,
    alternates: { canonical: `/newsletters/${issue.slug}` },
    robots: issue.preview ? { index: false, follow: false } : undefined,
  };
}

/** A web issue. Reading it never subscribes anyone, and publishing it never sends email (guide p.128). */
export default async function NewsletterIssuePage({ params }: { params: Params }) {
  const content = await getContent();
  const issue = content.publicIssue((await params).slug);
  if (!issue) notFound();

  const all = content.publicIssues();
  const index = all.findIndex((i) => i.slug === issue.slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index < all.length - 1 ? all[index + 1] : undefined;
  const items = content.issuePublications(issue);

  return (
    <>
      <PageHero eyebrow={`${issue.focus}${issue.preview ? " / Issue preview" : ""}`} title={issue.title} lead={issue.introduction}>
        {issue.preview && <DraftNote className="mt-6">Preview edition. No campaign has been created or sent.</DraftNote>}
      </PageHero>

      {items.length > 0 && (
        <section aria-label="Publications in this issue" className="shell py-12 md:py-16">
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={`${p.type}-${p.slug}`}>
                <PublicationCard publication={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {(newer || older) && (
        <nav aria-label="Other issues" className="shell flex justify-between gap-6 border-t border-line py-8 text-[14px]">
          {older ? (
            <Link href={`/newsletters/${older.slug}`} className="link-action" rel="prev">
              <Arrow direction="left" /> {older.title}
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={`/newsletters/${newer.slug}`} className="link-action text-right" rel="next">
              {newer.title} <Arrow direction="right" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      <NewsletterBand
        heading="Stay connected."
        text="Choose the practice areas you wish to follow and receive future RNK Legalheads Insights by email."
      />
    </>
  );
}
