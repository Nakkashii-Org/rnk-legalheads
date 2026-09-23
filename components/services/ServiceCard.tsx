import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import { getServiceGroup, type Service } from "@/lib/content/services";

/** One card, one destination: the whole card links to the service page (guide p.8). */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block h-full border-t border-line pb-8 pt-5">
      <span className="block text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
        {getServiceGroup(service.group).name}
      </span>
      <span className="mt-3 flex items-start justify-between gap-4">
        <span className="font-serif text-[21px] leading-[28px] group-hover:text-action">{service.title}</span>
        <Arrow className="mt-1 text-[18px] text-rnk" />
      </span>
      <span className="mt-3 block text-[14px] leading-[22px] text-muted">{service.summary}</span>
      <span className="mt-4 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
        View service
      </span>
    </Link>
  );
}
