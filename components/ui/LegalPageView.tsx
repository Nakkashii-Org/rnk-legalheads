import type { Metadata } from "next";
import Link from "next/link";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { legalPages, type LegalBlock, type LegalPage } from "@/lib/content/legal";
import { getContent } from "@/lib/content/source";
import type { ContactDetails } from "@/lib/content/types";

export function legalMetadata(page: LegalPage): Metadata {
  return { title: page.title, description: page.lead, alternates: { canonical: page.path } };
}

/** The Privacy Policy's grievance contact: the privacy contact from Site settings, and the firm's email and address. */
function GrievanceContact({ contact, name, drafts }: { contact: ContactDetails; name?: string; drafts: boolean }) {
  const rows: [string, React.ReactNode][] = [];
  if (name) rows.push(["Grievance / privacy contact", name]);
  if (contact.email)
    rows.push([
      "Email",
      <a key="e" href={`mailto:${contact.email}?subject=${encodeURIComponent("Privacy request")}`} className="underline underline-offset-4">
        {contact.email}
      </a>,
    ]);
  if (contact.address) rows.push(["Postal address", <span key="a" className="whitespace-pre-line">{contact.address}</span>]);
  return (
    <>
      <dl className="mt-4 border-t border-line text-[15px]">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-4">
            <dt className="text-muted">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {!name && drafts && (
        <DraftNote className="mt-4">
          Add the name or designation of the grievance / privacy contact in CMS → Site settings. It appears here once saved.
        </DraftNote>
      )}
    </>
  );
}

function Block({ block, contact, grievanceName, drafts }: { block: LegalBlock; contact: ContactDetails; grievanceName?: string; drafts: boolean }) {
  if (typeof block === "string") return <p className="mt-4">{block}</p>;
  if ("lead" in block)
    return (
      <p className="mt-4">
        <strong className="text-charcoal">{block.lead}</strong> {block.text}
      </p>
    );
  if ("list" in block)
    return (
      <ul className="mt-4 list-disc space-y-2 pl-5">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  if ("table" in block)
    return (
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px] leading-[22px]">
          <thead>
            <tr className="border-b border-charcoal">
              {block.table.head.map((h) => (
                <th key={h} scope="col" className="py-2 pr-4 align-bottom text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row) => (
              <tr key={row[0]} className="border-b border-line align-top">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="py-3 pr-4 font-bold">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="py-3 pr-4">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return <GrievanceContact contact={contact} name={grievanceName} drafts={drafts} />;
}

/** G01–G04 reading layout (guide p.138): the firm's approved text, word for word. */
export default async function LegalPageView({ page }: { page: LegalPage }) {
  const content = await getContent();
  const { contactDetails, site } = content;
  const others = legalPages.filter((p) => p.path !== page.path);
  const blockProps = { contact: contactDetails, grievanceName: site.grievanceContact, drafts: content.drafts };

  return (
    <>
      <PageHero breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} eyebrow="Legal information" title={page.title} lead={page.lead}>
        <p className="mt-6 text-[14px] text-muted">Last updated: {page.lastUpdated}</p>
      </PageHero>

      <div className={`shell grid grid-cols-1 gap-12 py-12 md:py-16 ${page.sections.length ? "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16" : ""}`}>
        {page.sections.length > 0 && (
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">On this page</p>
              <ol className="mt-3 space-y-1 border-l border-line">
                {page.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-[14px] leading-[20px] hover:border-rnk hover:text-action">
                      {i + 1}. {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <article className={`max-w-[760px] ${page.sections.length ? "lg:col-start-2" : ""}`}>
          {page.intro.map((b, i) => (
            <Block key={i} block={b} {...blockProps} />
          ))}

          {page.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-10 scroll-mt-28 border-t border-line pt-8">
              <h2 id={`${s.id}-title`} className="font-serif text-[24px] leading-[32px]">
                {i + 1}. {s.heading}
              </h2>
              {s.blocks.map((b, j) => (
                <Block key={j} block={b} {...blockProps} />
              ))}
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
