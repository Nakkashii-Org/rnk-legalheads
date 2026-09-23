import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Articles, case notes and legal updates from across our practice areas.";

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
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      emptyText="No insights are published yet. Approved articles, judgment notes and legal updates will appear here."
      params={await searchParams}
    />
  );
}
