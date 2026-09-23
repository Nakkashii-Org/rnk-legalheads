import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Arrow from "@/components/ui/Arrow";
import StatusPanel from "@/components/ui/StatusPanel";

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
    <StatusPanel
      title="Your enquiry has been received"
      actions={
        <Link href="/services" className="btn btn-primary">
          Return to services <Arrow />
        </Link>
      }
    >
      <p>
        This confirms receipt only and does not mean that RNK Legalheads has accepted instructions. Please do not send
        confidential documents until the firm confirms how they should be shared.
      </p>
      <p className="text-[14px] text-charcoal">
        Reference: <strong className="tabular-nums">{reference}</strong>
      </p>
    </StatusPanel>
  );
}
