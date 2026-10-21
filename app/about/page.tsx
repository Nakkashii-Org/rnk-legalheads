import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

// Copy from the final screens (/about). Do not add history, statistics or client names.
const howWeWork = [
  {
    title: "Understand the matter",
    text: "We identify the parties, the background and the assistance required. Conflict checks and engagement terms are addressed before substantive work begins.",
  },
  {
    title: "Define the scope",
    text: "We identify the work to be undertaken, the information needed and the responsibilities within the engagement. Changes in scope are discussed as the matter develops.",
  },
  {
    title: "Keep the work clear",
    text: "We explain the legal issues, record the advice and identify the next steps. The approach follows the facts and the instructions received.",
  },
];

export const metadata: Metadata = {
  title: "The firm",
  description:
    "Established in 2024, RNK Legalheads LLP is a New Delhi law firm advising businesses and individuals on intellectual property, corporate and commercial matters, disputes, taxation, projects and private matters.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero breadcrumb={[{ label: "Home", href: "/" }, { label: "The firm" }]} eyebrow="RNK Legalheads LLP" title="The firm" lead="Built on Trust, Driven by Commitment." />

      <section aria-labelledby="practice-title" className="shell pt-14 md:pt-20">
        <h2 id="practice-title" className="section-title">
          A connected legal practice.
        </h2>
        <div className="mt-6 max-w-[780px] space-y-4 text-muted">
          <p>
            Established in 2024, RNK Legalheads LLP is a New Delhi law firm advising businesses and individuals on intellectual property,
            corporate and commercial matters, disputes, taxation, projects and private matters.
          </p>
          <p>
            Our intellectual-property work spans protection, prosecution, ownership, commercialisation and enforcement. The wider practice
            includes civil and commercial litigation, criminal defence, arbitration, finance and recovery, real estate, family matters and
            succession.
          </p>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="shell pt-14 md:pt-20">
        <h2 id="approach-title" className="section-title">
          A clear view of the matter
        </h2>
        <p className="mt-6 max-w-[780px] text-muted">
          We begin with the facts, the relevant documents and the decision the client needs to make. Where several areas of law overlap, we
          consider their interaction when defining the work and advising on next steps.
        </p>
      </section>

      <section aria-labelledby="how-title" className="shell pt-14 md:pt-20">
        <h2 id="how-title" className="section-title">
          How we work
        </h2>
        <ol className="mt-8 grid gap-x-8 md:grid-cols-3">
          {howWeWork.map((step) => (
            <li key={step.title} className="border-t border-line pb-8 pt-5">
              <h3 className="font-serif text-[21px] leading-[28px]">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-[22px] text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Maxim" className="shell pb-14 pt-6 md:pb-20">
        <p className="font-serif text-[24px] italic leading-[32px]">Audi alteram partem</p>
        <p className="mt-2 text-muted">Hear the other side.</p>
      </section>

      <section aria-labelledby="services-cta-title" className="bg-warm">
        <div className="shell py-14 md:py-16">
          <h2 id="services-cta-title" className="section-title">
            Explore our services.
          </h2>
          <p className="mt-3 max-w-[640px] text-muted">
            Read the scope of our work across intellectual property, transactions, disputes, taxation, projects and private matters.
          </p>
          <Link href="/services" className="btn btn-primary mt-7">
            Explore services
          </Link>
        </div>
      </section>
    </>
  );
}
