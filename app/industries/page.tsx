import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import PageHero from "@/components/ui/PageHero";
import { industries } from "@/lib/content/industries";
import { getPublicServices } from "@/lib/content/services";
import { isPublic } from "@/lib/visibility";

const LEAD =
  "Sector context helps identify the legal questions that need to be considered together. Each industry page connects to the relevant services.";

export const metadata: Metadata = {
  title: "Industries",
  description: LEAD,
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  const publicServices = getPublicServices();

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        eyebrow="Sector perspectives"
        title="Industries"
        lead={LEAD}
      />

      <section aria-label="Sectors" className="shell py-14 md:py-20">
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => {
            const related = industry.serviceIds
              .map((id) => publicServices.find((service) => service.id === id))
              .filter((service) => service !== undefined)
              .slice(0, 3);
            const label = (
              <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">
                Sector / {String(i + 1).padStart(2, "0")}
              </span>
            );

            // Finished sector pages get a link; unfinished cards must not link to an empty page (p.115).
            if (isPublic(industry)) {
              return (
                <li key={industry.slug}>
                  <Link href={`/industries/${industry.slug}`} className="group block h-full border-t border-line pb-10 pt-5">
                    {label}
                    <span className="mt-3 flex items-start justify-between gap-4">
                      <span className="font-serif text-[21px] leading-[28px] group-hover:text-action">{industry.name}</span>
                      <Arrow className="mt-1 text-[18px] text-rnk" />
                    </span>
                    <span className="mt-3 block text-[14px] leading-[22px] text-muted">{industry.summary}</span>
                    <span className="mt-4 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                      View industry
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={industry.slug} className="border-t border-line pb-10 pt-5">
                {label}
                <h2 className="mt-3 font-serif text-[21px] leading-[28px]">{industry.name}</h2>
                <p className="mt-3 text-[14px] leading-[22px] text-muted">{industry.summary}</p>
                {related.length > 0 && (
                  <p className="mt-4 text-[13px] leading-[20px]">
                    <span className="text-muted">Related services: </span>
                    {related.map((service, j) => (
                      <span key={service.id}>
                        <Link href={`/services/${service.slug}`} className="underline underline-offset-4 hover:text-action">
                          {service.title}
                        </Link>
                        {j < related.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
