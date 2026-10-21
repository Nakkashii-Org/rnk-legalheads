import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Notes on decisions relevant to our areas of practice, with the case, court and source identified.";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props) {
  return listingMetadata("/recent-judgments", "Recent Judgments", LEAD, await searchParams);
}

export default async function RecentJudgmentsPage({ searchParams }: Props) {
  return (
    <PublicationListing
      basePath="/recent-judgments"
      type="judgment"
      title="Recent Judgments"
      lead={LEAD}
      emptyText="No judgment notes are currently available. Browse our articles for practical perspectives on our areas of practice."
      params={await searchParams}
    />
  );
}
