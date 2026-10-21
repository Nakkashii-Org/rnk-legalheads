import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { footerColumns } from "@/lib/content/site";
import { getContent } from "@/lib/content/source";

/** Footer (final screens: dark background, white logo lettering, address, telephone and email). */
export default async function SiteFooter() {
  const { site, contactDetails } = await getContent();
  const year = new Date().getFullYear();
  const phones = (contactDetails.phone ?? "").split("|").map((p) => p.trim()).filter(Boolean);

  return (
    <footer className="bg-black text-white print:hidden">
      <div className="shell grid gap-10 border-b border-white/15 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo onDark />
          <p className="mt-4 max-w-[240px] text-[13px] leading-[20px] text-white/70">{site.statement}</p>
          {contactDetails.address && (
            <address className="mt-5 max-w-[260px] whitespace-pre-line text-[13px] not-italic leading-[20px] text-white/70">
              {contactDetails.address}
            </address>
          )}
          {phones.length > 0 && (
            <p className="mt-3 text-[13px] leading-[20px] text-white/70">
              {phones.map((phone, i) => (
                <span key={phone}>
                  {i > 0 && <span aria-hidden="true"> | </span>}
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center hover:text-white md:min-h-0">
                    {phone}
                  </a>
                </span>
              ))}
            </p>
          )}
          {contactDetails.email && (
            <a
              href={`mailto:${contactDetails.email}`}
              className="mt-2 inline-flex min-h-11 items-center text-[13px] text-white underline underline-offset-4 hover:text-rnk md:min-h-9"
            >
              {contactDetails.email}
            </a>
          )}
        </div>
        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-[11px] font-bold uppercase leading-4 tracking-[0.18em] text-white">{column.heading}</h2>
            <ul className="mt-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-9 items-center text-[14px] text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell py-6 text-[12px] leading-[18px] text-white/60">
        <p>© {year} RNK Legalheads LLP. All rights reserved.</p>
        <p className="mt-1 max-w-[720px]">{site.disclaimer}</p>
      </div>
    </footer>
  );
}
