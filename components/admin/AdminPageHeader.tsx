import Link from "next/link";

export type AdminCrumb = { label: string; href?: string };

export default function AdminPageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  crumbs?: AdminCrumb[];
  actions?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line pb-6">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-3 text-[13px] text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="underline-offset-4 hover:text-charcoal hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] leading-[36px] md:text-[32px] md:leading-[40px]">{title}</h1>
          {description && <p className="mt-2 max-w-[680px] text-[14px] leading-[22px] text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}
