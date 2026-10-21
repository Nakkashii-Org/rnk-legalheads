import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Developments in legislation, rules and regulatory practice, with the source and status identified.";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props) {
  return listingMetadata("/legal-updates", "Legal Updates", LEAD, await searchParams);
}

export default async function LegalUpdatesPage({ searchParams }: Props) {
  return (
    <PublicationListing
      basePath="/legal-updates"
      type="update"
      title="Legal Updates"
      lead={LEAD}
      emptyText="No legal updates are currently available. Browse all insights."
      params={await searchParams}
    />
  );
}
