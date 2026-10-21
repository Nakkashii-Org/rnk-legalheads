import type { Metadata } from "next";
import ContactForm, { type EnquiryContext } from "@/components/contact/ContactForm";
import OfficeMap from "@/components/contact/OfficeMap";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";
import { showDrafts } from "@/lib/visibility";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LEAD =
  "Please share your contact details and a brief, non-confidential description of the subject. We will assess whether we can assist before accepting instructions.";

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

  // Read only allowlisted values from the URL; otherwise the visitor picks a service ("Select a service").
  const requested = first(params.service);
  const initialService = services.some((s) => s.slug === requested) ? requested : "";

  const person = content.publicPerson(first(params.person));
  const industry = content.publicIndustry(first(params.industry));
  const context: EnquiryContext | undefined = person
    ? { kind: "person", slug: person.slug, label: person.name }
    : industry
      ? { kind: "industry", slug: industry.slug, label: industry.name }
      : undefined;

  // No telephone numbers are published: enquiries come through this form or by email.
  const hasDetails = Boolean(contactDetails.address || contactDetails.email);

  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact RNK Legalheads" lead={LEAD} />

      <div className="shell grid grid-cols-1 gap-12 py-12 md:py-16 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
        <aside aria-label="Contact information" className="space-y-8">
          <section aria-labelledby="office-title">
            <h2 id="office-title" className="font-serif text-[24px] leading-[32px]">
              New Delhi
            </h2>
            {hasDetails ? (
              <div className="mt-4 text-[15px] leading-[24px]">
                <p className="font-bold">RNK Legalheads LLP</p>
                {contactDetails.address && <address className="mt-1 whitespace-pre-line not-italic text-muted">{contactDetails.address}</address>}
                {contactDetails.email && (
                  <a href={`mailto:${contactDetails.email}`} className="mt-3 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-action md:min-h-0">
                    {contactDetails.email}
                  </a>
                )}
              </div>
            ) : showDrafts ? (
              <DraftNote className="mt-4 bg-warm">
                The firm must supply and verify the office address and enquiry email. Placeholder contact information must never go live.
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

          <p className="border-l-2 border-rnk pl-4 text-[14px] leading-[22px] text-muted">
            An enquiry does not confirm that RNK Legalheads LLP is acting for you. Please do not use this form to serve legal documents or rely
            on it for urgent filing, hearing or limitation deadlines.
          </p>
        </aside>

        <ContactForm
          key={`${initialService}-${context?.slug ?? ""}`}
          services={services}
          initialService={initialService}
          context={context}
          email={contactDetails.email}
        />
      </div>
    </>
  );
}
