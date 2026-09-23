import Breadcrumb, { type Crumb } from "@/components/ui/Breadcrumb";

type PageHeroProps = {
  breadcrumb: Crumb[];
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
};

/** Warm page hero used by inner pages: breadcrumb, eyebrow, one H1 and a short lead (guide p.25, p.30). */
export default function PageHero({ breadcrumb, eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="bg-warm">
      <div className="shell pb-12 pt-6 md:pb-14 md:pt-8">
        <Breadcrumb items={breadcrumb} />
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-5 max-w-[860px] font-serif text-[40px] font-normal leading-[44px] tracking-[-0.02em] md:text-[54px] md:leading-[59px]">
          {title}
        </h1>
        {lead && <p className="mt-5 max-w-[640px] text-muted">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
