import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Selected decisions with the issue, ruling, procedural context and official source.";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props) {
  return listingMetadata("/recent-judgments", "Recent judgments", LEAD, await searchParams);
}

export default async function RecentJudgmentsPage({ searchParams }: Props) {
  return (
    <PublicationListing
      basePath="/recent-judgments"
      type="judgment"
      title="Recent judgments"
      lead={LEAD}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Recent judgments" }]}
      emptyText="No judgment notes are published yet. Approved notes will appear here."
      params={await searchParams}
    />
  );
}
