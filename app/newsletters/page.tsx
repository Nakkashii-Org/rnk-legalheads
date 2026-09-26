import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";
import { formatDate } from "@/lib/content/publications";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LEAD =
  "A collection of articles, judgment notes and legal updates selected by our team. Read each issue online or choose the subjects you would like to receive.";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const year = (await searchParams).year;
  return {
    title: "Newsletters",
    description: LEAD,
    alternates: { canonical: "/newsletters" },
    robots: year ? { index: false, follow: true } : undefined,
  };
}

export default async function NewslettersPage({ searchParams }: { searchParams: SearchParams }) {
  const all = (await getContent()).publicIssues();
  const years = [...new Set(all.map((i) => i.issueDate?.slice(0, 4)).filter((y): y is string => Boolean(y)))].sort().reverse();
  const raw = (await searchParams).year;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const year = requested && years.includes(requested) ? requested : undefined;
  const issues = year ? all.filter((i) => i.issueDate?.startsWith(year)) : all;

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Newsletters" }]}
        eyebrow="RNK Legalheads / Publications"
        title="Newsletters"
        lead={LEAD}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/subscribe" className="btn btn-primary">
            Subscribe <Arrow />
          </Link>
          <Link href="/preferences" className="link-action">
            Manage preferences <Arrow />
          </Link>
        </div>
      </PageHero>

      <section aria-labelledby="archive-title" className="shell py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="archive-title" className="section-title">
            Issue archive
          </h2>
          <Form action="/newsletters" scroll={false} className="flex items-center gap-2">
            <label htmlFor="archive-year" className="sr-only">
              Issue year
            </label>
            <select key={year ?? "all"} id="archive-year" name="year" defaultValue={year ?? ""} className="h-11 border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal">
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-secondary min-h-11 px-4">
              Show
            </button>
          </Form>
        </div>

        {all.some((i) => i.preview) && (
          <p className="mt-6 border-l-2 border-rnk bg-warm px-4 py-3 text-[12px] leading-[18px] text-muted">
            Archive layout preview. Issue numbers and dates are assigned only to approved editions.
          </p>
        )}

        {issues.length === 0 ? (
          <p role="status" className="mt-8 max-w-[620px] text-muted">
            No newsletter issues are published yet. Approved issues will appear here. You can{" "}
            <Link href="/subscribe" className="underline underline-offset-4 hover:text-action">
              subscribe
            </Link>{" "}
            to receive them by email.
          </p>
        ) : (
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link href={`/newsletters/${issue.slug}`} className="group block h-full border-t border-line pb-8 pt-5">
                  <span className="block text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
                    {issue.preview ? "Issue preview" : formatDate(issue.issueDate)} / {issue.focus}
                  </span>
                  <span className="mt-3 block font-serif text-[21px] leading-[28px] group-hover:text-action">{issue.title}</span>
                  <span className="mt-3 block text-[14px] leading-[22px] text-muted">{issue.introduction}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                    Read issue online <Arrow />
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
