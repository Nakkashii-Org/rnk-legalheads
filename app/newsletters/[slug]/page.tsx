import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicationCard from "@/components/insights/PublicationCard";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { getPublicIssue, getPublicIssues, issuePublications } from "@/lib/content/newsletters";
import { formatDate } from "@/lib/content/publications";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicIssues().map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const issue = getPublicIssue((await params).slug);
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
  const issue = getPublicIssue((await params).slug);
  if (!issue) notFound();

  const all = getPublicIssues();
  const index = all.findIndex((i) => i.slug === issue.slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index < all.length - 1 ? all[index + 1] : undefined;
  const items = issuePublications(issue);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Newsletters", href: "/newsletters" }, { label: issue.title }]}
        eyebrow={issue.preview ? "Newsletter / Issue preview" : `Newsletter / ${formatDate(issue.issueDate)}`}
        title={issue.title}
        lead={issue.introduction}
      >
        {issue.preview && <DraftNote className="mt-6">Preview edition. No campaign has been created or sent.</DraftNote>}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/subscribe" className="btn btn-primary">
            Subscribe <Arrow />
          </Link>
          <Link href="/newsletters" className="link-action">
            All issues <Arrow />
          </Link>
        </div>
      </PageHero>

      <section aria-labelledby="in-this-issue" className="shell grid gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <h2 id="in-this-issue" className="section-title">
            In this issue
          </h2>
          <p className="mt-4 max-w-[460px] text-muted">
            Each item below links to the complete article, judgment note or legal update on our website.
          </p>
        </div>
        <ol>
          {issue.contents.map((section, i) => (
            <li key={section} className="flex min-h-12 items-center gap-4 border-t border-line text-[15px] last:border-b">
              <span className="text-[13px] font-bold tabular-nums text-rnk">{String(i + 1).padStart(2, "0")}</span>
              {section}
            </li>
          ))}
        </ol>
      </section>

      {items.length > 0 && (
        <section aria-label="Publications in this issue" className="shell pb-14 md:pb-20">
          <ul className="grid gap-x-8 md:grid-cols-3">
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
    </>
  );
}
