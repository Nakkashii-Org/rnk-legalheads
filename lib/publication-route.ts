import type { Metadata } from "next";
import { publicationTypeMeta, type PublicationType } from "@/lib/content/publications";
import { getContent } from "@/lib/content/source";

type Params = Promise<{ slug: string }>;

/** Shared route helpers for the three publication detail pages. */
export function publicationRoute(type: PublicationType) {
  return {
    async generateStaticParams() {
      return (await getContent()).publicPublications(type).map((p) => ({ slug: p.slug }));
    },
    async generateMetadata({ params }: { params: Params }): Promise<Metadata> {
      const p = (await getContent()).publicPublication(type, (await params).slug);
      if (!p) return {};
      return {
        title: p.title,
        description: p.summary,
        alternates: { canonical: `${publicationTypeMeta[type].basePath}/${p.slug}` },
        robots: p.preview ? { index: false, follow: false } : undefined,
        openGraph: { type: "article", title: p.title, description: p.summary, publishedTime: p.publishedAt },
      };
    },
    async load(params: Params) {
      return (await getContent()).publicPublication(type, (await params).slug);
    },
  };
}
