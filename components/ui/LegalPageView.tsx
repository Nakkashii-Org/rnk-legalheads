import type { Metadata } from "next";
import Link from "next/link";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { isApproved, legalPages, type LegalPage } from "@/lib/content/legal";
import { getContent } from "@/lib/content/source";
import { showDrafts } from "@/lib/visibility";

/** Pages are indexed only once every section is approved and dated. */
export function legalMetadata(page: LegalPage): Metadata {
  return {
    title: page.title,
    description: page.lead,
    alternates: { canonical: page.path },
    robots: isApproved(page) ? undefined : { index: false, follow: true },
  };
}

/** G01–G03 reading layout (guide p.138). */
export default async function LegalPageView({ page }: { page: LegalPage }) {
  const { contactDetails } = await getContent();
  const approved = isApproved(page);
  const others = legalPages.filter((p) => p.path !== page.path);

  return (
    <>
      <PageHero breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} eyebrow="Legal information" title={page.title} lead={page.lead}>
        {page.effectiveDate && <p className="mt-6 text-[14px] text-muted">Effective from {page.effectiveDate}</p>}
      </PageHero>

      <div className="shell grid grid-cols-1 gap-12 py-12 md:py-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        {(approved || showDrafts) && (
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">On this page</p>
              <ul className="mt-3 space-y-1 border-l border-line">
                {page.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-[14px] leading-[20px] hover:border-rnk hover:text-action">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        <article className="max-w-[720px] lg:col-start-2">
          {!approved && (
            <div className="border-l-2 border-rnk bg-warm px-5 py-4">
              <p className="font-bold">This {page.shortTitle} is being finalised.</p>
              <p className="mt-1 text-[15px] text-muted">
                The approved text will be published here.
                {contactDetails.email && (
                  <>
                    {" "}
                    Until then, questions can be sent to{" "}
                    <a href={`mailto:${contactDetails.email}`} className="text-charcoal underline underline-offset-4">
                      {contactDetails.email}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          )}

          {showDrafts && !approved && (
            <DraftNote className="mt-6">
              Review mode. The guide forbids generic placeholder policies (p.138): each section below lists only what the
              firm&apos;s approved text must cover. The public site shows the notice above until every section is approved
              and an effective date is set.
            </DraftNote>
          )}

          {(approved || showDrafts) &&
            page.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-10 border-t border-line pt-8">
                <h2 id={`${s.id}-title`} className="font-serif text-[24px] leading-[32px]">
                  {i + 1}. {s.heading}
                </h2>
                {s.text.length > 0 ? (
                  s.text.map((p) => (
                    <p key={p} className="mt-4">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="mt-3 text-[15px] text-muted">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-action">Awaiting approved text · </span>
                    Must cover: {s.covers}
                  </p>
                )}
              </section>
            ))}

          <p className="mt-12 border-t border-line pt-6 text-[14px] text-muted">
            See also:{" "}
            {others.map((o, i) => (
              <span key={o.path}>
                {i > 0 && " · "}
                <Link href={o.path} className="text-charcoal underline underline-offset-4">
                  {o.title}
                </Link>
              </span>
            ))}
          </p>
        </article>
      </div>
    </>
  );
}
