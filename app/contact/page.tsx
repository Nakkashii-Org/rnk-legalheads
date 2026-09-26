import type { Metadata } from "next";
import ContactForm, { type EnquiryContext } from "@/components/contact/ContactForm";
import OfficeMap from "@/components/contact/OfficeMap";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { GENERAL_ENQUIRY } from "@/lib/contact-form";
import { getContent } from "@/lib/content/source";
import { showDrafts } from "@/lib/visibility";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LEAD = "Share your contact details and a brief, non-confidential description of the subject.";

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export const metadata: Metadata = {
  title: "Contact",
  description: LEAD,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const content = await getContent();
  const contactDetails = content.contactDetails;
  const services = content.publicServices().map((s) => ({ slug: s.slug, title: s.title }));

  // Read only allowlisted values from the URL; unknown slugs fall back to General enquiry (guide p.135).
  const requested = first(params.service);
  const initialService = services.some((s) => s.slug === requested) ? requested : GENERAL_ENQUIRY;

  const person = content.publicPerson(first(params.person));
  const industry = content.publicIndustry(first(params.industry));
  const context: EnquiryContext | undefined = person
    ? { kind: "person", slug: person.slug, label: person.name }
    : industry
      ? { kind: "industry", slug: industry.slug, label: industry.name }
      : undefined;

  const details = [
    { label: "Address", value: contactDetails.address },
    { label: "Telephone", value: contactDetails.phone },
    { label: "Email", value: contactDetails.email },
  ].filter((d): d is { label: string; value: string } => Boolean(d.value));

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact RNK Legalheads" }]}
        eyebrow="Contact"
        title="Contact RNK Legalheads"
        lead={LEAD}
      />

      <div className="shell grid grid-cols-1 gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <ContactForm key={`${initialService}-${context?.slug ?? ""}`} services={services} initialService={initialService} context={context} />

        <aside aria-label="Contact information" className="space-y-10">
          <section aria-labelledby="office-title">
            <h2 id="office-title" className="font-serif text-[24px] leading-[32px]">
              Office and contact details
            </h2>
            {details.length > 0 ? (
              <dl className="mt-4 space-y-3 text-[15px] leading-[24px]">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-[13px] text-muted">{d.label}</dt>
                    <dd>
                      {d.label === "Email" ? (
                        <a href={`mailto:${d.value}`} className="underline underline-offset-4 hover:text-action">
                          {d.value}
                        </a>
                      ) : d.label === "Telephone" ? (
                        <a href={`tel:${d.value.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4 hover:text-action">
                          {d.value}
                        </a>
                      ) : (
                        <address className="whitespace-pre-line not-italic">{d.value}</address>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : showDrafts ? (
              <DraftNote className="mt-4 bg-warm">
                The firm must supply and verify the office address, telephone number and enquiry email. Placeholder
                contact information must never go live.
              </DraftNote>
            ) : (
              <p className="mt-4 text-[15px] text-muted">Office contact details will be published here once verified.</p>
            )}
            {contactDetails.mapQuery && (
              <div className="mt-6">
                <OfficeMap query={contactDetails.mapQuery} />
              </div>
            )}
          </section>

          <section aria-labelledby="before-title">
            <h2 id="before-title" className="text-[16px] font-bold">
              Before sending
            </h2>
            <p className="mt-2 text-[14px] leading-[22px] text-muted">
              Do not send confidential documents, invention details or urgent procedural instructions. A professional
              engagement is confirmed separately after the firm agrees that it can act.
            </p>
            <p className="mt-3 text-[14px] leading-[22px] text-muted">
              Sending this form does not create a lawyer-client relationship or confirm that the firm is acting for
              you. Do not use it for urgent procedural deadlines.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
