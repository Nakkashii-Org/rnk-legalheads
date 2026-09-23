import Link from "next/link";
import ArticleActions from "@/components/insights/ArticleActions";
import PublicationCard from "@/components/insights/PublicationCard";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import {
  formatDate,
  getRelatedPublications,
  publicationTypeMeta,
  readingMinutes,
  updateStatusLabel,
  type BodyBlock,
  type Publication,
} from "@/lib/content/publications";
import { getPublicServices } from "@/lib/content/services";

function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Block({ block }: { block: BodyBlock }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 id={headingId(block.text)} className="mt-10 font-serif text-[26px] leading-[34px] first:mt-0">
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className="mt-6 text-[17px] font-bold leading-[26px]">{block.text}</h3>;
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-1 pl-5">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return <p className="mt-4">{block.text}</p>;
  }
}

/** Official source panel: judgment (J02) or legal update (U02). */
function SourcePanel({ p }: { p: Publication }) {
  if (p.type === "article") return null;
  const rows =
    p.type === "judgment"
      ? [
          { label: "Case", value: p.caseName },
          { label: "Court and case number", value: `${p.court}, ${p.caseNumber}` },
          { label: "Decision date", value: formatDate(p.decisionDate) ?? "Date of the decision" },
          { label: "Neutral citation", value: p.neutralCitation },
          { label: "Procedural position", value: p.proceduralStatus },
        ]
      : [
          { label: "Issuing authority", value: p.issuer },
          { label: "Instrument", value: p.instrument },
          { label: "Status", value: updateStatusLabel[p.status] },
          { label: "Published", value: formatDate(p.instrumentPublishedOn) },
          { label: "Effective date", value: formatDate(p.effectiveDate) },
        ];

  return (
    <div className="mb-10 bg-warm px-6 py-5">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-[14px] leading-[22px] sm:grid-cols-[180px_1fr]">
        {rows
          .filter((row) => row.value)
          .map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-muted">{row.label}</dt>
              <dd className="mb-2 sm:mb-0">{row.value}</dd>
            </div>
          ))}
      </dl>
      {p.officialSourceUrl && (
        <a href={p.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="link-action mt-2">
          Official source (opens in a new tab) <Arrow />
        </a>
      )}
    </div>
  );
}

function articleJsonLd(p: Publication) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.summary,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt ?? p.publishedAt,
    author: { "@type": "Person", name: p.author.name },
    publisher: { "@type": "Organization", name: "RNK Legalheads" },
  };
}

export default function PublicationDetail({ publication: p }: { publication: Publication }) {
  const meta = publicationTypeMeta[p.type];
  const services = getPublicServices().filter((s) => p.serviceIds.includes(s.id));
  const related = getRelatedPublications(p);
  const headings = p.body.filter((b): b is Extract<BodyBlock, { kind: "h2" }> => b.kind === "h2");
  const checkedAt = p.type !== "article" ? formatDate(p.sourceCheckedAt) : undefined;

  return (
    <>
      {!p.preview && p.publishedAt && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(p)).replace(/</g, "\\u003c") }}
        />
      )}

      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: meta.plural, href: meta.basePath },
          { label: p.title },
        ]}
        eyebrow={`${meta.label}${p.preview ? " / Preview" : ""}`}
        title={p.title}
        lead={p.summary}
      >
        {p.preview && (
          <DraftNote className="mt-6">Editorial template only. Replace with source-checked content before publication.</DraftNote>
        )}
      </PageHero>

      <div className="shell">
        <p className="border-b border-line py-4 text-[13px] leading-5 text-muted">
          <span>
            Author:{" "}
            {p.author.personSlug ? (
              <Link href={`/people/${p.author.personSlug}`} className="underline underline-offset-4 hover:text-charcoal">
                {p.author.name}
              </Link>
            ) : (
              p.author.name
            )}
          </span>
          <span aria-hidden="true"> / </span>
          <span>Published: {formatDate(p.publishedAt) ?? "set on approval"}</span>
          {p.updatedAt && (
            <>
              <span aria-hidden="true"> / </span>
              <span>Updated: {formatDate(p.updatedAt)}</span>
            </>
          )}
          {p.type === "article" && (
            <>
              <span aria-hidden="true"> / </span>
              <span>{readingMinutes(p)} min read</span>
            </>
          )}
        </p>
      </div>

      <div className="shell grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <article className="max-w-[720px]">
          <SourcePanel p={p} />
          {p.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          {p.type === "update" && p.updateNotes && p.updateNotes.length > 0 && (
            <section aria-labelledby="update-history" className="mt-12">
              <h2 id="update-history" className="font-serif text-[22px] leading-[30px]">
                Update history
              </h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-[22px] text-muted">
                {p.updateNotes.map((note) => (
                  <li key={`${note.date}-${note.note}`}>
                    <strong className="text-charcoal">{formatDate(note.date)}</strong>: {note.note}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="sources-title" className="mt-12 border-t border-line pt-6">
            <h2 id="sources-title" className="font-serif text-[22px] leading-[30px]">
              Sources
            </h2>
            <ul className="mt-3 space-y-2 text-[14px] leading-[22px]">
              {p.sources.map((source) => (
                <li key={source.label}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-action">
                      {source.label}
                    </a>
                  ) : (
                    <span className="text-muted">{source.label}</span>
                  )}
                </li>
              ))}
            </ul>
            {checkedAt && <p className="mt-3 text-[12px] text-muted">Checked against the official source on {checkedAt}.</p>}
          </section>
        </article>

        <aside aria-label="Article tools" className="lg:border-l lg:border-line lg:pl-10 print:hidden">
          <div className="lg:sticky lg:top-8">
            {/* Contents rail on desktop, only for longer pieces (guide p.121) */}
            {headings.length >= 3 && (
              <nav aria-label="On this page" className="mb-8 hidden lg:block">
                <p className="eyebrow">On this page</p>
                <ul className="mt-3">
                  {headings.map((h) => (
                    <li key={h.text}>
                      <a href={`#${headingId(h.text)}`} className="flex min-h-9 items-center text-[13px] hover:text-action">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {services.length > 0 && (
              <div className="mb-8">
                <p className="text-[14px] font-bold">Related services</p>
                <ul className="mt-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link href={`/services/${s.slug}`} className="inline-flex min-h-9 items-center gap-1.5 text-[13px] hover:text-action">
                        {s.title} <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ArticleActions />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-insights-title" className="bg-warm print:hidden">
          <div className="shell py-14 md:py-20">
            <h2 id="related-insights-title" className="section-title">
              Related insights
            </h2>
            <ul className="mt-8 grid gap-x-8 md:grid-cols-3">
              {related.map((item) => (
                <li key={`${item.type}-${item.slug}`}>
                  <PublicationCard publication={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
