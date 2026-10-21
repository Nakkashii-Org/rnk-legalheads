import type { Metadata } from "next";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import PageHero from "@/components/ui/PageHero";

const LEAD = "Receive articles and legal updates on the subjects you select. You can change your preferences or unsubscribe at any time.";

export const metadata: Metadata = {
  title: "Subscribe to RNK Legalheads Insights",
  description: LEAD,
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <>
      <PageHero eyebrow="Stay connected" title="Subscribe to RNK Legalheads Insights" lead={LEAD} />

      <div className="shell py-12 md:py-16">
        <div className="max-w-[760px]">
          <SubscribeForm />
        </div>
      </div>
    </>
  );
}
