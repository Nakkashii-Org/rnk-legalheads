import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import ContactCta from "@/components/ui/ContactCta";
import PageHero from "@/components/ui/PageHero";

// Copy from the guide's firm copy sheet (p.112). Do not add history, statistics or client names.
const LEAD =
  "Established in 2024, RNK Legalheads is a full-service law firm advising businesses, institutions and individuals. Our work covers transactions, disputes, taxation, regulation, intellectual property and private matters.";

const howWeWork = [
  {
    title: "Understand the matter",
    text: "We begin with the facts, the parties involved and the decision or assistance required. Conflict checks and engagement terms are addressed before substantive work begins.",
  },
  {
    title: "Define the scope",
    text: "We identify the work to be undertaken, the lawyers involved and the information needed. Any assumptions, exclusions or changes in scope are discussed.",
  },
  {
    title: "Keep the work clear",
    text: "We explain the legal position, record the advice and identify the steps that follow. The approach depends on the matter and the instructions received.",
  },
];

export const metadata: Metadata = {
  title: "The firm",
  description: LEAD,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "The firm" }]}
        eyebrow="About RNK Legalheads"
        title="The firm"
        lead={LEAD}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/services" className="btn btn-primary">
            Explore our services <Arrow />
          </Link>
          <Link href="/people" className="link-action">
            Meet our people <Arrow />
          </Link>
        </div>
      </PageHero>

      <section aria-labelledby="approach-title" className="shell grid gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-24">
        <h2 id="approach-title" className="section-title max-w-[340px]">
          A clear view of the matter.
        </h2>
        <p className="max-w-[540px] text-muted">
          We consider the legal questions raised by a matter together, rather than treating each issue in isolation.
          Where an engagement involves more than one area of law, the relevant lawyers work to an agreed scope and
          keep the client informed of the issues, options and next steps.
        </p>
      </section>

      <section aria-labelledby="how-title" className="bg-warm">
        <div className="shell py-14 md:py-20">
          <p className="eyebrow">How we work</p>
          <h2 id="how-title" className="sr-only">
            How we work
          </h2>
          <ol className="mt-8 grid gap-x-8 md:grid-cols-3">
            {howWeWork.map((step, i) => (
              <li key={step.title} className="border-t border-line pb-8 pt-5">
                <span className="text-[11px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-serif text-[21px] leading-[28px]">{step.title}</h3>
                <p className="mt-3 text-[14px] leading-[22px] text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Our people and services" className="shell grid gap-12 py-14 md:grid-cols-2 md:gap-16 md:py-24">
        <div>
          <h2 className="section-title">Our people</h2>
          <p className="mt-4 text-muted">
            Our lawyers&apos; profiles describe their qualifications, areas of practice and professional background.
            Experience gained before joining RNK is identified separately from the firm&apos;s own history.
          </p>
          <Link href="/people" className="link-action mt-3">
            Meet our people <Arrow />
          </Link>
        </div>
        <div>
          <h2 className="section-title">Our services</h2>
          <p className="mt-4 text-muted">
            The services directory explains the work offered across our practice groups. The scope of any
            individual engagement is confirmed after the firm has assessed the matter and can accept instructions.
          </p>
          <Link href="/services" className="link-action mt-3">
            Explore our services <Arrow />
          </Link>
        </div>
      </section>

      <ContactCta href="/contact" heading="Contact RNK Legalheads" label="Contact" />
    </>
  );
}
