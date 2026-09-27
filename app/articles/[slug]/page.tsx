import { notFound } from "next/navigation";
import PublicationDetail from "@/components/insights/PublicationDetail";
import { publicationRoute } from "@/lib/publication-route";

const route = publicationRoute("article");

// Unknown slugs render on request (then 404), so a signed-in staff preview can open unpublished drafts.
export const dynamicParams = true;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const publication = await route.load(params);
  if (!publication) notFound();
  return <PublicationDetail publication={publication} />;
}
