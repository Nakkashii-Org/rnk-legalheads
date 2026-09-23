import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { footerColumns, legalLinks, site } from "@/lib/content/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas">
      <div className="shell grid gap-10 border-b border-line py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[220px] text-[13px] leading-[20px] text-muted">{site.statement}</p>
        </div>
        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-[11px] font-bold uppercase leading-4 tracking-[0.18em]">{column.heading}</h2>
            <ul className="mt-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-9 items-center text-[14px] text-muted hover:text-charcoal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell flex flex-col gap-4 py-6 text-[12px] leading-[18px] text-muted md:flex-row md:items-start md:justify-between">
        <div>
          <p>© {year} RNK Legalheads. All rights reserved.</p>
          <p className="mt-1 max-w-[640px]">{site.disclaimer}</p>
        </div>
        <ul className="flex gap-5">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-charcoal md:min-h-6">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
