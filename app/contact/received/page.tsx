import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Arrow from "@/components/ui/Arrow";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Receipt pages are never indexed.
export const metadata: Metadata = {
  title: "Enquiry received",
  robots: { index: false, follow: false },
};

// Non-sensitive reference issued by POST /api/contact, e.g. RNK-7F3K9Q2A.
const REFERENCE_PATTERN = /^RNK-[A-Z0-9]{6,12}$/;

export default async function ContactReceivedPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).ref;
  const reference = Array.isArray(raw) ? raw[0] : raw;
  // Without a valid reference there is nothing to confirm; never show a receipt by default.
  if (!reference || !REFERENCE_PATTERN.test(reference)) redirect("/contact");

  return (
    <section className="shell py-16 md:py-24">
      <div className="mx-auto max-w-[640px] border border-line bg-warm px-6 py-10 md:px-12 md:py-14">
        <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
        <h1 className="mt-6 font-serif text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
          Your enquiry has been received
        </h1>
        <p className="mt-4 text-muted">
          This confirms receipt only and does not mean that RNK Legalheads has accepted instructions. Please do not send
          confidential documents until the firm confirms how they should be shared.
        </p>
        <p className="mt-4 text-[14px]">
          Reference: <strong className="tabular-nums">{reference}</strong>
        </p>
        <Link href="/services" className="btn btn-primary mt-8">
          Return to services <Arrow />
        </Link>
      </div>
    </section>
  );
}
