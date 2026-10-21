import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import PublicationCard from "@/components/insights/PublicationCard";
import NewsletterBand from "@/components/layout/NewsletterBand";
import { groupHref } from "@/lib/content/services";
import { heroSlides } from "@/lib/content/site";
import { getContent } from "@/lib/content/source";

const textLink = "inline-flex min-h-11 items-center text-[13px] font-bold underline decoration-1 underline-offset-[6px] hover:text-action md:min-h-0";

export default async function HomePage() {
  const content = await getContent();
  const groups = content.publicGroups();
  const publications = content.homePublications();
  const industries = content.homeIndustries();

  return (
    <>
      <HeroSlider slides={heroSlides} />

      {/* The firm: warm band directly after the hero */}
      <section aria-labelledby="firm-title" className="bg-warm">
        <div className="shell grid gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <p className="eyebrow">The firm</p>
            <h2 id="firm-title" className="section-title mt-5 max-w-[380px]">
              Legal matters seldom stand alone.
            </h2>
          </div>
          <div className="md:pt-10">
            <p className="max-w-[520px] text-muted">
              A business decision may involve contracts, intellectual property, financing and tax. A dispute may affect assets, operations and
              personal interests. We consider the connected issues so that the legal work reflects the matter as a whole.
            </p>
            <Link href="/about" className={`${textLink} mt-5`}>
              About RNK Legalheads
            </Link>
          </div>
        </div>
      </section>

      {/* Services: the six practice groups */}
      {groups.length > 0 && (
        <section id="services" aria-labelledby="services-title">
          <div className="shell py-14 md:py-24">
            <p className="eyebrow">Our services</p>
            <h2 id="services-title" className="section-title mt-5">
              Find the area relevant to you.
            </h2>

            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <li key={group.key}>
                  <Link href={groupHref(group)} className="group block h-full border-t border-line pb-10 pt-5">
                    <span className="block font-serif text-[21px] leading-[28px] group-hover:text-action">{group.name}</span>
                    <span className="mt-3 block text-[14px] leading-[22px] text-muted">{group.description}</span>
                    <span className="mt-4 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                      Explore services
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/services" className={textLink}>
              View all services
            </Link>
          </div>
        </section>
      )}

      {/* Insights: hidden when no published articles exist */}
      {publications.length > 0 && (
        <section id="insights" aria-labelledby="insights-title">
          <div className="shell pb-14 md:pb-24">
            <p className="eyebrow">Insights</p>
            <h2 id="insights-title" className="section-title mt-5">
              Analysis and practical perspectives.
            </h2>
            <ul className="mt-10 grid gap-x-8 md:grid-cols-3">
              {publications.map((item) => (
                <li key={`${item.type}-${item.slug}`}>
                  <PublicationCard publication={item} />
                </li>
              ))}
            </ul>
            <Link href="/insights" className={textLink}>
              View all insights
            </Link>
          </div>
        </section>
      )}

      {/* Industries */}
      {industries.length > 0 && (
        <section aria-labelledby="industries-title">
          <div className="shell pb-14 md:pb-24">
            <p className="eyebrow">Industries</p>
            <h2 id="industries-title" className="section-title mt-5">
              The context matters.
            </h2>
            <p className="mt-3 text-muted">Explore the contracts, rights and disputes relevant to your sector.</p>
            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link href={`/industries/${industry.slug}`} className="group block border-t border-line pb-8 pt-5">
                    <span className="block font-serif text-[20px] leading-[28px] group-hover:text-action">{industry.name}</span>
                    <span className="mt-2 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
                      Explore industry
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/industries" className={textLink}>
              Explore all industries
            </Link>
          </div>
        </section>
      )}

      <NewsletterBand />
    </>
  );
}
