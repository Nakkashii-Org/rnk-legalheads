import Link from "next/link";
import Arrow from "@/components/ui/Arrow";

/** Shared newsletter invitation shown above the footer on every page (guide p.17, p.30). */
export default function NewsletterBand() {
  return (
    <section aria-labelledby="newsletter-band-title" className="bg-warm">
      <div className="shell flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div>
          <h2 id="newsletter-band-title" className="font-serif text-[24px] leading-[32px] md:text-[28px] md:leading-[36px]">
            Legal updates, selected by our team.
          </h2>
          <p className="mt-2 text-[14px] leading-[22px] text-muted">
            Choose the subjects you wish to receive. Unsubscribe at any time.
          </p>
        </div>
        <Link href="/subscribe" className="btn btn-secondary shrink-0">
          Subscribe <Arrow />
        </Link>
      </div>
    </section>
  );
}
