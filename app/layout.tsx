import type { Metadata } from "next";
import NewsletterBand from "@/components/layout/NewsletterBand";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getPublicGroups, groupHref } from "@/lib/content/services";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerGroups = getPublicGroups().map((group) => ({ name: group.name, href: groupHref(group) }));

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-charcoal px-4 py-3 text-[14px] font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <SiteHeader groups={headerGroups} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <NewsletterBand />
        <SiteFooter />
      </body>
    </html>
  );
}
