/** Centred confirmation / status box used by the contact and subscription flows (C02, L04–L08). */
export default function StatusPanel({
  title,
  children,
  actions,
  note,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <section className="shell py-16 md:py-24">
      <div className="mx-auto max-w-[640px] border border-line bg-warm px-6 py-10 md:px-12 md:py-14">
        <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
        {note}
        <h1 className="mt-6 font-serif text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">{title}</h1>
        <div className="mt-4 space-y-4 text-muted">{children}</div>
        {actions && <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">{actions}</div>}
      </div>
    </section>
  );
}
