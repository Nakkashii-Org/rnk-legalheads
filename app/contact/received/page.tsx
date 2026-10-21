import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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
      eyebrow="RNK Legalheads LLP"
      title="Your enquiry has been received."
      actions={
        <Link href="/" className="btn btn-primary">
          Return home
        </Link>
      }
    >
      <p>
        Thank you for contacting RNK Legalheads LLP. Receipt of this enquiry does not confirm acceptance of an engagement. Please wait
        for the firm to confirm whether it can assist before sending confidential material.
      </p>
      <p className="text-[14px] text-charcoal">
        Reference: <strong className="tabular-nums">{reference}</strong>
      </p>
    </StatusPanel>
  );
}
