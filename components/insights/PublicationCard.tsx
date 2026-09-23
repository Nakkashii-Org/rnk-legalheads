import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import {
  formatDate,
  publicationHref,
  publicationTypeMeta,
  readingMinutes,
  updateStatusLabel,
  type Publication,
} from "@/lib/content/publications";

/** Type-specific card fields (guide p.120, p.122, p.124). Decision and publication dates are labelled separately. */
function metaLine(p: Publication): string[] {
  const published = formatDate(p.publishedAt);
  if (p.type === "judgment") {
    return [p.court, p.decisionDate ? `Decided ${formatDate(p.decisionDate)}` : "", published ? `Published ${published}` : ""];
  }
  if (p.type === "update") {
    return [p.issuer, `Status: ${updateStatusLabel[p.status]}`, p.effectiveDate ? `Effective ${formatDate(p.effectiveDate)}` : ""];
  }
  return [p.author.name, published ?? "", `${readingMinutes(p)} min read`];
}

export default function PublicationCard({ publication: p }: { publication: Publication }) {
  const meta = publicationTypeMeta[p.type];
  return (
    <Link href={publicationHref(p)} className="group block h-full border-t border-line pb-8 pt-5">
      <span className="block text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
        {meta.label}
        {p.preview && " / Layout preview"}
      </span>
      <span className="mt-3 block font-serif text-[21px] leading-[28px] group-hover:text-action">{p.title}</span>
      <span className="mt-3 block text-[14px] leading-[22px] text-muted">{p.summary}</span>
      <span className="mt-3 block text-[12px] leading-[18px] text-muted">{metaLine(p).filter(Boolean).join(" · ")}</span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
        {meta.action} <Arrow />
      </span>
    </Link>
  );
}
