import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Statutes, rules, notifications and regulatory developments, with their status and relevant dates.";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props) {
  return listingMetadata("/legal-updates", "Legal updates", LEAD, await searchParams);
}

export default async function LegalUpdatesPage({ searchParams }: Props) {
  return (
    <PublicationListing
      basePath="/legal-updates"
      type="update"
      title="Legal updates"
      lead={LEAD}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Legal updates" }]}
      emptyText="No legal updates are published yet. Approved updates will appear here."
      params={await searchParams}
    />
  );
}
