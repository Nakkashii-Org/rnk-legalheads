import type { Metadata } from "next";
import {
  getPublicPublication,
  getPublicPublications,
  publicationTypeMeta,
  type PublicationType,
} from "@/lib/content/publications";

type Params = Promise<{ slug: string }>;

/** Shared route helpers for the three publication detail pages. */
export function publicationRoute(type: PublicationType) {
  return {
    generateStaticParams() {
      return getPublicPublications(type).map((p) => ({ slug: p.slug }));
    },
    async generateMetadata({ params }: { params: Params }): Promise<Metadata> {
      const p = getPublicPublication(type, (await params).slug);
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
      return getPublicPublication(type, (await params).slug);
    },
  };
}
