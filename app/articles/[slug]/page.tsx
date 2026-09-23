import { notFound } from "next/navigation";
import PublicationDetail from "@/components/insights/PublicationDetail";
import { publicationRoute } from "@/lib/publication-route";

const route = publicationRoute("article");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const publication = await route.load(params);
  if (!publication) notFound();
  return <PublicationDetail publication={publication} />;
}
