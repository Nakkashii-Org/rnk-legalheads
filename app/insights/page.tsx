import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Articles, case notes and legal updates connected with our areas of practice.";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props) {
  return listingMetadata("/insights", "Insights", LEAD, await searchParams);
}

export default async function InsightsPage({ searchParams }: Props) {
  return (
    <PublicationListing
      basePath="/insights"
      title="Insights"
      lead={LEAD}
      emptyText="No insights are currently available."
      params={await searchParams}
    />
  );
}
