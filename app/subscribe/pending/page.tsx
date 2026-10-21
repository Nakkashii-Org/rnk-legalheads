import type { Metadata } from "next";
import Link from "next/link";
import StatusPanel from "@/components/ui/StatusPanel";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

/** Neutral wording: never reveals whether an address exists or is already subscribed (L04, guide p.130). */
export default function SubscribePendingPage() {
  return (
    <StatusPanel
      eyebrow="RNK Legalheads LLP"
      title="Check your inbox."
      actions={
        <Link href="/insights" className="btn btn-primary">
          Browse insights
        </Link>
      }
    >
      <p>
        If this address can be subscribed, you will receive an email with a confirmation link. Your subscription starts only after you
        confirm.
      </p>
    </StatusPanel>
  );
}
