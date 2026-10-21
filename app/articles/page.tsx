import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Practical perspectives on the documents, decisions and legal issues that shape a matter.";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props) {
  return listingMetadata("/articles", "Articles", LEAD, await searchParams);
}

export default async function ArticlesPage({ searchParams }: Props) {
  return (
    <PublicationListing
      basePath="/articles"
      type="article"
      title="Articles"
      lead={LEAD}
      emptyText="No articles are currently available."
      params={await searchParams}
    />
  );
}
