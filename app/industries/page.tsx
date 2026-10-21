import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content/source";

const LEAD =
  "Industry context helps define the legal work. Explore the transactions, intellectual property, contracts and disputes relevant to your sector.";

export const metadata: Metadata = {
  title: "Industries",
  description: LEAD,
  alternates: { canonical: "/industries" },
};

export default async function IndustriesPage() {
  const content = await getContent();
  const industries = content.allIndustries();

  return (
    <>
      <PageHero breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries" }]} eyebrow="Sector perspectives" title="Industries" lead={LEAD} />

      <section aria-label="Sectors" className="shell py-14 md:py-20">
        <ul className="grid gap-x-8 md:grid-cols-2">
          {industries.map((industry) => {
            const body = (
              <>
                <span className="block font-serif text-[22px] leading-[30px] group-hover:text-action">{industry.name}</span>
                <span className="mt-3 block text-[14px] leading-[22px] text-muted">{industry.summary}</span>
              </>
            );
            // Finished sector pages get a link; unfinished cards must not link to an empty page.
            return content.isPublic(industry) ? (
              <li key={industry.slug}>
                <Link href={`/industries/${industry.slug}`} className="group block h-full border-t border-line pb-10 pt-6">
                  {body}
                  <span className="mt-4 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                    Explore industry
                  </span>
                </Link>
              </li>
            ) : (
              <li key={industry.slug} className="border-t border-line pb-10 pt-6">
                {body}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
