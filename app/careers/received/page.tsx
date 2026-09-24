import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Arrow from "@/components/ui/Arrow";
import StatusPanel from "@/components/ui/StatusPanel";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Receipt pages are never indexed.
export const metadata: Metadata = {
  title: "Application received",
  robots: { index: false, follow: false },
};

// Non-sensitive reference issued by POST /api/careers, e.g. RNK-7F3K9Q2A.
const REFERENCE_PATTERN = /^RNK-[A-Z0-9]{6,12}$/;

export default async function CareersReceivedPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).ref;
  const reference = Array.isArray(raw) ? raw[0] : raw;
  // Without a valid reference there is nothing to confirm; never show a receipt by default.
  if (!reference || !REFERENCE_PATTERN.test(reference)) redirect("/careers");

  return (
    <StatusPanel
      title="Your application has been received"
      actions={
        <Link href="/careers" className="btn btn-primary">
          Return to careers <Arrow />
        </Link>
      }
    >
      <p>
        Thank you for your interest in RNK Legalheads. This confirms receipt only. We will contact you if your profile
        matches a current or future opportunity.
      </p>
      <p className="text-[14px] text-charcoal">
        Reference: <strong className="tabular-nums">{reference}</strong>
      </p>
    </StatusPanel>
  );
}
