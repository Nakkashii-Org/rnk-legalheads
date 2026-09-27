import type { Metadata } from "next";
import DisclaimerGate, { disclaimerScript } from "@/components/layout/DisclaimerGate";
import NewsletterBand from "@/components/layout/NewsletterBand";
import SiteChrome from "@/components/layout/SiteChrome";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import StaffPreviewBanner from "@/components/layout/StaffPreviewBanner";
import { getContent } from "@/lib/content/source";
import { groupHref } from "@/lib/content/services";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "RNK Legalheads | Full-Service Law Firm",
    template: "%s | RNK Legalheads",
  },
  description:
    "RNK Legalheads is a full-service law firm established in 2024, advising businesses, institutions and individuals on transactions, disputes, taxation, regulation and private matters.",
};

// Pages are rebuilt in the background at most every 5 minutes, so content changes appear without a redeploy.
export const revalidate = 300;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  const headerGroups = content.publicGroups().map((group) => ({ name: group.name, href: groupHref(group) }));

  return (
    // The disclaimer script marks <html> (data-disclaimer) before React loads; only this element's attributes may differ.
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        {/* Hides the disclaimer before paint for visitors who already agreed (see DisclaimerGate). */}
        <script dangerouslySetInnerHTML={{ __html: disclaimerScript }} />
        <DisclaimerGate firm={content.site.legalEntity || content.site.name} />
        <a
          href="#main"
          className="sr-only z-50 bg-charcoal px-4 py-3 text-[14px] font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        {content.staffPreview && <StaffPreviewBanner />}
        <SiteChrome
          header={<SiteHeader groups={headerGroups} />}
          footer={
            <>
              <NewsletterBand />
              <SiteFooter />
            </>
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
