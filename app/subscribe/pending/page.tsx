import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import StatusPanel from "@/components/ui/StatusPanel";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

/** Neutral wording: never reveals whether an address exists or is already subscribed (L04, guide p.130). */
export default function SubscribePendingPage() {
  return (
    <StatusPanel
      title="Check your email"
      actions={
        <Link href="/newsletters" className="btn btn-primary">
          Return to newsletters <Arrow />
        </Link>
      }
    >
      <p>
        Please check your email. Where the address is eligible, we have sent a confirmation link. Follow the link to
        complete your subscription.
      </p>
      <p>You will not receive newsletters until confirmation is complete.</p>
    </StatusPanel>
  );
}
