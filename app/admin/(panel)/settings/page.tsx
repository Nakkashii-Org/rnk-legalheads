import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { footerColumns, legalLinks, primaryNav } from "@/lib/content/site";
import { getContent } from "@/lib/content/source";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const { site, contactDetails } = await getContent();
  const navigation = [
    { area: "Main menu", links: primaryNav },
    ...footerColumns.map((c) => ({ area: `Footer: ${c.heading}`, links: c.links })),
    { area: "Footer: legal", links: legalLinks },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Site settings" }]}
        title="Site settings"
        description="Firm facts used across the website. Administrators only. API keys and passwords are never stored here; they stay in the server environment."
      />
      <SettingsForm
        initial={{
          brandName: site.name,
          legalEntity: site.legalEntity ?? "",
          established: String(site.established),
          domain: "",
          statement: site.statement,
          disclaimer: site.disclaimer,
          address: contactDetails.address ?? "",
          phone: contactDetails.phone ?? "",
          email: contactDetails.email ?? "",
          mapQuery: contactDetails.mapQuery ?? "",
        }}
      />
      <section aria-labelledby="nav-title" className="max-w-[760px] space-y-3">
        <h2 id="nav-title" className="font-serif text-[20px] leading-[28px]">
          Navigation
        </h2>
        <p className="text-[13px] text-muted">Menu structure follows the approved site map. Changes are made by the developer and reviewed.</p>
        <dl className="border-t border-line">
          {navigation.map((n) => (
            <div key={n.area} className="grid gap-1 border-b border-line py-3 text-[14px] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-muted">{n.area}</dt>
              <dd>{n.links.map((l) => l.label).join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
