import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import Arrow from "@/components/ui/Arrow";
import { getHomeIndustries } from "@/lib/content/industries";
import { getHomePublications, publicationTypeMeta } from "@/lib/content/publications";
import { getPublicGroups, groupHref } from "@/lib/content/services";
import { heroSlides } from "@/lib/content/site";

export default function HomePage() {
  const groups = getPublicGroups();
  const publications = getHomePublications();
  const industries = getHomeIndustries();
  const hasPreviews = publications.some((item) => item.preview);

  return (
    <>
      <HeroSlider slides={heroSlides} />

      {/* Firm introduction: warm band directly after the hero (H01) */}
      <section aria-labelledby="firm-title" className="bg-warm">
        <div className="shell grid gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <p className="eyebrow">The firm</p>
            <h2 id="firm-title" className="section-title mt-5 max-w-[340px]">
              Legal matters seldom stand alone.
            </h2>
          </div>
          <div className="md:pt-10">
            <p className="max-w-[520px] text-muted">
              A transaction can raise tax, employment and regulatory questions. A dispute may affect a business,
              its assets and its people. Our work brings the relevant areas of law into the same conversation.
            </p>
            <Link href="/about" className="link-action mt-4">
              About RNK Legalheads <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* Services: seven groups, not forty cards (H04) */}
      {groups.length > 0 && (
        <section id="services" aria-labelledby="services-title">
          <div className="shell py-14 md:py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Our services</p>
                <h2 id="services-title" className="section-title mt-5">
                  Find the area relevant to you.
                </h2>
                <p className="mt-3 max-w-[520px] text-muted">
                  Explore our work across business, disputes, taxation, property, technology, regulation and
                  private matters.
                </p>
              </div>
              <Link href="/services" className="link-action shrink-0">
                View all services <Arrow />
              </Link>
            </div>

            <ul className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, i) => (
                <li key={group.key}>
                  <Link
                    href={groupHref(group)}
                    className="group block h-full border-t border-line pb-10 pt-5"
                  >
                    <span className="text-[11px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-2 flex items-start justify-between gap-4">
                      <span className="font-serif text-[21px] leading-[28px] group-hover:text-action">{group.name}</span>
                      <Arrow className="mt-1 text-[18px] text-rnk" />
                    </span>
                    <span className="mt-3 block text-[14px] leading-[22px] text-muted">
                      {group.services.slice(0, 3).map((service) => service.title).join(" / ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Insights: hidden when no approved publications exist (H05) */}
      {publications.length > 0 && (
        <section id="insights" aria-labelledby="insights-title" className="bg-warm">
          <div className="shell py-14 md:py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Insights</p>
                <h2 id="insights-title" className="section-title mt-5">
                  Analysis and legal updates.
                </h2>
                <p className="mt-3 text-muted">
                  Articles, case notes and legal updates from across our practice areas.
                </p>
              </div>
              <Link href="/insights" className="link-action shrink-0">
                View all insights <Arrow />
              </Link>
            </div>

            {hasPreviews && (
              <p className="mt-8 text-[11px] uppercase tracking-[0.14em] text-muted">
                Layout preview. Replace with approved publications before launch.
              </p>
            )}

            <ul className="mt-6 grid gap-x-8 gap-y-10 md:grid-cols-3">
              {publications.map((item) => {
                const meta = publicationTypeMeta[item.type];
                return (
                  <li key={item.href} className="border-t border-line pt-5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                      {meta.label}
                      {item.preview && " / Layout preview"}
                    </p>
                    <h3 className="mt-3 font-serif text-[21px] leading-[28px]">{item.title}</h3>
                    <p className="mt-3 text-[14px] leading-[22px] text-muted">{item.summary}</p>
                    <Link href={item.href} className="link-action mt-2">
                      {meta.action}
                      <span className="sr-only">: {item.title}</span> <Arrow />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Industries */}
      <section aria-labelledby="industries-title">
        <div className="shell py-14 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Industries</p>
              <h2 id="industries-title" className="section-title mt-5">
                The context matters.
              </h2>
              <p className="mt-3 text-muted">Explore the legal questions relevant to your sector.</p>
            </div>
            <Link href="/industries" className="link-action shrink-0">
              Explore industries <Arrow />
            </Link>
          </div>

          {industries.length > 0 && (
            <ul className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group flex min-h-16 items-center justify-between gap-4 border-t border-line py-4"
                  >
                    <span className="font-serif text-[18px] leading-[26px] group-hover:text-action">{industry.name}</span>
                    <Arrow className="text-rnk" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* People introduction: charcoal panel, no placeholder profiles (H06) */}
      <section aria-labelledby="people-title" className="on-dark bg-charcoal text-white">
        <div className="shell grid gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <p className="eyebrow">People</p>
            <h2 id="people-title" className="section-title mt-5 max-w-[320px]">
              The lawyers behind the advice.
            </h2>
          </div>
          <div className="md:pt-10">
            <p className="max-w-[440px] text-[#d8d6d2]">
              Read about our lawyers, their qualifications and their areas of practice.
            </p>
            <Link href="/people" className="btn mt-6 bg-white text-charcoal hover:bg-warm">
              Meet the team <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
