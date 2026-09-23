import type { Metadata } from "next";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import PageHero from "@/components/ui/PageHero";

const LEAD = "Select your interests. We will send an email asking you to confirm your subscription.";

export const metadata: Metadata = {
  title: "Receive RNK legal updates",
  description: LEAD,
  alternates: { canonical: "/subscribe" },
};

const steps = ["Choose your topics.", "Confirm your email address.", "Manage your preferences from any newsletter."];

export default function SubscribePage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Receive RNK legal updates" }]}
        eyebrow="Email subscriptions"
        title="Receive RNK legal updates"
        lead={LEAD}
      />

      <div className="shell grid grid-cols-1 gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <SubscribeForm />

        <aside aria-labelledby="expect-title">
          <h2 id="expect-title" className="font-serif text-[24px] leading-[32px]">
            What to expect
          </h2>
          <p className="mt-3 text-[15px] leading-[24px] text-muted">
            Articles, judgment notes and legal updates relevant to the topics you choose.
          </p>
          <ol className="mt-6">
            {steps.map((step, i) => (
              <li key={step} className="flex min-h-12 items-center gap-4 border-t border-line text-[14px] last:border-b">
                <span className="text-[13px] font-bold tabular-nums text-rnk">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[13px] leading-[20px] text-muted">
            You will not receive newsletters until you confirm your address. Sending an enquiry through the contact form
            does not subscribe you.
          </p>
        </aside>
      </div>
    </>
  );
}
