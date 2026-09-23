import PublicationListing, { listingMetadata, type RawParams } from "@/components/insights/PublicationListing";

const LEAD = "Articles from across our practice areas, with the author, publication date and related services.";

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
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Articles" }]}
      emptyText="No articles are published yet. Approved articles will appear here."
      params={await searchParams}
    />
  );
}
