import Link from "next/link";
import type { Service } from "@/lib/content/services";

/** One card, one destination: the whole card links to the service page. */
export default function ServiceCard({ service, text }: { service: Service; text?: string }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block h-full border-t border-line pb-8 pt-5">
      <span className="block font-serif text-[21px] leading-[28px] group-hover:text-action">{service.title}</span>
      <span className="mt-3 block text-[14px] leading-[22px] text-muted">{text ?? service.summary}</span>
      <span className="mt-4 inline-block text-[13px] font-bold underline decoration-1 underline-offset-[6px] group-hover:text-action">
        View service
      </span>
    </Link>
  );
}
