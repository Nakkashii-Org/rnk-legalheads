import type { Crumb } from "@/components/ui/Breadcrumb";

type PageHeroProps = {
  /** Kept for the page structure; the final screens show no visible breadcrumb. */
  breadcrumb?: Crumb[];
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
};

/** Warm page hero used by inner pages: eyebrow, one H1 and a short lead (final screens). */
export default function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="bg-warm">
      <div className="shell pb-12 pt-10 md:pb-14 md:pt-12">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-[860px] font-serif text-[40px] font-normal leading-[44px] tracking-[-0.02em] md:text-[54px] md:leading-[59px]">
          {title}
        </h1>
        {lead && <p className="mt-5 max-w-[640px] text-muted">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
